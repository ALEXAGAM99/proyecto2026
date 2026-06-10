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
exports.AuditoriaService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let AuditoriaService = class AuditoriaService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtAuditoria() {
        const res = await this.pool.request().execute('sp_ObtenerAuditoria');
        return res.recordset;
    }
    async registrarAcceso(acceso) {
        const { usuario, ip, evento, navegador, location } = acceso;
        const res = await this.pool
            .request()
            .input('usuario', usuario)
            .input('ip', ip)
            .input('evento', evento)
            .input('navegador', navegador)
            .input('location', location)
            .execute('sp_RegistrarAcceso');
        return res.recordset ? res.recordset[0] : null;
    }
    async registrarSalida(accion) {
        const { session_id } = accion;
        const res = await this.pool
            .request()
            .input('session_id', Number(session_id))
            .execute('sp_CerrarSesion');
        return { session_id, rowsAffected: res.rowsAffected };
    }
};
exports.AuditoriaService = AuditoriaService;
exports.AuditoriaService = AuditoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], AuditoriaService);
//# sourceMappingURL=auditoria.service.js.map