import { Controller , Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { CrearUsuarioDto } from './dto/login.dto';

@Controller('api/usuarios')
export class LoginController {
    constructor(
        private readonly loginService: LoginService
    ) {}

    @Get()
    obtUsuario() {
        return this.loginService.obtUsuario();
    }

    @Post()
    crearUsuario(@Body() usuario: CrearUsuarioDto) {
        return this.loginService.crearUsuario(usuario.usuario, usuario.password);
    }

    @Put(':id')
    actualizarUsuario(@Param('id') id: string, @Body() usuario: CrearUsuarioDto) {
        return this.loginService.actualizarUsuario(id, usuario.usuario, usuario.password);
    }

    @Delete(':id')
    eliminarUsuario(@Param('id') id: string) {
        return this.loginService.eliminarUsuario(id);
    }

    @Post('login')
    login(@Body() usuario: CrearUsuarioDto) {
        return this.loginService.verificarCredenciales(usuario.usuario, usuario.password);
    }
}
