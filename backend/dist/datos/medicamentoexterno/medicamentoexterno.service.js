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
exports.MedicamentoexternoService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let MedicamentoexternoService = class MedicamentoexternoService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtMedicamentoExterno() {
        const res = await this.pool.request().execute('MostrarMedicamentosExternos');
        return res.recordset;
    }
    async obtMedicamentoExternoPorIdme(idme) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .query('SELECT * FROM MEDICAMENTOEXTERNO WHERE idme = @idme');
        return res.recordset[0];
    }
    async crearMedicamentoExterno(medicamentoexterno) {
        const { idme, idp, nomme, descrip, obs } = medicamentoexterno;
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('idp', idp)
            .input('nomme', nomme)
            .input('descrip', descrip)
            .input('obs', obs)
            .execute('InsertarMedicamentoExterno');
        return res.rowsAffected;
    }
    async actualizaMedicamentoExterno(idme, medicamentoexterno) {
        const { idp, nomme, descrip, obs } = medicamentoexterno;
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('idp', idp)
            .input('nomme', nomme)
            .input('descrip', descrip)
            .input('obs', obs)
            .execute('ActualizarMedicamentoExterno');
        return res.rowsAffected;
    }
    async eliminaMedicamentoExterno(idme, usuario) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamentoExterno');
        return res.rowsAffected;
    }
};
exports.MedicamentoexternoService = MedicamentoexternoService;
exports.MedicamentoexternoService = MedicamentoexternoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], MedicamentoexternoService);
//# sourceMappingURL=medicamentoexterno.service.js.map