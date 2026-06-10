export async function EliminarPaciente(ci: number) {
  const response = await fetch(`http://localhost:3005/api/pacientes/${ci}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario: localStorage.getItem("usuarioActivo") || "admin" }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
