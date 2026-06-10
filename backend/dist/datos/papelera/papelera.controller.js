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
exports.PapeleraPacientesDefinitivoController = exports.PapeleraPacientesRestaurarController = exports.PapeleraPacientesController = exports.PapeleraMedicamentosExternosDefinitivoController = exports.PapeleraMedicamentosExternosRestaurarController = exports.PapeleraMedicamentosExternosController = exports.PapeleraMedicamentosDefinitivoController = exports.PapeleraMedicamentosRestaurarController = exports.PapeleraMedicamentosController = exports.PapeleraDescargosDefinitivoController = exports.PapeleraDescargosRestaurarController = exports.PapeleraDescargosController = exports.PapeleraConsultasDefinitivoController = exports.PapeleraConsultasRestaurarController = exports.PapeleraConsultasController = exports.PapeleraMedicosDefinitivoController = exports.PapeleraMedicosRestaurarController = exports.PapeleraMedicosController = void 0;
const common_1 = require("@nestjs/common");
const papelera_service_1 = require("./papelera.service");
let PapeleraMedicosController = class PapeleraMedicosController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    obtenerDoctoresPapelera() {
        return this.papeleraService.obtenerDoctoresPapelera();
    }
};
exports.PapeleraMedicosController = PapeleraMedicosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PapeleraMedicosController.prototype, "obtenerDoctoresPapelera", null);
exports.PapeleraMedicosController = PapeleraMedicosController = __decorate([
    (0, common_1.Controller)('api/papelera/medicos'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicosController);
let PapeleraMedicosRestaurarController = class PapeleraMedicosRestaurarController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    restaurarMedico(mat) {
        return this.papeleraService.restaurarMedico(mat);
    }
};
exports.PapeleraMedicosRestaurarController = PapeleraMedicosRestaurarController;
__decorate([
    (0, common_1.Put)(':mat'),
    __param(0, (0, common_1.Param)('mat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PapeleraMedicosRestaurarController.prototype, "restaurarMedico", null);
exports.PapeleraMedicosRestaurarController = PapeleraMedicosRestaurarController = __decorate([
    (0, common_1.Controller)('api/papelera/medicos/restaurar'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicosRestaurarController);
let PapeleraMedicosDefinitivoController = class PapeleraMedicosDefinitivoController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    eliminarDefinitivo(mat) {
        return this.papeleraService.eliminarDefinitivoMedico(mat);
    }
};
exports.PapeleraMedicosDefinitivoController = PapeleraMedicosDefinitivoController;
__decorate([
    (0, common_1.Delete)(':mat'),
    __param(0, (0, common_1.Param)('mat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PapeleraMedicosDefinitivoController.prototype, "eliminarDefinitivo", null);
exports.PapeleraMedicosDefinitivoController = PapeleraMedicosDefinitivoController = __decorate([
    (0, common_1.Controller)('api/papelera/medicos/definitivo'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicosDefinitivoController);
let PapeleraConsultasController = class PapeleraConsultasController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    obtenerConsultas() {
        return this.papeleraService.obtenerConsultasPapelera();
    }
};
exports.PapeleraConsultasController = PapeleraConsultasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PapeleraConsultasController.prototype, "obtenerConsultas", null);
exports.PapeleraConsultasController = PapeleraConsultasController = __decorate([
    (0, common_1.Controller)('api/papelera/consultas'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraConsultasController);
let PapeleraConsultasRestaurarController = class PapeleraConsultasRestaurarController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    restaurar(id) {
        return this.papeleraService.restaurarConsulta(+id);
    }
};
exports.PapeleraConsultasRestaurarController = PapeleraConsultasRestaurarController;
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PapeleraConsultasRestaurarController.prototype, "restaurar", null);
exports.PapeleraConsultasRestaurarController = PapeleraConsultasRestaurarController = __decorate([
    (0, common_1.Controller)('api/papelera/consultas/restaurar'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraConsultasRestaurarController);
let PapeleraConsultasDefinitivoController = class PapeleraConsultasDefinitivoController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    eliminar(id) {
        return this.papeleraService.eliminarDefinitivoConsulta(+id);
    }
};
exports.PapeleraConsultasDefinitivoController = PapeleraConsultasDefinitivoController;
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PapeleraConsultasDefinitivoController.prototype, "eliminar", null);
exports.PapeleraConsultasDefinitivoController = PapeleraConsultasDefinitivoController = __decorate([
    (0, common_1.Controller)('api/papelera/consultas/definitivo'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraConsultasDefinitivoController);
let PapeleraDescargosController = class PapeleraDescargosController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    obtenerDescargos() {
        return this.papeleraService.obtenerDescargosPapelera();
    }
};
exports.PapeleraDescargosController = PapeleraDescargosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PapeleraDescargosController.prototype, "obtenerDescargos", null);
exports.PapeleraDescargosController = PapeleraDescargosController = __decorate([
    (0, common_1.Controller)('api/papelera/descargosAdministrativos'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraDescargosController);
let PapeleraDescargosRestaurarController = class PapeleraDescargosRestaurarController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    restaurar(idd) {
        return this.papeleraService.restaurarDescargo(+idd);
    }
};
exports.PapeleraDescargosRestaurarController = PapeleraDescargosRestaurarController;
__decorate([
    (0, common_1.Put)(':idd'),
    __param(0, (0, common_1.Param)('idd')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PapeleraDescargosRestaurarController.prototype, "restaurar", null);
exports.PapeleraDescargosRestaurarController = PapeleraDescargosRestaurarController = __decorate([
    (0, common_1.Controller)('api/papelera/descargosAdministrativos/restaurar'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraDescargosRestaurarController);
let PapeleraDescargosDefinitivoController = class PapeleraDescargosDefinitivoController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    eliminar(idd) {
        return this.papeleraService.eliminarDefinitivoDescargo(+idd);
    }
};
exports.PapeleraDescargosDefinitivoController = PapeleraDescargosDefinitivoController;
__decorate([
    (0, common_1.Delete)(':idd'),
    __param(0, (0, common_1.Param)('idd')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PapeleraDescargosDefinitivoController.prototype, "eliminar", null);
exports.PapeleraDescargosDefinitivoController = PapeleraDescargosDefinitivoController = __decorate([
    (0, common_1.Controller)('api/papelera/descargosAdministrativos/definitivo'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraDescargosDefinitivoController);
let PapeleraMedicamentosController = class PapeleraMedicamentosController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    obtenerMedicamentos() {
        return this.papeleraService.obtenerMedicamentosPapelera();
    }
};
exports.PapeleraMedicamentosController = PapeleraMedicamentosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PapeleraMedicamentosController.prototype, "obtenerMedicamentos", null);
exports.PapeleraMedicamentosController = PapeleraMedicamentosController = __decorate([
    (0, common_1.Controller)('api/papelera/medicamentos'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicamentosController);
let PapeleraMedicamentosRestaurarController = class PapeleraMedicamentosRestaurarController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    restaurar(codm) {
        return this.papeleraService.restaurarMedicamento(codm);
    }
};
exports.PapeleraMedicamentosRestaurarController = PapeleraMedicamentosRestaurarController;
__decorate([
    (0, common_1.Put)(':codm'),
    __param(0, (0, common_1.Param)('codm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PapeleraMedicamentosRestaurarController.prototype, "restaurar", null);
exports.PapeleraMedicamentosRestaurarController = PapeleraMedicamentosRestaurarController = __decorate([
    (0, common_1.Controller)('api/papelera/medicamentos/restaurar'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicamentosRestaurarController);
let PapeleraMedicamentosDefinitivoController = class PapeleraMedicamentosDefinitivoController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    eliminar(codm) {
        return this.papeleraService.eliminarDefinitivoMedicamento(codm);
    }
};
exports.PapeleraMedicamentosDefinitivoController = PapeleraMedicamentosDefinitivoController;
__decorate([
    (0, common_1.Delete)(':codm'),
    __param(0, (0, common_1.Param)('codm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PapeleraMedicamentosDefinitivoController.prototype, "eliminar", null);
exports.PapeleraMedicamentosDefinitivoController = PapeleraMedicamentosDefinitivoController = __decorate([
    (0, common_1.Controller)('api/papelera/medicamentos/definitivo'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicamentosDefinitivoController);
let PapeleraMedicamentosExternosController = class PapeleraMedicamentosExternosController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    obtenerMedicamentosExternos() {
        return this.papeleraService.obtenerMedicamentosExternosPapelera();
    }
};
exports.PapeleraMedicamentosExternosController = PapeleraMedicamentosExternosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PapeleraMedicamentosExternosController.prototype, "obtenerMedicamentosExternos", null);
exports.PapeleraMedicamentosExternosController = PapeleraMedicamentosExternosController = __decorate([
    (0, common_1.Controller)('api/papelera/medicamentosExternos'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicamentosExternosController);
let PapeleraMedicamentosExternosRestaurarController = class PapeleraMedicamentosExternosRestaurarController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    restaurar(idme) {
        return this.papeleraService.restaurarMedicamentoExterno(+idme);
    }
};
exports.PapeleraMedicamentosExternosRestaurarController = PapeleraMedicamentosExternosRestaurarController;
__decorate([
    (0, common_1.Put)(':idme'),
    __param(0, (0, common_1.Param)('idme')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PapeleraMedicamentosExternosRestaurarController.prototype, "restaurar", null);
exports.PapeleraMedicamentosExternosRestaurarController = PapeleraMedicamentosExternosRestaurarController = __decorate([
    (0, common_1.Controller)('api/papelera/medicamentosExternos/restaurar'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicamentosExternosRestaurarController);
let PapeleraMedicamentosExternosDefinitivoController = class PapeleraMedicamentosExternosDefinitivoController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    eliminar(idme) {
        return this.papeleraService.eliminarDefinitivoMedicamentoExterno(+idme);
    }
};
exports.PapeleraMedicamentosExternosDefinitivoController = PapeleraMedicamentosExternosDefinitivoController;
__decorate([
    (0, common_1.Delete)(':idme'),
    __param(0, (0, common_1.Param)('idme')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PapeleraMedicamentosExternosDefinitivoController.prototype, "eliminar", null);
exports.PapeleraMedicamentosExternosDefinitivoController = PapeleraMedicamentosExternosDefinitivoController = __decorate([
    (0, common_1.Controller)('api/papelera/medicamentosExternos/definitivo'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraMedicamentosExternosDefinitivoController);
let PapeleraPacientesController = class PapeleraPacientesController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    obtenerPacientes() {
        return this.papeleraService.obtenerPacientesPapelera();
    }
};
exports.PapeleraPacientesController = PapeleraPacientesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PapeleraPacientesController.prototype, "obtenerPacientes", null);
exports.PapeleraPacientesController = PapeleraPacientesController = __decorate([
    (0, common_1.Controller)('api/papelera/pacientes'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraPacientesController);
let PapeleraPacientesRestaurarController = class PapeleraPacientesRestaurarController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    restaurar(ci) {
        return this.papeleraService.restaurarPaciente(ci);
    }
};
exports.PapeleraPacientesRestaurarController = PapeleraPacientesRestaurarController;
__decorate([
    (0, common_1.Put)(':ci'),
    __param(0, (0, common_1.Param)('ci')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PapeleraPacientesRestaurarController.prototype, "restaurar", null);
exports.PapeleraPacientesRestaurarController = PapeleraPacientesRestaurarController = __decorate([
    (0, common_1.Controller)('api/papelera/pacientes/restaurar'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraPacientesRestaurarController);
let PapeleraPacientesDefinitivoController = class PapeleraPacientesDefinitivoController {
    papeleraService;
    constructor(papeleraService) {
        this.papeleraService = papeleraService;
    }
    eliminar(ci) {
        return this.papeleraService.eliminarDefinitivoPaciente(ci);
    }
};
exports.PapeleraPacientesDefinitivoController = PapeleraPacientesDefinitivoController;
__decorate([
    (0, common_1.Delete)(':ci'),
    __param(0, (0, common_1.Param)('ci')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PapeleraPacientesDefinitivoController.prototype, "eliminar", null);
exports.PapeleraPacientesDefinitivoController = PapeleraPacientesDefinitivoController = __decorate([
    (0, common_1.Controller)('api/papelera/pacientes/definitivo'),
    __metadata("design:paramtypes", [papelera_service_1.PapeleraService])
], PapeleraPacientesDefinitivoController);
//# sourceMappingURL=papelera.controller.js.map