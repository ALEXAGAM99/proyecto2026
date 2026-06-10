"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const basededatos_module_1 = require("./basededatos/basededatos.module");
const gateway_module_1 = require("./gateway.module");
const device_module_1 = require("./device/device.module");
const doctor_module_1 = require("./datos/doctor/doctor.module");
const paciente_module_1 = require("./datos/paciente/paciente.module");
const consulta_module_1 = require("./datos/consulta/consulta.module");
const descargoadministrativo_module_1 = require("./datos/descargoadministrativo/descargoadministrativo.module");
const medicamento_module_1 = require("./datos/medicamento/medicamento.module");
const medicamentoexterno_module_1 = require("./datos/medicamentoexterno/medicamentoexterno.module");
const auditoria_module_1 = require("./datos/auditoria/auditoria.module");
const login_module_1 = require("./datos/login/login.module");
const papelera_module_1 = require("./datos/papelera/papelera.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            doctor_module_1.DoctorModule,
            paciente_module_1.PacienteModule,
            consulta_module_1.ConsultaModule,
            descargoadministrativo_module_1.DescargoadministrativoModule,
            medicamento_module_1.MedicamentoModule,
            medicamentoexterno_module_1.MedicamentoexternoModule,
            auditoria_module_1.AuditoriaModule,
            login_module_1.LoginModule,
            papelera_module_1.PapeleraModule,
            basededatos_module_1.BasededatosModule,
            gateway_module_1.GatewayModule,
            device_module_1.DeviceModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map