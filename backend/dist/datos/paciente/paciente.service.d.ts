import { ConnectionPool } from 'mssql';
export declare class PacienteService {
    private pool;
    constructor(pool: ConnectionPool);
    obtPacientes(): Promise<import("mssql").IRecordSet<any>>;
    obtPacientePorCi(ci: string): Promise<import("mssql").IRecordSet<any>>;
    crearPaciente(paciente: any): Promise<number[]>;
    actualizaPaciente(ci: string, paciente: any): Promise<number[]>;
    eliminaPaciente(ci: string, usuario: string): Promise<number[]>;
}
