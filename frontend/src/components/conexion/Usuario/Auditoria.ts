export interface LogAcceso {
  id: string;
  usuario: string;
  ip: string;
  evento: 'Ingreso' | 'Salida' | 'Intento Fallido';
  navegador: string;
  timestamp_ingreso: string;
  timestamp_salida?: string;
}


export async function MostrarAuditoria(): Promise<LogAcceso[]> {
  try {
    const response = await fetch("http://localhost:3005/api/auditoria");
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Error al obtener auditoría:", error);
    return [];
  }
}
