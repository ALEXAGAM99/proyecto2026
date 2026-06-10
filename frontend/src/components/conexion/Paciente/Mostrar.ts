export interface Paciente {
  ci: number;
  ap: string;
  am: string;
  nom: string;
  edad: number;
  ocu: string;
  fech: string;
  cel: number;
  pro: string;
  res: string;
  dir: string;
  nomt: string;
  matm: string;
  EstadoEliminado: boolean;
  FechaEliminacion: string | null;
  UsuarioElimino: string | null;
}

export async function MostrarPacientes(): Promise<Paciente[]> {
  try {
    const res = await fetch("http://localhost:3005/api/pacientes");
    const per: Paciente[] = await res.json();

    return per;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

MostrarPacientes();




