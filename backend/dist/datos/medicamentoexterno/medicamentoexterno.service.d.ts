import { ConnectionPool } from 'mssql';
import { actualizarMedicamentoExternoDto, crearMedicamentoExternoDto } from './dto/medicamentoexterno.dto';
export declare class MedicamentoexternoService {
    private pool;
    constructor(pool: ConnectionPool);
    obtMedicamentoExterno(): Promise<import("mssql").IRecordSet<any>>;
    obtMedicamentoExternoPorIdme(idme: string): Promise<any>;
    crearMedicamentoExterno(medicamentoexterno: crearMedicamentoExternoDto): Promise<number[]>;
    actualizaMedicamentoExterno(idme: string, medicamentoexterno: actualizarMedicamentoExternoDto): Promise<number[]>;
    eliminaMedicamentoExterno(idme: string, usuario: string): Promise<number[]>;
}
