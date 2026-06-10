import { useState, useEffect } from "react";
import {
  Activity,
  Power,
  RefreshCcw,
  Smartphone,
  Laptop,
  Users,
  Monitor,
} from "lucide-react";
import { MostrarAuditoria } from "../../conexion/Usuario/Auditoria";
import { useToast } from "../../common/ToastContext";
import PopoverAnimado from "../../common/PopoverAnimado";
import { TableSkeleton } from "../../common/skeleton";
import { UAParser } from "ua-parser-js";
import { useSocket } from "../../../hooks/useSocket";

export interface AccessLog {
  id: string;
  user: string;
  name: string;
  type: string;
  ip: string;
  event: "Ingreso" | "Salida" | "Intento Fallido";
  browser: string;
  timestamp: string;
  logoutTimestamp?: string;
  location?: string;
  origen: "flutter" | "web" | "electron" | "otro";
}

export interface ConnectedDevice {
  socketId: string;
  ip: string;
  tipoDispositivo: string;
  sistemaOperativo: string;
  modelo: string;
  origen: "web" | "electron" | "flutter";
  timestamp: string;
}

import { LogoutUsuario } from "../../conexion/Usuario/Acceso";
import { MostrarMedicos } from "../../conexion/Doctor/Mostrar";

interface GestionUsuariosProps {
  theme: "light" | "dark" | "hybrid";
  setRegistrado: (val: boolean) => void;
}

const getLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date(0);
  const normalized =
    typeof dateStr === "string" ? dateStr.replace("Z", "") : dateStr;
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? new Date(0) : date;
};

const detectarOrigen = (
  navegador: string,
): "flutter" | "web" | "electron" | "otro" => {
  const nav = (navegador || "").toLowerCase();
  if (
    nav.includes("flutter") ||
    nav.includes("dart") ||
    nav.includes("mobile access")
  )
    return "flutter";
  if (nav.includes("electron")) return "electron";
  if (
    nav.includes("chrome") ||
    nav.includes("firefox") ||
    nav.includes("safari") ||
    nav.includes("edge")
  )
    return "web";
  return "otro";
};

