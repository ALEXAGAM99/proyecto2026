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
exports.ConsultaService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let ConsultaService = class ConsultaService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtConsultas() {
        const res = await this.pool.request().execute('MostrarConsultas');
        return res.recordset;
    }
    async obtConsultaPorIdc(idc) {
        const res = await this.pool
            .request()
            .input('idc', idc)
            .query('SELECT * FROM CONSULTA WHERE idc = @idc');
        return res.recordset[0];
    }
    async crearConsulta(consulta) {
        const { idp, mc, evad, pa, fc, fr, temp, peso, talla, imc, cond } = consulta;
        const res = await this.pool
            .request()
            .input("idp", idp)
            .input("mc", mc)
            .input("evad", evad)
            .input("pa", pa)
            .input("fc", fc)
            .input("fr", fr)
            .input("temp", temp)
            .input("peso", peso)
            .input("talla", talla)
            .input("imc", imc)
            .input("cond", cond)
            .execute('InsertarConsulta');
        return res.rowsAffected;
    }
    async actualizaConsulta(idc, consulta) {
        const { idp, mc, evad, pa, fc, fr, temp, peso, talla, imc, cond } = consulta;
        const res = await this.pool
            .request()
            .input("idc", idc)
            .input("idp", idp)
            .input("mc", mc)
            .input("evad", evad)
            .input("pa", pa)
            .input("fc", fc)
            .input("fr", fr)
            .input("temp", temp)
            .input("peso", peso)
            .input("talla", talla)
            .input("imc", imc)
            .input("cond", cond)
            .execute('ActualizarConsulta');
        return res.rowsAffected;
    }
    async eliminaConsulta(idc, usuario) {
        const res = await this.pool
            .request()
            .input('idc', idc)
            .input('usuario', usuario)
            .execute('EliminarLogicoConsulta');
        return res.rowsAffected;
    }
};
exports.ConsultaService = ConsultaService;
exports.ConsultaService = ConsultaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], ConsultaService);
//# sourceMappingURL=consulta.service.js.map