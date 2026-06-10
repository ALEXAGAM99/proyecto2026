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
exports.MedicamentoService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let MedicamentoService = class MedicamentoService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtMedicamento() {
        const res = await this.pool.request().execute('MostrarMedicamentos');
        return res.recordset;
    }
    async obtMedicamentoPorCodm(codm) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .query('SELECT * FROM MEDICAMENTO WHERE codm = @codm');
        return res.recordset[0];
    }
    async crearMedicamento(medicamento) {
        const { codm, nomm, fechv, numex, precio, frecuso, obs } = medicamento;
        const res = await this.pool
            .request()
            .input("codm", codm)
            .input("nomm", nomm)
            .input("fechv", fechv)
            .input("numex", numex)
            .input("precio", precio)
            .input("frecuso", frecuso)
            .input("obs", obs)
            .execute('InsertarMedicamento');
        return res.rowsAffected;
    }
    async actualizaMedicamento(codm, medicamento) {
        const { nomm, fechv, numex, precio, frecuso, obs } = medicamento;
        const res = await this.pool
            .request()
            .input("codm", codm)
            .input("nomm", nomm)
            .input("fechv", fechv)
            .input("numex", numex)
            .input("precio", precio)
            .input("frecuso", frecuso)
            .input("obs", obs)
            .execute('ActualizarMedicamento');
        return res.rowsAffected;
    }
    async eliminaMedicamento(codm, usuario) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamento');
        return res.rowsAffected;
    }
};
exports.MedicamentoService = MedicamentoService;
exports.MedicamentoService = MedicamentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], MedicamentoService);
//# sourceMappingURL=medicamento.service.js.map