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
exports.MedicamentoController = void 0;
const common_1 = require("@nestjs/common");
const medicamento_service_1 = require("./medicamento.service");
const medicamento_dto_1 = require("./dto/medicamento.dto");
const app_gateway_1 = require("../../app.gateway");
let MedicamentoController = class MedicamentoController {
    medicamentoService;
    appGateway;
    constructor(medicamentoService, appGateway) {
        this.medicamentoService = medicamentoService;
        this.appGateway = appGateway;
    }
    obtMedicamento() {
        return this.medicamentoService.obtMedicamento();
    }
    obtMedicamentoPorCodm(codm) {
        return this.medicamentoService.obtMedicamentoPorCodm(codm);
    }
    crearMedicamento(medicamento) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoService.crearMedicamento(medicamento);
    }
    actualizarMedicamento(codm, medicamento) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoService.actualizaMedicamento(codm, medicamento);
    }
    eliminarMedicamento(codm, usuario) {
        this.appGateway.emitirActualizacion();
        return this.medicamentoService.eliminaMedicamento(codm, usuario || 'admin');
    }
};
exports.MedicamentoController = MedicamentoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MedicamentoController.prototype, "obtMedicamento", null);
__decorate([
    (0, common_1.Get)(':codm'),
    __param(0, (0, common_1.Param)('codm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MedicamentoController.prototype, "obtMedicamentoPorCodm", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medicamento_dto_1.CrearMedicamentoDto]),
    __metadata("design:returntype", void 0)
], MedicamentoController.prototype, "crearMedicamento", null);
__decorate([
    (0, common_1.Put)(':codm'),
    __param(0, (0, common_1.Param)('codm')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, medicamento_dto_1.ActualizarMedicamentoDto]),
    __metadata("design:returntype", void 0)
], MedicamentoController.prototype, "actualizarMedicamento", null);
__decorate([
    (0, common_1.Delete)(':codm'),
    __param(0, (0, common_1.Param)('codm')),
    __param(1, (0, common_1.Body)('usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MedicamentoController.prototype, "eliminarMedicamento", null);
exports.MedicamentoController = MedicamentoController = __decorate([
    (0, common_1.Controller)('api/medicamentos'),
    __metadata("design:paramtypes", [medicamento_service_1.MedicamentoService,
        app_gateway_1.AppGateway])
], MedicamentoController);
//# sourceMappingURL=medicamento.controller.js.map