import { ConnectionPool } from 'mssql';
export declare class MedicamentoService {
    private pool;
    constructor(pool: ConnectionPool);
    obtMedicamento(): Promise<import("mssql").IRecordSet<any>>;
    obtMedicamentoPorCodm(codm: string): Promise<any>;
    crearMedicamento(medicamento: any): Promise<number[]>;
    actualizaMedicamento(codm: string, medicamento: any): Promise<number[]>;
    eliminaMedicamento(codm: string, usuario: string): Promise<number[]>;
}
