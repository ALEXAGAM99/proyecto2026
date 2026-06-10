import { type Medico } from "./Mostrar";

export async function MostrarPapeleraMedicos(): Promise<Medico[]> {
  try {
    const res = await fetch("http://localhost:3005/api/papelera/medicos");
    return res.json();
  } catch (error) {
    console.error("Error fetching medicos papelera:", error);
    return [];
  }
}

export async function RestaurarMedico(mat: string) {
  const response = await fetch(`http://localhost:3005/api/papelera/medicos/restaurar/${mat}`, {
    method: "PUT",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}

export async function EliminarDefinitivoMedico(mat: string) {
  const response = await fetch(`http://localhost:3005/api/papelera/medicos/definitivo/${mat}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
