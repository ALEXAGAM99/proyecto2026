"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const common_1 = require("@nestjs/common");
const mssql_1 = require("mssql");
const bcrypt = __importStar(require("bcrypt"));
let DoctorService = class DoctorService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async obtDoctor() {
        const res = await this.pool.request().execute('MostrarMedicos');
        return res.recordset;
    }
    async obtDoctorPorMat(mat) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .query('SELECT * FROM MEDICO WHERE mat = @mat');
        return res.recordset[0];
    }
    async crearDoctor(doctor) {
        const { mat, nomd, apd, amd, contra, tipo } = doctor;
        const hashedPassword = await bcrypt.hash(contra, 10);
        const res = await this.pool
            .request()
            .input('mat', mat)
            .input('nomd', nomd)
            .input('apd', apd)
            .input('amd', amd)
            .input('contra', hashedPassword)
            .input('tipo', tipo)
            .execute('InsertarMedico');
        return res.rowsAffected;
    }
    async actualizaDoctor(mat, doctor) {
        const { nomd, apd, amd } = doctor;
        const res = await this.pool
            .request()
            .input('mat', mat)
            .input('nomd', nomd)
            .input('apd', apd)
            .input('amd', amd)
            .execute('ActualizarMedico');
        return res.rowsAffected;
    }
    async eliminaDoctor(mat, usuario) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedico');
        return res.rowsAffected;
    }
    async login(mat, contra) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .query('SELECT * FROM MEDICO WHERE mat = @mat');
        const doctor = res.recordset[0];
        if (!doctor) {
            return { success: false, message: 'Matrícula no encontrada' };
        }
        const isBcryptHash = doctor.contra && doctor.contra.startsWith('$2b$');
        let passwordMatch = false;
        if (isBcryptHash) {
            passwordMatch = await bcrypt.compare(contra, doctor.contra);
        }
        else {
            passwordMatch = doctor.contra === contra;
        }
        if (!passwordMatch) {
            return { success: false, message: 'Contraseña incorrecta' };
        }
        return { success: true, user: doctor };
    }
    async cambiarContrasena(mat, contraActual, contraNueva) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .query('SELECT * FROM MEDICO WHERE mat = @mat');
        const doctor = res.recordset[0];
        if (!doctor) {
            throw new common_1.NotFoundException('Médico no encontrado');
        }
        const isBcryptHash = doctor.contra && doctor.contra.startsWith('$2b$');
        let passwordMatch = false;
        if (isBcryptHash) {
            passwordMatch = await bcrypt.compare(contraActual, doctor.contra);
        }
        else {
            passwordMatch = doctor.contra === contraActual;
        }
        if (!passwordMatch) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        const hashedNueva = await bcrypt.hash(contraNueva, 10);
        await this.pool
            .request()
            .input('mat', mat)
            .input('contra', hashedNueva)
            .query('UPDATE MEDICO SET contra = @contra WHERE mat = @mat');
        return { success: true, message: 'Contraseña actualizada correctamente' };
    }
};
exports.DoctorService = DoctorService;
exports.DoctorService = DoctorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONEXION')),
    __metadata("design:paramtypes", [mssql_1.ConnectionPool])
], DoctorService);
//# sourceMappingURL=doctor.service.js.map