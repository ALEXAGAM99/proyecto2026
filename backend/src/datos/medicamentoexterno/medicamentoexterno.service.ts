import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import { actualizarMedicamentoExternoDto, crearMedicamentoExternoDto } from './dto/medicamentoexterno.dto';

@Injectable()
export class MedicamentoexternoService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

    async obtMedicamentoExterno() {
        const res = await this.pool.request().execute('MostrarMedicamentosExternos');
        return res.recordset;
    }

    async obtMedicamentoExternoPorIdme(idme: string) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .query('SELECT * FROM MEDICAMENTOEXTERNO WHERE idme = @idme');
        return res.recordset[0];
    }

    async crearMedicamentoExterno(medicamentoexterno: crearMedicamentoExternoDto) {
        const { idme, idp, nomme, descrip, obs } = medicamentoexterno;
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('idp', idp)
            .input('nomme', nomme)
            .input('descrip', descrip)
            .input('obs', obs)
            .execute('InsertarMedicamentoExterno');
        return res.rowsAffected;
    }

    async actualizaMedicamentoExterno(idme: string, medicamentoexterno: actualizarMedicamentoExternoDto) {
        const { idp, nomme, descrip, obs } = medicamentoexterno;
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('idp', idp)
            .input('nomme', nomme)
            .input('descrip', descrip)
            .input('obs', obs)
            .execute('ActualizarMedicamentoExterno');
        return res.rowsAffected;
    }

    async eliminaMedicamentoExterno(idme: string, usuario: string) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamentoExterno');
        return res.rowsAffected;
    }
}   
