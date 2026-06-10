export class registrarAccesoDto {
    usuario: string = "";
    ip: string = "";
    evento: string = "";
    navegador: string = "";
    location: string = "";
}

export class registrarSalidaDto {
    session_id: number;
    usuario?: string = "";
    ip?: string = "";
    evento: string = "";
    navegador?: string = "";
    location?: string = "";
}