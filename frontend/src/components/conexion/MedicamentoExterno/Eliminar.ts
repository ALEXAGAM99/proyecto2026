export async function EliminarMedicamentoExterno(idme: number) {
  const response = await fetch(`http://localhost:3005/api/medicamentosExternos/${idme}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario: localStorage.getItem("usuarioActivo") || "admin" }),
  });
  return response.json();
}
