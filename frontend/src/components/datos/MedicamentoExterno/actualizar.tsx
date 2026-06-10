import { useState } from "react";
import {
  Save,
  X,
  Tag,
  FileText,
  Info,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { ActualizarMedicamentoExterno } from "../../conexion/MedicamentoExterno/Actualizar";
import type { Theme } from "../../sidebars/Sidebar";

interface ActualizarExternoProps {
  theme: Theme;
  med: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

const ActualizarExternoForm = ({
  theme,
  med,
  onSuccess,
  onCancel,
  hideHeader = false,
}: ActualizarExternoProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";
  const [form, setForm] = useState(med);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomme) {
      showToast("El nombre del medicamento es obligatorio", "warning");
      return;
    }
    try {
      await ActualizarMedicamentoExterno(form);
      showToast("Registro actualizado correctamente", "success");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar el registro.", "warning");
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
              <RefreshCw size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">
                Editar Registro
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
              >
                Actualizando medicamento del paciente
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
        <div>
          <label className={labelStyles}><Tag size={14} /> Nombre del Medicamento</label>
          <div className="relative">
            <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              value={form.nomme}
              onChange={(e) => setForm({ ...form, nomme: e.target.value })}
              className={`${inputStyles} pl-12 font-bold`}
              placeholder="Nombre..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}><Info size={14} /> Descripción del Uso</label>
            <div className="relative">
              <Info size={18} className="absolute left-4 top-4 text-zinc-400" />
              <textarea
                value={form.descrip}
                onChange={(e) => setForm({ ...form, descrip: e.target.value })}
                className={`${inputStyles} pl-12 min-h-[120px] resize-none overflow-y-auto`}
                placeholder="Descripción..."
              />
            </div>
          </div>

          <div>
            <label className={labelStyles}><FileText size={14} /> Observaciones Clínicas</label>
            <div className="relative">
              <FileText size={18} className="absolute left-4 top-4 text-zinc-400" />
              <textarea
                value={form.obs}
                onChange={(e) => setForm({ ...form, obs: e.target.value })}
                className={`${inputStyles} pl-12 min-h-[120px] resize-none overflow-y-auto`}
                placeholder="Observaciones..."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
          {onCancel && (
            <button
              type="button"
              aria-label="Cancelar"
              onClick={onCancel}
              className={`flex-1 sm:flex-none px-10 py-3.5 rounded-2xl font-bold border-2 border-zinc-200 transition-all active:scale-95 ${
                isDarkMode ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            aria-label="Guardar Cambios"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-3.5 rounded-2xl font-black uppercase tracking-wider shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarExternoForm;
