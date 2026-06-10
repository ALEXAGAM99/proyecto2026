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
exports.ConsultaController = void 0;
const common_1 = require("@nestjs/common");
const consulta_service_1 = require("./consulta.service");
const consulta_dto_1 = require("./dto/consulta.dto");
const app_gateway_1 = require("../../app.gateway");
let ConsultaController = class ConsultaController {
    consultaService;
    appGateway;
    constructor(consultaService, appGateway) {
        this.consultaService = consultaService;
        this.appGateway = appGateway;
    }
    async obtConsultas() {
        return this.consultaService.obtConsultas();
    }
    async obtConsultaPorId(idc) {
        return this.consultaService.obtConsultaPorIdc(idc);
    }
    async crearConsulta(consulta) {
        this.appGateway.emitirActualizacion();
        return this.consultaService.crearConsulta(consulta);
    }
    async actualizaConsulta(idc, consulta) {
        this.appGateway.emitirActualizacion();
        return this.consultaService.actualizaConsulta(idc, consulta);
    }
    async eliminaConsulta(idc, usuario) {
        this.appGateway.emitirActualizacion();
        return this.consultaService.eliminaConsulta(idc, usuario || 'admin');
    }
};
exports.ConsultaController = ConsultaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultaController.prototype, "obtConsultas", null);
__decorate([
    (0, common_1.Get)(':idc'),
    __param(0, (0, common_1.Param)('idc')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultaController.prototype, "obtConsultaPorId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [consulta_dto_1.crearConsultaDto]),
    __metadata("design:returntype", Promise)
], ConsultaController.prototype, "crearConsulta", null);
__decorate([
    (0, common_1.Put)(':idc'),
    __param(0, (0, common_1.Param)('idc')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consulta_dto_1.crearConsultaDto]),
    __metadata("design:returntype", Promise)
], ConsultaController.prototype, "actualizaConsulta", null);
__decorate([
    (0, common_1.Delete)(':idc'),
    __param(0, (0, common_1.Param)('idc')),
    __param(1, (0, common_1.Body)('usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConsultaController.prototype, "eliminaConsulta", null);
exports.ConsultaController = ConsultaController = __decorate([
    (0, common_1.Controller)('api/consultas'),
    __metadata("design:paramtypes", [consulta_service_1.ConsultaService, app_gateway_1.AppGateway])
], ConsultaController);
//# sourceMappingURL=consulta.controller.js.map