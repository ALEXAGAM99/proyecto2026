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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const login_dto_1 = require("./dto/login.dto");
let LoginController = class LoginController {
    loginService;
    constructor(loginService) {
        this.loginService = loginService;
    }
    obtUsuario() {
        return this.loginService.obtUsuario();
    }
    crearUsuario(usuario) {
        return this.loginService.crearUsuario(usuario.usuario, usuario.password);
    }
    actualizarUsuario(id, usuario) {
        return this.loginService.actualizarUsuario(id, usuario.usuario, usuario.password);
    }
    eliminarUsuario(id) {
        return this.loginService.eliminarUsuario(id);
    }
    login(usuario) {
        return this.loginService.verificarCredenciales(usuario.usuario, usuario.password);
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "obtUsuario", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.CrearUsuarioDto]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "crearUsuario", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_dto_1.CrearUsuarioDto]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "actualizarUsuario", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "eliminarUsuario", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.CrearUsuarioDto]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "login", null);
exports.LoginController = LoginController = __decorate([
    (0, common_1.Controller)('api/usuarios'),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
//# sourceMappingURL=login.controller.js.map