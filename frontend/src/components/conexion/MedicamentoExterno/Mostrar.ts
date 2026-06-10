export interface MedicamentoExterno {
  idme: number;
  idp: number;
  nomme: string;
  descrip: string;
  obs: string;
  EstadoEliminado?: boolean;
}

export async function MostrarMedicamentosExternosReal(): Promise<MedicamentoExterno[]> {
  try {
    const res = await fetch("http://localhost:3005/api/medicamentosExternos");
    if (!res.ok) throw new Error("Error fetching medicamentos externos");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching medicamentos externos:", error);
    return [];
  }
}
