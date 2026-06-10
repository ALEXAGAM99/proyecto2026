import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

// DOCTORES (MEDICOS)
export class EliminarLogicoMedicoDto {
    @IsNotEmpty()
    @IsString()
    mat: string;

    @IsNotEmpty()
    @IsString()
    usuario: string;
}

export class RestaurarMedicoDto {
    @IsNotEmpty()
    @IsString()
    mat: string;
}

export class EliminarDefinitivoMedicoDto {
    @IsNotEmpty()
    @IsString()
    mat: string;
}

// PACIENTES
export class EliminarLogicoPacienteDto {
    @IsNotEmpty()
    @IsString()
    ci: string;

    @IsNotEmpty()
    @IsString()
    usuario: string;
}

export class RestaurarPacienteDto {
    @IsNotEmpty()
    @IsString()
    ci: string;
}

export class EliminarDefinitivoPacienteDto {
    @IsNotEmpty()
    @IsString()
    ci: string;
}

// MEDICAMENTOS
export class EliminarLogicoMedicamentoDto {
    @IsNotEmpty()
    @IsString()
    codm: string;

    @IsNotEmpty()
    @IsString()
    usuario: string;
}

export class RestaurarMedicamentoDto {
    @IsNotEmpty()
    @IsString()
    codm: string;
}

export class EliminarDefinitivoMedicamentoDto {
    @IsNotEmpty()
    @IsString()
    codm: string;
}

// MEDICAMENTOS EXTERNOS
export class EliminarLogicoMedicamentoExternoDto {
    @IsNotEmpty()
    @IsNumber()
    idme: number;

    @IsNotEmpty()
    @IsString()
    usuario: string;
}

export class RestaurarMedicamentoExternoDto {
    @IsNotEmpty()
    @IsNumber()
    idme: number;
}

export class EliminarDefinitivoMedicamentoExternoDto {
    @IsNotEmpty()
    @IsNumber()
    idme: number;
}

// CONSULTAS
export class EliminarLogicoConsultaDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    usuario: string;
}

export class RestaurarConsultaDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class EliminarDefinitivoConsultaDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

// DESCARGOS ADMINISTRATIVOS
export class EliminarLogicoDescargoDto {
    @IsNotEmpty()
    @IsNumber()
    idd: number;

    @IsNotEmpty()
    @IsString()
    usuario: string;
}

export class RestaurarDescargoDto {
    @IsNotEmpty()
    @IsNumber()
    idd: number;
}

export class EliminarDefinitivoDescargoDto {
    @IsNotEmpty()
    @IsNumber()
    idd: number;
}
