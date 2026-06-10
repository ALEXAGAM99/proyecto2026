import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';

@Injectable()
export class MedicamentoService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

    async obtMedicamento() {
        const res = await this.pool.request().execute('MostrarMedicamentos');
        return res.recordset;
    }

    async obtMedicamentoPorCodm(codm: string) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .query('SELECT * FROM MEDICAMENTO WHERE codm = @codm');
        return res.recordset[0];
    }

    async crearMedicamento(medicamento: any) {
        const { codm, nomm, fechv, numex, precio, frecuso, obs } = medicamento;
        const res = await this.pool
            .request()
            .input("codm", codm)
            .input("nomm", nomm)
            .input("fechv", fechv)
            .input("numex", numex)
            .input("precio", precio)
            .input("frecuso", frecuso)
            .input("obs", obs)
            .execute('InsertarMedicamento');
        return res.rowsAffected;
    }

    async actualizaMedicamento(codm: string, medicamento: any) {
        const { nomm, fechv, numex, precio, frecuso, obs } = medicamento;
        const res = await this.pool
            .request()
            .input("codm", codm)
            .input("nomm", nomm)
            .input("fechv", fechv)
            .input("numex", numex)
            .input("precio", precio)
            .input("frecuso", frecuso)
            .input("obs", obs)
            .execute('ActualizarMedicamento');
        return res.rowsAffected;
    }

    async eliminaMedicamento(codm: string, usuario: string) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamento');
        return res.rowsAffected;
    }
}
