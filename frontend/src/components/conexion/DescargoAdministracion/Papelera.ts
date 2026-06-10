export async function MostrarPapeleraDescargos(): Promise<any[]> {
  const res = await fetch("http://localhost:3005/api/papelera/descargosAdministrativos");
  return res.json();
}

export async function RestaurarDescargo(idd: number) {
  const res = await fetch(`http://localhost:3005/api/papelera/descargosAdministrativos/restaurar/${idd}`, { method: "PUT" });
  return res.json();
}

export async function EliminarDefinitivoDescargo(idd: number) {
  const res = await fetch(`http://localhost:3005/api/papelera/descargosAdministrativos/definitivo/${idd}`, { method: "DELETE" });
  return res.json();
}
