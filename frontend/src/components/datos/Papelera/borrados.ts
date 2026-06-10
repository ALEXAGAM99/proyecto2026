import { MostrarPapeleraConsultas } from "../../conexion/Consulta/Papelera";
import { MostrarPapeleraDescargos } from "../../conexion/DescargoAdministracion/Papelera";
import { MostrarPapeleraMedicos } from "../../conexion/Doctor/Papelera";
import { MostrarPapeleraMedicamentos } from "../../conexion/Inventario/Papelera";
import { MostrarPapeleraMedicamentosExternos } from "../../conexion/MedicamentoExterno/Papelera";
import { MostrarPapeleraPacientes } from "../../conexion/Paciente/Papelera";


export async function ContarTodosBorrados(): Promise<number> {
  try {
    const [
      consultas,
      descargos,
      medicos,
      medicamentos,
      medicamentosExternos,
      pacientes
    ] = await Promise.all([
      MostrarPapeleraConsultas(),
      MostrarPapeleraDescargos(),
      MostrarPapeleraMedicos(),
      MostrarPapeleraMedicamentos(),
      MostrarPapeleraMedicamentosExternos(),
      MostrarPapeleraPacientes()
    ]);

    return (
      consultas.length +
      descargos.length +
      medicos.length +
      medicamentos.length +
      medicamentosExternos.length +
      pacientes.length
    );
  } catch (error) {
    console.error("Error en elementos de la papelera:", error);
    return 0;
  }
}
