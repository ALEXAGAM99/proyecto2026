import { useState, useEffect } from "react";
import { Save, AlertCircle, Fingerprint } from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { ActualizarMedico } from "../../conexion/Doctor/Actualizar";
import { type Medico } from "../../conexion/Doctor/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";

interface ActualizarDoctorProps {
  theme: Theme;
  medico: Medico;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

const ActualizarDoctor = ({
  theme,
  medico,
  onSuccess,
  onCancel,
  hideHeader = false,
}: ActualizarDoctorProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";

  const [form, setForm] = useState({
    mat: "",
    nomd: "",
    apd: "",
    amd: "",
  });

  useEffect(() => {
    if (medico) {
      setForm({
        mat: medico.mat,
        nomd: medico.nomd,
        apd: medico.apd,
        amd: medico.amd || "",
      });
    }
  }, [medico]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await ActualizarMedico({
        ...medico,
        ...form,
      });
      showToast("Médico actualizado con éxito.", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Error al actualizar médico.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-blue-500/30 focus:border-blue-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/20 focus:border-blue-500"
  }`;

  const labelStyles = `text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-500" : "text-gray-400"
  }`;

  return (
    <div className="flex justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl border transition-colors duration-300 ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800"
            : "bg-white border-gray-100"
        } ${hideHeader ? "border-none shadow-none !p-0 !bg-transparent" : "shadow-2xl rounded-3xl p-8"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <Fingerprint size={14} /> Matrícula
            </label>
            <input
              name="mat"
              type="text"
              className={inputStyles}
              value={form.mat}
              disabled
            />
          </div>
          <div>
            <label className={labelStyles}>
              <Fingerprint size={14} /> Nombre *
            </label>
            <input
              name="nomd"
              type="text"
              autoComplete="off"
              className={inputStyles}
              value={form.nomd}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Apellido Paterno *</label>
            <input
              name="apd"
              type="text"
              autoComplete="off"
              className={inputStyles}
              value={form.apd}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className={labelStyles}>Apellido Materno</label>
            <input
              name="amd"
              type="text"
              autoComplete="off"
              className={inputStyles}
              value={form.amd}
              onChange={handleChange}
            />
          </div>
        </div>

        <div
          className={`mt-0 pt-6 border-t flex items-center justify-between ${isDarkMode ? "border-zinc-800" : "border-gray-100"}`}
        >
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={16} />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Los campos con * son obligatorios
            </span>
          </div>

          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${isDarkMode ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] transition-all active:scale-95"
            >
              <Save size={18} />
              Actualizar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActualizarDoctor;
