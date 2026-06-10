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
exports.MedicamentoexternoController = void 0;
const common_1 = require("@nestjs/common");
const medicamentoexterno_service_1 = require("./medicamentoexterno.service");
const app_gateway_1 = require("../../app.gateway");
const medicamentoexterno_dto_1 = require("./dto/medicamentoexterno.dto");
let MedicamentoexternoController = class MedicamentoexternoController {
    medicamentoexternoService;
    appGateway;
    constructor(medicamentoexternoService, appGateway) {
        this.medicamentoexternoService = medicamentoexternoService;
        this.appGateway = appGateway;
    }
    obtMedicamentoExterno() {
        return this.medicamentoexternoService.obtMedicamentoExterno();
    }
    obtMedicamentoExternoPorIdme(idme) {
        return this.medicamentoexternoService.obtMedicamentoExternoPorIdme(idme);
    }
    crearMedicamentoExterno(medicamentoexterno) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoexternoService.crearMedicamentoExterno(medicamentoexterno);
    }
    actualizarMedicamentoExterno(idme, medicamentoexterno) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoexternoService.actualizaMedicamentoExterno(idme, medicamentoexterno);
    }
    eliminarMedicamentoExterno(idme, usuario) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoexternoService.eliminaMedicamentoExterno(idme, usuario || 'admin');
    }
};
exports.MedicamentoexternoController = MedicamentoexternoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MedicamentoexternoController.prototype, "obtMedicamentoExterno", null);
__decorate([
    (0, common_1.Get)(':idme'),
    __param(0, (0, common_1.Param)('idme')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicamentoexternoController.prototype, "obtMedicamentoExternoPorIdme", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medicamentoexterno_dto_1.crearMedicamentoExternoDto]),
    __metadata("design:returntype", void 0)
], MedicamentoexternoController.prototype, "crearMedicamentoExterno", null);
__decorate([
    (0, common_1.Put)(':idme'),
    __param(0, (0, common_1.Param)('idme')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, medicamentoexterno_dto_1.actualizarMedicamentoExternoDto]),
    __metadata("design:returntype", void 0)
], MedicamentoexternoController.prototype, "actualizarMedicamentoExterno", null);
__decorate([
    (0, common_1.Delete)(':idme'),
    __param(0, (0, common_1.Param)('idme')),
    __param(1, (0, common_1.Body)('usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MedicamentoexternoController.prototype, "eliminarMedicamentoExterno", null);
exports.MedicamentoexternoController = MedicamentoexternoController = __decorate([
    (0, common_1.Controller)('api/medicamentosExternos'),
    __metadata("design:paramtypes", [medicamentoexterno_service_1.MedicamentoexternoService,
        app_gateway_1.AppGateway])
], MedicamentoexternoController);
//# sourceMappingURL=medicamentoexterno.controller.js.map