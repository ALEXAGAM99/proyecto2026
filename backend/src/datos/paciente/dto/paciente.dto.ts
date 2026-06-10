export class crearPacienteDto {
    ci: number = 0;
    ap: string = "";
    am: string = "";
    nom: string = "";
    edad: number = 0;
    ocu: string = "";
    fech: Date = new Date();
    cel: number = 0;
    pro: string = "";
    res: string = "";
    dir: string = "";
    nomt: string = "";
    matm: string = "";
    EstadoEliminado: number = 0;
}

export class actualizarPacienteDto {
    ap?: string;
    am?: string;
    nom?: string;
    edad?: number;
    ocu?: string;
    fech?: Date;
    cel?: number;
    pro?: string;
    res?: string;
    dir?: string;
    nomt?: string;
    matm?: string;
    EstadoEliminado?: number;
}
