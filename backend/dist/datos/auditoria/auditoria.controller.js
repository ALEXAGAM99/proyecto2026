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
exports.AuditoriaController = void 0;
const common_1 = require("@nestjs/common");
const auditoria_service_1 = require("./auditoria.service");
const auditoria_dto_1 = require("./dto/auditoria.dto");
const common_2 = require("@nestjs/common");
const app_gateway_1 = require("../../app.gateway");
let AuditoriaController = class AuditoriaController {
    auditoriaService;
    appGateway;
    constructor(auditoriaService, appGateway) {
        this.auditoriaService = auditoriaService;
        this.appGateway = appGateway;
    }
    obtAuditoria() {
        return this.auditoriaService.obtAuditoria();
    }
    registrarAcceso(acceso) {
        return this.auditoriaService.registrarAcceso(acceso);
    }
    async registrarSalida(salida) {
        const result = await this.auditoriaService.registrarSalida(salida);
        this.appGateway.forzarLogout(salida.session_id);
        this.appGateway.server.emit('logout_global', {
            session_id: salida.session_id
        });
        return result;
    }
};
exports.AuditoriaController = AuditoriaController;
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuditoriaController.prototype, "obtAuditoria", null);
__decorate([
    (0, common_2.Post)('acceso'),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auditoria_dto_1.registrarAccesoDto]),
    __metadata("design:returntype", void 0)
], AuditoriaController.prototype, "registrarAcceso", null);
__decorate([
    (0, common_2.Post)('salida'),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auditoria_dto_1.registrarSalidaDto]),
    __metadata("design:returntype", Promise)
], AuditoriaController.prototype, "registrarSalida", null);
exports.AuditoriaController = AuditoriaController = __decorate([
    (0, common_1.Controller)('api/auditoria'),
    __metadata("design:paramtypes", [auditoria_service_1.AuditoriaService,
        app_gateway_1.AppGateway])
], AuditoriaController);
//# sourceMappingURL=auditoria.controller.js.map