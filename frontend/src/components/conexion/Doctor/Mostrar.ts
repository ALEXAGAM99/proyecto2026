export interface Medico {
  mat: string;
  nomd: string;
  apd: string;
  amd: string;
  contra?: string;
  tipo?: string;  
  EstadoEliminado: boolean;
  FechaEliminacion: string | null;
  UsuarioElimino: string | null;
}

export async function MostrarMedicos(): Promise<Medico[]> {
  try {
    const res = await fetch("http://localhost:3005/api/medicos");
    return res.json();
  } catch (error) {
    console.error("Error fetching medicos:", error);
    return [];
  }
}
