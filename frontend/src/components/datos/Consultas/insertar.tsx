import { useState, useEffect } from "react";
import {
  Calendar,
  Save,
  X,
  User,
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
import { InsertarConsulta } from "../../conexion/Consulta/Insertar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";
import "./../../../index.css";
import { AnimatePresence, motion } from "framer-motion";

interface InsertarConsultaProps {
  theme: Theme;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
  patientId?: number;
}

const InsertarConsultaForm = ({
  theme,
  onSuccess,
  onCancel,
  hideHeader = false,
  patientId,
}: InsertarConsultaProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    idp: patientId || 0,
    mc: "",
    evad: "",
    pa: "",
    fc: "",
    fr: "",
    temp: "",
    peso: "",
    talla: "",
    imc: "",
    cond: "",
    fechactual: (() => {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      return new Date(now.getTime() - offset).toISOString().slice(0, 16);
    })(),
    EstadoEliminado: false,
    FechaEliminacion: null,
    UsuarioElimino: null,
  });

  useEffect(() => {
    if (patientId) {
      setForm((prev) => ({ ...prev, idp: patientId }));
    }
  }, [patientId]);

  useEffect(() => {
    const loadPacientes = async () => {
      const data = await MostrarPacientes();
      setPacientes(data.filter((p) => !p.EstadoEliminado));
    };
    loadPacientes();
  }, []);

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
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "peso" || name === "talla") {
        next.imc = calculateIMC(next.peso, next.talla);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idp === 0) {
      showToast("Seleccione un paciente valido", "warning");
      return;
    }
    try {
      await InsertarConsulta(form);
      showToast("Consulta registrada con éxito", "success");
      onSuccess?.();
    } catch (error) {
      showToast("Error al registrar consulta.", "warning");
    }
  };

  const handlePacienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;

    setBusquedaPaciente(texto);

    const pacienteEncontrado = pacientes.find(
      (p) => `${p.nom} ${p.ap}`.toLowerCase() === texto.toLowerCase(),
    );

    setForm((prev) => ({
      ...prev,
      idp: pacienteEncontrado ? pacienteEncontrado.ci : 0,
    }));
  };

  const [busquedaPaciente, setBusquedaPaciente] = useState("");

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-emerald-500/30 focus:border-emerald-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-emerald-500/20 focus:border-emerald-500"
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
        className={`p-1.5 rounded-lg ${isDarkMode ? "bg-zinc-800 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}
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

  return (
    <div
      className={
        hideHeader
          ? "w-full"
          : `p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-gray-100"}`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN 1: IDENTIFICACIÓN */}
        <div className="space-y-4">
          <SectionTitle icon={User} title="Información General" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Paciente Asignado *</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                {patientId ? (
                  <input
                    type="text"
                    name="idp"
                    value={
                      pacientes.find((p) => p.ci === patientId)?.nom +
                      " " +
                      pacientes.find((p) => p.ci === patientId)?.ap
                    }
                    onChange={handleInputChange}
                    className={`${inputStyles} pl-12`}
                    disabled
                  />
                ) : (
                  <div className="relative">
                    <input
                      name="idp"
                      type="text"
                      placeholder="Ingresar Paciente"
                      value={busquedaPaciente}
                      autoComplete="off"
                      list="paciente-consulta"
                      className={`${inputStyles} pl-12 pr-10`}
                      disabled={!!patientId}
                      onChange={handlePacienteChange}
                    />

                    <datalist id="paciente-consulta">
                      {pacientes
                        .filter((p) =>
                          `${p.nom} ${p.ap}`
                            .toLowerCase()
                            .includes(busquedaPaciente.toLowerCase()),
                        )
                        .slice(0, 5)
                        .map((paciente) => (
                          <option
                            key={paciente.ci}
                            value={`${paciente.nom} ${paciente.ap}`}
                          />
                        ))}
                    </datalist>

                    <AnimatePresence>
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
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className={labelStyles}>Fecha y Hora de Atención</label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="datetime-local"
                  name="fechactual"
                  value={form.fechactual}
                  onChange={handleInputChange}
                  className={`${inputStyles} pl-12`}
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
                  type="number"
                  name="pa"
                  placeholder="0"
                  autoComplete="off"
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
                  type="number"
                  name="fc"
                  placeholder="75 bpm"
                  autoComplete="off"
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
                  type="number"
                  name="temp"
                  placeholder="36.5 °C"
                  autoComplete="off"
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
                  type="number"
                  name="fr"
                  placeholder="18 rpm"
                  autoComplete="off"
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
                  type="number"
                  name="peso"
                  placeholder="70 kg"
                  autoComplete="off"
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
                  type="number"
                  name="talla"
                  placeholder="Ej: 1.75"
                  autoComplete="off"
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
                  type="number"
                  name="imc"
                  value={form.imc}
                  readOnly
                  placeholder="Autocalculado"
                  className={`${inputStyles} pl-10 bg-zinc-50 dark:bg-zinc-100/10 border-none font-black text-emerald-500`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: EVOLUCIÓN CLÍNICA */}
        <SectionTitle icon={Stethoscope} title="Evaluación y Conducta" />
        <div className="space-y-2 grid grid-cols-3 gap-4">
          <div>
            <div>
              <label className={labelStyles}>Motivo de la Consulta</label>
              <textarea
                name="mc"
                value={form.mc}
                onChange={handleInputChange}
                className={`${inputStyles} min-h-[100px] py-4 resize-none leading-relaxed text-sm`}
                placeholder="Describa brevemente el motivo de la visita del paciente..."
              />
            </div>
          </div>
          <div>
            <label className={labelStyles}>Evolución Médica</label>
            <textarea
              name="evad"
              value={form.evad}
              onChange={handleInputChange}
              className={`${inputStyles} min-h-[100px] py-4 resize-none leading-relaxed text-sm`}
              placeholder="Notas sobre el estado y evolución..."
            />
          </div>
          <div>
            <label className={labelStyles}>Conducta / Plan a seguir</label>
            <textarea
              name="cond"
              value={form.cond}
              onChange={handleInputChange}
              className={`${inputStyles} min-h-[100px] py-4 resize-none leading-relaxed text-sm`}
              placeholder="Indicaciones, medicamentos y plan diagnóstico..."
            />
          </div>
        </div>

        {/* FOOTER ACCIONES */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isDarkMode ? "border-zinc-800" : "border-gray-100"}`}
        >
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">
              Verifique todos los registros antes de guardar
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
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Save size={18} />
              Guardar Consulta
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InsertarConsultaForm;
