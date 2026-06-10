import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ChevronDown,
  User,
  Trash2,
  RefreshCw,
  Archive,
  DollarSign,
  Calendar,
  Package,
  FileSpreadsheet,
  AlertCircle,
  Hash,
  X,
  Settings,
} from "lucide-react";
import {
  MostrarDescargosReal,
  type DescargoAdministracion,
} from "../../conexion/DescargoAdministracion/Mostrar";
import { EliminarDescargo } from "../../conexion/DescargoAdministracion/Eliminar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import {
  MostrarMedicamentosReal,
  type Medicamento,
} from "../../conexion/Inventario/Mostrar";

import InsertarDescargoForm from "./insertar";
import ActualizarDescargoForm from "./actualizar";
import type { Theme } from "../../sidebars/Sidebar";
import PopoverAnimado from "../../common/PopoverAnimado";
import { useToast } from "../../common/ToastContext";
import { DescargoSkeleton } from "../../common/skeleton";
import { useSocket } from "../../../hooks/useSocket";

interface MostrarDescargoAdministracionProps {
  theme: Theme;
}

export function MostrarDescargoAdministracion({
  theme,
}: MostrarDescargoAdministracionProps) {
  const { showToast } = useToast();
  const [descargos, setDescargos] = useState<DescargoAdministracion[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [expandedIdp, setExpandedIdp] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = theme === "dark";
  const isRegistrado = !!localStorage.getItem("usuarioActivo");
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dRes, pRes, mRes] = await Promise.all([
        MostrarDescargosReal(),
        MostrarPacientes(),
        MostrarMedicamentosReal(),
      ]);
      setDescargos(dRes.filter((d) => !d.EstadoEliminado));
      setPacientes(pRes);
      setMedicamentos(mRes);
    } catch (error) {
      console.error(error);
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

  const patientsMap = pacientes.reduce(
    (acc, p) => {
      acc[p.ci] = p;
      return acc;
    },
    {} as Record<number, Paciente>,
  );
  const medsMap = medicamentos.reduce(
    (acc, m) => {
      acc[m.codm] = m;
      return acc;
    },
    {} as Record<number, Medicamento>,
  );

  const grouped = descargos.reduce(
    (acc, d) => {
      if (!acc[d.idp]) acc[d.idp] = [];
      acc[d.idp].push(d);
      return acc;
    },
    {} as Record<number, DescargoAdministracion[]>,
  );

  Object.values(grouped).forEach((items) => {
    items.sort(
      (a, b) => new Date(b.fechi).getTime() - new Date(a.fechi).getTime(),
    );
  });

  const filteredGroups = Object.keys(grouped).filter((idp) => {
    const p = patientsMap[Number(idp)];

    if (!p) return false;

    const fullName = `${p.nom ?? ""} ${p.ap ?? ""} ${p.am ?? ""}`.trim();

    if (!fullName) return false;

    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    try {
      await EliminarDescargo(id);
      showToast("Descargo enviado a la papelera.", "success");
      await loadData();
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch (error) {
      showToast("Error al eliminar descargo.", "warning");
    }
  };

  const calculateTotalCost = (items: DescargoAdministracion[]) => {
    return items.reduce((sum, item) => sum + item.costo, 0);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "--:--";
    const normalized =
      typeof timeStr === "string" ? timeStr.replace("Z", "") : timeStr;

    if (normalized.includes("T")) {
      const d = new Date(normalized);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
    return normalized.substring(0, 5);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "--/--/----";
    const baseDate = dateStr.split("T")[0].split(" ")[0];
    const parts = baseDate.split(/[-/]/);

    if (parts.length === 3) {
      let day, month, year;
      if (parts[0].length === 4) {
        [year, month, day] = parts.map(Number);
      } else {
        [day, month, year] = parts.map(Number);
      }
      return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  if (isLoading) {
    return <DescargoSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div className="h-full p-2 flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3 text-sky-500">
          <div className="p-3 bg-sky-500/10 rounded-2xl shadow-inner">
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Descargo de Administración
            </h1>
            <p
              className={`${isDarkMode ? "text-zinc-500" : "text-gray-400"} text-[10px] font-black uppercase tracking-[0.2em]`}
            >
              Control Clínico de Insumos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none md:w-80 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por paciente..."
              className={`w-full pl-12 pr-10 py-3 border-2 rounded-2xl transition-all outline-none ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 focus:border-sky-500 text-zinc-100 placeholder-zinc-500"
                  : "bg-white border-gray-100 focus:border-sky-500 text-zinc-900 placeholder-gray-400"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              list="pacientes"
            />
            <datalist id="pacientes">
              {filteredGroups.slice(0, 5).map((idpStr) => {
                const p = patientsMap[Number(idpStr)];
                return (
                  <option
                    key={idpStr}
                    value={p ? `${p.nom} ${p.ap}` : idpStr}
                  />
                );
              })}
            </datalist>
            <AnimatePresence>
              <motion.button
                onClick={() => setSearchTerm("")}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                  isDarkMode
                    ? "text-zinc-500 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                    : "text-zinc-400 hover:text-zinc-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <X size={14} />
              </motion.button>
            </AnimatePresence>
          </div>

          {isRegistrado && (
            <PopoverAnimado
              id="descargo-insert"
              titulo="Nuevo Registro de Descargo"
              direccion="bl"
              pWidth={740}
              pHeight={580}
              theme={theme}
              triggerWidth={220}
              triggerHeight={48}
              triggerContent={
                <div className="flex items-center gap-2">
                  <Plus size={20} strokeWidth={3} />
                  <span className="font-black uppercase text-[11px] tracking-wider">
                    Nuevo Descargo
                  </span>
                </div>
              }
              triggerClassName="text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-sky-500/20 transition-all active:scale-95"
            >
              {({ close }: any) => (
                <div className="mt-4">
                  <InsertarDescargoForm
                    theme={theme}
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
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-4">
        <div className="space-y-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((idpStr, idx) => {
              const idp = Number(idpStr);
              const p = patientsMap[idp];
              const isOpen = expandedIdp === idp;
              const items = grouped[idp];
              const totalCost = calculateTotalCost(items);

              return (
                <motion.div
                  key={idp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-[2rem] border transition-all ${
                    isDarkMode
                      ? `bg-zinc-950/50 border-zinc-900 ${isOpen ? "ring-1 ring-sky-500/30" : ""}`
                      : `bg-white border-gray-100 shadow-sm ${isOpen ? "ring-1 ring-sky-500/20" : ""}`
                  }`}
                >
                  <button
                    onClick={() => setExpandedIdp(isOpen ? null : idp)}
                    className={`w-full flex justify-between items-center px-8 py-5 transition-all rounded-[2rem] ${
                      isOpen
                        ? isDarkMode
                          ? "bg-zinc-900/40"
                          : "bg-sky-50/30"
                        : isDarkMode
                          ? "hover:bg-zinc-900/20"
                          : "hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isOpen
                            ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                            : "bg-sky-500/10 text-sky-500"
                        }`}
                      >
                        <User size={24} />
                      </div>
                      <div className="text-left">
                        <h3
                          className={`font-black text-xl tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {p
                            ? `${p.nom} ${p.ap} ${p.am}`
                            : `Paciente CI: ${idp}`}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-500/10 px-2 py-0.5 rounded-md opacity-60">
                            {items.length} Registros
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            <DollarSign size={10} strokeWidth={3} />{" "}
                            {totalCost.toFixed(2)} Bs. Acumulado
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-xl transition-all ${isOpen ? "rotate-180 bg-sky-500/10 text-sky-500" : "text-zinc-400"}`}
                    >
                      <ChevronDown size={24} strokeWidth={3} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <div
                            className={`rounded-2xl border ${isDarkMode ? "border-zinc-900 bg-zinc-950/30" : "border-gray-50 bg-gray-50/30"} overflow-x-auto`}
                          >
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr
                                  className={`text-[9px] uppercase font-black tracking-widest text-zinc-500 border-b ${isDarkMode ? "border-zinc-900" : "border-gray-100"}`}
                                >
                                  <th className="px-6 py-4">
                                    <Hash size={12} className="inline mr-1" />{" "}
                                    ID
                                  </th>
                                  <th className="px-6 py-4">
                                    <Package
                                      size={12}
                                      className="inline mr-1"
                                    />{" "}
                                    Medicamento / Diagnóstico
                                  </th>
                                  <th className="px-6 py-4">
                                    <Calendar
                                      size={12}
                                      className="inline mr-1"
                                    />{" "}
                                    Tiempos
                                  </th>
                                  <th className="px-6 py-4 text-center">
                                    <Archive
                                      size={12}
                                      className="inline mr-1"
                                    />{" "}
                                    Cant.
                                  </th>
                                  <th className="px-6 py-4 text-right">
                                    <DollarSign
                                      size={12}
                                      className="inline mr-1"
                                    />{" "}
                                    Costo
                                  </th>
                                  {isRegistrado && (
                                    <th className="px-6 py-4 text-center">
                                      <Settings
                                        size={12}
                                        className="inline mr-1"
                                      />{" "}
                                      Acciones
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((it) => {
                                  return (
                                    <tr
                                      key={it.idd}
                                      className={`group border-b last:border-0 ${isDarkMode ? "border-zinc-900 hover:bg-zinc-900/40" : "border-gray-50 hover:bg-white"}`}
                                    >
                                      <td className="px-6 py-5">
                                        <span className="text-[11px] font-mono font-bold bg-zinc-500/10 px-2 py-1 rounded-lg">
                                          #{it.idd}
                                        </span>
                                      </td>
                                      <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                          <span className="font-black text-sm text-sky-500 uppercase tracking-tight">
                                            {medsMap[it.codm]?.nomm ||
                                              "Insumo Desconocido"}
                                          </span>
                                          <p
                                            className={`text-[10px] leading-relaxed mt-1 italic max-w-[260px] ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}
                                          >
                                            "
                                            {it.diag ||
                                              "Sin diagnóstico registrado"}
                                            "
                                          </p>
                                          <div
                                            className={`mt-1 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? "text-zinc-600" : "text-gray-400"}`}
                                          >
                                            <span className="opacity-60">
                                              Responsable:
                                            </span>{" "}
                                            {it.resp}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-1.5 text-[12px] font-black text-emerald-500 uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {formatDate(it.fechi)} -{" "}
                                            {formatTime(it.horai)}
                                          </div>
                                          {it.fechalta ? (
                                            <div className="flex items-center gap-1.5 text-[12px] font-black text-rose-500 uppercase opacity-60">
                                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                              Alta: {formatDate(it.fechalta)} -{" "}
                                              {formatTime(it.horalta)}
                                            </div>
                                          ) : (
                                            <span className="text-[9px] font-black bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-full w-fit">
                                              En Curso
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-6 py-5 text-center">
                                        <span className="font-black text-base">
                                          {it.cant}
                                        </span>
                                      </td>
                                      <td className="px-6 py-5 text-right">
                                        <span className="font-black text-emerald-500 text-sm whitespace-nowrap">
                                          {it.costo.toFixed(2)} Bs.
                                        </span>
                                      </td>
                                      <td className="px-6 py-5">
                                        <div className="flex justify-center gap-2">
                                          {isRegistrado && (
                                            <PopoverAnimado
                                              id={`edit-${it.idd}`}
                                              titulo={`Editar Descargo #${it.idd}`}
                                              direccion="bl"
                                              pWidth={680}
                                              pHeight={520}
                                              theme={theme}
                                              triggerWidth={42}
                                              triggerHeight={42}
                                              triggerContent={
                                                <RefreshCw
                                                  size={14}
                                                  strokeWidth={3}
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
                                                <div className="mt-4">
                                                  <ActualizarDescargoForm
                                                    theme={theme}
                                                    descargo={it}
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
                                              id={`delete-${it.idd}`}
                                              titulo="Eliminar Registro"
                                              direccion="bl"
                                              pWidth={345}
                                              pHeight={245}
                                              theme={theme}
                                              triggerWidth={42}
                                              triggerHeight={42}
                                              triggerContent={
                                                <Trash2
                                                  size={14}
                                                  strokeWidth={3}
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
                                                <div className="flex flex-col h-full">
                                                  <p
                                                    className={`text-sm mb-6 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}
                                                  >
                                                    ¿Confirma eliminar el
                                                    descargo{" "}
                                                    <strong>#{it.idd}</strong>{" "}
                                                    del historial clínico?
                                                  </p>
                                                  <div className="flex gap-3 mt-auto">
                                                    <button
                                                      onClick={() => close()}
                                                      className={`flex-1 py-3 rounded-xl text-xs font-bold ${isDarkMode ? "bg-zinc-800 text-white" : "bg-gray-100 text-gray-500"}`}
                                                    >
                                                      No, mantener
                                                    </button>
                                                    <button
                                                      onClick={() => {
                                                        handleDelete(it.idd);
                                                        close();
                                                      }}
                                                      className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20"
                                                    >
                                                      Sí, eliminar
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </PopoverAnimado>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            {items.length > 5 && (
                              <motion.div
                                className="relative h-6 w-full bg-gradient-to-b from-transparent to-sky-500/30"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                              >
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.7)]" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div
              className={`py-20 text-center rounded-[2.5rem] border-2 border-dashed ${isDarkMode ? "bg-zinc-950/50 border-zinc-900" : "bg-gray-50/50 border-gray-100"}`}
            >
              <AlertCircle
                size={48}
                className="mx-auto mb-4 text-zinc-500 opacity-20"
              />
              <p className="font-black text-zinc-500 uppercase tracking-widest text-sm">
                No se encontraron registros activos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MostrarDescargoAdministracion;
