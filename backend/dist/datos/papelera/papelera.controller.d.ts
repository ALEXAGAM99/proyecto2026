import { PapeleraService } from './papelera.service';
export declare class PapeleraMedicosController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    obtenerDoctoresPapelera(): Promise<import("mssql").IRecordSet<any>>;
}
export declare class PapeleraMedicosRestaurarController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    restaurarMedico(mat: string): Promise<number[]>;
}
export declare class PapeleraMedicosDefinitivoController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    eliminarDefinitivo(mat: string): Promise<number[]>;
}
export declare class PapeleraConsultasController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    obtenerConsultas(): Promise<import("mssql").IRecordSet<any>>;
}
export declare class PapeleraConsultasRestaurarController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    restaurar(id: number): Promise<number[]>;
}
export declare class PapeleraConsultasDefinitivoController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    eliminar(id: number): Promise<number[]>;
}
export declare class PapeleraDescargosController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    obtenerDescargos(): Promise<import("mssql").IRecordSet<any>>;
}
export declare class PapeleraDescargosRestaurarController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    restaurar(idd: number): Promise<number[]>;
}
export declare class PapeleraDescargosDefinitivoController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    eliminar(idd: number): Promise<number[]>;
}
export declare class PapeleraMedicamentosController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    obtenerMedicamentos(): Promise<import("mssql").IRecordSet<any>>;
}
export declare class PapeleraMedicamentosRestaurarController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    restaurar(codm: string): Promise<number[]>;
}
export declare class PapeleraMedicamentosDefinitivoController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    eliminar(codm: string): Promise<number[]>;
}
export declare class PapeleraMedicamentosExternosController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    obtenerMedicamentosExternos(): Promise<import("mssql").IRecordSet<any>>;
}
export declare class PapeleraMedicamentosExternosRestaurarController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    restaurar(idme: number): Promise<number[]>;
}
export declare class PapeleraMedicamentosExternosDefinitivoController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    eliminar(idme: number): Promise<number[]>;
}
export declare class PapeleraPacientesController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    obtenerPacientes(): Promise<import("mssql").IRecordSet<any>>;
}
export declare class PapeleraPacientesRestaurarController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    restaurar(ci: string): Promise<number[]>;
}
export declare class PapeleraPacientesDefinitivoController {
    private readonly papeleraService;
    constructor(papeleraService: PapeleraService);
    eliminar(ci: string): Promise<number[]>;
}
