import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  RefreshCw,
  IdCard,
} from "lucide-react";
import { LoginUsuario } from "../../conexion/Usuario/Acceso";
import type { Theme } from "../../sidebars/Sidebar";
import { useToast } from "../../common/ToastContext";
import ReCAPTCHA from "react-google-recaptcha";

interface LoginProps {
  theme: Theme;
  onLogin: (usuario: string) => void;
  isPopover?: boolean;
}

export function LoginView({ theme, onLogin, isPopover = false }: LoginProps) {
  const [form, setForm] = useState({ mat: "", contra: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDarkMode = theme === "dark" || theme === "hybrid";
  const { showToast } = useToast();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await LoginUsuario(form.mat, form.contra);

      if (res.success && res.user) {
        localStorage.setItem("usuarioActivo", form.mat);
        localStorage.setItem("userObject", JSON.stringify(res.user));
        localStorage.setItem("contraseñaActivo", form.contra);

        if (res.sesionId) {
          localStorage.setItem("sesionId", String(res.sesionId));
        }

        localStorage.setItem("registrado", "true");

        const nombreUsuario = res.user.nomd + " " + res.user.apd || form.mat;

        if (!captchaValue) {
          showToast("Por favor completa el captcha de seguridad", "warning");
          return;
        }
        onLogin(form.mat);
        showToast(`Bienvenido ${nombreUsuario}`, "success");
      } else {
        showToast(
          res.message || "Matrícula o contraseña incorrectos.",
          "warning",
        );
      }
    } catch (err) {
      showToast("No se pudo conectar con el servidor.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = `w-full px-5 py-3.5 rounded-xl border-1 transition-all ${
    isDarkMode && theme == "hybrid"
      ? "bg-zinc-900 border-zinc-800 border-10 text-white focus:ring-indigo-500/20"
      : "bg-transparent border-gray-300 focus:ring-indigo-500/10"
  }`;

  return (
    <div
      className={`w-full ${isPopover ? "p-1 border-none shadow-none bg-transparent" : "max-w-md p-8 rounded-[2.5rem] border shadow-2xl bg-white border-gray-50"} relative overflow-hidden`}
    >
      <div
        className={`absolute top-[-20px] right-[-20px] p-4 opacity-10 pointer-events-none text-indigo-500`}
      >
        <Shield
          size={140}
          className={`${isDarkMode ? "text-indigo-500" : "text-red-500"}`}
        />
      </div>

      <form onSubmit={handleLogin} className="space-y-4 relative z-10 p-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
            <IdCard size={18} className="text-zinc-500" />
            Matrícula
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Matrícula"
              className={`${inputStyles} font-bold text-sm`}
              value={form.mat}
              onChange={(e) => setForm({ ...form, mat: e.target.value })}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">
            <Lock size={18} className="text-zinc-500" />
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Contraseña"
              className={`${inputStyles} font-black tracking-widest text-sm`}
              value={form.contra}
              onChange={(e) => setForm({ ...form, contra: e.target.value })}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              aria-label="Mostrar contraseña"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-indigo-500 transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="w-0">
          <ReCAPTCHA
            sitekey="6LdU_lQrAAAAAH9hz1PIiQG076oW6Zwb8M8_ODAe"
            onChange={(val: string | null) => setCaptchaValue(val)}
            theme={isDarkMode && theme == "hybrid" ? "dark" : "light"}
            style={{ transformOrigin: "center", scale: 0.8 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Iniciar sesión"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-[1.2rem] font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm"
        >
          {loading ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <>
              <LogIn size={18} /> Iniciar Sesión
            </>
          )}
        </button>
      </form>
    </div>
  );
}
