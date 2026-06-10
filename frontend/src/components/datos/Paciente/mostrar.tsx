import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  AlertCircle,
  Search,
  Trash2,
  Fingerprint,
  User,
  X,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  Thermometer,
  Ruler,
  Scale,
  Link2,
  Map as MapIcon,
  Users,
  Plus,
  HeartPulse,
  Activity,
  ClipboardList,
  Menu,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Wind,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import PopoverAnimado from "../../common/PopoverAnimado";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import { ObtenerMedicos, type Medico } from "../../conexion/Paciente/Insertar";
import {
  MostrarConsultasReal,
  type Consulta,
} from "../../conexion/Consulta/Mostrar";
import { EliminarPaciente } from "../../conexion/Paciente/Eliminar";
import type { Theme } from "../../sidebars/Sidebar";
import { ActualizarPacienteComponent } from "./actualizar";
import InsertarPaciente from "./insertar";
import InsertarConsultaForm from "../Consultas/insertar";
import GenerarPDF from "../../common/GenerarPDF";
import { useSocket } from "../../../hooks/useSocket";

interface MostrarPacienteProps {
  theme: Theme;
  refreshTrigger?: number;
}

interface PatientDrawerProps {
  patient: Paciente | null;
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  doctorName?: string;
  onUpdate?: (p: Paciente) => void;
}

