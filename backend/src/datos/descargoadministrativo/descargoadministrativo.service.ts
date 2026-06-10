import { Injectable, Inject } from '@nestjs/common';
import { ConnectionPool } from 'mssql';

@Injectable()
export class DescargoadministrativoService {
  constructor(@Inject('CONEXION') private pool: ConnectionPool) { }

  async obtDescargoadministrativo() {
    const res = await this.pool.request().execute('MostrarDescargosAdministrativos');
    return res.recordset;
  }

  async obtDescargoadministrativoPorIdd(idd: string) {
    const res = await this.pool
      .request()
      .input('idd', idd)
      .query('SELECT * FROM Descargoadministrativo WHERE idd = @idd');
    return res.recordset[0];
  }

  async crearDescargoadministrativo(descargoadministrativo: any) {
    const { idp, codm, turnom, fechi, horai, diag, cant, costo, resp } = descargoadministrativo;
    const res = await this.pool
      .request()
      .input("idp", idp)
      .input("codm", codm)
      .input("turnom", turnom)
      .input("fechi", fechi)
      .input("horai", horai)
      .input("diag", diag)
      .input("cant", cant)
      .input("costo", costo)
      .input("resp", resp)
      .execute('InsertarDescargoAdministrativo');
    return res.rowsAffected;
  }

  async actualizarDescargoadministrativo(id: string, descargoadministrativo: any) {
    const { idd, idp, codm, turnom, fechalta, horalta, fechactual, horactual, diag, cant, costo, resp } = descargoadministrativo;
    const res = await this.pool
      .request()
      .input("idd", idd)
      .input("idp", idp)
      .input("codm", codm)
      .input("turnom", turnom)
      .input("fechalta", fechalta)
      .input("horalta", horalta)
      .input("fechactual", fechactual)
      .input("horactual", horactual)
      .input("diag", diag)
      .input("cant", cant)
      .input("costo", costo)
      .input("resp", resp)
      .execute('ActualizarDescargoAdministrativo');
    return res.rowsAffected;
  }

  async eliminarDescargoadministrativo(idd: string, usuario: string) {
    const res = await this.pool
      .request()
      .input('idD', idd)
      .input('usuario', usuario)
      .execute('EliminarLogicoDescargo');
    return res.rowsAffected;
  }


}
