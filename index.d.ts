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
    };

    interface ISqlTypes {
        varChar(value?: String): SqlType;
        nVarChar(value?: String): SqlType;
        text(value?: String): SqlType;
        int(value?: Number): SqlType;
        bigInt(value?: Number): SqlType;
        tinyInt(value?: Number): SqlType;
        smallInt(value?: Number): SqlType;
        bit(value?: Number): SqlType;
        float(value?: Number): SqlType;
        numeric(value?: Number): SqlType;
        decimal(value?: Number): SqlType;
        real(value?: Number): SqlType;
        date(value?: Date): SqlType;
        dateTime(value?: Date): SqlType;
        dateTime2(value?: Date): SqlType;
        dateTimeOffset(value?: Date): SqlType;
        smallDateTime(value?: Date): SqlType;
        time(value?: TimerHandler): SqlType;
        uniqueIdentifier(value?: String): SqlType;
        smallMoney(value?: Number): SqlType;
        money(value?: Number): SqlType;
        binary(value?: Number): SqlType;
        varBinary(value?: Number): SqlType;
        char(value?: String): SqlType;
        nChar(value?: String): SqlType;
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
         * var param = { 
         *      name: 'exemplo',                    // Input param
         *      $return_value: sql.types.int()      // Output param
         * };
         * 
         * // Exemplo Model
         * var modelEx = { 
         *      usuario: {}, 
         *      telefones: [] 
         * }; 
         * // Resulta em { content: {usuario:{}, telefones:[]}}
         * //------
         */
        execute(procedure: String, parameters?: any, model?: Object): Promise<ISqlReturn>;
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
