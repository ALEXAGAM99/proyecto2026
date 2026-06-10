import { LoginService } from './login.service';
import { CrearUsuarioDto } from './dto/login.dto';
export declare class LoginController {
    private readonly loginService;
    constructor(loginService: LoginService);
    obtUsuario(): Promise<import("mssql").IRecordSet<any>>;
    crearUsuario(usuario: CrearUsuarioDto): Promise<any>;
    actualizarUsuario(id: string, usuario: CrearUsuarioDto): Promise<number>;
    eliminarUsuario(id: string): Promise<number>;
    login(usuario: CrearUsuarioDto): Promise<any>;
}
