import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  X,
  RefreshCw,
  Calendar,
  Clock,
  Info,
  Activity,
  Tag,
  Package,
} from "lucide-react";
import { ActualizarDescargo } from "../../conexion/DescargoAdministracion/Actualizar";
import {
  MostrarMedicamentosReal,
  type Medicamento,
} from "../../conexion/Inventario/Mostrar";
import { ActualizarMedicamento } from "../../conexion/Inventario/Actualizar";
import type { Theme } from "../../sidebars/Sidebar";
import { useToast } from "../../common/ToastContext";

interface ActualizarDescargoProps {
  theme: Theme;
  descargo: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

const ActualizarDescargoForm = ({
  theme,
  descargo,
  onSuccess,
  onCancel,
  hideHeader = false,
}: ActualizarDescargoProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  const formatInputDate = (d: string) => {
    if (!d) return "";
    return d.split("T")[0];
  };

  const formatInputTime = (t: string) => {
    if (!t) return "";
    if (t.includes("T")) {
      return new Date(t).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return t;
  };

  const [form, setForm] = useState({
    ...descargo,
    fechi: formatInputDate(descargo.fechi),
    horai: formatInputTime(descargo.horai),
    fechalta: descargo.fechalta
      ? formatInputDate(descargo.fechalta)
      : new Date().toISOString().slice(0, 10),
    horalta: descargo.horalta
      ? formatInputTime(descargo.horalta)
      : new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
  });

  useEffect(() => {
    const load = async () => {
      const m = await MostrarMedicamentosReal();
      setMedicamentos(m);
    };
    load();
  }, []);

  const currentMed = medicamentos.find((m) => m.codm === form.codm);

  const getStockStatus = () => {
    if (!currentMed)
      return { insufficient: false, available: 0, maxPosible: 0 };

    if (descargo.codm === form.codm) {
      const maxPosible = currentMed.numex + descargo.cant;
      return {
        insufficient: form.cant > maxPosible,
        available: currentMed.numex,
        maxPosible,
      };
    } else {
      return {
        insufficient: form.cant > currentMed.numex,
        available: currentMed.numex,
        maxPosible: currentMed.numex,
      };
    }
  };

  const stockStatus = getStockStatus();
  const isStockInsufficient = stockStatus.insufficient;

  const handleMedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCodm = Number(e.target.value);
    const med = medicamentos.find((m) => m.codm === newCodm);
    setForm({
      ...form,
      codm: newCodm,
      costo: med ? med.precio * form.cant : 0,
    });
  };

  const handleCantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCant = Number(e.target.value);
    const med = medicamentos.find((m) => m.codm === form.codm);
    setForm({
      ...form,
      cant: newCant,
      costo: med ? med.precio * newCant : 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const oldCodm = descargo.codm;
      const oldCant = descargo.cant;
      const newCodm = form.codm;
      const newCant = form.cant;

      if (isStockInsufficient) {
        showToast(
          `Stock insuficiente. Máximo posible: ${stockStatus.maxPosible}`,
          "warning",
        );
        return;
      }

      if (oldCodm === newCodm) {
        const delta = newCant - oldCant;
        if (delta !== 0) {
          const med = medicamentos.find((m) => m.codm === newCodm);
          if (med) {
            await ActualizarMedicamento({ ...med, numex: med.numex - delta });
          }
        }
      } else {
        const oldMed = medicamentos.find((m) => m.codm === oldCodm);
        if (oldMed) {
          await ActualizarMedicamento({
            ...oldMed,
            numex: oldMed.numex + oldCant,
          });
        }
        const newMed = medicamentos.find((m) => m.codm === newCodm);
        if (newMed) {
          await ActualizarMedicamento({
            ...newMed,
            numex: newMed.numex - newCant,
          });
        }
      }

      await ActualizarDescargo(form);
      showToast("Descargo e Inventario actualizados.", "success");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast("Error al guardar cambios.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-sky-500/30 focus:border-sky-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-sky-500/20 focus:border-sky-500"
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
            <div className="p-4 bg-sky-500/10 text-sky-500 rounded-3xl">
              <RefreshCw size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">
                Editar Descargo
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
              >
                ID de Registro: #{descargo.idd}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cerrar"
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
              <Package size={14} /> Insumo Administrado
            </label>
            <div className="relative">
              <Package
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
              />
              <select
                value={form.codm}
                onChange={handleMedChange}
                className={`${inputStyles} pl-12 font-bold`}
              >
                {medicamentos.map((m) => (
                  <option key={m.codm} value={m.codm}>
                    {m.nomm} ({m.numex})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative">
            <label className={labelStyles}>
              <Activity size={14} /> Cantidad
            </label>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={form.cant === 0 ? "" : form.cant}
              onChange={handleCantChange}
              className={`${inputStyles} ${isStockInsufficient ? "border-red-500 text-red-500 focus:ring-red-500/20 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]" : ""}`}
            />
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
            >
              {form.cant === 0 || form.cant === null
                ? "La cantidad es obligatoria"
                : form.cant < 0
                  ? "La cantidad no puede ser negativa"
                  : null}
            </motion.p>
            {isStockInsufficient && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
              >
                Stock insuficiente (Máximo posible: {stockStatus.maxPosible})
              </motion.p>
            )}
          </div>
        </div>

        <div>
          <label className={labelStyles}>
            <Info size={14} /> Diagnóstico / Indicación Actualizada
          </label>
          <div className="relative">
            <Info size={18} className="absolute left-4 top-4 text-zinc-400" />
            <textarea
              value={form.diag}
              onChange={(e) => setForm({ ...form, diag: e.target.value })}
              className={`${inputStyles} pl-12 min-h-[80px] resize-none`}
              placeholder="Notas del descargo..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <Calendar size={14} /> Fecha de Alta
            </label>
            <input
              type="date"
              value={form.fechalta}
              onChange={(e) => setForm({ ...form, fechalta: e.target.value })}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>
              <Clock size={14} /> Hora de Alta
            </label>
            <input
              type="time"
              value={form.horalta}
              onChange={(e) => setForm({ ...form, horalta: e.target.value })}
              className={inputStyles}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-emerald-500" />
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">
              Costo Actualizado: {form.costo.toFixed(2)} Bs.
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
              disabled={isStockInsufficient || form.cant <= 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
            >
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActualizarDescargoForm;
