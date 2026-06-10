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
exports.DescargoadministrativoService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let DescargoadministrativoService = class DescargoadministrativoService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtDescargoadministrativo() {
        const res = await this.pool.request().execute('MostrarDescargosAdministrativos');
        return res.recordset;
    }
    async obtDescargoadministrativoPorIdd(idd) {
        const res = await this.pool
            .request()
            .input('idd', idd)
            .query('SELECT * FROM Descargoadministrativo WHERE idd = @idd');
        return res.recordset[0];
    }
    async crearDescargoadministrativo(descargoadministrativo) {
        const { idp, codm, turnom, fechi, horai, diag, cant, costo, resp } = descargoadministrativo;
        const res = await this.pool
            .request()
            .input("idp", idp)
            .input("codm", codm)
            .input("turnom", turnom)
            .input("fechi", fechi)
            .input("horai", horai)
            .input("diag", diag)
            .input("cant", cant)
            .input("costo", costo)
            .input("resp", resp)
            .execute('InsertarDescargoAdministrativo');
        return res.rowsAffected;
    }
    async actualizarDescargoadministrativo(id, descargoadministrativo) {
        const { idd, idp, codm, turnom, fechalta, horalta, fechactual, horactual, diag, cant, costo, resp } = descargoadministrativo;
        const res = await this.pool
            .request()
            .input("idd", idd)
            .input("idp", idp)
            .input("codm", codm)
            .input("turnom", turnom)
            .input("fechalta", fechalta)
            .input("horalta", horalta)
            .input("fechactual", fechactual)
            .input("horactual", horactual)
            .input("diag", diag)
            .input("cant", cant)
            .input("costo", costo)
            .input("resp", resp)
            .execute('ActualizarDescargoAdministrativo');
        return res.rowsAffected;
    }
    async eliminarDescargoadministrativo(idd, usuario) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .input('usuario', usuario)
            .execute('EliminarLogicoDescargo');
        return res.rowsAffected;
    }
};
exports.DescargoadministrativoService = DescargoadministrativoService;
exports.DescargoadministrativoService = DescargoadministrativoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], DescargoadministrativoService);
//# sourceMappingURL=descargoadministrativo.service.js.map