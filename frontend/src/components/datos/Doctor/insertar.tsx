import { useState, useEffect } from "react";
import { Save, ShieldCheck, Eye, EyeOff, Stethoscope } from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { InsertarMedico } from "../../conexion/Doctor/Insertar";
import type { Theme } from "../../sidebars/Sidebar";
import { motion } from "framer-motion";
import { checkPasswordStrength } from "../../../lib/utils";
import { useSocket } from "../../../hooks/useSocket";
import ReCAPTCHA from "react-google-recaptcha";

interface InsertarDoctorProps {
  theme: Theme;
  onSuccess?: () => void;
  onCancel?: () => void;
  doctoresExistentes?: any[];
  isPopover?: boolean;
}

const InsertarDoctor = ({
  theme,
  onSuccess,
  doctoresExistentes = [],
}: InsertarDoctorProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark" || theme === "hybrid";
  const { socket } = useSocket();

  const [form, setForm] = useState({
    mat: "",
    nomd: "",
    apd: "",
    amd: "",
    contra: "",
    confirmar_contra: "",
    tipo: "doctor",
  });

  const [errors, setErrors] = useState({
    nomd: "",
    apd: "",
    amd: "",
    contra: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const ustr = localStorage.getItem("userObject");
      if (ustr) {
        const u = JSON.parse(ustr);
        setIsAdmin(u.tipo === "administrador");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("actualizar_datos", () => {
      console.log("🔄 Actualizando doctores...");
      handleChange;
    });

    return () => {
      socket.off("actualizar_datos");
    };
  }, [socket]);

  const isDuplicateId = doctoresExistentes.some(
    (d: any) => d.mat === form.mat && d.mat !== "",
  );
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const strength = checkPasswordStrength(form.contra);
  const validateField = (name: string, value: string) => {
    const textOnlyFields = ["nomd", "apd", "amd"];
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
    Object.values(errors).some((error) => error !== "") ||
    isDuplicateId ||
    (form.contra.length > 0 && form.contra.length < 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasErrors) {
      showToast(
        "Por favor, corrija los errores antes de continuar.",
        "warning",
      );
      return;
    }

    if (!form.mat || !form.nomd || !form.apd || !form.contra) {
      showToast("Faltan datos obligatorios.", "warning");
      return;
    }
    if (!captchaValue) {
      showToast("Por favor completa el captcha de seguridad", "warning");
      return;
    }

    try {
      await InsertarMedico({
        ...form,
        EstadoEliminado: false,
        FechaEliminacion: null,
        UsuarioElimino: null,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Error al registrar el usuario.", "warning");
    }
  };

  const inputStyles = `w-full px-2 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-blue-500/30 focus:border-blue-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500/20 focus:border-blue-500"
  }`;

  const errorInputStyles = "border-red-500 ring-red-500/20";

  const labelStyles = `text-xs font-bold uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-200" : "text-gray-400"
  }`;

  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
    >
      {message}
    </motion.p>
  );
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  return (
    <div className="w-full flex justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className={`w-190 h-75 rounded-2xl grid grid-cols-[54%_46%]
      ${isDarkMode ? "text-zinc-100" : "text-gray-900"}`}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className={labelStyles}>Matrícula *</label>
              <input
                name="mat"
                value={form.mat}
                onChange={handleChange}
                autoComplete="off"
                className={`${inputStyles} ${isDuplicateId ? errorInputStyles : ""}`}
                placeholder="Matrícula"
              />
              {isDuplicateId && (
                <ErrorMessage message="Matrícula ya registrada" />
              )}
            </div>

            <div className="relative">
              <label className={labelStyles}>Nombre *</label>
              <input
                name="nomd"
                value={form.nomd}
                autoComplete="off"
                onChange={handleChange}
                className={`${inputStyles} ${errors.nomd ? errorInputStyles : ""}`}
                placeholder="Nombre"
              />
              {errors.nomd && <ErrorMessage message={errors.nomd} />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 space-y-4">
            <div className="relative">
              <label className={labelStyles}>Apellido Paterno *</label>
              <input
                name="apd"
                value={form.apd}
                autoComplete="off"
                onChange={handleChange}
                className={`${inputStyles} ${errors.apd ? errorInputStyles : ""}`}
                placeholder="Apellido Paterno"
              />
              {errors.apd && <ErrorMessage message={errors.apd} />}
            </div>

            <div className="relative">
              <label className={labelStyles}>Apellido Materno</label>
              <input
                name="amd"
                value={form.amd}
                autoComplete="off"
                onChange={handleChange}
                className={`${inputStyles} ${errors.amd ? errorInputStyles : ""}`}
                placeholder="Apellido Materno"
              />
              {errors.amd && <ErrorMessage message={errors.amd} />}
            </div>

            <div className="relative">
              <label className={labelStyles}>Contraseña *</label>
              <input
                name="contra"
                type={showPwd ? "text" : "password"}
                value={form.contra}
                autoComplete="off"
                onChange={handleChange}
                className={`${inputStyles} ${errors.contra ? errorInputStyles : ""}`}
                placeholder="Contraseña"
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-9"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {form.contra && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(strength.score / 3) * 100}%` }}
                      className={`h-full ${strength.color}`}
                    />
                  </div>
                  <p className="text-xs mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            <div className="relative mb-10">
              <label className={labelStyles}>Confirmar contraseña *</label>
              <input
                type={showPwd2 ? "text" : "password"}
                autoComplete="off"
                value={form.confirmar_contra || ""}
                onChange={(e) =>
                  setForm({ ...form, confirmar_contra: e.target.value })
                }
                className={`${inputStyles} mb-0`}
                placeholder="Confirmar contraseña"
              />

              {form.confirmar_contra &&
                form.contra !== form.confirmar_contra && (
                  <ErrorMessage message="Las contraseñas no coinciden" />
                )}
              <button
                type="button"
                onClick={() => setShowPwd2(!showPwd2)}
                className="absolute right-3 top-9"
              >
                {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5">
          {isAdmin && (
            <div>
              <label className={labelStyles}>Nivel de acceso</label>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo: "doctor" })}
                  className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden
                    ${
                      form.tipo === "doctor"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 scale-110 rounded-lg border-2 border-indigo-500 ${
                        form.tipo === "doctor"
                          ? "bg-indigo-500"
                          : "bg-transparent"
                      }`}
                    >
                      <Stethoscope
                        size={14}
                        className={`scale-150 ${form.tipo === "doctor" ? "text-white" : "text-indigo-500"}`}
                      />
                    </div>

                    <div className="text-left">
                      <p className="font-bold text-sm">Doctor</p>
                      <p className="text-[10px] opacity-60">Acceso limitado</p>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${form.tipo === "doctor" ? "border-indigo-500" : "border-gray-300"}`}
                    >
                      {form.tipo === "doctor" && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo: "administrador" })}
                  className={`relative p-4 rounded-xl border transition-all duration-300 overflow-hidden
                    ${
                      form.tipo === "administrador"
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border-2 border-cyan-500 ${
                        form.tipo === "administrador"
                          ? "bg-cyan-500 text-white"
                          : "bg-transparent"
                      }`}
                    >
                      <ShieldCheck
                        size={18}
                        className={`scale-150 ${form.tipo === "administrador" ? "text-white" : "text-cyan-500"} `}
                      />
                    </div>

                    <div className="text-left">
                      <p className="font-bold text-sm">Admin</p>
                      <p className="text-[10px] opacity-60">Control total</p>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${form.tipo === "administrador" ? "border-cyan-500" : "border-gray-300"}`}
                    >
                      {form.tipo === "administrador" && (
                        <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LdU_lQrAAAAAH9hz1PIiQG076oW6Zwb8M8_ODAe"
              onChange={(val: string | null) => setCaptchaValue(val)}
              theme={isDarkMode ? "dark" : "light"}
              style={{ transform: "scale(0.85)", transformOrigin: "center" }}
            />
          </div>

          <button
            type="submit"
            className="w-full relative overflow-hidden py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              <Save size={18} />
              Guardar doctor
            </span>

            <span className="absolute inset-0 opacity-0 hover:opacity-20 bg-white transition" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsertarDoctor;
