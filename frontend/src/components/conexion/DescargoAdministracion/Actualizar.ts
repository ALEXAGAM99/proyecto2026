export async function ActualizarDescargo(descargo: any) {
  const response = await fetch(`http://localhost:3005/api/descargosAdministrativos/${descargo.idd}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(descargo),
  });
  return response.json();
}
