import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  RotateCcw,
  User,
  Calendar,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import {
  MostrarPapeleraMedicos,
  RestaurarMedico,
  EliminarDefinitivoMedico,
} from "../../conexion/Doctor/Papelera";
import { type Medico } from "../../conexion/Doctor/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";
import PopoverAnimado from "../../common/PopoverAnimado";

interface PapeleraDoctorProps {
  theme: Theme;
}

export function PapeleraDoctor({ theme }: PapeleraDoctorProps) {
  const { showToast } = useToast();
  const [deletedDoctors, setDeletedDoctors] = useState<Medico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = theme === "dark";

  const loadPapelera = async () => {
    try {
      const data = await MostrarPapeleraMedicos();
      const sorted = [...data].sort((a, b) => {
        const dateA = a.FechaEliminacion
          ? new Date(a.FechaEliminacion).getTime()
          : 0;
        const dateB = b.FechaEliminacion
          ? new Date(b.FechaEliminacion).getTime()
          : 0;
        return dateB - dateA;
      });
      setDeletedDoctors(sorted);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    loadPapelera();
  }, []);

  const handleRestore = async (mat: string) => {
    try {
      await RestaurarMedico(mat);
      loadPapelera();
      showToast("Médico restaurado al directorio.", "success");
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch {
      showToast("Error al restaurar médico.", "warning");
    }
  };
  const handleDeletePermanent = async (mat: string) => {
    try {
      await EliminarDefinitivoMedico(mat);
      loadPapelera();
      showToast("Registro eliminado permanentemente.", "success");
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch {
      showToast("Error al eliminar definitivamente.", "warning");
    }
  };

  const filtered = deletedDoctors.filter((doc) =>
    `${doc.nomd} ${doc.apd} ${doc.mat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const inputBase = `w-full px-4 py-3 rounded-2xl border-2 outline-none transition-all ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-red-500 placeholder:text-zinc-600" : "bg-white border-gray-100 focus:border-red-400 text-gray-900"}`;

  return (
    <div className="flex flex-col h-full p-2 pt-0 overflow-hidden">
      <div
        className={`flex flex-col md:flex-row justify-between sticky top-0 z-19 items-start md:items-center p-4 gap-4 mb-3 shrink-0 ${isDarkMode ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800" : "bg-white/90 backdrop-blur-md border-b border-gray-100"}`}
      >
        <div className="flex items-center gap-3 text-red-500">
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <Trash2 size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Papelera de Doctores
            </h1>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}
            >
              {deletedDoctors.length} Médico
              {deletedDoctors.length !== 1 ? "s" : ""} eliminado
              {deletedDoctors.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex-1 md:flex-none md:w-80 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar nombre o matrícula..."
            className={`${inputBase} pl-12 pr-10`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            list="papelera-doc-list"
          />
          <datalist id="papelera-doc-list">
            {deletedDoctors
              .slice(-5)
              .reverse()
              .map((d) => (
                <option key={d.mat} value={`${d.nomd} ${d.apd}`} />
              ))}
          </datalist>
          <AnimatePresence>
            {
              <motion.button
                onClick={() => setSearchTerm("")}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full ${isDarkMode ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-gray-100 text-zinc-400 hover:text-zinc-700"}`}
              >
                <X size={14} />
              </motion.button>
            }
          </AnimatePresence>
        </div>
      </div>

      <div
        className={`border rounded-[2.5rem] flex-1 min-h-0 z-0  ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-gray-100 shadow-sm"}`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead
              className={`sticky top-0 z-20 ${isDarkMode ? "bg-zinc-900" : "bg-gray-50"}`}
            >
              <tr className="text-[10px] uppercase font-black tracking-widest text-zinc-500 border-b border-zinc-800/10">
                <th className="px-6 py-4 sticky top-0 z-20 bg-inherit shadow-sm">
                  Matrícula
                </th>
                <th className="px-6 py-4 sticky top-0 z-20 bg-inherit shadow-sm">
                  Médico
                </th>
                <th className="px-6 py-4 sticky top-0 z-20 bg-inherit shadow-sm">
                  Eliminado por
                </th>
                <th className="px-6 py-4 text-center sticky top-0 z-20 bg-inherit shadow-sm">
                  Fecha
                </th>
                <th className="px-6 py-4 text-center sticky top-0 z-20 bg-inherit shadow-sm">
                  Gestión
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  filtered.map((doc, idx) => (
                    <motion.tr
                      key={doc.mat}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b last:border-0 ${isDarkMode ? "border-zinc-900 hover:bg-zinc-900/40" : "border-gray-50 hover:bg-gray-50/50"}`}
                    >
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-mono font-bold bg-red-500/10 text-red-500 px-2 py-1 rounded-lg">
                          {doc.mat}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-black text-sm tracking-tight capitalize">
                              {doc.nomd} {doc.apd}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p
                          className={`text-xs font-bold italic ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}
                        >
                          {doc.UsuarioElimino || "Sistema"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-red-500/60" />
                            {doc.FechaEliminacion
                              ? new Date(
                                  doc.FechaEliminacion,
                                ).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  timeZone: "UTC",
                                })
                              : "—"}
                          </div>
                          <span className="opacity-50">
                            {doc.FechaEliminacion
                              ? new Date(
                                  doc.FechaEliminacion,
                                ).toLocaleTimeString("es-ES", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "UTC",
                                })
                              : ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <PopoverAnimado
                            id={`restore-doc-${doc.mat}`}
                            titulo="Restaurar Médico"
                            direccion="bl"
                            pWidth={355}
                            pHeight={245}
                            theme={theme}
                            triggerWidth={42}
                            triggerHeight={42}
                            triggerContent={
                              <RotateCcw
                                size={18}
                                strokeWidth={2.5}
                                className="text-emerald-500"
                              />
                            }
                            triggerClassName={
                              isDarkMode
                                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.5),0_6px_20px_rgba(16,185,129,0.2)]"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.4),0_6px_20px_rgba(16,185,129,0.15)]"
                            }
                          >
                            {({ close }: any) => (
                              <div className="flex flex-col h-full">
                                <p
                                  className={`text-sm mb-6 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
                                >
                                  ¿Restaurar al Dr.{" "}
                                  <strong>
                                    {doc.nomd} {doc.apd}
                                  </strong>{" "}
                                  al directorio activo?
                                </p>
                                <div className="flex gap-3 mt-auto">
                                  <button
                                    onClick={() => close()}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase ${isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleRestore(doc.mat);
                                      close();
                                    }}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 active:scale-95"
                                  >
                                    Restaurar
                                  </button>
                                </div>
                              </div>
                            )}
                          </PopoverAnimado>
                          <PopoverAnimado
                            id={`delete-doc-${doc.mat}`}
                            titulo="Eliminar Permanentemente"
                            direccion="bl"
                            pWidth={480}
                            pHeight={245}
                            theme={theme}
                            triggerWidth={42}
                            triggerHeight={42}
                            triggerContent={
                              <Trash2
                                size={18}
                                strokeWidth={2.5}
                                className="text-red-500"
                              />
                            }
                            triggerClassName={
                              isDarkMode
                                ? "bg-zinc-800/80 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.5),0_6px_20px_rgba(239,68,68,0.2)]"
                                : "bg-white hover:bg-red-50 text-zinc-600 hover:text-red-600 border border-zinc-200 hover:border-red-300 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_6px_20px_rgba(239,68,68,0.15)]"
                            }
                          >
                            {({ close }: any) => (
                              <div className="flex flex-col h-full">
                                <p
                                  className={`text-sm mb-6 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
                                >
                                  ¿Eliminar permanentemente al Dr.{" "}
                                  <strong>
                                    {doc.nomd} {doc.apd}
                                  </strong>
                                  ? Esta acción no se puede deshacer.
                                </p>
                                <div className="flex gap-3 mt-auto">
                                  <button
                                    onClick={() => close()}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase ${isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"}`}
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeletePermanent(doc.mat);
                                      close();
                                    }}
                                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-rose-500/20 active:scale-95"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            )}
                          </PopoverAnimado>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 opacity-20"
                      >
                        <AlertCircle size={48} />
                        <p className="font-black uppercase tracking-widest text-sm">
                          Papelera vacía
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length > 5 && (
            <motion.div
              className="relative h-6 w-full bg-gradient-to-b from-transparent to-red-500/30"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PapeleraDoctor;
