import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package2,
  Plus,
  Trash2,
  RefreshCw,
  FileText,
  X,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Pill,
  BadgeInfo,
  Users,
} from "lucide-react";
import {
  MostrarMedicamentosExternosReal,
  type MedicamentoExterno,
} from "../../conexion/MedicamentoExterno/Mostrar";
import { EliminarMedicamentoExterno } from "../../conexion/MedicamentoExterno/Eliminar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import InsertarExternoForm from "./insertar";
import ActualizarExternoForm from "./actualizar";
import type { Theme } from "../../sidebars/Sidebar";
import PopoverAnimado from "../../common/PopoverAnimado";
import { useToast } from "../../common/ToastContext";
import { MedicamentoExternoSkeleton } from "../../common/skeleton";
import { useSocket } from "../../../hooks/useSocket";

interface MostrarMedicamentoExternoProps {
  theme: Theme;
}

interface GrupoPaciente {
  paciente: Paciente;
  idp: number;
  medicamentos: MedicamentoExterno[];
}

export function MostrarMedicamentoExterno({
  theme,
}: MostrarMedicamentoExternoProps) {
  const { showToast } = useToast();
  const [datos, setDatos] = useState<MedicamentoExterno[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = theme === "dark";
  const isRegistrado = !!localStorage.getItem("usuarioActivo");
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const { socket } = useSocket();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [externos, pacs] = await Promise.all([
        MostrarMedicamentosExternosReal(),
        MostrarPacientes(),
      ]);
      setDatos(externos.filter((d) => !d.EstadoEliminado));
      setPacientes(pacs);
    } catch (error) {
      console.error(error);
      showToast("Error al cargar los datos.", "warning");
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

  const patientsMap = useMemo(
    () =>
      pacientes.reduce(
        (acc, p) => {
          acc[p.ci] = p;
          return acc;
        },
        {} as Record<number, Paciente>,
      ),
    [pacientes],
  );

  const gruposFiltrados = useMemo((): GrupoPaciente[] => {
    const filtrados = datos.filter((d) => {
      const p = patientsMap[d.idp];
      const pname = p ? `${p.nom} ${p.ap} ${p.am}` : "";

      return `${d.nomme} ${pname} ${d.idme} ${d.descrip} ${d.obs}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });

    const mapa: Record<number, MedicamentoExterno[]> = {};

    for (const med of filtrados) {
      if (!mapa[med.idp]) mapa[med.idp] = [];
      mapa[med.idp].push(med);
    }

    return Object.entries(mapa)
      .reduce<GrupoPaciente[]>((acc, [idpStr, meds]) => {
        const idp = Number(idpStr);
        const paciente = patientsMap[idp];

        if (!paciente) return acc;

        acc.push({
          paciente,
          idp,
          medicamentos: [...meds].sort((a, b) => b.idme - a.idme),
        });

        return acc;
      }, [])
      .sort((a, b) => {
        const na = `${a.paciente.nom} ${a.paciente.ap}`;
        const nb = `${b.paciente.nom} ${b.paciente.ap}`;
        return na.localeCompare(nb);
      });
  }, [datos, patientsMap, searchTerm]);

  useEffect(() => {
    const estado: Record<number, boolean> = {};
    gruposFiltrados.forEach((g) => {
      estado[g.idp] = expanded[g.idp] !== false;
    });
    setExpanded(estado);
  }, [gruposFiltrados.length]);

  const toggleExpanded = (idp: number) => {
    setExpanded((prev) => ({ ...prev, [idp]: !prev[idp] }));
  };

  const handleDelete = async (id: number) => {
    try {
      await EliminarMedicamentoExterno(id);
      showToast("Registro enviado a la papelera.", "success");
      await loadData();
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch (error) {
      showToast("Error al eliminar registro.", "warning");
    }
  };

  const totalMeds = datos.length;
  const totalPacientes = new Set(datos.map((d) => d.idp)).size;

  if (isLoading) {
    return <MedicamentoExternoSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div className="flex flex-col h-full mb-0 p-2 pt-0 pb-0 overflow-hidden">
      <div
        className={`flex flex-col md:flex-row justify-between sticky top-0 z-19 items-start md:items-center p-4 gap-4 mb-3 shrink-0`}
      >
        <div className="flex items-center gap-3 text-indigo-500">
          <div className="p-3 bg-indigo-500/10 rounded-2xl shadow-inner">
            <Package2 size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">
              Medicamentos Externos
            </h1>
            <p
              className={`${isDarkMode ? "text-zinc-500" : "text-gray-400"} text-[10px] font-black uppercase tracking-[0.2em]`}
            >
              Control Clínico de Fármacos Propios
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              isDarkMode
                ? "bg-zinc-900 text-zinc-400 border border-zinc-800"
                : "bg-gray-50 text-gray-400 border border-gray-200"
            }`}
          >
            <Users size={13} className="text-indigo-500" />
            <span>{totalPacientes} pacientes</span>
            <span className="mx-1 opacity-30">·</span>
            <Pill size={13} className="text-indigo-400" />
            <span>{totalMeds} fármacos</span>
          </div>

          <div className="flex-1 md:flex-none md:w-72 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar fármaco o paciente..."
              className={`w-full pl-10 pr-9 py-3 border-2 rounded-2xl transition-all outline-none ${
                isDarkMode
                  ? "bg-zinc-900 border-zinc-800 focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
                  : "bg-white border-gray-100 focus:border-indigo-500 text-zinc-900 placeholder-gray-400"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              list="externo-suggestions"
            />
            <datalist id="externo-suggestions">
              {datos
                .filter((d) =>
                  d.nomme.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .slice(0, 3)
                .map((d) => (
                  <option key={d.idme} value={d.nomme} />
                ))}

              {pacientes
                .filter((p) =>
                  `${p.nom} ${p.ap}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .slice(0, 3)
                .map((p) => (
                  <option key={p.ci} value={`${p.nom} ${p.ap}`} />
                ))}
            </datalist>
            <AnimatePresence>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchTerm("")}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
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
              id="externo-insert"
              titulo="Registrar Medicamento Externo"
              direccion="bl"
              pWidth={650}
              pHeight={500}
              theme={theme}
              triggerWidth={180}
              triggerHeight={48}
              triggerContent={
                <div className="flex items-center gap-2">
                  <Plus size={20} strokeWidth={3} />
                  <span className="font-black uppercase text-[11px] tracking-wider">
                    Nuevo Ingreso
                  </span>
                </div>
              }
              triggerClassName="text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              {({ close }: any) => (
                <div className="mt-4">
                  <InsertarExternoForm
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

      <div
        className={`flex-1 rounded-[2.5rem] border overflow-hidden ${
          isDarkMode
            ? "bg-zinc-950 border-zinc-900"
            : "bg-white border-gray-100 shadow-sm"
        }`}
      >
        <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {gruposFiltrados.length > 0 ? (
              gruposFiltrados.map((grupo, gi) => {
                const pac = grupo.paciente;
                if (isNaN(grupo.idp)) {
                  return null;
                }
                const isOpen = expanded[grupo.idp] !== false;
                const initials = pac
                  ? `${pac.nom?.charAt(0) ?? ""}${pac.ap?.charAt(0) ?? ""}`.toUpperCase()
                  : "?";

                return (
                  <motion.div
                    key={grupo.idp}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: gi * 0.04 }}
                    className={`rounded-3xl border overflow-hidden ${
                      isDarkMode
                        ? "bg-zinc-900/60 border-zinc-800"
                        : "bg-gray-50/80 border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => toggleExpanded(grupo.idp)}
                      className={`w-full flex items-center gap-4 px-5 py-4 transition-all ${
                        isDarkMode
                          ? "hover:bg-zinc-800/60"
                          : "hover:bg-indigo-50/60"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 shrink-0">
                        {initials}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <p className="font-black text-sm tracking-tight truncate">
                          {pac
                            ? `${pac.nom} ${pac.ap}${pac.am ? " " + pac.am : ""}`
                            : `Paciente ID: ${grupo.idp}`}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${
                              isDarkMode ? "text-zinc-500" : "text-gray-400"
                            }`}
                          >
                            CI: {grupo.idp}
                          </span>
                          {pac?.ocu && (
                            <>
                              <span className="opacity-20">·</span>
                              <span
                                className={`text-[10px] font-medium capitalize ${
                                  isDarkMode ? "text-zinc-500" : "text-gray-400"
                                }`}
                              >
                                {pac.ocu}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl">
                          <Pill size={11} />
                          {grupo.medicamentos.length}{" "}
                          {grupo.medicamentos.length === 1
                            ? "fármaco"
                            : "fármacos"}
                        </span>
                        <span
                          className={`transition-transform duration-300 ${
                            isDarkMode ? "text-zinc-500" : "text-gray-400"
                          } ${isOpen ? "rotate-0" : "-rotate-90"}`}
                        >
                          {isOpen ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className={`mx-4 mb-4 rounded-2xl overflow-hidden border ${
                              isDarkMode
                                ? "border-zinc-800 bg-zinc-950/60"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <div
                              className={`grid grid-cols-[auto_1fr_1fr_auto] gap-0 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest border-b ${
                                isDarkMode
                                  ? "text-zinc-600 border-zinc-800 bg-zinc-900/40"
                                  : "text-gray-400 border-gray-100 bg-gray-50/80"
                              }`}
                            >
                              <span className="w-10 text-center">#</span>
                              <span className="flex items-center gap-1 pl-2">
                                <Pill size={9} /> Medicamento
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText size={9} /> Descripción
                              </span>
                              <span className="w-32 text-center">Acciones</span>
                            </div>

                            {grupo.medicamentos.map((med, mi) => (
                              <motion.div
                                key={med.idme}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: mi * 0.04 }}
                                className={`grid grid-cols-[auto_1fr_1fr_auto] gap-0 items-center px-5 py-4 border-b last:border-0 transition-colors ${
                                  isDarkMode
                                    ? "border-zinc-800/60 hover:bg-indigo-500/5"
                                    : "border-gray-100 hover:bg-indigo-50/40"
                                }`}
                              >
                                <div className="w-10 flex justify-center">
                                  <span className="text-[10px] font-mono font-black bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-lg">
                                    {med.idme}
                                  </span>
                                </div>

                                <div className="pl-2 min-w-0">
                                  <p className="font-black text-sm text-indigo-500 uppercase tracking-tight truncate">
                                    {med.nomme}
                                  </p>
                                </div>

                                <div className="min-w-0 pr-4">
                                  <p
                                    className={`text-[11px] leading-relaxed italic line-clamp-2 ${
                                      isDarkMode
                                        ? "text-zinc-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {med.descrip ||
                                      "Sin descripción registrada"}
                                  </p>
                                </div>

                                <div className="w-32 flex justify-end gap-1.5">
                                  <PopoverAnimado
                                    id={`obs-${med.idme}`}
                                    titulo="Observación"
                                    direccion="bl"
                                    pWidth={340}
                                    pHeight={200}
                                    theme={theme}
                                    triggerWidth={36}
                                    triggerHeight={36}
                                    triggerContent={
                                      <Eye
                                        size={15}
                                        color="#f59e0b"
                                        strokeWidth={2.5}
                                      />
                                    }
                                    triggerClassName={
                                      isDarkMode
                                        ? "bg-zinc-800 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl transition-all"
                                        : "bg-amber-50 hover:bg-amber-500 text-amber-500 hover:text-white rounded-xl transition-all"
                                    }
                                  >
                                    {() => (
                                      <div className="relative">
                                        <div className="absolute -top-10 -right-4 opacity-5 text-amber-500">
                                          <BadgeInfo size={80} />
                                        </div>
                                        <p
                                          className={`text-sm leading-relaxed relative z-10 font-medium break-words whitespace-pre-wrap ${
                                            isDarkMode
                                              ? "text-zinc-400"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {med.obs ||
                                            "Sin observaciones adicionales."}
                                        </p>
                                      </div>
                                    )}
                                  </PopoverAnimado>

                                  {isRegistrado && (
                                    <PopoverAnimado
                                      id={`edit-${med.idme}`}
                                      titulo={`Editar #${med.idme}`}
                                      direccion="bl"
                                      pWidth={550}
                                      pHeight={500}
                                      theme={theme}
                                      triggerWidth={36}
                                      triggerHeight={36}
                                      triggerContent={
                                        <RefreshCw
                                          size={15}
                                          color="blue"
                                          strokeWidth={2.5}
                                        />
                                      }
                                      triggerClassName={
                                        isDarkMode
                                          ? "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 rounded-xl shadow-sm transition-all"
                                          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl shadow-sm transition-all"
                                      }
                                    >
                                      {({ close }: any) => (
                                        <div className="mt-4">
                                          <ActualizarExternoForm
                                            theme={theme}
                                            med={med}
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
                                      id={`delete-${med.idme}`}
                                      titulo="Eliminar"
                                      direccion="bl"
                                      pWidth={325}
                                      pHeight={235}
                                      theme={theme}
                                      triggerWidth={36}
                                      triggerHeight={36}
                                      triggerContent={
                                        <Trash2
                                          size={15}
                                          color="red"
                                          strokeWidth={2.5}
                                        />
                                      }
                                      triggerClassName={
                                        isDarkMode
                                          ? "bg-zinc-800/80 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/40 rounded-xl shadow-sm transition-all"
                                          : "bg-white hover:bg-red-50 text-zinc-600 hover:text-red-600 border border-zinc-200 hover:border-red-300 rounded-xl shadow-sm transition-all"
                                      }
                                    >
                                      {({ close }: any) => (
                                        <div className="flex flex-col h-full">
                                          <p
                                            className={`text-sm mb-6 leading-relaxed ${
                                              isDarkMode
                                                ? "text-zinc-400"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            ¿Eliminar{" "}
                                            <strong className="text-red-500">
                                              {med.nomme}
                                            </strong>{" "}
                                            del historial de{" "}
                                            <strong>
                                              {pac
                                                ? `${pac.nom} ${pac.ap}`
                                                : `ID ${med.idp}`}
                                            </strong>
                                            ?
                                          </p>
                                          <div className="flex gap-3 mt-auto">
                                            <button
                                              onClick={() => close()}
                                              aria-label="Cancelar"
                                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                isDarkMode
                                                  ? "bg-zinc-800 text-zinc-400 hover:text-white"
                                                  : "bg-gray-100 text-gray-500"
                                              }`}
                                            >
                                              Cancelar
                                            </button>
                                            <button
                                              onClick={() => {
                                                handleDelete(med.idme);
                                                close();
                                              }}
                                              aria-label="Eliminar"
                                              className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95"
                                            >
                                              Sí, eliminar
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </PopoverAnimado>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-4 opacity-20"
              >
                <AlertCircle size={48} />
                <p className="font-black uppercase tracking-widest text-sm text-zinc-500">
                  No se encontraron registros activos
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MostrarMedicamentoExterno;
