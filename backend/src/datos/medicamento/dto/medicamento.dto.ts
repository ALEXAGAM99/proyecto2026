export class CrearMedicamentoDto {
    codm: string;
    nomm: string;
    fechv: Date;
    numex: number;
    precio: number;
    frecuso: string;
    obs: string;
}

export class ActualizarMedicamentoDto {
    codm?: string;
    nomm?: string;
    fechv?: Date;
    numex?: number;
    precio?: number;
    frecuso?: string;
    obs?: string;
}
