export class crearDoctorDto {
    mat: string = "";
    nomd: string = "";
    apd: string = "";
    amd: string = "";
    contra: string = "";
    tipo: string = "";
    EstadoEliminado?: number = 0;
    FechaEliminacion?: Date = new Date();
    UsuarioElimino?: string = "";
}

export class actualizarDoctorDto {
    nomd?: string;
    apd?: string;
    amd?: string;
    contra?: string;
    tipo?: string;
    EstadoEliminado?: number;
    FechaEliminacion?: Date;
    UsuarioElimino?: string;
}