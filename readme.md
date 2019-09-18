### Package para manipular banco de dados SQL
### Use MSSQL

Install
```js
npm i sql-mocha
```

Config
```js
const Sql = require('sql');

const sql = new Sql({
    server: '',
    database: '',
    user: '',
    password: '',
    connectTimeout: 60000,
    requestTimeout: 60000,
    pool: {
        max: 5,
        min: 1,
        idleTimeoutMillis: 3000
    }
});
```

```js
const return = await sql.execute('procedureName', {
    input: any,
    $output: sql.types.type()
});

/*
return =
    {
        content: [],
        returnValue: Number|String,
        outputs: { output: any }
    }
*/
```

```js
const return = await sql.executeOne('procedureName', {
    input: any
});

/*
return =
    {
        content: {},
        returnValue: Number|String
    }
*/
```

```js
const return = await sql.query('Select * From TABELA Where id = $id', {
    id: 'String|Number|Date|Boolean'
});
```

```js
await sql.openTransaction();

const result = await sql.execute('procedureName', {
    input: any,
    $output: sql.types.type()
});

if(!result.returnValue)
    await sql.rollback();

await sql.commit();
```

## Mock

* Mocar retornos procedures
* Criar arquivo 'mocha.json' no mesmo diretório onde sera executado a procedure
* Setar process.env.DATABASE_MOCHA = true;

#### Estrutura de pastas
```
Api
└─ src
    └─ diretorio
        |─ controller.js
        |─ repository.js //sql.execute('procedureName')
        └─ mocha.json
```

##### mocha.js

* Estrutura do json
    - Key = Nome da procedure
        - parameters = Nome dos parâmetros e seu devido valor
        - returns = [content, outputs, returnValue] // Definir valores conforme retorno da procedure

```js
{
	"procedureName": {
        "parameters": {
            "param1": 'value'
        }
		"content": [],
		"outputs": {},
		"returnValue": null
	}
}
```
