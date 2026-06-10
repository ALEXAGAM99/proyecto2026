import { useState, useEffect } from "react";
import {
  Calendar,
  Save,
  X,
  User,
  ClipboardList,
  Thermometer,
  Ruler,
  Scale,
  Activity,
  HeartPulse,
  AlertCircle,
  Stethoscope,
  Wind,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { ActualizarConsulta } from "../../conexion/Consulta/Actualizar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import {
  MostrarConsultasReal,
  type Consulta,
} from "../../conexion/Consulta/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";

interface ActualizarConsultaProps {
  theme: Theme;
  idc: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

const ActualizarConsultaForm = ({
  theme,
  idc,
  onSuccess,
  onCancel,
  hideHeader = false,
}: ActualizarConsultaProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Consulta | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [patientsData, consultasData] = await Promise.all([
          MostrarPacientes(),
          MostrarConsultasReal(),
        ]);

        setPacientes(patientsData.filter((p) => !p.EstadoEliminado));

        const currentConsulta = consultasData.find((c) => c.idc === idc);
        if (currentConsulta) {
          setForm(currentConsulta);
        } else {
          showToast("No se encontró la consulta", "warning");
          onCancel?.();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [idc]);

  const calculateIMC = (p: string, t: string) => {
    const weight = parseFloat(p);
    let height = parseFloat(t);
    if (weight > 0 && height > 0) {
      if (height > 3) {
        height = height / 100;
      }
      return (weight / (height * height)).toFixed(2);
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm((prev: any) => {
      const next = { ...prev, [name]: value };
      if (name === "peso" || name === "talla") {
        next.imc = calculateIMC(next.peso, next.talla);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      await ActualizarConsulta(form);
      showToast("Consulta actualizada correctamente", "success");
      onSuccess?.();
    } catch (error) {
      showToast("Error al actualizar consulta.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-blue-500/30 focus:border-blue-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/20 focus:border-blue-500"
  }`;

  const labelStyles = `text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-500" : "text-gray-400"
  }`;

  const SectionTitle = ({
    icon: Icon,
    title,
  }: {
    icon: any;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div
        className={`p-1.5 rounded-lg ${isDarkMode ? "bg-zinc-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}
      >
        <Icon size={14} />
      </div>
      <h3
        className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
      >
        {title}
      </h3>
      <div
        className={`flex-1 h-[1px] ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`}
      ></div>
    </div>
  );

  if (loading || !form) {
    return (
      <div className="p-20 text-center animate-pulse">
        <ClipboardList size={40} className="mx-auto mb-4 opacity-20" />
        <p className="text-xs font-black uppercase tracking-widest opacity-40">
          Cargando...
        </p>
      </div>
    );
  }

  const patient = pacientes.find((p) => p.ci === form.idp);

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
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-3xl">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2
                className={`text-2xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Actualizar Consulta
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
              >
                ID Registro: #{idc}
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-zinc-800 text-zinc-500 hover:text-white" : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"}`}
            >
              <X size={24} />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN 1: IDENTIFICACIÓN */}
        <div className="space-y-4">
          <SectionTitle icon={User} title="Información General" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Paciente (No Editable)</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  readOnly
                  value={
                    patient ? `${patient.nom} ${patient.ap}` : `CI: ${form.idp}`
                  }
                  className={`${inputStyles} pl-12 bg-zinc-100 dark:bg-zinc-900 opacity-60 cursor-not-allowed`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Fecha y Hora Original</label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  readOnly
                  value={new Date(form.fechactual).toLocaleString()}
                  className={`${inputStyles} pl-12 bg-zinc-100 dark:bg-zinc-900 opacity-60 cursor-not-allowed`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: SIGNOS VITALES (TRIAJE) */}
        <div className="space-y-4">
          <SectionTitle icon={HeartPulse} title="Signos Vitales y Triaje" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelStyles}>Presión Art. (PA)</label>
              <div className="relative">
                <Activity
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                />
                <input
                  type="text"
                  name="pa"
                  value={form.pa}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-10 text-xs font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>F. Cardíaca (P)</label>
              <div className="relative">
                <HeartPulse
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                />
                <input
                  type="text"
                  name="fc"
                  value={form.fc}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-10 text-xs font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Temp. Corporal</label>
              <div className="relative">
                <Thermometer
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500"
                />
                <input
                  type="text"
                  name="temp"
                  value={form.temp}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-10 text-xs font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>F. Resp. (FR)</label>
              <div className="relative">
                <Wind
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"
                />
                <input
                  type="text"
                  name="fr"
                  value={form.fr}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-10 text-xs font-bold`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelStyles}>Peso (Kg)</label>
              <div className="relative">
                <Scale
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"
                />
                <input
                  type="text"
                  name="peso"
                  value={form.peso}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-10 text-xs font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Talla (m)</label>
              <div className="relative">
                <Ruler
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"
                />
                <input
                  type="text"
                  name="talla"
                  value={form.talla}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-10 text-xs font-bold`}
                />
              </div>
            </div>
            <div>
              <label className={labelStyles}>IMC</label>
              <div className="relative">
                <Activity
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  name="imc"
                  value={form.imc}
                  readOnly
                  className={`${inputStyles} pl-10 bg-zinc-50 dark:bg-zinc-100/10 border-none font-black text-blue-500`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: EVOLUCIÓN CLÍNICA */}
        <SectionTitle icon={Stethoscope} title="Evaluación y Conducta" />
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyles}>Motivo de la Consulta</label>
            <textarea
              name="mc"
              value={form.mc}
              onChange={handleInputChange}
              className={`${inputStyles} min-h-[120px] py-4 resize-none leading-relaxed text-sm`}
            />
          </div>
          <div>
            <label className={labelStyles}>Evolución Médica</label>
            <textarea
              name="evad"
              value={form.evad}
              onChange={handleInputChange}
              className={`${inputStyles} min-h-[120px] py-4 resize-none leading-relaxed text-sm`}
            />
          </div>
          <div>
            <label className={labelStyles}>Conducta / Plan a seguir</label>
            <textarea
              name="cond"
              value={form.cond}
              onChange={handleInputChange}
              className={`${inputStyles} min-h-[120px] py-4 resize-none leading-relaxed text-sm`}
            />
          </div>
        </div>

        {/* FOOTER ACCIONES */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-500">
            <AlertCircle size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">
              Modificando registro histórico #{idc}
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
                  isDarkMode
                    ? "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActualizarConsultaForm;
