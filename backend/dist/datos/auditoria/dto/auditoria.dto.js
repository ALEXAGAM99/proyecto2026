"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarSalidaDto = exports.registrarAccesoDto = void 0;
class registrarAccesoDto {
    usuario = "";
    ip = "";
    evento = "";
    navegador = "";
    location = "";
}
exports.registrarAccesoDto = registrarAccesoDto;
class registrarSalidaDto {
    session_id;
    usuario = "";
    ip = "";
    evento = "";
    navegador = "";
    location = "";
}
exports.registrarSalidaDto = registrarSalidaDto;
//# sourceMappingURL=auditoria.dto.js.map