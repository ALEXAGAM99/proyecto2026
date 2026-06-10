import React, { useState, useEffect } from "react";
import {
  LockKeyhole,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  Calendar,
  Shield,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { motion } from "framer-motion";
import PopoverAnimado from "../../common/PopoverAnimado";
import ActualizarDoctor from "../Doctor/actualizar";
import { type Medico } from "../../conexion/Doctor/Mostrar";
import { MostrarMedicos } from "../../conexion/Doctor/Mostrar";
import { checkPasswordStrength, cn } from "../../../lib/utils";

interface PerfilUsuarioProps {
  theme: "light" | "dark" | "hybrid";
  usuarioActivo: string;
  onSuccess?: () => void;
}

export function PerfilUsuario({
  theme,
  usuarioActivo,
  onSuccess,
}: PerfilUsuarioProps) {
  const { showToast } = useToast();
  const isDark = theme === "dark";
  const isDarkMode = theme === "dark";

  const [userData, setUserData] = useState({
    mat: usuarioActivo,
    nombre: "",
    apellidoP: "",
    apellidoM: "",
    tipo: "Doctor",
    fechaRegistro: new Date().toLocaleDateString(),
  });

  const [medicoData, setMedicoData] = useState<Medico | null>(null);

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-sky-500/30 focus:border-sky-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-sky-500/20 focus:border-sky-500"
  }`;

  const labelStyles = `text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-500" : "text-gray-400"
  }`;

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:3005/api/medicos`);
      if (!res.ok) throw new Error();
      const medicos = await res.json();
      const miInfo = medicos.find((m: any) => m.mat === usuarioActivo);
      if (miInfo) {
        setUserData({
          mat: miInfo.mat,
          nombre: miInfo.nomd || "",
          apellidoP: miInfo.apd || "",
          apellidoM: miInfo.amd || "",
          tipo: miInfo.tipo || "Doctor",
          fechaRegistro: miInfo.fecha_registro
            ? new Date(miInfo.fecha_registro).toLocaleDateString()
            : new Date().toLocaleDateString(),
        });
      }
    } catch {
      showToast("Error al cargar datos del perfil", "warning");
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await MostrarMedicos();
      console.log("DOCTORES:", data);
      const active = data.filter((d) => !d.EstadoEliminado);
      const yo = active.find((d) => d.mat === usuarioActivo) ?? null;
      setMedicoData(yo);
    } catch {}
  };

  useEffect(() => {
    fetchUserData();
    loadDoctors();
  }, [usuarioActivo]);

  const medicoActivo = medicoData;

  const [pwdLoading, setPwdLoading] = useState(false);
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [showPwd, setShowPwd] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });
  const [errors, setErrors] = useState({
    contra: "",
  });
  const ErrorMessage = ({ message }: { message: string }) => (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
    >
      {message}
    </motion.p>
  );

  const strength = checkPasswordStrength(nuevaContraseña);

  const showStrength = nuevaContraseña.length > 0;
  const showMismatch =
    confirmarContraseña.length > 0 && confirmarContraseña !== nuevaContraseña;

  const dynamicHeight = showStrength || showMismatch ? 450 : 410;

  const handleCambiarContraseña = async (closeFn: () => void) => {
    if (!contraseñaActual.trim()) {
      showToast("Ingresa tu contraseña actual", "warning");
      return;
    }
    if (nuevaContraseña !== confirmarContraseña) {
      showToast("Las contraseñas nuevas no coinciden", "warning");
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3005/api/medicos/${usuarioActivo}/cambiar-contrasena`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contraActual: contraseñaActual,
            contraNueva: nuevaContraseña,
          }),
        },
      );

      if (res.ok) {
        showToast("Contraseña actualizada correctamente", "success");
        setContraseñaActual("");
        setNuevaContraseña("");
        setConfirmarContraseña("");
        closeFn();
        if (onSuccess) onSuccess();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || "Error al cambiar la contraseña", "warning");
      }
    } catch {
      showToast("Error de conexión con el servidor", "warning");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className={`w-full h-[calc(100vh-1.5rem)] overflow-hidden rounded-[3rem] text-white p-8 lg:p-12 flex flex-col lg:flex-row items-stretch justify-between gap-10 relative shadow-2xl ${isDark ? "bg-zinc-950" : "bg-slate-900 "}`}
    >
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col z-10 w-full lg:w-1/2 justify-center h-full">
        <div className="mx-auto">
          <PopoverAnimado
            key={`edit-${userData.mat}`}
            id={`edit-${userData.mat}`}
            titulo={`Editar Datos`}
            direccion="bc"
            pWidth={480}
            pHeight={390}
            theme={theme}
            triggerWidth={320}
            triggerHeight={50}
            triggerContent={
              <div className="w-full bg-transparent font-bold text-xl flex items-center justify-between transition-colors">
                <span
                  className={`flex items-center gap-4 ${isDark ? "text-white" : "text-indigo-950"}`}
                >
                  <RefreshCw size={24} /> Editar Datos
                </span>
              </div>
            }
            triggerClassName={
              isDarkMode
                ? `bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_6px_20px_rgba(99,102,241,0.2)]`
                : `bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_6px_20px_rgba(99,102,241,0.15)]`
            }
          >
            {({ close }: { close: () => void }) => (
              <div className="mt-4 relative">
                {medicoActivo ? (
                  <ActualizarDoctor
                    theme={theme}
                    medico={medicoActivo}
                    onSuccess={() => {
                      loadDoctors();
                      fetchUserData();
                      close();
                      if (onSuccess) onSuccess();
                    }}
                    onCancel={() => close()}
                    hideHeader={true}
                  />
                ) : (
                  <p
                    className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
                  >
                    Cargando datos del médico...
                  </p>
                )}
              </div>
            )}
          </PopoverAnimado>
        </div>
        <motion.div layout className="mb-6 mt-4 flex items-center gap-4">
          <div className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.2em] text-indigo-200 border border-white/10">
            {userData.tipo || "Usuario"}
          </div>
        </motion.div>

        <motion.h1
          layout
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.05]"
        >
          {userData.nombre} <br />
          <span className="text-white/40">
            {userData.apellidoP} {userData.apellidoM}
          </span>
        </motion.h1>
      </div>

      <div className="z-10 w-full lg:w-1/2 lg:max-w-md flex flex-col justify-center h-full relative">
        <motion.div layout className="w-full flex flex-col gap-6">
          <div className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl">
            <h2 className="text-white/40 font-black tracking-widest text-xs uppercase mb-8 ml-2">
              Estado de Cuenta
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Shield className="text-indigo-400" size={20} />
                </div>
                <div>
                  <p className="text-white/40 font-bold tracking-widest text-[10px] uppercase">
                    Rol Asignado
                  </p>
                  <p className="text-white font-extrabold text-lg">
                    {userData.tipo || "Sin Asignar"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Calendar className="text-emerald-400" size={20} />
                </div>
                <div>
                  <p className="text-white/40 font-bold tracking-widest text-[10px] uppercase">
                    Fecha Registro
                  </p>
                  <p className="text-white font-extrabold text-lg">
                    {userData.fechaRegistro}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <KeyRound className="text-orange-400" size={20} />
                </div>
                <div>
                  <p className="text-white/40 font-bold tracking-widest text-[10px] uppercase">
                    Matrícula
                  </p>
                  <p className="text-white font-extrabold text-lg">
                    {userData.mat}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 mx-auto">
            <PopoverAnimado
              key="popover-contra"
              id="popover-contra"
              titulo="Cambiar Contraseña"
              texto="Edita la información de tu contraseña"
              direccion="bc"
              pWidth={400}
              pHeight={dynamicHeight}
              theme={theme}
              triggerWidth={320}
              triggerHeight={60}
              triggerContent={
                <div
                  className="w-full bg-transparent font-bold text-xl flex items-center justify-between transition-colors"
                  onClick={() => {
                    setContraseñaActual("");
                    setNuevaContraseña("");
                    setConfirmarContraseña("");
                    setShowPwd({
                      actual: false,
                      nueva: false,
                      confirmar: false,
                    });
                  }}
                >
                  <span
                    className={`flex items-center gap-4 ${isDark ? "text-white" : "text-indigo-950"}`}
                  >
                    <LockKeyhole size={24} /> Cambiar Contraseña
                  </span>
                </div>
              }
              triggerClassName="flex-1"
            >
              {({ close }: { close: () => void }) => (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="relative">
                    <label className={labelStyles}>
                      <Key size={14} /> Contraseña Actual
                    </label>
                    <input
                      type={showPwd.actual ? "text" : "password"}
                      className={inputStyles}
                      value={contraseñaActual}
                      onChange={(e) => setContraseñaActual(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label="Mostrar Contraseña Actual"
                      onClick={() =>
                        setShowPwd((p) => ({ ...p, actual: !p.actual }))
                      }
                      className="absolute right-3 top-9 text-zinc-500 hover:text-indigo-500 transition-colors"
                    >
                      {showPwd.actual ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <label className={labelStyles}>
                      <Key size={14} /> Nueva Contraseña
                    </label>
                    <input
                      type={showPwd.nueva ? "text" : "password"}
                      className={inputStyles}
                      value={nuevaContraseña}
                      onChange={(e) => setNuevaContraseña(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label="Mostrar Nueva Contraseña"
                      onClick={() =>
                        setShowPwd((p) => ({ ...p, nueva: !p.nueva }))
                      }
                      className="absolute right-3 top-9 text-zinc-500 hover:text-indigo-500 transition-colors"
                    >
                      {showPwd.nueva ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.contra && <ErrorMessage message={errors.contra} />}
                    {nuevaContraseña && (
                      <div className="mt-2 px-1">
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(strength.score / 3) * 100}%`,
                            }}
                            className={cn(
                              "h-full transition-all rounded-full duration-300",
                              strength.color,
                            )}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span
                            className={cn(
                              "text-[9px] font-bold uppercase",
                              strength.color.replace("bg-", "text-"),
                            )}
                          >
                            {strength.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative border-b-0">
                    <label className={labelStyles}>
                      <Key size={14} /> Confirmar Contraseña
                    </label>
                    <input
                      type={showPwd.confirmar ? "text" : "password"}
                      className={`${inputStyles} ${
                        confirmarContraseña &&
                        confirmarContraseña !== nuevaContraseña
                          ? "border-red-500 focus:border-red-500 ring-red-500/20"
                          : confirmarContraseña &&
                              confirmarContraseña === nuevaContraseña
                            ? "border-emerald-500 focus:border-emerald-500 ring-emerald-500/20"
                            : ""
                      }`}
                      value={confirmarContraseña}
                      onChange={(e) => setConfirmarContraseña(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label="Mostrar Confirmar Contraseña"
                      onClick={() =>
                        setShowPwd((p) => ({ ...p, confirmar: !p.confirmar }))
                      }
                      className="absolute right-3 top-9 text-zinc-500 hover:text-indigo-500 transition-colors"
                    >
                      {showPwd.confirmar ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {confirmarContraseña && (
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ml-1 -mt-2 ${confirmarContraseña === nuevaContraseña ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {confirmarContraseña === nuevaContraseña
                        ? "✓ Las contraseñas coinciden"
                        : "✗ Las contraseñas no coinciden"}
                    </p>
                  )}

                  <div className="flex  gap-3 mb-3  absolute bottom-2 right-10">
                    <button
                      type="button"
                      aria-label="Cancelar"
                      onClick={() => {
                        setContraseñaActual("");
                        setNuevaContraseña("");
                        setConfirmarContraseña("");
                        close();
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isDarkMode
                          ? "text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      aria-label="Guardar Cambios"
                      disabled={pwdLoading}
                      onClick={() => handleCambiarContraseña(close)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Save size={15} />
                      {pwdLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              )}
            </PopoverAnimado>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
