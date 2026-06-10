export async function InsertarDescargo(descargo: Omit<any, "idd">) {
  const response = await fetch("http://localhost:3005/api/descargosAdministrativos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(descargo),
  });
  return response.json();
}
