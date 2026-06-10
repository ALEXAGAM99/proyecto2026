export class CrearUsuarioDto{
    usuario: string = "";
    password: string = "";
}

export class ActualizarUsuarioDto{
    usuario?: string = "";
    password?: string = "";
}