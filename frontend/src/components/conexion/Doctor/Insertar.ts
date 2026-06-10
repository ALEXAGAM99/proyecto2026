import { type Medico } from "./Mostrar";

export async function InsertarMedico(medico: Medico) {
  const response = await fetch("http://localhost:3005/api/medicos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(medico),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
