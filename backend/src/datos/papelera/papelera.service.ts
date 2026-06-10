import { Injectable , Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';

@Injectable()
export class PapeleraService {
    constructor(@Inject('CONEXION') private pool: ConnectionPool) {}

    async eliminarLogicoMedico(mat: string, usuario: string) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedico');
        return res.rowsAffected;
    }

    async restaurarMedico(mat: string) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .execute('RestaurarMedico');
        return res.rowsAffected;
    }

    async obtenerDoctoresPapelera() {
    const result = await this.pool.request().execute("MostrarMedicosPapelera");
    return result.recordset;
    }

    async eliminarDefinitivoMedico(mat: string) {
        const res = await this.pool
            .request()
            .input('mat', mat)
            .execute('EliminarDefinitivoMedico');
        return res.rowsAffected;
    }

    async eliminarLogicoPaciente(ci: string, usuario: string) {
        const res = await this.pool
            .request()
            .input('ci', ci)
            .input('usuario', usuario)
            .execute('EliminarLogicoPaciente');
        return res.rowsAffected;
    }

    async restaurarPaciente(ci: string) {
        const res = await this.pool
            .request()
            .input('ci', ci)
            .execute('RestaurarPaciente');
        return res.rowsAffected;
    }

    async obtenerPacientesPapelera() {
    const result = await this.pool.request().execute("MostrarPacientesPapelera");
    return result.recordset;
    }

    async eliminarDefinitivoPaciente(ci: string) {
        const res = await this.pool
            .request()
            .input('ci', ci)
            .query("DELETE FROM PACIENTE WHERE CI = @CI");
        return res.rowsAffected;
    }

    async eliminarLogicoMedicamento(codm: string, usuario: string) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamento');
        return res.rowsAffected;
    }

    async restaurarMedicamento(codm: string) {
        const res = await this.pool
            .request()
            .input('codm', codm)
            .execute('RestaurarMedicamento');
        return res.rowsAffected;
    }

    async obtenerMedicamentosPapelera() {
    const result = await this.pool.request().execute("MostrarMedicamentosPapelera");
    return result.recordset;
    }

    async eliminarDefinitivoMedicamento(codm: string) {
        const res = await this.pool
            .request()
            .input("CodM", codm)
            .query("DELETE FROM MEDICAMENTO WHERE CodM = @CodM");
        return res.rowsAffected;
    }

    async eliminarLogicoMedicamentoExterno(idme: number, usuario: string) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .input('usuario', usuario)
            .execute('EliminarLogicoMedicamentoExterno');
        return res.rowsAffected;
    }

    async restaurarMedicamentoExterno(idme: number) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .execute('RestaurarMedicamentoExterno');
        return res.rowsAffected;
    }

    async eliminarDefinitivoMedicamentoExterno(idme: number) {
        const res = await this.pool
            .request()
            .input('idme', idme)
            .query("DELETE FROM MEDICAMENTO_EXTERNO WHERE IdME = @IdME");
        return res.rowsAffected;
    }

    async obtenerMedicamentosExternosPapelera() {
    const result = await this.pool.request().execute("MostrarMedicamentosExternosPapelera");
    return result.recordset;
    }

    async eliminarLogicoConsulta(id: number, usuario: string) {
        const res = await this.pool
            .request()
            .input("Idc", id) 
            .input("Usuario", usuario)
            .execute('EliminarLogicoConsulta');
        return res.rowsAffected;
    }

    async restaurarConsulta(id: number) {
        const res = await this.pool
            .request()
            .input('idc', id)
            .execute('RestaurarConsulta');
        return res.rowsAffected;
    }

    async eliminarDefinitivoConsulta(id: number) {
        const res = await this.pool
            .request()
            .input('Idc', id)
            .execute('EliminarDefinitivoConsulta');
        return res.rowsAffected;
    }

    async obtenerConsultasPapelera() {
    const result = await this.pool.request().execute("MostrarConsultasPapelera");
    return result.recordset;
    }

    async eliminarLogicoDescargo(idd: number, usuario: string) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .input('usuario', usuario)
            .execute('EliminarLogicoDescargo');
        return res.rowsAffected;
    }

    async restaurarDescargo(idd: number) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .execute('RestaurarDescargo');
        return res.rowsAffected;
    }

    async eliminarDefinitivoDescargo(idd: number) {
        const res = await this.pool
            .request()
            .input('idD', idd)
            .query("DELETE FROM DESCARGO_ADMINISTRATIVO WHERE IdD = @IdD");

        return res.rowsAffected;
    }

    async obtenerDescargosPapelera() {
    const result = await this.pool.request().execute("MostrarDescargosPapelera");
    return result.recordset;
    }
}
