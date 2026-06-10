import { ConnectionPool } from 'mssql';
export declare class DescargoadministrativoService {
    private pool;
    constructor(pool: ConnectionPool);
    obtDescargoadministrativo(): Promise<import("mssql").IRecordSet<any>>;
    obtDescargoadministrativoPorIdd(idd: string): Promise<any>;
    crearDescargoadministrativo(descargoadministrativo: any): Promise<number[]>;
    actualizarDescargoadministrativo(id: string, descargoadministrativo: any): Promise<number[]>;
    eliminarDescargoadministrativo(idd: string, usuario: string): Promise<number[]>;
}
