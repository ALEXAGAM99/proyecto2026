import { type Paciente } from "./Mostrar";

export async function MostrarPapeleraPacientes(): Promise<Paciente[]> {
  try {
    const res = await fetch("http://localhost:3005/api/papelera/pacientes");
    return res.json();
  } catch (error) {
    console.error("Error fetching pacientes papelera:", error);
    return [];
  }
}

export async function RestaurarPaciente(ci: string) {
  const response = await fetch(`http://localhost:3005/api/papelera/pacientes/restaurar/${ci}`, {
    method: "PUT",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}

export async function EliminarDefinitivoPaciente(ci: string) {
  const response = await fetch(`http://localhost:3005/api/papelera/pacientes/definitivo/${ci}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
