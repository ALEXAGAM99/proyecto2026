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

export async function ActualizarPaciente(paciente: Paciente) {
  const response = await fetch(`http://localhost:3005/api/pacientes/${paciente.ci}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paciente),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}