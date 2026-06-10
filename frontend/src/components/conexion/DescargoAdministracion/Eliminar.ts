export async function EliminarDescargo(idd: number) {
  const response = await fetch(`http://localhost:3005/api/descargosAdministrativos/${idd}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario: localStorage.getItem("usuarioActivo") || "admin" }),
  });
  return response.json();
}
