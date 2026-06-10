import { ConnectionPool } from 'mssql';
export declare class PapeleraService {
    private pool;
    constructor(pool: ConnectionPool);
    eliminarLogicoMedico(mat: string, usuario: string): Promise<number[]>;
    restaurarMedico(mat: string): Promise<number[]>;
    obtenerDoctoresPapelera(): Promise<import("mssql").IRecordSet<any>>;
    eliminarDefinitivoMedico(mat: string): Promise<number[]>;
    eliminarLogicoPaciente(ci: string, usuario: string): Promise<number[]>;
    restaurarPaciente(ci: string): Promise<number[]>;
    obtenerPacientesPapelera(): Promise<import("mssql").IRecordSet<any>>;
    eliminarDefinitivoPaciente(ci: string): Promise<number[]>;
    eliminarLogicoMedicamento(codm: string, usuario: string): Promise<number[]>;
    restaurarMedicamento(codm: string): Promise<number[]>;
    obtenerMedicamentosPapelera(): Promise<import("mssql").IRecordSet<any>>;
    eliminarDefinitivoMedicamento(codm: string): Promise<number[]>;
    eliminarLogicoMedicamentoExterno(idme: number, usuario: string): Promise<number[]>;
    restaurarMedicamentoExterno(idme: number): Promise<number[]>;
    eliminarDefinitivoMedicamentoExterno(idme: number): Promise<number[]>;
    obtenerMedicamentosExternosPapelera(): Promise<import("mssql").IRecordSet<any>>;
    eliminarLogicoConsulta(id: number, usuario: string): Promise<number[]>;
    restaurarConsulta(id: number): Promise<number[]>;
    eliminarDefinitivoConsulta(id: number): Promise<number[]>;
    obtenerConsultasPapelera(): Promise<import("mssql").IRecordSet<any>>;
    eliminarLogicoDescargo(idd: number, usuario: string): Promise<number[]>;
    restaurarDescargo(idd: number): Promise<number[]>;
    eliminarDefinitivoDescargo(idd: number): Promise<number[]>;
    obtenerDescargosPapelera(): Promise<import("mssql").IRecordSet<any>>;
}
