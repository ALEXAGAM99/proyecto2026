import { ConnectionPool } from 'mssql';
export declare class LoginService {
    private pool;
    constructor(pool: ConnectionPool);
    obtUsuario(): Promise<import("mssql").IRecordSet<any>>;
    crearUsuario(usuario: string, password: string): Promise<any>;
    actualizarUsuario(id: string, usuario: string, password: string): Promise<number>;
    eliminarUsuario(id: string): Promise<number>;
    verificarCredenciales(usuario: string, password: string): Promise<any>;
}
