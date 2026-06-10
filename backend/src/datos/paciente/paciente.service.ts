import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';

@Injectable()
export class PacienteService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

    async obtPacientes() {
        const res = await this.pool.request().execute('MostrarPacientes');
        return res.recordset;
    }

    async obtPacientePorCi(ci: string) {
        const res = await this.pool.request().input('ci', ci).execute('MostrarPacientePorCi');
        return res.recordset;
    }

    async crearPaciente(paciente: any) {
        const { ci, ap, am, nom, edad, ocu, fech, cel, pro, res, dir, nomt, matm } = paciente;
        const resul = await this.pool.request()
            .input("ci", ci)
            .input("ap", ap)
            .input("am", am)
            .input("nom", nom)
            .input("edad", edad)
            .input("ocu", ocu)
            .input("fech", fech)
            .input("cel", cel)
            .input("pro", pro)
            .input("res", res)
            .input("dir", dir)
            .input("nomt", nomt)
            .input("matm", matm)
            .execute('InsertarPaciente');
        return resul.rowsAffected;
    }

    async actualizaPaciente(ci: string, paciente: any) {
        const { ap, am, nom, edad, ocu, fech, cel, pro, res, dir, nomt, matm } = paciente;
        const resul = await this.pool.request()
            .input('ci', ci)
            .input('ap', ap)
            .input('am', am)
            .input('nom', nom)
            .input('edad', edad)
            .input('ocu', ocu)
            .input('fech', fech)
            .input('cel', cel)
            .input('pro', pro)
            .input('res', res)
            .input('dir', dir)
            .input('nomt', nomt)
            .input('matm', matm)
            .execute('ActualizarPaciente');
        return resul.rowsAffected;
    }

    async eliminaPaciente(ci: string, usuario: string) {
        const res = await this.pool.request()
            .input('ci', ci)
            .input('usuario', usuario)
            .execute('EliminarLogicoPaciente');
        return res.rowsAffected;
    }
}
