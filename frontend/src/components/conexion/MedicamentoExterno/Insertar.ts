export async function InsertarMedicamentoExterno(med: any) {
  const response = await fetch("http://localhost:3005/api/medicamentosExternos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }
  return response.json();
}
