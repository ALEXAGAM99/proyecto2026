"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PapeleraModule = void 0;
const common_1 = require("@nestjs/common");
const papelera_controller_1 = require("./papelera.controller");
const papelera_service_1 = require("./papelera.service");
const basededatos_provider_1 = require("../../basededatos/basededatos.provider");
let PapeleraModule = class PapeleraModule {
};
exports.PapeleraModule = PapeleraModule;
exports.PapeleraModule = PapeleraModule = __decorate([
    (0, common_1.Module)({
        controllers: [papelera_controller_1.PapeleraMedicosController, papelera_controller_1.PapeleraMedicosRestaurarController, papelera_controller_1.PapeleraMedicosDefinitivoController, papelera_controller_1.PapeleraConsultasController, papelera_controller_1.PapeleraConsultasRestaurarController, papelera_controller_1.PapeleraConsultasDefinitivoController, papelera_controller_1.PapeleraDescargosController, papelera_controller_1.PapeleraDescargosRestaurarController, papelera_controller_1.PapeleraDescargosDefinitivoController, papelera_controller_1.PapeleraMedicamentosController, papelera_controller_1.PapeleraMedicamentosRestaurarController, papelera_controller_1.PapeleraMedicamentosDefinitivoController, papelera_controller_1.PapeleraMedicamentosExternosController, papelera_controller_1.PapeleraMedicamentosExternosRestaurarController, papelera_controller_1.PapeleraMedicamentosExternosDefinitivoController, papelera_controller_1.PapeleraPacientesController, papelera_controller_1.PapeleraPacientesRestaurarController, papelera_controller_1.PapeleraPacientesDefinitivoController],
        providers: [papelera_service_1.PapeleraService, ...basededatos_provider_1.basededatos]
    })
], PapeleraModule);
//# sourceMappingURL=papelera.module.js.map