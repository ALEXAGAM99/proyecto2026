import { type Medicamento } from "./Mostrar";

export async function ActualizarMedicamento(med: Partial<Medicamento>) {
  const response = await fetch(`http://localhost:3005/api/medicamentos/${med.codm}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(med),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
