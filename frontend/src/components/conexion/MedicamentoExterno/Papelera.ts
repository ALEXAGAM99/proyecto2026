export async function MostrarPapeleraMedicamentosExternos(): Promise<any[]> {
  const res = await fetch("http://localhost:3005/api/papelera/medicamentosExternos");
  return res.json();
}

export async function RestaurarMedicamentoExterno(idme: number) {
  const res = await fetch(`http://localhost:3005/api/papelera/medicamentosExternos/restaurar/${idme}`, { method: "PUT" });
  return res.json();
}

export async function EliminarDefinitivoMedicamentoExterno(idme: number) {
  const res = await fetch(`http://localhost:3005/api/papelera/medicamentosExternos/definitivo/${idme}`, { method: "DELETE" });
  return res.json();
}
