export class CrearDescargoadministrativoDto {
    idp: string;
    codm: string;
    turnom: string;
    fechi: string;
    horai: string;
    diag: string;
    cant: number;
    costo: number;
    resp: string;
}

export class ActualizarDescargoadministrativoDto {
    idp?: string;
    codm?: string;
    turnom?: string;
    fechi?: string;
    horai?: string;
    diag?: string;
    cant?: number;
    costo?: number;
    resp?: string;
}
