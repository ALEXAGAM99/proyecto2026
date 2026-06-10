import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConnectionPool } from 'mssql';
import * as bcrypt from 'bcrypt';


@Injectable()
export class DoctorService {
  constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

  async obtDoctor() {
    const res = await this.pool.request().execute('MostrarMedicos');
    return res.recordset;
  }

  async obtDoctorPorMat(mat: string) {
    const res = await this.pool
      .request()
      .input('mat', mat)
      .query('SELECT * FROM MEDICO WHERE mat = @mat');
    return res.recordset[0];
  }

  async crearDoctor(doctor: any) {
    const { mat, nomd, apd, amd, contra, tipo } = doctor;
    const hashedPassword = await bcrypt.hash(contra, 10);
    const res = await this.pool
      .request()
      .input('mat', mat)
      .input('nomd', nomd)
      .input('apd', apd)
      .input('amd', amd)
      .input('contra', hashedPassword)
      .input('tipo', tipo)
      .execute('InsertarMedico');
    return res.rowsAffected;
  }

  async actualizaDoctor(mat: string, doctor: any) {
    const { nomd, apd, amd } = doctor;
    const res = await this.pool
      .request()
      .input('mat', mat)
      .input('nomd', nomd)
      .input('apd', apd)
      .input('amd', amd)
      .execute('ActualizarMedico');
    return res.rowsAffected;
  }

  async eliminaDoctor(mat: string, usuario: string) {
    const res = await this.pool
      .request()
      .input('mat', mat)
      .input('usuario', usuario)
      .execute('EliminarLogicoMedico');
    return res.rowsAffected;
  }

  async login(mat: string, contra: string) {
    const res = await this.pool
      .request()
      .input('mat', mat)
      .query('SELECT * FROM MEDICO WHERE mat = @mat');

    const doctor = res.recordset[0];
    if (!doctor) {
      return { success: false, message: 'Matrícula no encontrada' };
    }

    const isBcryptHash = doctor.contra && doctor.contra.startsWith('$2b$');
    let passwordMatch = false;

    if (isBcryptHash) {
      passwordMatch = await bcrypt.compare(contra, doctor.contra);
    } else {
      passwordMatch = doctor.contra === contra;
    }

    if (!passwordMatch) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    return { success: true, user: doctor };
  }

  async cambiarContrasena(mat: string, contraActual: string, contraNueva: string) {
    const res = await this.pool
      .request()
      .input('mat', mat)
      .query('SELECT * FROM MEDICO WHERE mat = @mat');

    const doctor = res.recordset[0];
    if (!doctor) {
      throw new NotFoundException('Médico no encontrado');
    }

    const isBcryptHash = doctor.contra && doctor.contra.startsWith('$2b$');
    let passwordMatch = false;

    if (isBcryptHash) {
      passwordMatch = await bcrypt.compare(contraActual, doctor.contra);
    } else {
      passwordMatch = doctor.contra === contraActual;
    }

    if (!passwordMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedNueva = await bcrypt.hash(contraNueva, 10);
    await this.pool
      .request()
      .input('mat', mat)
      .input('contra', hashedNueva)
      .query('UPDATE MEDICO SET contra = @contra WHERE mat = @mat');

    return { success: true, message: 'Contraseña actualizada correctamente' };
  }
}
