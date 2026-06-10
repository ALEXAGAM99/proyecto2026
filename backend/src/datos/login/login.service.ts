import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import * as bcrypt from 'bcrypt';

const contra = 10;

@Injectable()
export class LoginService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

    async obtUsuario() {
        const res = await this.pool.request().execute('ObtenerUsuarios');
        return res.recordset;
    }

    async crearUsuario(usuario: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, contra);
        const res = await this.pool
            .request()
            .input('usuario', usuario)
            .input('password', hashedPassword)
            .execute('InsertarUsuario');
        return res.recordset[0];
    }

    async actualizarUsuario(id: string, usuario: string, password: string) {
        let finalPassword = password;
        if (password) {
            finalPassword = await bcrypt.hash(password, contra);
        }
        console.log("password: " + password);
        console.log("hash: " + finalPassword);
        const res = await this.pool
            .request()
            .input("id", id)
            .input("usuario", usuario)
            .input("password", finalPassword)
            .execute("ActualizarUsuario");
        return res.rowsAffected[0];
    }

    async eliminarUsuario(id: string) {
        const res = await this.pool
            .request()
            .input("id", id)
            .execute("EliminarUsuario");
        return res.rowsAffected[0];
    }

    async verificarCredenciales(usuario: string, password: string) {
        const res = await this.pool.request().execute("ObtenerUsuarios");
        const users = res.recordset;
        const user = users.find((u) => u.usuario === usuario);
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password);
        return match ? user : null;
    }

}
