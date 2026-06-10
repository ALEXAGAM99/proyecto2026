import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Stethoscope,
  User,
  Trash2,
  RefreshCw,
  Plus,
  ClipboardList,
  Activity,
  HeartPulse,
  Thermometer,
  AlertCircle,
  Calculator,
  Scale,
  Ruler,
  Wind,
  Calendar,
  TrendingUp,
  Inbox,
  X,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import {
  MostrarConsultasReal,
  type Consulta,
} from "../../conexion/Consulta/Mostrar";
import { EliminarConsulta } from "../../conexion/Consulta/Eliminar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import InsertarConsultaForm from "./insertar";
import ActualizarConsultaForm from "./actualizar";
import type { Theme } from "../../sidebars/Sidebar";
import PopoverAnimado from "../../common/PopoverAnimado";
import { ConsultaSkeleton } from "../../common/skeleton";
import { useSocket } from "../../../hooks/useSocket";

interface MostrarConsultasProps {
  theme: Theme;
}

export function MostrarConsultas({ theme }: MostrarConsultasProps) {
  const { showToast } = useToast();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientCI, setSelectedPatientCI] = useState<number | null>(
    null,
  );
  const [selectedConsultaId, setSelectedConsultaId] = useState<number | null>(
    null,
  );
  const isDarkMode = theme === "dark";
  const isRegistrado = !!localStorage.getItem("usuarioActivo");
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const loadData = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);

      try {
        const [consultasData, patientsData] = await Promise.all([
          MostrarConsultasReal(),
          MostrarPacientes(),
        ]);

        const activeConsultas = (consultasData || []).filter(
          (c) => !c.EstadoEliminado,
        );

        setConsultas(activeConsultas);
        setPacientes(patientsData || []);

        if (selectedPatientCI == null && activeConsultas.length > 0) {
          setSelectedPatientCI(activeConsultas[0].idp);
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [selectedPatientCI],
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadData(true);
    };

    socket.on("actualizar_datos", handleUpdate);

    return () => {
      socket.off("actualizar_datos", handleUpdate);
    };
  }, [socket, loadData]);

  const stats = useMemo(() => {
    const total = consultas.length;
    const imcs = consultas
      .map((c) => parseFloat(c.imc))
      .filter((v) => !isNaN(v));
    const avgIMC = imcs.length
      ? (imcs.reduce((a, b) => a + b, 0) / imcs.length).toFixed(1)
      : "0";

    const counts: Record<string, number> = {};
    consultas.forEach((c) => {
      const v = parseFloat(c.imc);
      let cat = "Normal";
      if (v < 18.5) cat = "Bajo Peso";
      else if (v >= 30) cat = "Obesidad";
      else if (v >= 25) cat = "Sobrepeso";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const topCat =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { total, avgIMC, topCat };
  }, [consultas]);

  const filteredPatients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const hasConsults = new Set(consultas.map((c) => c.idp));

    return pacientes
      .filter((p) => hasConsults.has(p.ci))
      .filter((p) =>
        `${p.nom} ${p.ap} ${p.am} ${p.ci}`.toLowerCase().includes(term),
      )
      .sort((a, b) => a.ap.localeCompare(b.ap));
  }, [pacientes, consultas, searchTerm]);

  const patientConsults = useMemo(() => {
    if (!selectedPatientCI) return [];
    return consultas
      .filter((c) => c.idp === selectedPatientCI)
      .sort(
        (a, b) =>
          new Date(b.fechactual).getTime() - new Date(a.fechactual).getTime(),
      );
  }, [consultas, selectedPatientCI]);

  useEffect(() => {
    if (patientConsults.length > 0 && !selectedConsultaId) {
      setSelectedConsultaId(patientConsults[0].idc);
    }
  }, [patientConsults]);

  const activeConsulta =
    patientConsults.find((c) => c.idc === selectedConsultaId) ||
    patientConsults[0];

  const handleDelete = async (idc: number) => {
    try {
      await EliminarConsulta(idc);
      showToast("Consulta eliminada", "success");
      await loadData();
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch (error) {
      showToast("Error al eliminar", "warning");
    }
  };

  const getIMCCategory = (imc: string) => {
    const val = parseFloat(imc);
    if (isNaN(val))
      return {
        text: "N/A",
        color: "text-zinc-400",
        bg: "bg-zinc-100",
        border: "border-zinc-200",
      };
    if (val < 18.5)
      return {
        text: "Bajo Peso",
        color: "text-cyan-500",
        bg: "bg-cyan-50",
        border: "border-cyan-100",
      };
    if (val < 25.0)
      return {
        text: "Normal",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
      };
    if (val < 30.0)
      return {
        text: "Sobrepeso",
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-100",
      };
    return {
      text: "Obesidad",
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
    };
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

    const normalized =
      typeof dateStr === "string" ? dateStr.replace("Z", "") : dateStr;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("es-ES");
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const normalized =
      typeof dateStr === "string" ? dateStr.replace("Z", "") : dateStr;
    const d = new Date(normalized);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return dateStr;
  };

  if (isLoading) {
    return <ConsultaSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div
      className={`h-full flex flex-col pb-4 mb-0 p-1 overflow-hidden transition-all duration-500 ${isDarkMode ? "text-zinc-100" : "text-gray-900"}`}
    >
      <div className="flex flex-col md:flex-row gap-6 mt-3 mb-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-600/20">
            <ClipboardList size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-emerald-600">
              Consultas
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
              Gestión de Historias Médicas
            </p>
          </div>
        </div>

        <div className="flex gap-4 -mt-3">
          {isRegistrado && (
            <PopoverAnimado
              id="new-desk"
              titulo="Nueva Consulta"
              direccion="tl"
              pWidth={840}
              pHeight={590}
              theme={theme}
              triggerContent={
                <div className="flex items-center">
                  <Plus size={18} /> Nueva Consulta
                </div>
              }
              triggerClassName="w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
            >
              {({ close }: any) => (
                <div className="mt-4">
                  <InsertarConsultaForm
                    theme={theme}
                    onSuccess={() => {
                      loadData();
                      close();
                    }}
                    onCancel={close}
                    hideHeader={true}
                  />
                </div>
              )}
            </PopoverAnimado>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 min-w-0">
        <div className="grid grid-cols-2 gap-4 px-2">
          <div className="h-10 sticky top-2 z-10">
            <StatCard
              icon={TrendingUp}
              label="Total Consultas"
              value={stats.total}
              color="text-indigo-500"
              isDarkMode={isDarkMode}
            />
            {/* PANEL IZQUIERDO: PACIENTES */}
            <div className="lg:col-span-3 flex flex-col gap-4 min-h-0 mt-3">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  list="paciente-sugerencias-mostrarx"
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border-none outline-none shadow-sm text-sm ${isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-gray-800"}`}
                />
                <datalist id="paciente-sugerencias-mostrarx">
                  {pacientes
                    .filter((p) => consultas.some((c) => c.idp === p.ci))
                    .slice(-5)
                    .reverse()
                    .map((paciente, index) => (
                      <option
                        key={index}
                        value={`${paciente.nom} ${paciente.ap}`}
                      />
                    ))}
                </datalist>
                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchTerm("")}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                        isDarkMode
                          ? "text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                          : "text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div
                className={`flex-1 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-2`}
              >
                {filteredPatients.map((p) => (
                  <button
                    key={p.ci}
                    onClick={() => {
                      setSelectedPatientCI(p.ci);
                      setSelectedConsultaId(null);
                    }}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      selectedPatientCI === p.ci
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                        : isDarkMode
                          ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                          : "bg-white border-gray-100 hover:border-emerald-200"
                    }`}
                  >
                    <p
                      className={`text-xs font-black uppercase tracking-tight truncate`}
                    >
                      {p.ap} {p.nom}
                    </p>
                    <p className={`text-[10px] font-bold opacity-60`}>
                      CI: {p.ci}
                    </p>
                  </button>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="py-10 text-center opacity-20">
                    <User size={40} className="mx-auto mb-2" />
                    <p className="text-xs font-bold">No hay pacientes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-10 sticky top-2 z-10">
            {/* PANEL CENTRAL: LINEA DE TIEMPO */}
            <div
              className={`lg:col-span-3 flex flex-col mt-3 gap-4 min-h-0 border-x px-4 ${isDarkMode ? "border-zinc-900" : "border-gray-100"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">
                  Total Consultas
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transform scale-130 ${isDarkMode ? "bg-zinc-800 text-cyan-500" : "bg-cyan-500 text-white"}`}
                >
                  {patientConsults.length}
                </span>
              </div>
              <div className="overflow-y-auto pr-2 custom-scrollbar h-[calc(100vh-230px)] pb-5 space-y-3">
                {patientConsults.map((c) => (
                  <button
                    key={c.idc}
                    onClick={() => setSelectedConsultaId(c.idc)}
                    className={`w-full text-left p-4 border-0 rounded-2xl rounded-l-xl transition-all relative ${
                      c.idc === patientConsults[0]?.idc
                        ? `sticky top-0 z-10 shadow-lg border-l-2 border-l-green-600 shadow-green-500/20 ${isDarkMode ? "bg-zinc-900" : "bg-white hover:bg-zinc-50 border border-gray-100"}`
                        : ""
                    } ${
                      selectedConsultaId === c.idc
                        ? "border-l-2 border-blue-600 text-white shadow-xl shadow-indigo-500/20"
                        : isDarkMode
                          ? "bg-zinc-900/50 hover:bg-zinc-900"
                          : "bg-white hover:bg-zinc-50 border border-gray-100"
                    }`}
                  >
                    <div
                      className={`flex justify-between items-start mb-1 ${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {c.idc === patientConsults[0]?.idc && (
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        )}
                        <span className="text-[10px] font-mono font-black border-b border-current opacity-50">
                          #{c.idc}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold opacity-50">
                        {formatDate(c.fechactual)}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-bold truncate ${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      {c.mc}
                    </p>
                  </button>
                ))}
                {patientConsults.length === 0 && (
                  <div className="py-20 text-center opacity-10">
                    <Inbox size={48} className="mx-auto" />
                  </div>
                )}
                {patientConsults.length > 5 && (
                  <motion.div
                    className="relative h-6 w-full bg-gradient-to-b from-transparent to-blue-500/30"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* PANEL DERECHO: DETALLES */}
          <div className="lg:col-span-6 min-h-0 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {activeConsulta ? (
                <motion.div
                  key={activeConsulta.idc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col gap-1"
                >
                  {/* Visual Header */}
                  <div className="flex gap-4">
                    <div className="w-2 bg-indigo-500 rounded-full"></div>

                    <div
                      className={`px-4 py-2 rounded-xl w-full mr-2 grid grid-cols-2 ${isDarkMode ? "bg-zinc-900" : "bg-white shadow"}`}
                    >
                      <div>
                        <h4 className="font-bold">Resumen de la Consulta</h4>
                        <p className="text-xs opacity-50 mb-2">
                          <span className="font-bold">Fecha:</span>{" "}
                          {formatDate(activeConsulta.fechactual)}{" "}
                          {formatTime(activeConsulta.fechactual)}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-self-end items-center">
                        {isRegistrado && (
                          <PopoverAnimado
                            id="edit-consulta"
                            titulo="Actualizar Consulta"
                            direccion="bl"
                            pWidth={840}
                            pHeight={590}
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
                              <div className="mt-4">
                                <ActualizarConsultaForm
                                  idc={activeConsulta.idc}
                                  theme={theme}
                                  onSuccess={() => {
                                    loadData();
                                    close();
                                  }}
                                  onCancel={close}
                                  hideHeader={true}
                                />
                              </div>
                            )}
                          </PopoverAnimado>
                        )}

                        {isRegistrado && (
                          <PopoverAnimado
                            id={`delete-${activeConsulta.idc}`}
                            titulo="¿Eliminar Consulta?"
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
                                  Esta acción enviará a la papelera la consulta.
                                  ¿Deseas continuar?
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
                                      handleDelete(activeConsulta.idc);
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
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10 space-y-2">
                    {/* Grid 1: Signs */}
                    <div className="grid grid-cols-3 gap-3 ">
                      <VitalItem
                        icon={Activity}
                        label="P. Arterial"
                        value={activeConsulta.pa}
                        color="text-cyan-500"
                        bg="bg-cyan-500/10"
                        isDarkMode={isDarkMode}
                      />
                      <VitalItem
                        icon={HeartPulse}
                        label="F. Cardíaca"
                        value={`${activeConsulta.fc} bpm`}
                        color="text-rose-500"
                        bg="bg-rose-500/10"
                        isDarkMode={isDarkMode}
                      />
                      <VitalItem
                        icon={Wind}
                        label="F. Respira."
                        value={`${activeConsulta.fr} rpm`}
                        color="text-blue-500"
                        bg="bg-blue-500/10"
                        isDarkMode={isDarkMode}
                      />
                      <VitalItem
                        icon={Thermometer}
                        label="Temperatura"
                        value={`${activeConsulta.temp}°C`}
                        color="text-orange-500"
                        bg="bg-orange-500/10"
                        isDarkMode={isDarkMode}
                      />
                      <VitalItem
                        icon={Scale}
                        label="Peso"
                        value={`${activeConsulta.peso} kg`}
                        color="text-indigo-500"
                        bg="bg-indigo-500/10"
                        isDarkMode={isDarkMode}
                      />
                      <VitalItem
                        icon={Ruler}
                        label="Talla"
                        value={`${activeConsulta.talla} cm`}
                        color="text-emerald-500"
                        bg="bg-emerald-500/10"
                        isDarkMode={isDarkMode}
                      />
                    </div>

                    {/* IMC Dashboard */}
                    <div
                      className={`p-0 rounded-3xl border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIMCCategory(activeConsulta.imc).bg} ${getIMCCategory(activeConsulta.imc).color}`}
                        >
                          <Calculator size={30} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            Índice de Masa Corporal
                          </p>
                          <p
                            className={`text-2xl font-black ${getIMCCategory(activeConsulta.imc).color}`}
                          >
                            {parseFloat(activeConsulta.imc).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest ${getIMCCategory(activeConsulta.imc).bg} ${getIMCCategory(activeConsulta.imc).color} ${getIMCCategory(activeConsulta.imc).border.replace("border-", "border-opacity-30 border-")}`}
                      >
                        {getIMCCategory(activeConsulta.imc).text}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-3xl rounded-l-xl border-l-8 h-full ${isDarkMode ? "bg-zinc-900/40 border-blue-500" : "bg-blue-50 border-blue-500 shadow-sm"}`}
                      >
                        <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-4">
                          <Calendar size={12} /> Enfermedad Actual
                        </h5>
                        <p className="text-sm font-bold text-indigo-500 mb-2 italic">
                          "{activeConsulta.mc}"
                        </p>
                        <p className="text-sm leading-relaxed opacity-70 whitespace-pre-wrap">
                          {activeConsulta.evad}
                        </p>
                      </div>
                      <div
                        className={`p-6 rounded-3xl rounded-l-xl border-l-8 h-full ${isDarkMode ? "bg-zinc-900/40 border-emerald-500" : "bg-emerald-50 border-emerald-500 shadow-sm"}`}
                      >
                        <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">
                          <AlertCircle size={12} /> Conducta Médica
                        </h5>
                        <p className="text-sm font-bold opacity-80 whitespace-pre-wrap leading-relaxed">
                          {activeConsulta.cond}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <Stethoscope size={120} />
                  <p className="text-xl font-black uppercase tracking-widest mt-4">
                    Seleccione un Registro
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, isDarkMode }: any) {
  return (
    <div
      className={`px-5 py-3 rounded-2xl flex items-center gap-4 transition-all shadow-sm border ${isDarkMode ? "bg-zinc-900/50 border-zinc-900" : "bg-white border-gray-100"}`}
    >
      <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-[8px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">
          {label}
        </p>
        <p className="text-md font-black leading-none">{value}</p>
      </div>
    </div>
  );
}

function VitalItem({ icon: Icon, label, value, color, bg, isDarkMode }: any) {
  return (
    <div
      className={`p-4 rounded-2xl flex items-start gap-4 shadow-sm ${isDarkMode ? "bg-zinc-800 border-zinc-800" : "bg-white border-gray-100"}`}
    >
      <div className={`p-2 rounded-xl ${bg} ${color}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p
          className={`text-[8px] font-black uppercase tracking-widest mb-1 truncate ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}
        >
          {label}
        </p>
        <p
          className={`text-sm font-black leading-none truncate ${isDarkMode ? "text-white" : "text-zinc-900"}`}
        >
          {value || "--"}
        </p>
      </div>
    </div>
  );
}

export default MostrarConsultas;
