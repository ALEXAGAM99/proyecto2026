import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Plus,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Archive,
  X,
  Eye,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import {
  MostrarMedicamentosReal,
  type Medicamento,
} from "../../conexion/Inventario/Mostrar";
import { EliminarMedicamento } from "../../conexion/Inventario/Eliminar";
import InsertarInventarioForm from "./insertar";
import ActualizarInventarioForm from "./actualizar";
import type { Theme } from "../../sidebars/Sidebar";
import PopoverAnimado from "../../common/PopoverAnimado";
import { TableSkeleton } from "../../common/skeleton";
import { useSocket } from "../../../hooks/useSocket";

interface MostrarInventarioProps {
  theme: Theme;
}

export function MostrarInventario({ theme }: MostrarInventarioProps) {
  const { showToast } = useToast();
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [filteredMedicamentos, setFilteredMedicamentos] = useState<
    Medicamento[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = theme === "dark";
  const isRegistrado = !!localStorage.getItem("usuarioActivo");
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await MostrarMedicamentosReal();
      const activeData = (data || []).filter((m) => !m.EstadoEliminado);
      setMedicamentos(activeData);
      setFilteredMedicamentos(activeData);
    } catch (error) {
      console.error("Error loading medicamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("actualizar_datos", () => {
      loadData();
    });

    return () => {
      socket.off("actualizar_datos");
    };
  }, [socket]);

  useEffect(() => {
    const filtered = medicamentos.filter((m) =>
      `${m.nomm} ${m.codm} ${m.frecuso}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredMedicamentos(filtered);
  }, [searchTerm, medicamentos]);

  const handleDelete = async (codm: number) => {
    try {
      await EliminarMedicamento(codm);
      showToast("Medicamento enviado a la papelera.", "success");
      await loadData();
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch (error) {
      showToast("Error al eliminar medicamento.", "warning");
    }
  };

  const getStockStatus = (numex: number) => {
    if (numex <= 5)
      return {
        label: "Crítico",
        style: "text-red-500 bg-red-500/10 border-red-500/20",
      };
    if (numex <= 15)
      return {
        label: "Bajo Stock",
        style: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      };
    return {
      label: "Disponible",
      style: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    };
  };

  const tableHeaderStyles = `px-6 py-4 text-[10px] uppercase font-black tracking-widest sticky top-0 z-10 backdrop-blur-md shadow-sm ${
    isDarkMode ? "text-zinc-500 bg-zinc-950/95" : "text-gray-400 bg-white/95"
  }`;

  const rowStyles = `border-b transition-all duration-200 ${
    isDarkMode
      ? "border-zinc-800 hover:bg-zinc-900/40"
      : "border-gray-100 hover:bg-gray-50/50"
  }`;

  const stats = [
    {
      label: "Total Fármacos",
      value: medicamentos.length,
      icon: Package,
      color: "blue",
    },
    {
      label: "Alertas Críticas",
      value: medicamentos.filter((m) => m.numex <= 5).length,
      icon: AlertTriangle,
      color: "red",
    },
    {
      label: "Bajo Stock",
      value: medicamentos.filter((m) => m.numex <= 15).length,
      icon: TrendingDown,
      color: "amber",
    },
    {
      label: "Suministros OK",
      value: medicamentos.filter((m) => m.numex > 15).length,
      icon: CheckCircle2,
      color: "emerald",
    },
  ];

  if (isLoading) {
    return <TableSkeleton isDarkMode={isDarkMode} rows={8} />;
  }

  return (
    <div
      className={`h-full flex flex-col space-y-4 transition-colors duration-300 overflow-hidden ${isDarkMode ? "text-zinc-100" : "text-gray-800"}`}
    >
      <div className="hidden"></div>

      <div className="flex flex-col mt-3 md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3 text-amber-500">
          <div className="p-2.5 bg-amber-500/10 rounded-2xl">
            <Archive size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Almacén e Inventario
            </h1>
            <p
              className={`${isDarkMode ? "text-zinc-500" : "text-gray-400"} text-[10px] font-bold uppercase tracking-widest`}
            >
              Control de existencias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className="flex-1 sm:flex-none sm:w-70 relative mr-2"
            style={{ filter: "drop-shadow(0 0 3px #059669)" }}
          >
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar Medicamento..."
              className={`w-full pl-12 pr-10 py-3 border rounded-2xl text-sm font-medium transition-all outline-none shadow-sm ${
                isDarkMode
                  ? "bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-zinc-100 placeholder-zinc-500"
                  : "bg-white border-zinc-50 focus:border-indigo-500 focus:ring-indigo-200 text-zinc-900 placeholder-zinc-400"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              list="inventario-sugerencias-mostrar"
            />
            <datalist id="inventario-sugerencias-mostrar">
              {medicamentos
                .slice(-5)
                .reverse()
                .map((medicamento, index) => (
                  <option key={index} value={`${medicamento.nomm}`} />
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

          {isRegistrado && (
            <div className="shrink-0" style={{ boxShadow: "0 0 0px #d97706" }}>
              <PopoverAnimado
                id="inventario-insert"
                titulo="Nuevo Registro en Inventario"
                direccion="bl"
                pWidth={680}
                pHeight={510}
                theme={theme}
                triggerWidth={155}
                triggerContent={
                  <div className="flex items-center gap-2">
                    <Plus size={18} />
                    Nuevo Registro
                  </div>
                }
                triggerClassName="flex items-center gap-2 mr-2 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-600/20 active:scale-95"
              >
                {({ close }: any) => (
                  <div className="mt-4 relative">
                    <InsertarInventarioForm
                      theme={theme}
                      medicamentosExistentes={medicamentos}
                      onSuccess={() => {
                        loadData();
                        close();
                      }}
                      onCancel={() => close()}
                      hideHeader={true}
                    />
                  </div>
                )}
              </PopoverAnimado>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-3.5 px-5 rounded-2xl border flex items-center justify-between gap-3 ${isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-gray-100 shadow-sm"}`}
          >
            <div className="flex flex-col">
              <h4 className="text-xl font-black leading-none">{stat.value}</h4>
              <p
                className={`text-[9px] mt-1.5 font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}
              >
                {stat.label}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                stat.color === "blue"
                  ? "bg-blue-500/10 text-blue-500"
                  : stat.color === "amber"
                    ? "bg-amber-500/10 text-amber-500"
                    : stat.color === "red"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-emerald-500/10 text-emerald-500"
              }`}
            >
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div
        className={`flex-1 min-h-0 border rounded-[2rem] overflow-hidden shadow-sm flex flex-col ${isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-100"}`}
      >
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${tableHeaderStyles} text-left`}>Código</th>
                <th className={`${tableHeaderStyles} text-left`}>
                  Medicamento
                </th>
                <th className={`${tableHeaderStyles} text-left`}>
                  Existencias
                </th>
                <th className={`${tableHeaderStyles} text-left`}>Precio/U</th>
                <th className={`${tableHeaderStyles} text-left`}>Estado</th>
                <th className={`${tableHeaderStyles} text-center`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicamentos.length > 0 ? (
                filteredMedicamentos.map((med, idx) => {
                  const status = getStockStatus(med.numex);
                  return (
                    <motion.tr
                      key={med.codm}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={rowStyles}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-amber-500">
                        #{med.codm}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{med.nomm}</span>
                          <span
                            className={`text-[10px] font-medium tracking-tight ${isDarkMode ? "text-zinc-600" : "text-gray-400"}`}
                          >
                            Vence: {new Date(med.fechv).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            {med.numex} uds.
                          </span>
                          <span
                            className={`text-[9px] font-black italic ${isDarkMode ? "text-zinc-700" : "text-gray-400"}`}
                          >
                            Frecuencia: {med.frecuso}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold">Bs. {med.precio}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <PopoverAnimado
                            id={`obs-${med.codm}`}
                            titulo={`Observación # ${med.codm}`}
                            texto={<p className="text-lg">{med.obs}</p>}
                            direccion="tl"
                            pWidth={360}
                            pHeight={220}
                            theme={theme}
                            triggerWidth={42}
                            triggerHeight={42}
                            triggerContent={<Eye size={18} />}
                            triggerClassName={
                              isDarkMode
                                ? "bg-zinc-800 hover:bg-amber-900/30 text-zinc-400 hover:text-amber-400 border-transparent hover:border-amber-500/30 rounded-xl"
                                : "bg-zinc-50 hover:bg-amber-50 text-zinc-500 hover:text-amber-600 border-transparent hover:border-amber-100 rounded-xl"
                            }
                          />
                          {isRegistrado && (
                            <PopoverAnimado
                              id={`edit-${med.codm}`}
                              titulo={`Editar Medicamento #${med.codm}`}
                              direccion="bl"
                              pWidth={680}
                              pHeight={510}
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
                                  ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.5),0_6px_20px_rgba(99,102,241,0.2)]"
                                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_6px_20px_rgba(99,102,241,0.15)]"
                              }
                            >
                              {({ close }: any) => (
                                <div className="mt-4 relative">
                                  <ActualizarInventarioForm
                                    theme={theme}
                                    medicamento={med}
                                    onSuccess={() => {
                                      loadData();
                                      close();
                                    }}
                                    onCancel={() => close()}
                                    hideHeader={true}
                                  />
                                </div>
                              )}
                            </PopoverAnimado>
                          )}

                          {isRegistrado && (
                            <PopoverAnimado
                              id={`delete-${med.codm}`}
                              titulo="¿Eliminar Medicamento?"
                              direccion="bl"
                              pWidth={425}
                              pHeight={225}
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
                                  ? "bg-zinc-800/80 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.5),0_6px_20px_rgba(239,68,68,0.2)]"
                                  : "bg-white hover:bg-red-50 text-zinc-600 hover:text-red-600 border border-zinc-200 hover:border-red-300 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_6px_20px_rgba(239,68,68,0.15)]"
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
                                    Esta acción enviará{" "}
                                    <strong>{med.nomm}</strong> a la papelera.
                                    ¿Deseas continuar?
                                  </p>
                                  <div className="flex gap-3 mt-auto relative z-10">
                                    <button
                                      aria-label="Cancelar"
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
                                      aria-label="Eliminar"
                                      onClick={() => {
                                        handleDelete(med.codm);
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
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Archive size={48} />
                      <p className="font-bold">
                        No hay medicamentos en el inventario
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredMedicamentos.length > 5 && (
            <motion.div
              className="relative h-6 w-full bg-gradient-to-b from-transparent to-indigo-500/30"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MostrarInventario;
