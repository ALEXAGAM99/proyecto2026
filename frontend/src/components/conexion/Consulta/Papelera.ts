import { type Consulta } from "./Mostrar";

export async function MostrarPapeleraConsultas(): Promise<Consulta[]> {
  try {
    const res = await fetch("http://localhost:3005/api/papelera/consultas");
    return res.json();
  } catch (error) {
    console.error("Error fetching consultas papelera:", error);
    return [];
  }
}

export async function RestaurarConsulta(idc: number) {
  const response = await fetch(`http://localhost:3005/api/papelera/consultas/restaurar/${idc}`, {
    method: "PUT",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}

export async function EliminarDefinitivoConsulta(idc: number) {
  const response = await fetch(`http://localhost:3005/api/papelera/consultas/definitivo/${idc}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
