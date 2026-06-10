import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';

@Injectable()
export class ConsultaService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

    async obtConsultas() {
        const res = await this.pool.request().execute('MostrarConsultas');
        return res.recordset;
    }

    async obtConsultaPorIdc(idc: string) {
        const res = await this.pool
            .request()
            .input('idc', idc)
            .query('SELECT * FROM CONSULTA WHERE idc = @idc');
        return res.recordset[0];
    }

    async crearConsulta(consulta: any) {
        const { idp, mc, evad, pa, fc, fr, temp, peso, talla, imc, cond } = consulta;
        const res = await this.pool
            .request()
            .input("idp", idp)
            .input("mc", mc)
            .input("evad", evad)
            .input("pa", pa)
            .input("fc", fc)
            .input("fr", fr)
            .input("temp", temp)
            .input("peso", peso)
            .input("talla", talla)
            .input("imc", imc)
            .input("cond", cond)
            .execute('InsertarConsulta');
        return res.rowsAffected;
    }

    async actualizaConsulta(idc: string, consulta: any) {
        const { idp, mc, evad, pa, fc, fr, temp, peso, talla, imc, cond } = consulta;
        const res = await this.pool
            .request()
            .input("idc", idc)
            .input("idp", idp)
            .input("mc", mc)
            .input("evad", evad)
            .input("pa", pa)
            .input("fc", fc)
            .input("fr", fr)
            .input("temp", temp)
            .input("peso", peso)
            .input("talla", talla)
            .input("imc", imc)
            .input("cond", cond)
            .execute('ActualizarConsulta');
        return res.rowsAffected;
    }

    async eliminaConsulta(idc: string, usuario: string) {
        const res = await this.pool
            .request()
            .input('idc', idc)
            .input('usuario', usuario)
            .execute('EliminarLogicoConsulta');
        return res.rowsAffected;
    }
}
