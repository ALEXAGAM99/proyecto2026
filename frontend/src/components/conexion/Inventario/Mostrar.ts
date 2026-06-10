export interface Medicamento {
  codm: number;
  nomm: string;
  fechv: string;
  numex: number;
  precio: number;
  frecuso: string;
  obs: string;
  EstadoEliminado: boolean;
  FechaEliminacion: string | null;
  UsuarioElimino: string | null;
}

export async function MostrarMedicamentosReal(): Promise<Medicamento[]> {
  try {
    const res = await fetch("http://localhost:3005/api/medicamentos");
    return res.json();
  } catch (error) {
    console.error("Error fetching medicamentos:", error);
    return [];
  }
}
