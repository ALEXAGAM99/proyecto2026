"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicamentoexternoModule = void 0;
const common_1 = require("@nestjs/common");
const medicamentoexterno_controller_1 = require("./medicamentoexterno.controller");
const medicamentoexterno_service_1 = require("./medicamentoexterno.service");
const basededatos_provider_1 = require("../../basededatos/basededatos.provider");
let MedicamentoexternoModule = class MedicamentoexternoModule {
};
exports.MedicamentoexternoModule = MedicamentoexternoModule;
exports.MedicamentoexternoModule = MedicamentoexternoModule = __decorate([
    (0, common_1.Module)({
        controllers: [medicamentoexterno_controller_1.MedicamentoexternoController],
        providers: [medicamentoexterno_service_1.MedicamentoexternoService, ...basededatos_provider_1.basededatos]
    })
], MedicamentoexternoModule);
//# sourceMappingURL=medicamentoexterno.module.js.map