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
exports.PapeleraService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let PapeleraService = class PapeleraService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async eliminarLogicoMedico(mat, usuario) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedico');
        return res.rowsAffected;
    }
    async restaurarMedico(mat) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .execute('RestaurarMedico');
        return res.rowsAffected;
    }
    async obtenerDoctoresPapelera() {
        const result = await this.pool.request().execute("MostrarMedicosPapelera");
        return result.recordset;
    }
    async eliminarDefinitivoMedico(mat) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .execute('EliminarDefinitivoMedico');
        return res.rowsAffected;
    }
    async eliminarLogicoPaciente(ci, usuario) {
        const res = await this.pool
            .request()
            .input('ci', ci)
            .input('usuario', usuario)
            .execute('EliminarLogicoPaciente');
        return res.rowsAffected;
    }
    async restaurarPaciente(ci) {
        const res = await this.pool
            .request()
            .input('ci', ci)
            .execute('RestaurarPaciente');
        return res.rowsAffected;
    }
    async obtenerPacientesPapelera() {
        const result = await this.pool.request().execute("MostrarPacientesPapelera");
        return result.recordset;
    }
    async eliminarDefinitivoPaciente(ci) {
        const res = await this.pool
            .request()
            .input('ci', ci)
            .query("DELETE FROM PACIENTE WHERE CI = @CI");
        return res.rowsAffected;
    }
    async eliminarLogicoMedicamento(codm, usuario) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamento');
        return res.rowsAffected;
    }
    async restaurarMedicamento(codm) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .execute('RestaurarMedicamento');
        return res.rowsAffected;
    }
    async obtenerMedicamentosPapelera() {
        const result = await this.pool.request().execute("MostrarMedicamentosPapelera");
        return result.recordset;
    }
    async eliminarDefinitivoMedicamento(codm) {
        const res = await this.pool
            .request()
            .input("CodM", codm)
            .query("DELETE FROM MEDICAMENTO WHERE CodM = @CodM");
        return res.rowsAffected;
    }
    async eliminarLogicoMedicamentoExterno(idme, usuario) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamentoExterno');
        return res.rowsAffected;
    }
    async restaurarMedicamentoExterno(idme) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .execute('RestaurarMedicamentoExterno');
        return res.rowsAffected;
    }
    async eliminarDefinitivoMedicamentoExterno(idme) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .query("DELETE FROM MEDICAMENTO_EXTERNO WHERE IdME = @IdME");
        return res.rowsAffected;
    }
    async obtenerMedicamentosExternosPapelera() {
        const result = await this.pool.request().execute("MostrarMedicamentosExternosPapelera");
        return result.recordset;
    }
    async eliminarLogicoConsulta(id, usuario) {
        const res = await this.pool
            .request()
            .input("Idc", id)
            .input("Usuario", usuario)
            .execute('EliminarLogicoConsulta');
        return res.rowsAffected;
    }
    async restaurarConsulta(id) {
        const res = await this.pool
            .request()
            .input('idc', id)
            .execute('RestaurarConsulta');
        return res.rowsAffected;
    }
    async eliminarDefinitivoConsulta(id) {
        const res = await this.pool
            .request()
            .input('Idc', id)
            .execute('EliminarDefinitivoConsulta');
        return res.rowsAffected;
    }
    async obtenerConsultasPapelera() {
        const result = await this.pool.request().execute("MostrarConsultasPapelera");
        return result.recordset;
    }
    async eliminarLogicoDescargo(idd, usuario) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .input('usuario', usuario)
            .execute('EliminarLogicoDescargo');
        return res.rowsAffected;
    }
    async restaurarDescargo(idd) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .execute('RestaurarDescargo');
        return res.rowsAffected;
    }
    async eliminarDefinitivoDescargo(idd) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .query("DELETE FROM DESCARGO_ADMINISTRATIVO WHERE IdD = @IdD");
        return res.rowsAffected;
    }
    async obtenerDescargosPapelera() {
        const result = await this.pool.request().execute("MostrarDescargosPapelera");
        return result.recordset;
    }
};
exports.PapeleraService = PapeleraService;
exports.PapeleraService = PapeleraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], PapeleraService);
//# sourceMappingURL=papelera.service.js.map