const PatientDrawer: React.FC<PatientDrawerProps> = ({
  patient,
  isOpen,
  onClose,
  theme,
  doctorName,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [consultations, setConsultations] = useState<Consulta[]>([]);
  const [selectedConsultaId, setSelectedConsultaId] = useState<number | null>(
    null,
  );

  const isRegistrado = !!localStorage.getItem("usuarioActivo");
  const isDarkMode = theme === "dark";

  const [activePatient, setActivePatient] = useState<Paciente | null>(patient);

  useEffect(() => {
    if (patient) setActivePatient(patient);
  }, [patient]);

  const displayPatient = patient || activePatient;

  const fetchConsultations = async () => {
    if (!displayPatient) return;
    try {
      const allConsultations = await MostrarConsultasReal();
      const patientConsults = allConsultations
        .filter((c) => c.idp === displayPatient.ci && !c.EstadoEliminado)
        .sort(
          (a, b) =>
            new Date(b.fechactual).getTime() - new Date(a.fechactual).getTime(),
        );

      setConsultations(patientConsults);
      if (patientConsults.length > 0) {
        setSelectedConsultaId(patientConsults[0].idc);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  useEffect(() => {
    if (isOpen && displayPatient) {
      fetchConsultations();
    }
  }, [isOpen, displayPatient]);

  const consultaActiva =
    consultations.find((c) => c.idc === selectedConsultaId) || consultations[0];

  const handleClose = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      onClose();
    }
  };

  interface InfoCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number | null | undefined;
    colorClass?: string;
    index?: number;
  }

  const InfoCard = ({
    icon: Icon,
    label,
    value,
    colorClass = "",
    index = 0,
  }: InfoCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isLongText = value && String(value).length > 8;
    const isRightColumn = index % 3 === 2;

    return (
      <div
        className="relative group/info h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex items-center gap-4 p-4 h-full rounded-2xl border transition-all duration-300 ${
            isDarkMode
              ? "bg-zinc-900/50 border-zinc-800 text-zinc-100 hover:border-indigo-500/50 hover:bg-zinc-900"
              : "bg-zinc-50/50 border-zinc-100 text-gray-800 hover:border-blue-500/50 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5"
          }`}
        >
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover/info:scale-110 ${isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-white text-gray-400 shadow-sm"} ${colorClass}`}
          >
            <Icon size={18} />
          </div>
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <span
              className={`text-[9px] font-black uppercase tracking-[0.1em] ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}
            >
              {label}
            </span>
            <span className="text-xs font-bold truncate pr-1">
              {value || "N/A"}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && isLongText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              className={`absolute bottom-[110%] z-[150] min-w-[260px] max-w-[340px] p-5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border backdrop-blur-2xl pointer-events-none ${
                isRightColumn ? "right-0" : "left-0"
              } ${
                isDarkMode
                  ? "bg-zinc-900/95 border-zinc-700 text-white shadow-black/50"
                  : "bg-white/95 border-gray-100 text-gray-900 shadow-blue-500/10"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl ${isDarkMode ? "bg-zinc-800 text-indigo-400" : "bg-blue-50 text-blue-600"}`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <p className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                    {label}
                  </p>
                  <p className="text-sm font-bold leading-relaxed">{value}</p>
                </div>
              </div>
              <div
                className={`absolute -bottom-1.5 w-3 h-3 rotate-45 border-r border-b ${
                  isRightColumn ? "right-8" : "left-8"
                } ${
                  isDarkMode
                    ? "bg-zinc-950 border-zinc-800"
                    : "bg-white border-gray-100"
                }`}
              ></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const latestConsultation = consultations.length > 0 ? consultations[0] : null;
  const [activeTab, setActiveTab] = useState<"evad" | "cond">("evad");

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <AnimatePresence>
      {isOpen && displayPatient && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <div className="flex relative bg-transparent items-stretch h-full w-[96%] pointer-events-none justify-end">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  layout
                  initial={{ x: "60%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{
                    x: "60%",
                    opacity: 0,
                    transition: { duration: 0.2, ease: "easeInOut" },
                  }}
                  transition={{
                    type: "spring",
                    damping: 40,
                    stiffness: 300,
                    mass: 1,
                  }}
                  className={`relative w-[60%] h-full shadow-2xl overflow-hidden pointer-events-auto border-r flex flex-col ${
                    isDarkMode
                      ? "bg-zinc-950/98 border-zinc-800"
                      : "bg-zinc-50/98 border-zinc-200"
                  }`}
                >
                  <div
                    className={`px-8 py-6 border-b flex items-center justify-between backdrop-blur-2xl ${
                      isDarkMode
                        ? "bg-zinc-950/80 border-zinc-800"
                        : "bg-white/80 border-zinc-100"
                    }`}
                  >
                    <div>
                      <h3
                        className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}
                      >
                        Centro de Diagnósticos
                      </h3>
                      <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">
                        Registro de Consultas y Evolución
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {isRegistrado && (
                        <PopoverAnimado
                          id="nueva-consulta-drawer"
                          titulo="Nueva Consulta"
                          direccion="bc"
                          pWidth={840}
                          pHeight={590}
                          triggerWidth={180}
                          triggerHeight={44}
                          theme={theme}
                          triggerClassName="shadow-lg shadow-indigo-500/20"
                          triggerContent={
                            <div
                              className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? "text-white" : "text-cyan-500"}`}
                            >
                              <Plus size={16} strokeWidth={3} />
                              Nueva Consulta
                            </div>
                          }
                        >
                          {({ close }) => (
                            <div className="flex flex-col gap-4">
                              <InsertarConsultaForm
                                theme={theme}
                                patientId={displayPatient.ci}
                                onSuccess={() => {
                                  fetchConsultations();
                                  close();
                                }}
                                onCancel={close}
                                hideHeader={true}
                              />
                            </div>
                          )}
                        </PopoverAnimado>
                      )}
                      <button
                        onClick={() => setIsExpanded(false)}
                        aria-label="Cerrar"
                        className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-zinc-200 text-zinc-500"}`}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden flex">
                    <div
                      className={`w-1/4 border-r overflow-y-auto p-1 custom-scrollbar ${isDarkMode ? "bg-zinc-950/50 border-zinc-900" : "bg-white border-zinc-100"}`}
                    >
                      <div className="relative pl-4 mt-2">
                        <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-zinc-100"></div>
                        <div className="flex flex-col gap-4">
                          {consultations.length > 0 ? (
                            consultations.map((consulta, idx) => {
                              const isSelected =
                                consulta.idc === selectedConsultaId;
                              const { date, time } = formatDateTime(
                                consulta.fechactual,
                              );
                              return (
                                <button
                                  key={consulta.idc}
                                  aria-label="Seleccionar consulta"
                                  onClick={() =>
                                    setSelectedConsultaId(consulta.idc)
                                  }
                                  className="relative text-left group w-full hover:cursor-pointer"
                                >
                                  <div
                                    className={`absolute  -left-[5px] top-5 w-3 h-3 rounded-full border-2 transition-all z-10 ${
                                      isSelected
                                        ? "bg-indigo-600 border-indigo-200 ring-4 ring-indigo-50 scale-125"
                                        : "bg-zinc-300 border-white group-hover:bg-indigo-400"
                                    }`}
                                  ></div>
                                  <div
                                    className={`p-4 rounded-3xl border-2 transition-all ${
                                      isSelected
                                        ? isDarkMode
                                          ? "bg-indigo-500/10 border-indigo-500/30 shadow-sm"
                                          : "bg-indigo-50/40 border-indigo-100 shadow-sm"
                                        : isDarkMode
                                          ? "border-transparent hover:bg-zinc-800/40"
                                          : "border-transparent hover:bg-zinc-50"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-1">
                                      <span
                                        className={`text-[9px] w-[55%] font-black uppercase tracking-wider ${isSelected ? "text-indigo-700" : "text-zinc-400"}`}
                                      >
                                        {date}
                                      </span>
                                      {idx === 0 && (
                                        <span className="px-1.5 w-[45%] text-end py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded-md">
                                          Ultimo registro
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? "text-indigo-900 font-bold" : isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                                    >
                                      {consulta.mc}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1.5 opacity-50">
                                      <Clock size={10} />
                                      <span className="text-[10px] font-medium">
                                        {time}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-zinc-500 text-xs font-bold text-center py-10 uppercase tracking-widest opacity-50">
                              Sin registros
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 pt-3 custom-scrollbar">
                      <AnimatePresence mode="wait">
                        {consultaActiva ? (
                          <motion.div
                            key={consultaActiva.idc}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                          >
                            <div className="grid grid-cols- mb-4 sm:grid-cols-4 gap-4">
                              <VitalCard
                                icon={<HeartPulse />}
                                label="Frecuencia Cardíaca"
                                value={`${consultaActiva.fc} bpm`}
                                color="rose"
                                theme={theme}
                              />
                              <VitalCard
                                icon={<Activity />}
                                label="Presión Arterial"
                                value={consultaActiva.pa}
                                color="indigo"
                                theme={theme}
                              />
                              <VitalCard
                                icon={<Thermometer />}
                                label="Temperatura"
                                value={`${consultaActiva.temp}°C`}
                                color="amber"
                                theme={theme}
                              />
                              <VitalCard
                                icon={<Wind />}
                                label="Frecuencia Respiratoria"
                                value={`${consultaActiva.fr} rpm`}
                                color="cyan"
                                theme={theme}
                              />
                            </div>

                            <div
                              className={`grid grid-cols-3 gap-2 p-6 pt-0 pb-0 mb-3 rounded-3xl border ${isDarkMode ? "border-none" : " border-zinc-100"}`}
                            >
                              <div
                                className={`rounded-3xl py-4 flex items-center border shadow-sm  transition-all hover:shadow-md hover:-translate-y-1 ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800"
                                    : "bg-white border-zinc-100"
                                }`}
                              >
                                <div
                                  className={`p-2.5 ml-1 flex items-center justify-center rounded-2xl ${theme === "dark" ? "bg-zinc-800 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}
                                >
                                  <Ruler size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-center font-black text-zinc-400 uppercase tracking-wider">
                                    Talla
                                  </span>
                                  <span
                                    className={`text-sm text-center font-bold ${theme === "dark" ? "text-zinc-100" : "text-zinc-900"}`}
                                  >
                                    {consultaActiva.talla} cm
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`rounded-3xl px-1 py-4 flex items-center gap-3 border shadow-sm  transition-all hover:shadow-md hover:-translate-y-1 ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800"
                                    : "bg-white border-zinc-100"
                                }`}
                              >
                                <div
                                  className={`p-2.5 flex items-center justify-center rounded-2xl ${theme === "dark" ? "bg-zinc-800 text-fuchsia-400" : "bg-fuchsia-50 text-fuchsia-600"}`}
                                >
                                  <Scale size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-center font-black text-zinc-400 uppercase tracking-wider">
                                    Peso
                                  </span>
                                  <span
                                    className={`text-sm text-center font-bold ${theme === "dark" ? "text-zinc-100" : "text-zinc-900"}`}
                                  >
                                    {consultaActiva.peso} kg
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`rounded-3xl  py-4 flex items-center border shadow-sm  transition-all hover:shadow-md hover:-translate-y-1 ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800"
                                    : "bg-white border-zinc-100"
                                }`}
                              >
                                <div
                                  className={`p-2.5 ml-1 flex items-center justify-center rounded-2xl ${theme === "dark" ? "bg-zinc-800 text-lime-400" : "bg-lime-50 text-lime-600"}`}
                                >
                                  <Calculator size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-center font-black text-zinc-400 uppercase tracking-wider">
                                    Indice masa Corporal
                                  </span>
                                  <span
                                    className={`text-[12.5px] text-center font-bold ${theme === "dark" ? "text-zinc-100" : "text-zinc-900"}`}
                                  >
                                    {consultaActiva.imc} kg/m²
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`rounded-2xl border border-zinc-200 p-5 shadow-sm flex flex-col h-[auto] ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white"}`}
                            >
                              <div className="shrink-0 mb-4">
                                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
                                  Motivo de Consulta
                                </h4>
                                <p className="text-sm font-semibold text-zinc-800 leading-snug line-clamp-2">
                                  "{consultaActiva.mc}"
                                </p>
                              </div>

                              <div className="relative flex border-b border-zinc-200 dark:border-zinc-700">
                                <div
                                  className={`
      absolute bottom-0 h-[2px] w-1/2 bg-blue-500
      transition-all duration-300
      ${activeTab === "cond" ? "translate-x-full" : "translate-x-0"}
    `}
                                />

                                <button
                                  onClick={() => setActiveTab("evad")}
                                  aria-label="Evolución y Diagnóstico"
                                  className={`
      relative z-10 flex-1 flex items-center justify-center gap-2 py-3
      text-sm font-semibold transition-colors
      ${
        activeTab === "evad"
          ? "text-blue-600"
          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      }
    `}
                                >
                                  <Clock size={16} />
                                  Enfermedad Actual
                                </button>

                                <button
                                  onClick={() => setActiveTab("cond")}
                                  aria-label="Conducta"
                                  className={`
      relative z-10 flex-1 flex items-center justify-center gap-2 py-3
      text-sm font-semibold transition-colors
      ${
        activeTab === "cond"
          ? "text-blue-600"
          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      }
    `}
                                >
                                  <ClipboardList size={16} />
                                  Conducta
                                </button>
                              </div>

                              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                {activeTab === "evad" ? (
                                  <div
                                    className={`text-sm leading-relaxed p-1 ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}
                                  >
                                    {consultaActiva.evad}
                                  </div>
                                ) : (
                                  <div
                                    className={`text-sm leading-relaxed p-1 ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}
                                  >
                                    {consultaActiva.cond}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                            <AlertCircle size={60} strokeWidth={1} />
                            <p className="mt-4 font-black uppercase text-xs tracking-[0.3em]">
                              Seleccione una consulta
                            </p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: "100%",
                opacity: 0,
                transition: { duration: 0.2, ease: "easeInOut" },
              }}
              transition={{ type: "spring", damping: 40, stiffness: 300 }}
              className={`relative w-[42%] h-full shadow-2xl flex flex-col pointer-events-auto border-l z-20 overflow-hidden ${
                isDarkMode
                  ? "bg-zinc-950 border-zinc-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`sticky top-0 z-50 px-6 py-2 border-b backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-zinc-950/90 border-zinc-800"
                    : "bg-white/95 border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10">
                    <PopoverAnimado
                      id="header-actions"
                      titulo="Acciones"
                      direccion="br"
                      pWidth={322}
                      pHeight={isRegistrado ? 235 : 168}
                      triggerWidth={40}
                      triggerHeight={40}
                      theme={theme}
                      triggerClassName="rounded-full text-white transition-all flex items-center justify-center p-0"
                      triggerContent={<Menu size={20} />}
                    >
                      {({ close }) => (
                        <div className="flex flex-col gap-2 overflow-hidden">
                          {isRegistrado && (
                            <button
                              style={{
                                filter: "drop-shadow(0 0 0px rgba(0, 0, 0, 0))",
                              }}
                              className={`group flex items-center justify-center rounded-xl font-black text-[11px] uppercase transition-all duration-300 hover:scale-102 active:scale-95  w-full ${
                                isDarkMode
                                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700"
                                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 "
                              }`}
                            >
                              <small
                                className={`text-xs fixed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                              >
                                Actualizar Paciente
                              </small>
                              <PopoverAnimado
                                id={`edit-${displayPatient.ci}`}
                                titulo={`Actualizar Paciente: ${displayPatient.nom}`}
                                direccion="bl"
                                pWidth={840}
                                pHeight={560}
                                theme={theme}
                                triggerWidth={255}
                                triggerHeight={55}
                                triggerContent={"Actualizar Paciente"}
                                triggerClassName={"opacity-0"}
                              >
                                {({ close: innerClose }: any) => (
                                  <div className="mt-4 relative">
                                    <ActualizarPacienteComponent
                                      theme={theme}
                                      paciente={displayPatient}
                                      onSuccess={(updated) => {
                                        onUpdate?.(updated);
                                        innerClose();
                                        close();
                                      }}
                                      onCancel={() => innerClose()}
                                      hideHeader={true}
                                    />
                                  </div>
                                )}
                              </PopoverAnimado>
                            </button>
                          )}
                          <GenerarPDF Id={displayPatient.ci} theme={theme} />
                        </div>
                      )}
                    </PopoverAnimado>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 shadow-lg border ${isDarkMode ? "bg-zinc-900 border-zinc-800 text-blue-400" : "bg-blue-50 border-white text-blue-600 shadow-blue-500/5"}`}
                    >
                      <User size={24} strokeWidth={2.5} />
                    </div>
                    <h2
                      className={`text-base font-black tracking-tighter uppercase leading-none text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {displayPatient.nom} <br className="sm:hidden" />
                      <span className="sm:ml-1">
                        {displayPatient.ap} {displayPatient.am}
                      </span>
                    </h2>
                  </div>

                  <div className="w-10 flex justify-end">
                    <button
                      onClick={handleClose}
                      aria-label="Cerrar"
                      className={`p-2 rounded-full transition-colors ${
                        isDarkMode
                          ? "hover:bg-zinc-800 text-zinc-500 hover:text-white"
                          : "hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                      }`}
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-2 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-2 mb-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-600" : "text-gray-400"}`}
                    >
                      Información Principal
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="text-right relative pr-2">
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-blue-500"></span>
                        <p className="text-[8px] text-zinc-400">Médico</p>
                        <p className="text-[10px] font-bold">
                          {doctorName || "S/D"}
                        </p>
                      </div>

                      <div
                        className={`p-2 rounded-xl border ${
                          isDarkMode
                            ? "bg-blue-900/20 border-blue-800/30"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        <Briefcase
                          size={18}
                          className={
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCard
                      icon={User}
                      label="Edad"
                      value={`${displayPatient.edad} años`}
                      index={0}
                    />
                    <InfoCard
                      icon={CreditCard}
                      label="Carnet"
                      value={displayPatient.ci}
                      index={1}
                    />
                    <InfoCard
                      icon={Briefcase}
                      label="Ocupación"
                      value={displayPatient.ocu}
                      index={2}
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Nacimiento"
                      value={
                        displayPatient.fech
                          ? new Date(displayPatient.fech).toLocaleDateString(
                              "es-ES",
                            )
                          : "N/A"
                      }
                      index={3}
                    />
                    <InfoCard
                      icon={Phone}
                      label="Celular"
                      value={String(displayPatient.cel)}
                      index={4}
                    />
                    <InfoCard
                      icon={Link2}
                      label="Procedencia"
                      value={displayPatient.pro}
                      index={5}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Residencia"
                      value={displayPatient.res}
                      index={6}
                    />
                    <InfoCard
                      icon={MapIcon}
                      label="Dirección"
                      value={displayPatient.dir}
                      index={7}
                    />
                    <InfoCard
                      icon={Users}
                      label="Tutor"
                      value={displayPatient.nomt}
                      index={8}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? "text-zinc-700" : "text-gray-500"}`}
                    >
                      Signos Vitales
                    </p>
                    {latestConsultation && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                      >
                        Última:{" "}
                        {new Date(
                          latestConsultation.fechactual,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 ">
                    <div
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-3 ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800"
                          : "bg-indigo-50 border-indigo-100"
                      }`}
                    >
                      <Thermometer size={24} className="text-cyan-500" />
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-bold uppercase ${isDarkMode ? "text-zinc-500" : "text-indigo-400"}`}
                        >
                          Temperatura
                        </p>
                        <p
                          className={`text-sm font-black ${isDarkMode ? "text-white" : "text-indigo-900"}`}
                        >
                          {latestConsultation
                            ? `${latestConsultation.temp}°`
                            : "--"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-4 pb-0 rounded-2xl border flex flex-col items-center gap-3 ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800"
                          : "bg-emerald-50 border-emerald-100"
                      }`}
                    >
                      <Scale size={24} className="text-emerald-500" />
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-bold uppercase ${isDarkMode ? "text-zinc-500" : "text-emerald-400"}`}
                        >
                          Peso
                        </p>
                        <p
                          className={`text-sm font-black ${isDarkMode ? "text-white" : "text-emerald-900"}`}
                        >
                          {latestConsultation
                            ? `${latestConsultation.peso} kg`
                            : "--"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-4 pb-0 rounded-2xl border flex flex-col items-center gap-3 ${
                        isDarkMode
                          ? "bg-zinc-900 border-zinc-800"
                          : "bg-amber-50 border-amber-100"
                      }`}
                    >
                      <Ruler size={24} className="text-amber-500" />
                      <div className="text-center">
                        <p
                          className={`text-[8px] font-bold uppercase ${isDarkMode ? "text-zinc-500" : "text-amber-400"}`}
                        >
                          Talla
                        </p>
                        <p
                          className={`text-sm font-black ${isDarkMode ? "text-white" : "text-amber-900"}`}
                        >
                          {latestConsultation
                            ? `${latestConsultation.talla} cm`
                            : "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-0 pt-0 grid grid-cols-2 gap-4 ${isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-100 bg-white"}`}
                >
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label="Consultas"
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl border-l-4 transition-all duration-300 shadow-sm active:scale-95 ${
                      isExpanded
                        ? isDarkMode
                          ? "border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          : "border-rose-500 bg-rose-50 text-rose-600 hover:bg-rose-100"
                        : isDarkMode
                          ? "border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                          : "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider">
                      <ChevronLeft
                        size={18}
                        className={`transition-transform duration-500 ${isExpanded ? "-rotate-180" : "rotate-0"}`}
                      />
                      <span>
                        {isExpanded ? "Cerrar Panel" : "Ver Consultas"}
                      </span>
                    </div>
                    {isExpanded ? <X size={18} /> : <FileText size={18} />}
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${displayPatient.cel}`,
                        "_blank",
                      )
                    }
                    aria-label="WhatsApp"
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl border-l-4 transition-all duration-300 shadow-sm active:scale-95 ${
                      isDarkMode
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider">
                      <Phone size={18} />
                      <span>Contactar</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

function VitalCard({
  icon,
  label,
  value,
  color,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "rose" | "indigo" | "amber" | "cyan" | "emerald" | "fuchsia" | "lime";
  theme: Theme;
}) {
  const isDarkMode = theme === "dark";
  const colorStyles = {
    rose: "bg-rose-50 text-rose-600 border-rose-100 ring-rose-50",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 ring-indigo-50",
    amber: "bg-amber-50 text-amber-600 border-amber-100 ring-amber-50",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100 ring-cyan-50",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-50",
    fuchsia:
      "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 ring-fuchsia-50",
    lime: "bg-lime-50 text-lime-600 border-lime-100 ring-lime-50",
  };

  return (
    <div
      className={`rounded-3xl p-4 w-full border shadow-sm flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1 ${
        isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 border ring-4 ${colorStyles[color]}`}
      >
        {icon}
      </div>
      <div className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.1em] mb-1">
        {label}
      </div>
      <div
        className={`text-sm font-black ${isDarkMode ? "text-white" : "text-zinc-800"}`}
      >
        {value}
      </div>
    </div>
  );
}

import { PacienteSkeleton } from "../../common/skeleton";

export function MostrarPaciente({
  theme,
  refreshTrigger,
}: MostrarPacienteProps) {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Paciente[]>([]);
  const [doctores, setDoctores] = useState<Medico[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = theme === "dark";
  const isRegistrado = !!localStorage.getItem("usuarioActivo");

  const { showToast } = useToast();

  const loadPatients = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const patientsData = await MostrarPacientes();
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleDelete = async (ci: number) => {
    const originalPatients = [...patients];
    setPatients((prev) => prev.filter((p) => p.ci !== ci));

    try {
      await EliminarPaciente(ci);
      showToast("Paciente enviado a la papelera.", "success");
      loadPatients(true);
      window.dispatchEvent(new Event("update-borrados-count"));
    } catch (error) {
      setPatients(originalPatients);
      showToast("Error al eliminar paciente.", "warning");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [patientsData, doctorsData] = await Promise.all([
          MostrarPacientes(),
          ObtenerMedicos(),
        ]);
        setPatients(patientsData);
        setFilteredPatients(patientsData);
        setDoctores(doctorsData);
      } catch (err) {
        showToast("Error al cargar datos", "warning");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const obtenerNombreDoctor = (matricula: string): string => {
    const doctor = doctores.find((doc) => doc.mat === matricula);
    return doctor ? `${doctor.apd} ${doctor.nomd}` : "Cargando...";
  };

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      `${patient.nom} ${patient.ap} ${patient.am} ${patient.ci}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      loadPatients(true); // mejor silent
    };

    socket.on("actualizar_datos", handleUpdate);

    return () => {
      socket.off("actualizar_datos", handleUpdate);
    };
  }, [socket]);

  const handlePatientClick = (patient: Paciente) => {
    setSelectedPatient(patient);
  };

  const closeDrawer = () => {
    setSelectedPatient(null);
  };

  if (isLoading) {
    return <PacienteSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div
      className={`h-full p-2 overflow-y-auto custom-scrollbar transition-colors duration-300 ${isDarkMode ? "text-zinc-100" : "text-gray-800"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-200 text-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20">
            <User size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-emerald-500">
              PACIENTES
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
              Gestión de Pacientes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className="flex-1 sm:flex-none sm:w-80 relative"
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
              placeholder="Buscar pacientes..."
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
              {patients
                .slice(-5)
                .reverse()
                .map((paciente, index) => (
                  <option
                    key={index}
                    value={`${paciente.nom} ${paciente.ap} ${paciente.am}`}
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
          {isRegistrado && (
            <div
              className="shrink-0"
              style={{ filter: "drop-shadow(0 0 3px #059669)" }}
            >
              <PopoverAnimado
                id="paciente-insert"
                titulo="Nuevo Paciente"
                direccion="bl"
                pWidth={840}
                pHeight={560}
                theme={theme}
              >
                {({ close }: any) => (
                  <div className="mt-4 relative">
                    <div className="absolute -top-12 right-0 opacity-10">
                      <Plus size={80} />
                    </div>
                    <InsertarPaciente
                      theme={theme}
                      pacientesExistentes={patients}
                      onSuccess={() => {
                        loadPatients(true);
                        close();
                      }}
                      onCancel={close}
                      hideHeader={true}
                    />
                  </div>
                )}
              </PopoverAnimado>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <motion.div
                layout
                key={patient.ci}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                  scale: 0.95,
                  transition: {
                    duration: 0.5,
                  },
                }}
                whileHover={{
                  scale: 1.005,
                  transition: { duration: 0.15 },
                }}
                onClick={() => handlePatientClick(patient)}
                className={`group border rounded-2xl p-5 cursor-pointer transition-all backdrop-blur-sm shadow-sm ${
                  isDarkMode
                    ? "bg-zinc-900/40 hover:bg-zinc-900/60 border-zinc-800/50 shadow-indigo-500/5"
                    : "bg-white hover:bg-gray-50 border-gray-100/50 shadow-gray-200/40"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-6 items-center">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isDarkMode
                          ? "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white"
                          : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                      }`}
                    >
                      <User size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3
                        className={`text-xl font-bold transition-colors ${isDarkMode ? "text-zinc-100 group-hover:text-white" : "text-gray-800 group-hover:text-gray-900"}`}
                      >
                        {patient.ap} {patient.am} {patient.nom}
                      </h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <p
                          className={`${isDarkMode ? "text-zinc-500" : "text-gray-500"} flex items-center gap-1.5`}
                        >
                          <Fingerprint
                            size={14}
                            className={
                              isDarkMode ? "text-zinc-600" : "text-gray-400"
                            }
                          />{" "}
                          CI:{" "}
                          <span
                            className={
                              isDarkMode ? "text-zinc-300" : "text-gray-700"
                            }
                          >
                            {patient.ci}
                          </span>
                        </p>
                        <p
                          className={`${isDarkMode ? "text-zinc-500" : "text-gray-500"} flex items-center gap-1.5`}
                        >
                          <Clock
                            size={14}
                            className={
                              isDarkMode ? "text-zinc-600" : "text-gray-400"
                            }
                          />{" "}
                          Edad:{" "}
                          <span
                            className={
                              isDarkMode ? "text-zinc-300" : "text-gray-700"
                            }
                          >
                            {patient.edad} años
                          </span>
                        </p>
                        <div
                          className={`flex items-center space-x-1.5 ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
                        >
                          <AlertCircle
                            size={14}
                            className={
                              isDarkMode ? "text-zinc-600" : "text-gray-400"
                            }
                          />
                          <span>
                            Médico:{" "}
                            <span
                              className={
                                isDarkMode ? "text-zinc-300" : "text-gray-700"
                              }
                            >
                              {obtenerNombreDoctor(patient.matm)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                        isDarkMode
                          ? "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 group-hover:border-indigo-500/30 group-hover:text-indigo-400"
                          : "bg-gray-100 text-gray-500 border-gray-200 group-hover:border-indigo-200 group-hover:text-indigo-600"
                      }`}
                    >
                      {patient.res}
                    </span>
                    {isRegistrado && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center"
                      >
                        <PopoverAnimado
                          id={`delete-${patient.ci}`}
                          titulo="¿Eliminar Paciente?"
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
                                Esta acción enviará a{" "}
                                <strong>
                                  {patient.nom} {patient.ap}
                                </strong>{" "}
                                a la papelera. ¿Deseas continuar?
                              </p>
                              <div className="flex gap-3 mt-auto relative z-10">
                                <button
                                  onClick={() => close()}
                                  aria-label="Cancelar"
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
                                    handleDelete(patient.ci);
                                    close();
                                  }}
                                  aria-label="Eliminar"
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
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`py-20 text-center border border-dashed rounded-3xl ${isDarkMode ? "text-zinc-600 bg-zinc-900/20 border-zinc-800" : "text-gray-400 bg-gray-50/50 border-gray-200"}`}
            >
              <Search size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No se encontraron pacientes disponibles</p>
              <p className="text-sm mt-2">
                Intenta buscar con otros términos o registra un nuevo paciente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PatientDrawer
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={closeDrawer}
        theme={theme}
        doctorName={
          selectedPatient ? obtenerNombreDoctor(selectedPatient.matm) : ""
        }
        onUpdate={(updated) => {
          setSelectedPatient(updated);
          loadPatients(true);
        }}
      />
    </div>
  );
}

export default MostrarPaciente;
