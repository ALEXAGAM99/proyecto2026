"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarPacienteDto = exports.crearPacienteDto = void 0;
class crearPacienteDto {
    ci = 0;
    ap = "";
    am = "";
    nom = "";
    edad = 0;
    ocu = "";
    fech = new Date();
    cel = 0;
    pro = "";
    res = "";
    dir = "";
    nomt = "";
    matm = "";
    EstadoEliminado = 0;
}
exports.crearPacienteDto = crearPacienteDto;
class actualizarPacienteDto {
    ap;
    am;
    nom;
    edad;
    ocu;
    fech;
    cel;
    pro;
    res;
    dir;
    nomt;
    matm;
    EstadoEliminado;
}
exports.actualizarPacienteDto = actualizarPacienteDto;
//# sourceMappingURL=paciente.dto.js.map