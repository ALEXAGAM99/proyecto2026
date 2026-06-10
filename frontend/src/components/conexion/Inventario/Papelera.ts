import { type Medicamento } from "./Mostrar";

export async function MostrarPapeleraMedicamentos(): Promise<Medicamento[]> {
  try {
    const res = await fetch("http://localhost:3005/api/papelera/medicamentos");
    return res.json();
  } catch (error) {
    console.error("Error fetching medicamentos papelera:", error);
    return [];
  }
}

export async function RestaurarMedicamento(codm: number) {
  const response = await fetch(`http://localhost:3005/api/papelera/medicamentos/restaurar/${codm}`, {
    method: "PUT",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}

export async function EliminarDefinitivoMedicamento(codm: number) {
  const response = await fetch(`http://localhost:3005/api/papelera/medicamentos/definitivo/${codm}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
