import { type Consulta } from "./Mostrar";

export async function InsertarConsulta(consulta: Omit<Consulta, "idc">) {
  const response = await fetch("http://localhost:3005/api/consultas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(consulta),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
