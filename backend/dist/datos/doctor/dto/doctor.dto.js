"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarDoctorDto = exports.crearDoctorDto = void 0;
class crearDoctorDto {
    mat = "";
    nomd = "";
    apd = "";
    amd = "";
    contra = "";
    tipo = "";
    EstadoEliminado = 0;
    FechaEliminacion = new Date();
    UsuarioElimino = "";
}
exports.crearDoctorDto = crearDoctorDto;
class actualizarDoctorDto {
    nomd;
    apd;
    amd;
    contra;
    tipo;
    EstadoEliminado;
    FechaEliminacion;
    UsuarioElimino;
}
exports.actualizarDoctorDto = actualizarDoctorDto;
//# sourceMappingURL=doctor.dto.js.map