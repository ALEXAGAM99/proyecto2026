import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  RefreshCw,
  X,
  Briefcase,
  IdCard,
  User,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { MostrarMedicos, type Medico } from "../../conexion/Doctor/Mostrar";
import { EliminarMedico } from "../../conexion/Doctor/Eliminar";
import type { Theme } from "../../sidebars/Sidebar";
import ActualizarDoctor from "./actualizar";
import PopoverAnimado from "../../common/PopoverAnimado";
import { PacienteSkeleton } from "../../common/skeleton";
import { useSocket } from "../../../hooks/useSocket";

interface MostrarDoctorProps {
  theme: Theme;
  refreshTrigger?: number;
}

export function MostrarDoctor({ theme, refreshTrigger }: MostrarDoctorProps) {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<Medico[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Medico[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const isDarkMode = theme === "dark";

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await MostrarMedicos();
      const activeDoctors = data.filter((d) => !d.EstadoEliminado);
      setDoctors(activeDoctors);
      setFilteredDoctors(activeDoctors);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [refreshTrigger]);

  useEffect(() => {
    if (!socket) return;

    socket.on("actualizar_datos", () => {
      loadDoctors();
    });

    return () => {
      socket.off("actualizar_datos");
    };
  }, [socket]);

  useEffect(() => {
    const filtered = doctors.filter((doc) =>
      `${doc.nomd} ${doc.apd} ${doc.amd} ${doc.mat}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const handleDelete = async (mat: string) => {
    try {
      await EliminarMedico(mat);
      showToast("Doctor enviado a la papelera.", "success");
      loadDoctors();
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch (error) {
      showToast("Error al eliminar Doctor.", "warning");
    }
  };

  if (isLoading) {
    return <PacienteSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div
      className={`h-full transition-colors duration-300 ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}
    >
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          ></motion.div>
        ) : (
          <motion.div
            key="table-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col mt-3 sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
              <div
                className={`flex items-center gap-2 shrink-0 text-emerald-500`}
              >
                <User />
                <h1 className="text-xl font-bold">Doctores</h1>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div
                  className="flex-1 sm:flex-none sm:w-80 relative rounded-2xl"
                  style={{ boxShadow: "0 0 5px #059669" }}
                >
                  <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Buscar doctores..."
                    className={`w-full pl-12 pr-10 py-3 border rounded-2xl text-sm font-medium transition-all outline-none shadow-sm ${
                      isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-zinc-100 placeholder-zinc-500"
                        : "bg-white border-zinc-50 focus:border-indigo-500 focus:ring-indigo-200 text-zinc-900 placeholder-zinc-400"
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    list="paciente-sugerencias-mostrar"
                  />
                  <datalist id="paciente-sugerencias-mostrar">
                    {doctors
                      .slice(-5)
                      .reverse()
                      .map((doctor, index) => (
                        <option
                          key={index}
                          value={`${doctor.nomd} ${doctor.apd} ${doctor.amd}`}
                        />
                      ))}
                  </datalist>

                  <AnimatePresence>
                    <motion.button
                      onClick={() => setSearchTerm("")}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                        isDarkMode
                          ? "text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                          : "text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      <X size={14} />
                    </motion.button>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc, idx) => (
                  <motion.div
                    key={doc.mat}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 sm:p-5 rounded-2xl shadow-sm border flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all gap-4 group hover:scale-101 ${
                      isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900"
                        : "bg-white border-zinc-50 hover:shadow-md hover:border-indigo-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl uppercase bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                        {doc.nomd?.[0]}
                        {doc.apd?.[0]}
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-bold leading-tight ${isDarkMode ? "text-zinc-100" : "text-zinc-800"}`}
                        >
                          {doc.nomd} {doc.apd} {doc.amd}
                        </h3>
                        <span
                          className={`text-sm flex items-center gap-1.5 mt-1 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                        >
                          <IdCard size={18} className="text-indigo-400" />{" "}
                          {doc.mat}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end items-center">
                      <PopoverAnimado
                        id={`edit-${doc.mat}`}
                        titulo={`Editar: ${doc.nomd}`}
                        direccion="bl"
                        pWidth={480}
                        pHeight={380}
                        theme={theme}
                        triggerWidth={42}
                        triggerHeight={42}
                        triggerContent={
                          <RefreshCw
                            size={18}
                            className="text-indigo-400 hover:text-indigo-300"
                          />
                        }
                        triggerClassName={
                          isDarkMode
                            ? `bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_6px_20px_rgba(99,102,241,0.2)]`
                            : `bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_6px_20px_rgba(99,102,241,0.15)]`
                        }
                      >
                        {({ close }: any) => (
                          <div className="mt-4 relative">
                            <div className="absolute -top-12 right-0 opacity-10"></div>
                            <ActualizarDoctor
                              theme={theme}
                              medico={doc}
                              onSuccess={() => {
                                loadDoctors();
                                close();
                              }}
                              onCancel={() => close()}
                              hideHeader={true}
                            />
                          </div>
                        )}
                      </PopoverAnimado>

                      <PopoverAnimado
                        id={`delete-${doc.mat}`}
                        titulo="¿Eliminar Doctor?"
                        direccion="bl"
                        pWidth={340}
                        pHeight={222}
                        theme={theme}
                        triggerWidth={42}
                        triggerHeight={42}
                        triggerContent={
                          <Trash2
                            size={18}
                            className="text-red-500 hover:text-red-600"
                          />
                        }
                        triggerClassName={
                          isDarkMode
                            ? `bg-zinc-800/80 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.5),0_6px_20px_rgba(239,68,68,0.2)]`
                            : `bg-white hover:bg-red-50 text-zinc-600 hover:text-red-600 border border-zinc-200 hover:border-red-300 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_6px_20px_rgba(239,68,68,0.15)]`
                        }
                      >
                        {({ close }: any) => (
                          <div className="flex flex-col h-full relative">
                            <div className="absolute -top-12 -right-4 opacity-10 text-red-500">
                              <Trash2 size={100} />
                            </div>
                            <p
                              className={`text-sm mb-6 relative z-10 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
                            >
                              Esta acción enviará a{" "}
                              <strong>
                                {doc.nomd} {doc.apd}
                              </strong>{" "}
                              a la papelera. ¿Deseas continuar?
                            </p>
                            <div className="flex gap-3 mt-auto relative z-10">
                              <button
                                onClick={() => close()}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                  isDarkMode
                                    ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                No, cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(doc.mat);
                                  close();
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                              >
                                <Trash2 size={16} />
                                Sí, eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </PopoverAnimado>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div
                  className={`py-20 text-center rounded-2xl border ${isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-50"}`}
                >
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <Briefcase
                      size={48}
                      className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}
                    />
                    <p
                      className={`font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      No se encontraron doctores
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
