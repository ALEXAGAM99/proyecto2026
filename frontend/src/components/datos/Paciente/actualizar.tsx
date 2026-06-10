import { useEffect, useState } from "react";
import {
  ActualizarPaciente,
  type Paciente,
} from "../../conexion/Paciente/Actualizar";
import { ObtenerMedicos, type Medico } from "../../conexion/Paciente/Insertar";
import {
  Save,
  AlertCircle,
  Fingerprint,
  Calendar,
  Phone,
  Briefcase,
  MapPin,
  Users,
  X,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import type { Theme } from "../../sidebars/Sidebar";

interface ActualizarPacienteProps {
  theme: Theme;
  paciente: Paciente;
  onSuccess?: (updatedPatient: Paciente) => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

export const ActualizarPacienteComponent = ({
  theme,
  paciente,
  onSuccess,
  onCancel,
  hideHeader = false,
}: ActualizarPacienteProps) => {
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

  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    if (paciente) {
      setForm({
        ci: paciente.ci.toString(),
        ap: paciente.ap || "",
        am: paciente.am || "",
        nom: paciente.nom || "",
        edad: paciente.edad?.toString() || "",
        ocu: paciente.ocu || "",
        fech: paciente.fech ? paciente.fech.split("T")[0] : "",
        cel: paciente.cel?.toString() || "",
        pro: paciente.pro || "",
        res: paciente.res || "",
        dir: paciente.dir || "",
        nomt: paciente.nomt || "",
        matm: paciente.matm || "",
      });
    }
  }, [paciente]);

  const [previousDoctor, setPreviousDoctor] = useState<Medico | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const data = await ObtenerMedicos();
      setMedicos(data);

      if (paciente) {
        const prev = data.find((m) => m.mat === paciente.matm);
        setPreviousDoctor(prev || null);
      }

      const matActivo = localStorage.getItem("usuarioActivo");
      if (matActivo) {
        const curr = data.find((m) => m.mat === matActivo);
        if (curr) {
          setForm((f) => ({ ...f, matm: curr.mat }));
        }
      }
    };
    cargar();
  }, [paciente]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.ci || !form.nom || !form.ap || !form.matm) {
      showToast(
        "Faltan datos obligatorios: CI, Nombre, Apellido Paterno y Médico Asignado.",
        "warning",
      );
      return;
    }

    const data: Paciente = {
      ...paciente,
      ...form,
      ci: Number(form.ci),
      edad: Number(form.edad),
      cel: Number(form.cel),
      fech: form.fech,
    };

    try {
      await ActualizarPaciente(data);
      showToast("Paciente actualizado con éxito.", "success");
      if (onSuccess) onSuccess(data);
    } catch (err) {
      console.error(err);
      showToast("Error al actualizar paciente.", "warning");
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

  const currentDoctor = medicos.find((m) => m.mat === form.matm);

  return (
    <div className={hideHeader ? "w-full" : "flex justify-center py-10 px-4"}>
      <form
        onSubmit={handleSubmit}
        className={`w-full transition-colors duration-300 ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-800 text-zinc-100"
            : "bg-white border-gray-100 text-gray-900"
        } ${hideHeader ? "border-none shadow-none !p-0 !bg-transparent" : "shadow-2xl rounded-3xl p-8 max-w-3xl border"}`}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl">
                <RefreshCw size={32} />
              </div>
              <h2
                className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Actualizar Paciente
              </h2>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-gray-100 text-gray-400"}`}
              >
                <X size={24} />
              </button>
            )}
          </div>
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
              placeholder="Ej: 12345678"
              className={inputStyles}
              value={form.ci}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div>
            <label className={labelStyles}>
              <Calendar size={14} /> Nombre *
            </label>
            <input
              name="nom"
              type="text"
              autoComplete="off"
              placeholder="Ej: Juan"
              className={inputStyles}
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Apellido Paterno *</label>
            <input
              name="ap"
              type="text"
              autoComplete="off"
              placeholder="Apellido Paterno"
              className={inputStyles}
              value={form.ap}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className={labelStyles}>Apellido Materno</label>
            <input
              name="am"
              type="text"
              autoComplete="off"
              placeholder="Apellido Materno"
              className={inputStyles}
              value={form.am}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelStyles}>
              <Calendar size={14} /> Edad
            </label>
            <input
              name="edad"
              type="number"
              autoComplete="off"
              placeholder="Ej: 30"
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
              autoComplete="off"
              placeholder="Ej: 77712345"
              className={inputStyles}
              value={form.cel}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className={labelStyles}>
              <Briefcase size={14} /> Ocupación
            </label>
            <input
              name="ocu"
              type="text"
              autoComplete="off"
              placeholder="Ej: Ingeniero"
              className={inputStyles}
              value={form.ocu}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={labelStyles}>Profesión</label>
            <input
              name="pro"
              type="text"
              autoComplete="off"
              placeholder="Ej: Sistemas"
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

          <div>
            <label className={labelStyles}>
              <Users size={14} /> Nombre Tutor
            </label>
            <input
              name="nomt"
              type="text"
              autoComplete="off"
              placeholder="Nombre completo del tutor"
              className={inputStyles}
              value={form.nomt}
              onChange={handleChange}
            />
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5 gap-2">
              <label className={`${labelStyles} !mb-0`}>
                <Briefcase size={14} />
                Realizando Cambios (Actual) *
              </label>
              {previousDoctor &&
                currentDoctor &&
                previousDoctor.mat !== currentDoctor.mat && (
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md ${isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
                  >
                    Última modif. por: {previousDoctor.nomd}{" "}
                    {previousDoctor.apd}
                  </span>
                )}
            </div>

            <div className="relative mt-1">
              <input
                type="text"
                readOnly
                value={
                  currentDoctor
                    ? `${currentDoctor.nomd || ""} ${currentDoctor.apd || ""} (${currentDoctor.mat})`
                    : form.matm || "Buscando..."
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
              Actualizar Datos
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActualizarPacienteComponent;