export function GestionUsuarios({
  theme,
  setRegistrado,
}: GestionUsuariosProps) {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { socket } = useSocket();

  const loadLogs = async () => {
    setLoading(true);
    try {
      const [auditData, medicos] = await Promise.all([
        MostrarAuditoria(),
        MostrarMedicos(),
      ]);

      const medicoMap = new Map(medicos.map((m) => [m.mat, m]));

      const mappedLogs: AccessLog[] = auditData
        .filter((l) => l.usuario !== "ADMIN_DEV")
        .map((l) => {
          const medico = medicoMap.get(l.usuario);

          const ua = new UAParser(l.navegador);
          const browser = ua.getBrowser();
          const browserString = browser.name
            ? `${browser.name} ${browser.version || ""}`.trim()
            : l.navegador || "Desconocido";

          const origen = detectarOrigen(l.navegador || "");

          return {
            id: String(l.id),
            user: l.usuario,
            name: medico
              ? `${medico.nomd} ${medico.apd}`
              : l.evento === "Intento Fallido"
                ? "Usuario Desconocido"
                : l.usuario,
            type: medico
              ? (medico.tipo || "doctor").charAt(0).toUpperCase() +
                (medico.tipo || "doctor").slice(1)
              : l.evento === "Intento Fallido"
                ? "N/A"
                : "Doctor",
            ip: l.ip || "0.0.0.0",
            event: l.evento as any,
            browser: browserString,
            timestamp: l.timestamp_ingreso,
            logoutTimestamp: l.timestamp_salida,
            origen,
          };
        });

      mappedLogs.sort(
        (a, b) =>
          getLocalDate(b.timestamp).getTime() -
          getLocalDate(a.timestamp).getTime(),
      );
      if (mappedLogs.length > 0) {
        setLogs(mappedLogs);
      } else {
        setLogs([
          {
            id: "m1",
            user: "admin",
            name: "Administrador Sistema",
            type: "Administrador",
            ip: "127.0.0.1",
            event: "Ingreso",
            browser: "Chrome",
            timestamp: new Date().toISOString(),
            origen: "web",
          },
        ]);
      }
    } catch (err) {
      showToast("Error al cargar la auditoría", "warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadLogs();
    };

    const handleLogout = () => {
      loadLogs();
    };

    const handleDevice = (device: any) => {
      if (!device) return;
      if (device.origen === "flutter") {
        showToast(`App móvil: ${device.modelo}`, "primary");
      }
      loadLogs();
    };

    socket.on("actualizar_doctores", handleUpdate);
    socket.on("dispositivo_registrado", handleDevice);
    socket.on("forzar_logout", handleLogout);

    return () => {
      socket.off("actualizar_doctores", handleUpdate);
      socket.on("dispositivo_registrado", handleDevice);
      socket.off("forzar_logout", handleLogout);
    };
  }, [socket]);

  return (
    <div className="w-full mx-auto flex flex-col h-full">
      <div
        className={`flex-1 relative overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300 ${theme === "dark" ? "bg-zinc-950 border-zinc-900" : "bg-white/40 border-gray-100 shadow-sm"}`}
      >
        <div className="absolute inset-0 flex flex-col">
          <AdvancedTableView
            logs={logs}
            onRefresh={loadLogs}
            loading={loading}
            setRegistrado={setRegistrado}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

function AdvancedTableView({
  logs,
  onRefresh,
  loading,
  setRegistrado,
  theme,
}: {
  logs: AccessLog[];
  onRefresh: () => void;
  loading: boolean;
  setRegistrado: (val: boolean) => void;
  theme: string;
}) {
  const activeLogs = logs.filter(
    (l) => !l.logoutTimestamp && l.event === "Ingreso",
  );
  const { showToast } = useToast();

  const handleRevoke = async (sessionId: string, closePopover: () => void) => {
    try {
      await LogoutUsuario(sessionId);
      const currentSessionId = localStorage.getItem("sesionId");

      if (sessionId === currentSessionId || activeLogs.length === 1) {
        localStorage.removeItem("usuarioActivo");
        localStorage.removeItem("sesionId");
        localStorage.setItem("registrado", "false");
        setRegistrado(false);
        showToast("Se ha cerrado la sesión actual", "primary");
      }

      closePopover();
      onRefresh();
    } catch (error) {
      showToast("Error al revocar la sesión", "warning");
    }
  };

  if (loading) {
    return (
      <TableSkeleton isDarkMode={theme === "dark"} rows={7} showStats={false} />
    );
  }

  return (
    <div
      className={`p-6 h-full flex flex-col overflow-hidden bg-transparent ${theme === "dark" ? "text-slate-200" : "text-gray-800"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-xl font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          <Activity
            className={theme === "dark" ? "text-cyan-400" : "text-indigo-600"}
          />{" "}
          Auditoría Global
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            aria-label="Recargar"
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                theme === "dark"
                  ? "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
              }`}
          >
            <RefreshCcw
              size={18}
              className={` transition-transform duration-500
                ${loading ? "animate-spin" : "group-hover:rotate-180"}
    `}
            />

            <span className="hidden sm:inline">
              {loading ? "Sincronizando..." : "Recargar"}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`mb-6 border rounded-xl p-4 ${theme === "dark" ? "bg-slate-800/30 border-slate-700" : "bg-gray-50 border-gray-200"}`}
      >
        <h4
          className={`text-sm font-bold mb-4 flex items-center gap-2 ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}
        >
          <Users
            className={`w-4 h-4 ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          />
          Sesiones Activas ({activeLogs.length})
        </h4>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
          {activeLogs.map((log) => (
            <div
              key={log.id}
              className={`min-w-[240px] border rounded-lg p-3 flex items-center justify-between group transition-all shadow-sm ${
                log.origen === "flutter"
                  ? theme === "dark"
                    ? "bg-emerald-950/30 border-emerald-800/50 hover:border-emerald-500/60"
                    : "bg-emerald-50 border-emerald-200 hover:border-emerald-500/50"
                  : log.origen === "electron"
                    ? theme === "dark"
                      ? "bg-purple-950/30 border-purple-800/50 hover:border-purple-500/60"
                      : "bg-purple-50 border-purple-200 hover:border-purple-400/50"
                    : theme === "dark"
                      ? "bg-slate-900/50 border-slate-700 hover:border-cyan-500/50"
                      : "bg-white border-gray-200 hover:border-indigo-500/50"
              }`}
            >
              <div className="flex items-center gap-3 mr-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border relative ${theme === "dark" ? "bg-slate-800 text-cyan-400 border-slate-700" : "bg-gray-100 text-indigo-600 border-gray-200"}`}
                >
                  {log.name ? log.name.substring(0, 2).toUpperCase() : "??"}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p
                      className={`text-sm font-bold truncate max-w-[120px] ${theme === "dark" ? "text-slate-200" : "text-gray-900"}`}
                    >
                      {log.name}
                    </p>
                    <IconoOrigen origen={log.origen} size={12} />
                  </div>
                  <p
                    className={`text-[10px] font-mono ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}
                  >
                    {log.user} • {log.ip}
                  </p>
                  {log.origen === "flutter" && (
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                      App Móvil
                    </span>
                  )}
                </div>
              </div>
              <PopoverAnimado
                id={`revoke-${log.id}`}
                titulo="Confirmar"
                direccion="bc"
                theme={theme === "dark" ? "dark" : "light"}
                pWidth={300}
                pHeight={195}
                triggerWidth={50}
                triggerHeight={50}
                triggerContent={
                  <div
                    className={`p-1.5 rounded-md ${theme === "dark" ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}
                  >
                    <Power className="w-4 h-4" />
                  </div>
                }
              >
                {({ close }) => (
                  <div className="flex flex-col h-full">
                    <p className="text-sm mb-4">
                      ¿Cerrar sesión de <b>{log.user}</b>?
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={close}
                        className="flex-1 py-1.5 rounded-lg border text-xs"
                      >
                        No
                      </button>
                      <button
                        onClick={() => handleRevoke(log.id, close)}
                        className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-xs"
                      >
                        Sí, Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </PopoverAnimado>
            </div>
          ))}
          {activeLogs.length === 0 && (
            <div
              className={`text-center text-sm py-2 w-full ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}
            >
              No hay sesiones activas.
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex-1 flex flex-col rounded-xl border shadow-sm overflow-hidden ${theme === "dark" ? "bg-slate-800/30 border-slate-700" : "bg-white border-gray-200"}`}
      >
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-sm border-collapse">
            <thead
              className={`sticky top-0 z-10 ${theme === "dark" ? "bg-slate-900 text-slate-400" : "bg-gray-50 text-gray-600"}`}
            >
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3 text-center">Ingreso</th>
                <th className="px-4 py-3 text-center">Salida</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Browser</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${theme === "dark" ? "divide-slate-700/50" : "divide-gray-100"}`}
            >
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className={`transition-colors ${theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <IconoOrigen origen={log.origen} size={14} />
                      <div className="flex flex-col">
                        <span className="font-bold">{log.name}</span>
                        <span className="text-[10px] opacity-60">
                          @{log.user}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${log.type === "Administrador" ? "bg-cyan-500/10 text-cyan-500" : "bg-zinc-500/10 text-zinc-400 mx-[20%]"}`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-center opacity-70">
                    {getLocalDate(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-center opacity-70">
                    {log.logoutTimestamp ? (
                      getLocalDate(log.logoutTimestamp).toLocaleString()
                    ) : (
                      <span className="text-green-500 font-bold text-[15px]">
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] opacity-70">
                    {log.ip}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] opacity-70">
                    {log.browser === "Flutter App (Mobile)"
                      ? "AppCemi Móvil"
                      : log.browser === "Electron"
                        ? "App Escritorio"
                        : log.browser}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${
                        log.event === "Intento Fallido"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : !log.logoutTimestamp
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                      }`}
                    >
                      {log.event === "Intento Fallido"
                        ? "Bloqueado"
                        : !log.logoutTimestamp
                          ? "En Línea"
                          : "Finalizado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IconoOrigen({
  origen,
  size = 14,
  className = "",
}: {
  origen: string;
  size?: number;
  className?: string;
}) {
  if (origen === "flutter")
    return (
      <Smartphone size={size} className={`text-emerald-500 ${className}`} />
    );
  if (origen === "electron")
    return <Monitor size={size} className={`text-purple-400 ${className}`} />;
  return (
    <Laptop size={size} className={`text-blue-400 opacity-70 ${className}`} />
  );
}
