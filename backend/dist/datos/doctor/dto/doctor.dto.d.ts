export declare class crearDoctorDto {
    mat: string;
    nomd: string;
    apd: string;
    amd: string;
    contra: string;
    tipo: string;
    EstadoEliminado?: number;
    FechaEliminacion?: Date;
    UsuarioElimino?: string;
}
export declare class actualizarDoctorDto {
    nomd?: string;
    apd?: string;
    amd?: string;
    contra?: string;
    tipo?: string;
    EstadoEliminado?: number;
    FechaEliminacion?: Date;
    UsuarioElimino?: string;
}
