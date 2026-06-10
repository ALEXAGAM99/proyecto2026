import { ConnectionPool } from 'mssql';
export declare class AuditoriaService {
    private pool;
    constructor(pool: ConnectionPool);
    obtAuditoria(): Promise<import("mssql").IRecordSet<any>>;
    registrarAcceso(acceso: any): Promise<any>;
    registrarSalida(accion: any): Promise<{
        session_id: any;
        rowsAffected: number[];
    }>;
}
