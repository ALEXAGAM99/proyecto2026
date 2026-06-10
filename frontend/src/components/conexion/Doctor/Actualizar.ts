import { type Medico } from "./Mostrar";

export async function ActualizarMedico(medico: Medico) {
  // Solo se envían los campos de nombre/matrícula, no la contraseña
  const { mat, nomd, apd, amd } = medico;
  const response = await fetch(`http://localhost:3005/api/medicos/${mat}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mat, nomd, apd, amd }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
