declare namespace sql {

    type SqlType = {
        type: any,
        value: any
    }

    type Config = {
        server: string;
        database: string;
        user: string;
        password: string;
        connectTimeout?: 60000;
        requestTimeout?: 60000;
        pool?: {
            max?: 5,
            min?: 1,
            idleTimeoutMillis?: 3000
        }
    };

    interface ISqlTypes {
        numeric(precision: Number, scale: Number, value?: Number): SqlType;
        decimal(precision: Number, scale: Number, value?: Number): SqlType;

        varChar(length: Number, value?: String): SqlType;
        nVarChar(length: Number, value?: String): SqlType;
        char(length: Number, value?: String): SqlType;
        nChar(length: Number, value?: String): SqlType;
        varBinary(length: Number, value?: String): SqlType;

        time(scale: Number, value?: TimerHandler): SqlType;
        dateTime2(scale: Number, value?: Date): SqlType;
        dateTimeOffset(scale: Number, value?: Date): SqlType;

        text(value?: String): SqlType;
        int(value?: Number): SqlType;
        bigInt(value?: Number): SqlType;
        tinyInt(value?: Number): SqlType;
        smallInt(value?: Number): SqlType;
        bit(value?: Number): SqlType;
        float(value?: Number): SqlType;
        real(value?: Number): SqlType;
        date(value?: Date): SqlType;
        dateTime(value?: Date): SqlType;
        smallDateTime(value?: Date): SqlType;
        uniqueIdentifier(value?: String): SqlType;
        smallMoney(value?: Number): SqlType;
        money(value?: Number): SqlType;
        binary(value?: Number): SqlType;
        nText(value?: String): SqlType;
    }

    interface ISqlReturn {
        content: object;
        outputs: object;
        returnValue: any;
    }

    interface ISqlIsolation {
        readCommitted: String;
        readUncommitted: String;
        repeatable: String;
        serializable: String;
        snapshot: String;
    }

    interface SqlInstance {
        isolation: ISqlIsolation;
        types: ISqlTypes;

        /**
         * 
         * @param parameters 
         * @param model Formatar retorno de datasets
         * @example
         * 
         * // Exemplo Parameters
         * const param = { 
         *      name: 'exemplo',                    // Input param
         *      $return_value: sql.types.int()      // Output param
         * };
         * 
         * // Exemplo Model
         * const modelEx = { 
         *      usuario: {}, 
         *      telefones: [] 
         * }; 
         * // Resulta em { content: {usuario:{}, telefones:[]}}
         * //------
         */
        execute(procedure: String, parameters?: any, model?: any): Promise<ISqlReturn>;
        /**
         * 
         * @param parameters 
         * @example
         * 
         * // Exemplo Parameters
         * var param = { 
         *      name: 'exemplo',            // Input param
         *      $return_value: sql.int()    // Output param
         * };
         */
        executeOne(procedure: String, parameters?: any): Promise<ISqlReturn>;
        openTransaction(isolation: ISqlIsolation): Promise<void>;
        commit(): Promise<void>;
        rollback(): Promise<void>;
    }

    interface Sql {
        new(config: Config): SqlInstance;
    }
}

declare var sql: sql.Sql;
export = sql;
