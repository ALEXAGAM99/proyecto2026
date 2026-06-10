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

export async function InsertarPacientes(paciente: Paciente) {
  const response = await fetch("http://localhost:3005/api/pacientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paciente),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}


export interface Medico {
  mat: string;
  nomd: string;
  apd: string;
}

export async function ObtenerMedicos(): Promise<Medico[]> {
  const res = await fetch("http://localhost:3005/api/medicos");
  return res.json();
}