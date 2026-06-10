import { type Medicamento } from "./Mostrar";

export async function InsertarMedicamento(med: Medicamento) {
  const response = await fetch("http://localhost:3005/api/medicamentos", {
    method: "POST",
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
