import { DescargoadministrativoService } from './descargoadministrativo.service';
import { CrearDescargoadministrativoDto } from './dto/descargoadministrativo.dto';
import { AppGateway } from "../../app.gateway";
export declare class DescargoadministrativoController {
    private readonly descargoadministrativoService;
    private readonly appGateway;
    constructor(descargoadministrativoService: DescargoadministrativoService, appGateway: AppGateway);
    obtDescargoadministrativo(): Promise<import("mssql").IRecordSet<any>>;
    obtDescargoadministrativoPorId(idd: string): Promise<any>;
    crearDescargoadministrativo(descargoadministrativo: CrearDescargoadministrativoDto): Promise<number[]>;
    actualizarDescargoadministrativo(idd: string, descargoadministrativo: CrearDescargoadministrativoDto): Promise<number[]>;
    eliminarDescargoadministrativo(idd: string, usuario: string): Promise<number[]>;
}
