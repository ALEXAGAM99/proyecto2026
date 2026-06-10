import { PacienteService } from './paciente.service';
import { AppGateway } from "../../app.gateway";
export declare class PacienteController {
    private readonly pacienteService;
    private readonly appGateway;
    constructor(pacienteService: PacienteService, appGateway: AppGateway);
    obtPacientes(): Promise<import("mssql").IRecordSet<any>>;
    obtPacientePorCi(ci: string): Promise<import("mssql").IRecordSet<any>>;
    crearPaciente(paciente: any): Promise<number[]>;
    actualizaPaciente(ci: string, paciente: any): Promise<number[]>;
    eliminaPaciente(ci: string, usuario: string): Promise<number[]>;
}
