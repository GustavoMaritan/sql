const sql = require('mssql');
const fs = require('fs');
const path = require('path');

class Sql {
	constructor(config) {
		config = this._defaultConfig(config);
		this._pool = new sql.ConnectionPool(config);
		this.isolation = {
			readCommitted: sql.ISOLATION_LEVEL.READ_COMMITTED,
			readUncommitted: sql.ISOLATION_LEVEL.READ_UNCOMMITTED,
			repeatable: sql.ISOLATION_LEVEL.REPEATABLE_READ,
			serializable: sql.ISOLATION_LEVEL.SERIALIZABLE,
			snapshot: sql.ISOLATION_LEVEL.SNAPSHOT
		};

		for (let type in sql.TYPES) {
			let typeName = type[0].toLowerCase() + type.substr(1);

			this[typeName] = (value = null) => {
				return {
					type: sql.TYPES[type],
					value: value
				};
			};
		}
	}

	async _connect() {
		if (!this._pool.connected)
			await this._pool.connect();

		return this._pool;
	}

	async openTransaction(isolation = this.isolation.readCommitted) {
		await this._connect();
		this._transaction = new sql.Transaction(this._pool);
		await this._transaction.begin(isolation);
	}

	async commit() {
		if (this._transaction) {
			await this._transaction.commit();
			this._transaction = null;
			await this._pool.close();
		}
	}

	async rollback() {
		if (this._transaction) {
			await this._transaction.rollback();
			this._transaction = null;
			await this._pool.close();
		}
	}

	_parameters(parameters) {
		if (!parameters || !this._request) return;
		for (let parameter in parameters) {

			if (parameters[parameter] == undefined || parameters[parameter] == null) continue;

			let param = parameter[0] == '$'
				? { type: 'output', name: parameter.substr(1) }
				: { type: 'input', name: parameter };

			if (typeof parameters[parameter] == 'object' && !(parameters[parameter] instanceof Date))
				this._request[param.type](param.name, parameters[parameter].type, parameters[parameter].value);
			else
				this._request[param.type](param.name, parameters[parameter]);
		}
	}

	async query($query, params) {
		if (process.env.DATABASE_MOCHA) {
			throw { message: 'Não existe mocha paraquery! ainda :)' };
		}

		await this._connect();
		this._request = new sql.Request(this._transaction || this._pool);

		if (!params)
			return await this._request.query($query);

		for (let i in params) {
			$query = $query.replace(
				new RegExp('\\$' + i, 'g'),
				typeof params[i] == "number"
					? typeof params[i]
					: typeof params[i] == "boolean"
						? Number(params[i])
						: `'${params[i]}'`
			);
		}
		return await this._request.query($query);
	}

	async mock(procedure, parameters) {
		let err = new Error();
		let filename = err.stack.split('\n')[3];
		filename = filename.replace(/^(.+)\(/, '').replace(/:[1-9]{1,}:[1-9]{1,}\)/, '');
		filename = path.join(path.dirname(filename), 'mocha.json');

		const exists = await promise((resolve) => {
			fs.exists(filename, resolve);
		});

		if (!exists)
			throw {
				message: `Arquivo mocha.json não encontrado para ${filename}`
			};

		let json = await promise((resolve, reject) => {
			fs.readFile(filename, (err, data) => {
				if (err) return reject(err);
				resolve(data);
			});
		});
		json = JSON.parse(json);
		json = json[procedure];

		if (!json.parameters) return json;

		const erros = [];
		for (const key in json.parameters) {
			if (json.parameters[key] != parameters[key])
				erros.push(`${key} expected ${json.parameters[key]}`);
		}

		if (erros.length)
			throw { message: `Parâmetros inválidos\n - ${erros.join('\n')}` };

		delete json.parameters;

		return json;
	}

	async execute(procedure, parameters, model) {
		if (process.env.DATABASE_MOCHA) {
			return await this.mock(procedure, parameters);
		}

		await this._connect();
		this._request = new sql.Request(this._transaction || this._pool);
		this._parameters(parameters);
		let result = await this._request.execute(procedure);

		let content = {};
		if (!model) content = result.recordsets.length > 1 ? result.recordsets : result.recordset;
		else {
			let i = 0;
			for (let prop in model) {
				content[prop] = Array.isArray(model[prop])
					? result.recordsets[i]
					: result.recordsets[i] ? result.recordsets[i][0] : null;
				i++;
			}
		}

		return {
			content: content,
			outputs: result.output,
			returnValue: result.returnValue
		};
	}

	async executeOne(procedure, parameters) {
		let result = await this.execute(procedure, parameters);

		if (process.env.DATABASE_MOCHA) return result;

		result.content = result.content ? result.content[0] : null;
		return result;
	}

	async executeReturn(procedure, parameters) {
		let result = await this.execute(procedure, parameters);

		if (process.env.DATABASE_MOCHA) return result;

		if (!result.outputs || !Object.keys(result.outputs).length) return result;
		for (let i in result.outputs)
			result.returnValue = result.outputs[i];
		return result;
	}

	async close() {
		if (this._pool.connected)
			await this._pool.close();
	}

	_defaultConfig(config) {
		return this._merge(config, {
			driver: 'tedious',
			connectTimeout: 60000,
			requestTimeout: 60000,
			pool: {
				max: 5,
				min: 1,
				idleTimeoutMillis: 3000
			}
		});
	}

	_merge(config, _default) {
		for (let prop in config)
			if (typeof config[prop] == 'object' && !(config[prop] instanceof Date))
				config[prop] = this._merge(config[prop], _default[prop] || {});

		return Object.assign(config, _default);
	}
}

async function promise(action) {
	return new Promise((resolve, reject) => {
		action(resolve, reject);
	});
}

module.exports = Sql;
