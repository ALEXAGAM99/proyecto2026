import { MedicamentoService } from './medicamento.service';
import { ActualizarMedicamentoDto, CrearMedicamentoDto } from './dto/medicamento.dto';
import { AppGateway } from "../../app.gateway";
export declare class MedicamentoController {
    private readonly medicamentoService;
    private readonly appGateway;
    constructor(medicamentoService: MedicamentoService, appGateway: AppGateway);
    obtMedicamento(): Promise<import("mssql").IRecordSet<any>>;
    obtMedicamentoPorCodm(codm: string): Promise<any>;
    crearMedicamento(medicamento: CrearMedicamentoDto): Promise<number[]>;
    actualizarMedicamento(codm: string, medicamento: ActualizarMedicamentoDto): Promise<number[]>;
    eliminarMedicamento(codm: string, usuario: string): Promise<number[]>;
}
