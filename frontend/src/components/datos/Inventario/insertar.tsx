import { useState } from "react";
import {
  Package,
  Save,
  AlertCircle,
  X,
  Tag,
  Calendar,
  Archive,
  DollarSign,
  Info,
  Activity,
  Pill,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { InsertarMedicamento } from "../../conexion/Inventario/Insertar";
import { type Medicamento } from "../../conexion/Inventario/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";
import { motion } from "framer-motion";

interface InsertarInventarioProps {
  theme: Theme;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
  medicamentosExistentes?: Medicamento[];
}

const InsertarInventarioForm = ({
  theme,
  onSuccess,
  onCancel,
  hideHeader = false,
  medicamentosExistentes = [],
}: InsertarInventarioProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";
  const [form, setForm] = useState<Medicamento>({
    codm: 0,
    nomm: "",
    fechv: new Date().toISOString().slice(0, 10),
    numex: 0,
    precio: 0,
    frecuso: "Media",
    obs: "",
    EstadoEliminado: false,
    FechaEliminacion: null,
    UsuarioElimino: null,
  });

  const isDuplicateId = medicamentosExistentes.some(m => m.codm === form.codm && m.codm !== 0);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "numex" || name === "precio" || name === "codm" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.codm === 0) {
      showToast("Ingrese un código ID válido", "warning");
      return;
    }

    if (isDuplicateId) {
      showToast("Este código ID ya existe en el inventario", "warning");
      return;
    }

    if (!form.nomm) {
      showToast("Ingrese el nombre del fármaco", "warning");
      return;
    }
    try {
      await InsertarMedicamento(form as Medicamento);
      showToast("Medicamento registrado con éxito", "success");
      onSuccess?.();
    } catch (error) {
      showToast("Error al registrar medicamento.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-amber-500/30 focus:border-amber-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-amber-500/20 focus:border-amber-500"
  }`;

  const labelStyles = `text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 ${
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
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-3xl">
              <Package size={32} />
            </div>
            <div>
              <h2
                className={`text-2xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Nuevo Fármaco
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
              >
                Añadir suministros al stock global del inventario.
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onCancel}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-zinc-800 text-zinc-500 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"}`}
            >
              <X size={24} />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 mb-3">
          <div className="grid grid-cols-1 w1/3 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="codm" className={labelStyles}>Código Medicamento</label>
              <div className="relative">
                <Tag
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50"
                />
                <input
                  type="number"
                  name="codm"
                  value={form.codm || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={`${inputStyles} pl-12 font-mono ${isDuplicateId ? "border-red-500 ring-red-500/20" : ""}`}
                />
                {isDuplicateId && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-5 left-1 text-[9px] font-bold text-red-500 uppercase tracking-tighter"
                  >
                    Este código ya está en uso
                  </motion.p>
                )}
              </div>
            </div>
            <div>
              <label className={labelStyles}>Nombre del Medicamento</label>
              <div className="relative">
                <Pill
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  name="nomm"
                  autoComplete="off"
                  value={form.nomm}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-12 font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Fecha de Vencimiento</label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="date"
                  name="fechv"
                  value={form.fechv}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-12`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelStyles}>Existencias</label>
              <div className="relative">
                <Archive
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  name="numex"
                  value={form.numex || ""}
                  placeholder="0"
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-12 font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Precio (Bs.)</label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                />
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  autoComplete="off"
                  value={form.precio || ""}
                  placeholder="0.00"
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-12 font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Frecuencia de Uso</label>
              <div className="relative">
                <Activity
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500"
                />
                <select
                  name="frecuso"
                  value={form.frecuso}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-12`}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                  <option value="Ocasional">Ocasional</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className={labelStyles}>Observaciones</label>
            <div className="relative">
              <Info size={18} className="absolute left-4 top-4 text-zinc-400" />
              <textarea
                name="obs"
                value={form.obs}
                onChange={handleInputChange}
                className={`${inputStyles} pl-12 min-h-[100px] resize-none`}
                placeholder="Notas de almacenamiento, contraindicaciones..."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">
              Verifique el stock antes de guardar
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                aria-label="Cancelar"
                onClick={onCancel}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-bold border-2 border-zinc-200 transition-all active:scale-95 ${
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
              aria-label="Guardar Cambios"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-8 py-2 rounded-2xl font-bold shadow-lg mr-5 shadow-amber-600/20 transition-all active:scale-95"
            >
              <Save size={18}/>
              Añadir al Stock
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InsertarInventarioForm;

