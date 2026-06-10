export interface Consulta {
  idc: number;
  idp: number;
  mc: string;
  evad: string;
  fechactual: string;
  pa: string;
  fc: string;
  fr: string;
  temp: string;
  peso: string;
  talla: string;
  imc: string;
  cond: string;
  EstadoEliminado: boolean;
  FechaEliminacion: string | null;
  UsuarioElimino: string | null;
}

export async function MostrarConsultasReal(): Promise<Consulta[]> {
  try {
    const res = await fetch("http://localhost:3005/api/consultas");
    return res.json();
  } catch (error) {
    console.error("Error fetching consultas:", error);
    return [];
  }
}
