import * as sql from 'mssql';

const sqlConfig: sql.config = {
  user: 'ALEXALX',
  password: '123456',
  server: 'host.docker.internal',
  database: 'BDCEMI',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const basededatos = [
  {
    provide: 'CONEXION',
    useFactory: async (): Promise<sql.ConnectionPool> => {
      const pool = new sql.ConnectionPool(sqlConfig);
      await pool.connect();
      return pool;
    },
  },
];