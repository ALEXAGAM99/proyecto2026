import { ConnectionPool } from 'mssql';
export declare class ConsultaService {
    private pool;
    constructor(pool: ConnectionPool);
    obtConsultas(): Promise<import("mssql").IRecordSet<any>>;
    obtConsultaPorIdc(idc: string): Promise<any>;
    crearConsulta(consulta: any): Promise<number[]>;
    actualizaConsulta(idc: string, consulta: any): Promise<number[]>;
    eliminaConsulta(idc: string, usuario: string): Promise<number[]>;
}
