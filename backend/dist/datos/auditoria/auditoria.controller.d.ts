import { AuditoriaService } from './auditoria.service';
import { registrarAccesoDto, registrarSalidaDto } from './dto/auditoria.dto';
import { AppGateway } from '../../app.gateway';
export declare class AuditoriaController {
    private readonly auditoriaService;
    private readonly appGateway;
    constructor(auditoriaService: AuditoriaService, appGateway: AppGateway);
    obtAuditoria(): Promise<import("mssql").IRecordSet<any>>;
    registrarAcceso(acceso: registrarAccesoDto): Promise<any>;
    registrarSalida(salida: registrarSalidaDto): Promise<{
        session_id: any;
        rowsAffected: number[];
    }>;
}
