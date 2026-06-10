export interface DescargoAdministracion {
  idd: number; //id descargo
  idp: number; //id paciente
  codm: number; //codigo medicamento
  turnom: number; //turno medico
  fechi: string; //fecha inicio
  horai: string; //hora inicio
  fechalta: string; //fecha alta
  horalta: string; //hora alta
  fechactual: string; //fecha actual
  horactual: string; //hora actual
  diag: string; //diagnostico
  cant: number; //cantidad
  costo: number; //costo
  resp: string; //responsable
  EstadoEliminado: boolean; //estado eliminado
  FechaEliminacion: string | null; //fecha eliminacion
  UsuarioElimino: string | null; //usuario eliminacion
}

export async function MostrarDescargosReal(): Promise<DescargoAdministracion[]> {
  try {
    const res = await fetch("http://localhost:3005/api/descargosAdministrativos");
    return res.json();
  } catch (error) {
    console.error("Error fetching descargos administrativos:", error);
    return [];
  }
}
