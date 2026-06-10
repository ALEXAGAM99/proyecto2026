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
exports.PacienteService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
let PacienteService = class PacienteService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtPacientes() {
        const res = await this.pool.request().execute('MostrarPacientes');
        return res.recordset;
    }
    async obtPacientePorCi(ci) {
        const res = await this.pool.request().input('ci', ci).execute('MostrarPacientePorCi');
        return res.recordset;
    }
    async crearPaciente(paciente) {
        const { ci, ap, am, nom, edad, ocu, fech, cel, pro, res, dir, nomt, matm } = paciente;
        const resul = await this.pool.request()
            .input("ci", ci)
            .input("ap", ap)
            .input("am", am)
            .input("nom", nom)
            .input("edad", edad)
            .input("ocu", ocu)
            .input("fech", fech)
            .input("cel", cel)
            .input("pro", pro)
            .input("res", res)
            .input("dir", dir)
            .input("nomt", nomt)
            .input("matm", matm)
            .execute('InsertarPaciente');
        return resul.rowsAffected;
    }
    async actualizaPaciente(ci, paciente) {
        const { ap, am, nom, edad, ocu, fech, cel, pro, res, dir, nomt, matm } = paciente;
        const resul = await this.pool.request()
            .input('ci', ci)
            .input('ap', ap)
            .input('am', am)
            .input('nom', nom)
            .input('edad', edad)
            .input('ocu', ocu)
            .input('fech', fech)
            .input('cel', cel)
            .input('pro', pro)
            .input('res', res)
            .input('dir', dir)
            .input('nomt', nomt)
            .input('matm', matm)
            .execute('ActualizarPaciente');
        return resul.rowsAffected;
    }
    async eliminaPaciente(ci, usuario) {
        const res = await this.pool.request()
            .input('ci', ci)
            .input('usuario', usuario)
            .execute('EliminarLogicoPaciente');
        return res.rowsAffected;
    }
};
exports.PacienteService = PacienteService;
exports.PacienteService = PacienteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], PacienteService);
//# sourceMappingURL=paciente.service.js.map