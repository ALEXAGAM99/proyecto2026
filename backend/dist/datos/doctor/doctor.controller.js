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
exports.DoctorController = void 0;
const common_1 = require("@nestjs/common");
const doctor_service_1 = require("./doctor.service");
const app_gateway_1 = require("../../app.gateway");
const doctor_dto_1 = require("./dto/doctor.dto");
const auditoria_service_1 = require("../auditoria/auditoria.service");
let DoctorController = class DoctorController {
    doctorService;
    appGateway;
    auditoriaService;
    constructor(doctorService, appGateway, auditoriaService) {
        this.doctorService = doctorService;
        this.appGateway = appGateway;
        this.auditoriaService = auditoriaService;
    }
    obtDoctor() {
        return this.doctorService.obtDoctor();
    }
    obtDoctorPorMat(mat) {
        return this.doctorService.obtDoctorPorMat(mat);
    }
    async crearDoctor(doctor) {
        const result = await this.doctorService.crearDoctor(doctor);
        this.appGateway.emitirActualizacion();
        return result;
    }
    async actualizarDoctor(mat, doctor) {
        const result = await this.doctorService.actualizaDoctor(mat, doctor);
        this.appGateway.emitirActualizacion();
        return result;
    }
    async eliminarDoctor(mat, usuario) {
        const result = await this.doctorService.eliminaDoctor(mat, usuario || 'admin');
        this.appGateway.emitirActualizacion();
        return result;
    }
    async login(credentials, req) {
        const result = await this.doctorService.login(credentials.mat, credentials.contra);
        const ipReal = credentials.ipCliente || req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || '';
        const isFlutter = !userAgent || userAgent.toLowerCase().includes('dart') || userAgent.toLowerCase().includes('flutter');
        const navegadorReal = isFlutter
            ? 'Flutter App (Mobile)'
            : (credentials.navegador || userAgent);
        const location = isFlutter ? 'Mobile Access' : (req.headers['origin'] || 'Web');
        if (result.success) {
            const auditRecord = await this.auditoriaService.registrarAcceso({
                usuario: result.user.mat,
                ip: ipReal,
                evento: 'Ingreso',
                navegador: navegadorReal,
                location,
            });
            this.appGateway.emitirActualizacion();
            const sessionId = auditRecord?.session_id ?? null;
            return { ...result, session_id: sessionId };
        }
        await this.auditoriaService.registrarAcceso({
            usuario: credentials.mat,
            ip: ipReal,
            evento: 'Intento Fallido',
            navegador: navegadorReal,
            location,
        });
        return result;
    }
    cambiarContrasena(mat, body) {
        return this.doctorService.cambiarContrasena(mat, body.contraActual, body.contraNueva);
    }
};
exports.DoctorController = DoctorController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DoctorController.prototype, "obtDoctor", null);
__decorate([
    (0, common_1.Get)(':mat'),
    __param(0, (0, common_1.Param)('mat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DoctorController.prototype, "obtDoctorPorMat", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [doctor_dto_1.crearDoctorDto]),
    __metadata("design:returntype", Promise)
], DoctorController.prototype, "crearDoctor", null);
__decorate([
    (0, common_1.Put)(':mat'),
    __param(0, (0, common_1.Param)('mat')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, doctor_dto_1.crearDoctorDto]),
    __metadata("design:returntype", Promise)
], DoctorController.prototype, "actualizarDoctor", null);
__decorate([
    (0, common_1.Delete)(':mat'),
    __param(0, (0, common_1.Param)('mat')),
    __param(1, (0, common_1.Body)('usuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DoctorController.prototype, "eliminarDoctor", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorController.prototype, "login", null);
__decorate([
    (0, common_1.Patch)(':mat/cambiar-contrasena'),
    __param(0, (0, common_1.Param)('mat')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DoctorController.prototype, "cambiarContrasena", null);
exports.DoctorController = DoctorController = __decorate([
    (0, common_1.Controller)('api/medicos'),
    __metadata("design:paramtypes", [doctor_service_1.DoctorService,
        app_gateway_1.AppGateway,
        auditoria_service_1.AuditoriaService])
], DoctorController);
//# sourceMappingURL=doctor.controller.js.map