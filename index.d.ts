import mssql = require('mssql');

declare interface IConfig {
    server?: string;
    database?: string;
    user?: string;
    password?: string;
}

declare interface IReturn {
    server?: string;
    database?: string;
    user?: string;
    password?: string;
}

declare interface IParameters {
    server?: string;
    database?: string;
    user?: string;
    password?: string;
}

export declare class Sql {
    constructor(config: IConfig);
    execute(procedure: string, parameters: IParameters, model: any): Promise<IReturn>;
    executeOne(procedure: string, parameters: IParameters, model: any): Promise<IReturn>;
    query(query: string, params: Object): Promise<IReturn>;
}