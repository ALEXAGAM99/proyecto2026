import { MedicamentoexternoService } from './medicamentoexterno.service';
import { AppGateway } from '../../app.gateway';
import { actualizarMedicamentoExternoDto, crearMedicamentoExternoDto } from './dto/medicamentoexterno.dto';
export declare class MedicamentoexternoController {
    private readonly medicamentoexternoService;
    private readonly appGateway;
    constructor(medicamentoexternoService: MedicamentoexternoService, appGateway: AppGateway);
    obtMedicamentoExterno(): Promise<import("mssql").IRecordSet<any>>;
    obtMedicamentoExternoPorIdme(idme: string): Promise<any>;
    crearMedicamentoExterno(medicamentoexterno: crearMedicamentoExternoDto): Promise<number[]>;
    actualizarMedicamentoExterno(idme: string, medicamentoexterno: actualizarMedicamentoExternoDto): Promise<number[]>;
    eliminarMedicamentoExterno(idme: string, usuario: string): Promise<number[]>;
}
