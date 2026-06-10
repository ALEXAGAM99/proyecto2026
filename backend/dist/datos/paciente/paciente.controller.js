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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteController = void 0;
const common_1 = require("@nestjs/common");
const paciente_service_1 = require("./paciente.service");
const app_gateway_1 = require("../../app.gateway");
let PacienteController = class PacienteController {
    pacienteService;
    appGateway;
    constructor(pacienteService, appGateway) {
        this.pacienteService = pacienteService;
        this.appGateway = appGateway;
    }
    async obtPacientes() {
        return this.pacienteService.obtPacientes();
    }
    async obtPacientePorCi(ci) {
        return this.pacienteService.obtPacientePorCi(ci);
    }
    async crearPaciente(paciente) {
        this.appGateway.emitirActualizacion();
        return this.pacienteService.crearPaciente(paciente);
    }
    async actualizaPaciente(ci, paciente) {
        this.appGateway.emitirActualizacion();
        return this.pacienteService.actualizaPaciente(ci, paciente);
    }
    async eliminaPaciente(ci, usuario) {
        this.appGateway.emitirActualizacion();
        return this.pacienteService.eliminaPaciente(ci, usuario || 'admin');
    }
};
exports.PacienteController = PacienteController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PacienteController.prototype, "obtPacientes", null);
__decorate([
    (0, common_1.Get)(':ci'),
    __param(0, (0, common_1.Param)('ci')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacienteController.prototype, "obtPacientePorCi", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PacienteController.prototype, "crearPaciente", null);
__decorate([
    (0, common_1.Put)(':ci'),
    __param(0, (0, common_1.Param)('ci')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PacienteController.prototype, "actualizaPaciente", null);
__decorate([
    (0, common_1.Delete)(':ci'),
    __param(0, (0, common_1.Param)('ci')),
    __param(1, (0, common_1.Body)('usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PacienteController.prototype, "eliminaPaciente", null);
exports.PacienteController = PacienteController = __decorate([
    (0, common_1.Controller)('api/pacientes'),
    __metadata("design:paramtypes", [paciente_service_1.PacienteService, app_gateway_1.AppGateway])
], PacienteController);
//# sourceMappingURL=paciente.controller.js.map