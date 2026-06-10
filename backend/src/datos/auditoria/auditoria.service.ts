import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';

@Injectable()
export class AuditoriaService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

    async obtAuditoria() {
        const res = await this.pool.request().execute('sp_ObtenerAuditoria');
        return res.recordset;
    }

    async registrarAcceso(acceso: any) {
        const { usuario, ip, evento, navegador, location } = acceso;
        const res = await this.pool
            .request()
            .input('usuario', usuario)
            .input('ip', ip)
            .input('evento', evento)
            .input('navegador', navegador)
            .input('location', location)
            .execute('sp_RegistrarAcceso');
        return res.recordset ? res.recordset[0] : null;
    }

    async registrarSalida(accion: any) {
        const { session_id } = accion;
        const res = await this.pool
            .request()
            .input('session_id', Number(session_id))
            .execute('sp_CerrarSesion');
        return { session_id, rowsAffected: res.rowsAffected };
    }
}
