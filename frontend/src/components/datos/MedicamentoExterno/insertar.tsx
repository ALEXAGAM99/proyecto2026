import { useState, useEffect } from "react";
import {
  Save,
  X,
  User,
  Tag,
  FileText,
  Info,
  ClipboardList,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { InsertarMedicamentoExterno } from "../../conexion/MedicamentoExterno/Insertar";
import { MostrarMedicamentosExternosReal } from "../../conexion/MedicamentoExterno/Mostrar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";
import { motion } from "framer-motion";

interface InsertarExternoProps {
  theme: Theme;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

const InsertarExternoForm = ({
  theme,
  onSuccess,
  onCancel,
  hideHeader = false,
}: InsertarExternoProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [form, setForm] = useState({
    idp: 0,
    nomme: "",
    descrip: "",
    obs: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, m] = await Promise.all([
          MostrarPacientes(),
          MostrarMedicamentosExternosReal(),
        ]);
        setPacientes(p.filter((pa) => !pa.EstadoEliminado));

        if (m && m.length > 0) {
          const ids = m.map((item) => item.idme);
          const maxId = Math.max(...ids);
          setNextId(maxId + 1);
        } else {
          setNextId(1);
        }
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    load();
  }, []);
  const [busquedaPaciente, setBusquedaPaciente] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idp === 0 || !form.nomme) {
      showToast(
        "Seleccione un paciente e ingrese el nombre del medicamento",
        "warning",
      );
      return;
    }
    try {
      await InsertarMedicamentoExterno({
        idme: nextId,
        idp: form.idp,
        nomme: form.nomme,
        descrip: form.descrip,
        obs: form.obs,
        EstadoEliminado: false,
        FechaEliminacion: null,
        UsuarioElimino: null,
      });
      showToast(`Registro #${nextId} guardado con éxito`, "success");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast("Error al registrar medicamento externo.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-3 rounded-2xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-indigo-500/30 focus:border-indigo-500"
      : "bg-white border-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/20 focus:border-indigo-500"
  }`;

  const labelStyles = `text-[10px] font-black uppercase tracking-widest mb-2 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-500" : "text-gray-400"
  }`;

  return (
    <div
      className={
        hideHeader
          ? "w-full"
          : `p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-gray-100"}`
      }
    >
      {!hideHeader && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-3xl">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">
                Registrar Ingreso
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
              >
                Control de medicamentos externos - ID Asignado: #{nextId}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cancelar"
            className="p-2 hover:bg-zinc-500/10 text-zinc-500 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <User size={14} /> Paciente Receptor
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                name="idp"
                list="pacientesME"
                autoComplete="off"
                value={busquedaPaciente}
                className={`${inputStyles} pl-12 font-bold`}
                placeholder="Buscar por nombre o CI..."
                onChange={(e) => {
                  const value = e.target.value;
                  setBusquedaPaciente(value);

                  const match = pacientes.find(
                    (p) => `${p.ap} ${p.nom} - ${p.ci}` === value,
                  );

                  setForm((prev) => ({
                    ...prev,
                    idp: match ? match.ci : 0,
                  }));
                }}
              />
              <datalist id="pacientesME">
                {pacientes
                  .filter((p) =>
                    `${p.nom} ${p.ap}`
                      .toLowerCase()
                      .includes(busquedaPaciente.toLowerCase()),
                  )
                  .slice(0, 5)
                  .map((p) => (
                    <option key={p.ci} value={`${p.ap} ${p.nom} - ${p.ci}`} />
                  ))}
              </datalist>
              {busquedaPaciente && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setBusquedaPaciente("");

                    setForm((prev) => ({
                      ...prev,
                      idp: 0,
                    }));
                  }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    isDarkMode
                      ? "text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                      : "text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                  }`}
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>
          </div>

          <div>
            <label className={labelStyles}>
              <Tag size={14} /> Nombre del Fármaco
            </label>
            <div className="relative">
              <Tag
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"
              />
              <input
                type="text"
                value={form.nomme}
                onChange={(e) => setForm({ ...form, nomme: e.target.value })}
                className={`${inputStyles} pl-12 font-bold`}
                placeholder="Nombre comercial/genérico..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <Info size={14} /> Instrucciones / Posología
            </label>
            <div className="relative">
              <Info size={18} className="absolute left-4 top-4 text-zinc-400" />
              <textarea
                value={form.descrip}
                onChange={(e) => setForm({ ...form, descrip: e.target.value })}
                className={`${inputStyles} pl-12 min-h-[120px] resize-none overflow-y-auto`}
                placeholder="Dosis, frecuencia, etc."
              />
            </div>
          </div>

          <div>
            <label className={labelStyles}>
              <FileText size={14} /> Observaciones Clínicas
            </label>
            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-zinc-400"
              />
              <textarea
                value={form.obs}
                onChange={(e) => setForm({ ...form, obs: e.target.value })}
                className={`${inputStyles} pl-12 min-h-[120px] resize-none overflow-y-auto`}
                placeholder="Notas adicionales relevantes..."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
          {onCancel && (
            <button
              type="button"
              aria-label="Cancelar"
              onClick={onCancel}
              className={`flex-1 sm:flex-none px-10 py-3.5 rounded-2xl font-bold border-2 border-zinc-200 transition-all active:scale-95 ${
                isDarkMode
                  ? "bg-zinc-900 text-zinc-400 hover:text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            aria-label="Confirmar Ingreso"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-3.5 rounded-2xl font-black uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Save size={18} /> Confirmar Ingreso
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsertarExternoForm;
