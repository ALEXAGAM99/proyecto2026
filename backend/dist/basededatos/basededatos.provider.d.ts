import * as sql from 'mssql';
export declare const basededatos: {
    provide: string;
    useFactory: () => Promise<sql.ConnectionPool>;
}[];
