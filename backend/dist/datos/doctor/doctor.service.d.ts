import { ConnectionPool } from 'mssql';
export declare class DoctorService {
    private pool;
    constructor(pool: ConnectionPool);
    obtDoctor(): Promise<import("mssql").IRecordSet<any>>;
    obtDoctorPorMat(mat: string): Promise<any>;
    crearDoctor(doctor: any): Promise<number[]>;
    actualizaDoctor(mat: string, doctor: any): Promise<number[]>;
    eliminaDoctor(mat: string, usuario: string): Promise<number[]>;
    login(mat: string, contra: string): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: any;
        message?: undefined;
    }>;
    cambiarContrasena(mat: string, contraActual: string, contraNueva: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
