"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EliminarDefinitivoDescargoDto = exports.RestaurarDescargoDto = exports.EliminarLogicoDescargoDto = exports.EliminarDefinitivoConsultaDto = exports.RestaurarConsultaDto = exports.EliminarLogicoConsultaDto = exports.EliminarDefinitivoMedicamentoExternoDto = exports.RestaurarMedicamentoExternoDto = exports.EliminarLogicoMedicamentoExternoDto = exports.EliminarDefinitivoMedicamentoDto = exports.RestaurarMedicamentoDto = exports.EliminarLogicoMedicamentoDto = exports.EliminarDefinitivoPacienteDto = exports.RestaurarPacienteDto = exports.EliminarLogicoPacienteDto = exports.EliminarDefinitivoMedicoDto = exports.RestaurarMedicoDto = exports.EliminarLogicoMedicoDto = void 0;
const class_validator_1 = require("class-validator");
class EliminarLogicoMedicoDto {
    mat;
    usuario;
}
exports.EliminarLogicoMedicoDto = EliminarLogicoMedicoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoMedicoDto.prototype, "mat", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoMedicoDto.prototype, "usuario", void 0);
class RestaurarMedicoDto {
    mat;
}
exports.RestaurarMedicoDto = RestaurarMedicoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestaurarMedicoDto.prototype, "mat", void 0);
class EliminarDefinitivoMedicoDto {
    mat;
}
exports.EliminarDefinitivoMedicoDto = EliminarDefinitivoMedicoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarDefinitivoMedicoDto.prototype, "mat", void 0);
class EliminarLogicoPacienteDto {
    ci;
    usuario;
}
exports.EliminarLogicoPacienteDto = EliminarLogicoPacienteDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoPacienteDto.prototype, "ci", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoPacienteDto.prototype, "usuario", void 0);
class RestaurarPacienteDto {
    ci;
}
exports.RestaurarPacienteDto = RestaurarPacienteDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestaurarPacienteDto.prototype, "ci", void 0);
class EliminarDefinitivoPacienteDto {
    ci;
}
exports.EliminarDefinitivoPacienteDto = EliminarDefinitivoPacienteDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarDefinitivoPacienteDto.prototype, "ci", void 0);
class EliminarLogicoMedicamentoDto {
    codm;
    usuario;
}
exports.EliminarLogicoMedicamentoDto = EliminarLogicoMedicamentoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoMedicamentoDto.prototype, "codm", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoMedicamentoDto.prototype, "usuario", void 0);
class RestaurarMedicamentoDto {
    codm;
}
exports.RestaurarMedicamentoDto = RestaurarMedicamentoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RestaurarMedicamentoDto.prototype, "codm", void 0);
class EliminarDefinitivoMedicamentoDto {
    codm;
}
exports.EliminarDefinitivoMedicamentoDto = EliminarDefinitivoMedicamentoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarDefinitivoMedicamentoDto.prototype, "codm", void 0);
class EliminarLogicoMedicamentoExternoDto {
    idme;
    usuario;
}
exports.EliminarLogicoMedicamentoExternoDto = EliminarLogicoMedicamentoExternoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EliminarLogicoMedicamentoExternoDto.prototype, "idme", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoMedicamentoExternoDto.prototype, "usuario", void 0);
class RestaurarMedicamentoExternoDto {
    idme;
}
exports.RestaurarMedicamentoExternoDto = RestaurarMedicamentoExternoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RestaurarMedicamentoExternoDto.prototype, "idme", void 0);
class EliminarDefinitivoMedicamentoExternoDto {
    idme;
}
exports.EliminarDefinitivoMedicamentoExternoDto = EliminarDefinitivoMedicamentoExternoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EliminarDefinitivoMedicamentoExternoDto.prototype, "idme", void 0);
class EliminarLogicoConsultaDto {
    id;
    usuario;
}
exports.EliminarLogicoConsultaDto = EliminarLogicoConsultaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EliminarLogicoConsultaDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoConsultaDto.prototype, "usuario", void 0);
class RestaurarConsultaDto {
    id;
}
exports.RestaurarConsultaDto = RestaurarConsultaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RestaurarConsultaDto.prototype, "id", void 0);
class EliminarDefinitivoConsultaDto {
    id;
}
exports.EliminarDefinitivoConsultaDto = EliminarDefinitivoConsultaDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EliminarDefinitivoConsultaDto.prototype, "id", void 0);
class EliminarLogicoDescargoDto {
    idd;
    usuario;
}
exports.EliminarLogicoDescargoDto = EliminarLogicoDescargoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EliminarLogicoDescargoDto.prototype, "idd", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EliminarLogicoDescargoDto.prototype, "usuario", void 0);
class RestaurarDescargoDto {
    idd;
}
exports.RestaurarDescargoDto = RestaurarDescargoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RestaurarDescargoDto.prototype, "idd", void 0);
class EliminarDefinitivoDescargoDto {
    idd;
}
exports.EliminarDefinitivoDescargoDto = EliminarDefinitivoDescargoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EliminarDefinitivoDescargoDto.prototype, "idd", void 0);
//# sourceMappingURL=papelera.dto.js.map