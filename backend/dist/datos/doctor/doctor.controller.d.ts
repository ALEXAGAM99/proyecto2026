import { DoctorService } from './doctor.service';
import { AppGateway } from '../../app.gateway';
import { crearDoctorDto } from './dto/doctor.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
export declare class DoctorController {
    private readonly doctorService;
    private readonly appGateway;
    private readonly auditoriaService;
    constructor(doctorService: DoctorService, appGateway: AppGateway, auditoriaService: AuditoriaService);
    obtDoctor(): Promise<import("mssql").IRecordSet<any>>;
    obtDoctorPorMat(mat: string): Promise<any>;
    crearDoctor(doctor: crearDoctorDto): Promise<number[]>;
    actualizarDoctor(mat: string, doctor: crearDoctorDto): Promise<number[]>;
    eliminarDoctor(mat: string, usuario: string): Promise<number[]>;
    login(credentials: {
        mat: string;
        contra: string;
        ipCliente?: string;
        navegador?: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: any;
        message?: undefined;
    } | {
        session_id: any;
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        session_id: any;
        success: boolean;
        user: any;
        message?: undefined;
    }>;
    cambiarContrasena(mat: string, body: {
        contraActual: string;
        contraNueva: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
