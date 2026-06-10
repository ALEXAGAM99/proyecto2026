import { useEffect, useState } from "react";
import { InsertarPacientes } from "../../conexion/Paciente/Insertar";
import { ObtenerMedicos } from "../../conexion/Paciente/Insertar";
import { useToast } from "../../common/ToastContext";
import {
  UserPlus,
  Save,
  AlertCircle,
  Fingerprint,
  Calendar,
  Phone,
  Briefcase,
  MapPin,
  Users,
  X,
} from "lucide-react";
import type { Theme } from "../../sidebars/Sidebar";
import { motion } from "framer-motion";

interface InsertarPacienteProps {
  theme: Theme;
  onCancel?: () => void;
  onSuccess?: () => void;
  hideHeader?: boolean;
  pacientesExistentes?: any[];
}

export const InsertarPaciente = ({
  theme,
  onSuccess,
  onCancel,
  hideHeader = false,
  pacientesExistentes = [],
}: InsertarPacienteProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";

  const [form, setForm] = useState({
    ci: "",
    ap: "",
    am: "",
    nom: "",
    edad: "",
    ocu: "",
    fech: "",
    cel: "",
    pro: "",
    res: "",
    dir: "",
    nomt: "",
    matm: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    ap: "",
    am: "",
    nomt: "",
    ocu: "",
  });

  const isDuplicateCi = pacientesExistentes.some(
    (p: any) => p.ci === Number(form.ci) && p.ci !== 0,
  );

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const matActivo = localStorage.getItem("usuarioActivo");
      if (!matActivo) return;
      try {
        const data = await ObtenerMedicos();
        const me = data.find((m: any) => m.mat === matActivo);
        if (me) {
          setCurrentUser(me);
          setForm((prev) => ({ ...prev, matm: me.mat }));
        }
      } catch {}
    };
    loadCurrentUser();
  }, []);

  const validateField = (name: string, value: string) => {
    const textOnlyFields = ["nom", "ap", "am", "nomt", "ocu"];
    if (textOnlyFields.includes(name)) {
      if (/\d/.test(value)) {
        return "No se permiten números en este campo";
      }
      if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)) {
        return "No se permiten símbolos en este campo";
      }
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const hasErrors =
    Object.values(errors).some((error) => error !== "") || isDuplicateCi;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasErrors) {
      showToast(
        "Por favor, corrija los errores antes de continuar.",
        "warning",
      );
      return;
    }

    if (!form.ci || !form.nom || !form.ap || !form.matm) {
      showToast(
        "Faltan datos obligatorios: CI, Nombre, Apellido Paterno y Médico Asignado.",
        "warning",
      );
      return;
    }

    const data = {
      ...form,
      ci: Number(form.ci),
      edad: Number(form.edad),
      cel: Number(form.cel),
      fech: form.fech || new Date().toISOString().split("T")[0],
      EstadoEliminado: false,
      FechaEliminacion: null,
      UsuarioElimino: null,
    };

    try {
      await InsertarPacientes(data as any);
      showToast("Paciente registrado con éxito.", "success");
      setForm({
        ci: "",
        ap: "",
        am: "",
        nom: "",
        edad: "",
        ocu: "",
        fech: "",
        cel: "",
        pro: "",
        res: "",
        dir: "",
        nomt: "",
        matm: "",
      });
      setErrors({
        nom: "",
        ap: "",
        am: "",
        nomt: "",
        ocu: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Error al insertar paciente.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-blue-500/30 focus:border-blue-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/20 focus:border-blue-500"
  }`;

  const errorInputStyles = "border-red-500 ring-red-500/20";

  const labelStyles = `text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-500" : "text-gray-400"
  }`;

  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 8 }}
      className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
    >
      {message}
    </motion.p>
  );

  return (
    <div className={hideHeader ? "w-full" : "flex justify-center py-10 px-4"}>
      <form
        onSubmit={handleSubmit}
        className={`w-full transition-colors duration-300 ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800"
            : "bg-white border-gray-100"
        } ${hideHeader ? "border-none shadow-none !p-0 !bg-transparent" : "shadow-2xl rounded-3xl p-8 max-w-3xl border"}`}
      >
        {!hideHeader && (
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl">
              <UserPlus size={32} />
            </div>
            <h2
              className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Registrar Nuevo Paciente
            </h2>
          </div>
        )}

        {onCancel && !hideHeader && (
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onCancel}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-gray-100 text-gray-400"}`}
          >
            <X size={24} />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={labelStyles}>
              <Fingerprint size={14} /> Carnet (CI) *
            </label>
            <input
              name="ci"
              type="number"
              autoComplete="off"
              placeholder="Carnet"
              className={`${inputStyles} ${isDuplicateCi ? "border-red-500 ring-red-500/20" : ""}`}
              value={form.ci}
              onChange={handleChange}
              required
            />
            {isDuplicateCi && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
              >
                CI ya registrado en el sistema
              </motion.p>
            )}
          </div>
          <div className="relative">
            <label className={labelStyles}>
              <UserPlus size={14} /> Nombre *
            </label>
            <input
              name="nom"
              type="text"
              autoComplete="off"
              placeholder="Nombre"
              className={`${inputStyles} ${errors.nom ? errorInputStyles : ""}`}
              value={form.nom}
              onChange={handleChange}
              required
            />
            {errors.nom && <ErrorMessage message={errors.nom} />}
          </div>

          <div className="relative">
            <label className={labelStyles}>Apellido Paterno *</label>
            <input
              name="ap"
              type="text"
              autoComplete="off"
              placeholder="Apellido Paterno"
              className={`${inputStyles} ${errors.ap ? errorInputStyles : ""}`}
              value={form.ap}
              onChange={handleChange}
              required
            />
            {errors.ap && <ErrorMessage message={errors.ap} />}
          </div>
          <div className="relative">
            <label className={labelStyles}>Apellido Materno</label>
            <input
              name="am"
              type="text"
              autoComplete="off"
              placeholder="Apellido Materno"
              className={`${inputStyles} ${errors.am ? errorInputStyles : ""}`}
              value={form.am}
              onChange={handleChange}
            />
            {errors.am && <ErrorMessage message={errors.am} />}
          </div>

          <div>
            <label className={labelStyles}>
              <Calendar size={14} /> Edad
            </label>
            <input
              name="edad"
              type="number"
              min={0}
              autoComplete="off"
              placeholder="Edad"
              className={inputStyles}
              value={form.edad}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={labelStyles}>
              <Phone size={14} /> Celular
            </label>
            <input
              name="cel"
              type="number"
              min={0}
              autoComplete="off"
              placeholder="Celular"
              className={inputStyles}
              value={form.cel}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <label className={labelStyles}>
              <Briefcase size={14} /> Ocupación
            </label>
            <input
              name="ocu"
              type="text"
              autoComplete="off"
              placeholder="Ocupación"
              className={inputStyles}
              value={form.ocu}
              onChange={handleChange}
            />
            {errors.ocu && <ErrorMessage message={errors.ocu} />}
          </div>
          <div>
            <label className={labelStyles}>Profesión</label>
            <input
              name="pro"
              type="text"
              autoComplete="off"
              placeholder="Profesión"
              className={inputStyles}
              value={form.pro}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelStyles}>Residencia</label>
            <input
              name="res"
              type="text"
              autoComplete="off"
              placeholder="Ciudad / Localidad"
              className={inputStyles}
              value={form.res}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={labelStyles}>
              <MapPin size={14} /> Dirección
            </label>
            <input
              name="dir"
              type="text"
              autoComplete="off"
              placeholder="Calle, Nro de casa"
              className={inputStyles}
              value={form.dir}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <label className={labelStyles}>
              <Users size={14} /> Nombre Tutor
            </label>
            <input
              name="nomt"
              type="text"
              autoComplete="off"
              placeholder="Nombre tutor"
              className={`${inputStyles} ${errors.nomt ? errorInputStyles : ""}`}
              value={form.nomt}
              onChange={handleChange}
            />
            {errors.nomt && <ErrorMessage message={errors.nomt} />}
          </div>

          <div>
            <label className={labelStyles}>
              <Calendar size={14} /> Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fech"
              className={inputStyles}
              value={form.fech}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <label className={`${labelStyles} flex items-center gap-2`}>
              <Briefcase size={14} />
              Médico / Usuario Asignado *
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                readOnly
                value={
                  currentUser
                    ? `${currentUser.nomd || ""} ${currentUser.apd || ""} (${currentUser.mat})`
                    : ""
                }
                className={`w-full appearance-none rounded-xl border px-4 py-2.5 text-sm font-bold opacity-80 cursor-not-allowed ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`mt-2 border-t flex items-center justify-between ${isDarkMode ? "border-zinc-800" : "border-gray-100"}`}
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
                aria-label="Cancelar"
                onClick={onCancel}
                className={`px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 ${isDarkMode ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={hasErrors}
              aria-label="Guardar Paciente"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save size={18} />
              Guardar Paciente
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InsertarPaciente;
