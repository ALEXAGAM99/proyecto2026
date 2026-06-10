import { ConsultaService } from './consulta.service';
import { crearConsultaDto } from './dto/consulta.dto';
import { AppGateway } from "../../app.gateway";
export declare class ConsultaController {
    private readonly consultaService;
    private readonly appGateway;
    constructor(consultaService: ConsultaService, appGateway: AppGateway);
    obtConsultas(): Promise<import("mssql").IRecordSet<any>>;
    obtConsultaPorId(idc: string): Promise<any>;
    crearConsulta(consulta: crearConsultaDto): Promise<number[]>;
    actualizaConsulta(idc: string, consulta: crearConsultaDto): Promise<number[]>;
    eliminaConsulta(idc: string, usuario: string): Promise<number[]>;
}
