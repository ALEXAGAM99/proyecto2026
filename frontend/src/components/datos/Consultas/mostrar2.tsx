import { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Activity,
  Plus,
  HeartPulse,
  Calendar,
  AlertCircle,
  Thermometer,
  User,
  Calculator,
  Scale,
  Wind,
  Ruler,
} from "lucide-react";

import PopoverAnimado from "../../common/PopoverAnimado";
import { useToast } from "../../common/ToastContext";

import {
  MostrarConsultasReal,
  type Consulta,
} from "../../conexion/Consulta/Mostrar";

import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";

import InsertarConsultaForm from "./insertar";

import type { Theme } from "../../sidebars/Sidebar";

interface MostrarConsultasProps {
  theme: Theme;
}

export function MostrarConsultas2({ theme }: MostrarConsultasProps) {
  const { showToast } = useToast();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const isDarkMode = theme === "dark";
  const isRegistrado = !!localStorage.getItem("usuarioActivo");

  const loadData = async () => {
    try {
      const [consultasData, patientsData] = await Promise.all([
        MostrarConsultasReal(),
        MostrarPacientes(),
      ]);

      setConsultas((consultasData || []).filter((c) => !c.EstadoEliminado));

      setPacientes((patientsData || []).filter((p) => !p.EstadoEliminado));
    } catch (error) {
      console.error(error);
      showToast("Error cargando las consultas", "warning");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  const goToDate = (dateString: string) => {
    if (!dateString) return;

    const [year, month, day] = dateString.split("-");

    setCurrentDate(
      new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    );
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const todayRef = useRef<HTMLDivElement | null>(null);

  const consultasByDate = useMemo(() => {
    const map: Record<string, Consulta[]> = {};

    consultas.forEach((c) => {
      if (!c.fechactual) return;

      let dateStr = "";

      try {
        const rawDate = c.fechactual.split(" ")[0].split("T")[0];

        if (rawDate.includes("/")) {
          const parts = rawDate.split("/");

          if (parts[0].length === 4) {
            dateStr = `${parts[0]}-${parts[1].padStart(
              2,
              "0",
            )}-${parts[2].padStart(2, "0")}`;
          } else {
            dateStr = `${parts[2]}-${parts[1].padStart(
              2,
              "0",
            )}-${parts[0].padStart(2, "0")}`;
          }
        } else if (rawDate.includes("-")) {
          const parts = rawDate.split("-");

          if (parts[0].length === 4) {
            dateStr = `${parts[0]}-${parts[1].padStart(
              2,
              "0",
            )}-${parts[2].padStart(2, "0")}`;
          } else {
            dateStr = `${parts[2]}-${parts[1].padStart(
              2,
              "0",
            )}-${parts[0].padStart(2, "0")}`;
          }
        }
      } catch {
        dateStr = c.fechactual.split("T")[0];
      }

      if (!map[dateStr]) {
        map[dateStr] = [];
      }

      map[dateStr].push(c);
    });

    return map;
  }, [consultas]);

  const getFormattedDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };
  const [highlightToday, setHighlightToday] = useState(false);

  return (
    <div
      className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${
        isDarkMode ? "text-zinc-100" : "text-gray-800"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 pt-2">
        <div
          className={`flex flex-wrap items-center gap-2 p-2 rounded-2xl border shadow-sm ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800"
              : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={prevMonth}
            title="Mes anterior"
            aria-label="Mes anterior"
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              isDarkMode
                ? "hover:bg-zinc-800 text-zinc-300"
                : "hover:bg-gray-100 text-zinc-600"
            }`}
          >
            <ChevronLeft size={17} />
          </button>

          <div
            className={`px-3 text-sm sm:text-base font-bold ${
              isDarkMode ? "text-zinc-100" : "text-zinc-800"
            }`}
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>

          <button
            onClick={nextMonth}
            title="Mes siguiente"
            aria-label="Mes siguiente"
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              isDarkMode
                ? "hover:bg-zinc-800 text-zinc-300"
                : "hover:bg-gray-100 text-zinc-600"
            }`}
          >
            <ChevronRight size={17} />
          </button>

          <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />

          <button
            onClick={() => {
              goToDate(new Date().toISOString().split("T")[0]);

              setTimeout(() => {
                todayRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 100);

              setHighlightToday(true);

              setTimeout(() => {
                setHighlightToday(false);
              }, 2000);
            }}
            className={`h-9 px-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              isDarkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                : "bg-gray-100 hover:bg-gray-200 text-zinc-700"
            }`}
          >
            Hoy
          </button>

          <div
            className={`flex items-center gap-2 px-3 h-9 rounded-xl ${
              isDarkMode ? "bg-zinc-900" : "bg-gray-100"
            }`}
          >
            <CalendarIcon
              size={14}
              className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}
            />

            <input
              type="date"
              className={`bg-transparent outline-none text-sm ${
                isDarkMode ? "[color-scheme:dark]" : "[color-scheme:light]"
              }`}
              value={`${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1,
              ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
                2,
                "0",
              )}`}
              onChange={(e) => goToDate(e.target.value)}
            />
          </div>
        </div>

        {/* NUEVA CONSULTA */}
        {isRegistrado && (
          <div className="-mt-1">
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
          </div>
        )}
      </div>

      {/* CALENDARIO */}
      <div
        className={`flex flex-col flex-1 min-h-0 rounded-3xl z-8 shadow-xl ${
          isDarkMode
            ? "bg-zinc-950/40 border-zinc-800"
            : "bg-gray-100 border-gray-100"
        }`}
      >
        {/* WEEK */}
        <div className="grid grid-cols-7 gap-3 mb-3">
          {weekDays.map((d) => (
            <div
              key={d}
              className="text-center text-[14px] font-black mt-3 uppercase tracking-wider text-zinc-500"
            >
              {d}
            </div>
          ))}
        </div>

        {/* GRID */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 pl-3">
          <div className="grid grid-cols-7 gap-3 auto-rows-[80px]">
            {/* BLANKS */}
            {blanks.map((b) => (
              <div
                key={b}
                className={`rounded-2xl border h-[84px] ${
                  isDarkMode
                    ? "bg-zinc-900/20 border-zinc-800/40"
                    : "bg-gray-50 border-gray-200/50"
                }`}
              />
            ))}

            {days.map((d) => {
              const dateStr = getFormattedDate(d);
              const dayConsultas = consultasByDate[dateStr] || [];
              const activeConsultas = dayConsultas.filter((c) =>
                pacientes.some((p) => p.ci === c.idp),
              );
              const today = new Date();
              const isToday =
                today.getDate() === d &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear();
              const hasConsultas = activeConsultas.length > 0;

              const baseClasses =
                "relative h-[84px] rounded-2xl border p-3 flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50";

              const borderClasses = isDarkMode
                ? `${isToday ? `border-blue-700` : ``}`
                : "border-blue-200 hover:border-blue-300";

              const backgroundClasses = isToday
                ? "bg-transparent"
                : isDarkMode
                  ? "bg-zinc-900"
                  : "bg-white";

              const highlightClasses =
                highlightToday && isToday
                  ? "ring-4 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.9)] scale-105"
                  : "";

              const cellClasses = `${baseClasses} ${borderClasses} ${backgroundClasses} ${highlightClasses}`;

              const cellInside = (
                <>
                  <div className="absolute top-3 left-3">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm font-black ${
                        isToday
                          ? "bg-blue-500 text-white"
                          : isDarkMode
                            ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                            : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      }`}
                    >
                      {d}
                    </div>
                  </div>

                  {/* NUMERO GRANDE */}
                  <div className="absolute top-[-12px] right-2 pointer-events-none">
                    <span
                      className={`text-[70px] font-black opacity-[0.05] ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {d}
                    </span>
                  </div>

                  <div className="flex flex-col mt-2 w-30 px-1 mx-0 gap-1">
                    {[...dayConsultas]
                      .filter((consulta) =>
                        pacientes.some((p) => p.ci === consulta.idp),
                      )
                      .slice(-2)
                      .map((consulta) => {
                        const paciente = pacientes.find(
                          (p) => p.ci === consulta.idp,
                        );

                        return (
                          <div
                            key={consulta.idc}
                            className={`flex items-center justify-between rounded-sm border z-22 px-2 py-1 shadow-sm ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-100 border-zinc-200"}`}
                          >
                            <p
                              className={`truncate text-[9px] text-left ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}
                            >
                              {paciente?.nom} {paciente?.ap}
                            </p>

                            <span
                              className={`ml-1 text-[10px] ${isDarkMode ? "text-zinc-400" : "text-zinc-700"}`}
                            >
                              ›
                            </span>
                          </div>
                        );
                      })}
                  </div>

                  <div className="absolute bottom-2 right-2">
                    {activeConsultas.length > 0 ? (
                      <div
                        className={`flex items-center gap-1.5 rounded-full border-1 px-2.5 py-1 text-[10px] font-black shadow-sm backdrop-blur-md transition-all duration-300 ${
                          isDarkMode
                            ? "border-zinc-700 bg-zinc-900/80 text-zinc-200"
                            : "border-slate-700/30 bg-white/90 text-zinc-700"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

                        <span className="leading-none">
                          {activeConsultas.length} consulta
                          {activeConsultas.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              );

              if (hasConsultas) {
                return (
                  <PopoverAnimado
                    key={d}
                    id={`day-${d}`}
                    titulo={` `}
                    direccion={`${
                      Math.floor((blanks.length + d - 1) / 7) <
                      Math.ceil((blanks.length + days.length) / 7) / 2
                        ? "b"
                        : "t"
                    }${
                      (blanks.length + d - 1) % 7 < 3
                        ? "r"
                        : (blanks.length + d - 1) % 7 === 3
                          ? "c"
                          : "l"
                    }`}
                    pWidth={450}
                    pHeight={Math.min(500, 120 + activeConsultas.length * 75)}
                    triggerWidth={125}
                    triggerHeight={84}
                    theme={theme}
                    triggerClassName={
                      cellClasses +
                      `${isToday ? "border-5 border-blue-400" : ""}`
                    }
                    triggerContent={cellInside}
                  >
                    {() => (
                      <div className="flex flex-col h-full overflow-hidden">
                        {/* HEADER */}
                        <div
                          className={` absolute top-5 left-5 z-20 flex items-center gap-1.5 rounded-xl px-2.5 py-1 backdrop-blur-md border shadow-sm ${
                            isDarkMode
                              ? "bg-zinc-900/80 border-zinc-700 text-zinc-100"
                              : "bg-white/90 border-zinc-200 text-zinc-700"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? "bg-emerald-400" : "bg-emerald-500"}`}
                          />

                          <span className="text-[14px] font-bold tracking-wide whitespace-nowrap">
                            {activeConsultas.length}
                            <span
                              className={`ml-1 font-medium ${
                                isDarkMode ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              consulta{activeConsultas.length > 1 ? "s" : ""}
                            </span>
                          </span>
                        </div>

                        {/* LISTA */}
                        <div className="flex-1 overflow-y-auto mt-3 custom-scrollbar space-y-2">
                          {dayConsultas.map((c, i) => {
                            const paciente = pacientes.find(
                              (p) => p.ci === c.idp,
                            );

                            if (!paciente) return null;

                            return (
                              <PopoverAnimado
                                key={c.idc || i}
                                id={`consulta-${c.idc}`}
                                titulo={
                                  <div className={` border-0 bg-transparent`}>
                                    <div className="flex items-center gap-2 overflow-hidden text-xs">
                                      <div
                                        className={`w-8 h-8 shrink-0 rounded-2xl flex items-center justify-center ${
                                          isDarkMode
                                            ? "bg-indigo-500/15 text-indigo-400"
                                            : "bg-indigo-100 text-indigo-600"
                                        }`}
                                      >
                                        <User size={24} />
                                      </div>

                                      <div className="flex items-center justify-between  w-70 tracking-normal truncate gap-2">
                                        <h2
                                          className="font-black text-base "
                                          title={`${paciente?.nom} ${paciente?.ap}`}
                                        >
                                          {paciente?.nom} {paciente?.ap}
                                        </h2>

                                        <p
                                          className={`text-base whitespace-nowrap shrink-0 pr-2 ${
                                            isDarkMode
                                              ? "text-zinc-400"
                                              : "text-zinc-500"
                                          }`}
                                        >
                                          CI: {paciente?.ci || "-"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                }
                                direccion={`${
                                  Math.floor((blanks.length + d - 1) / 7) <
                                  Math.ceil((blanks.length + days.length) / 7) /
                                    2
                                    ? "b"
                                    : "t"
                                }${
                                  (blanks.length + d - 1) % 7 < 2
                                    ? "r"
                                    : (blanks.length + d - 1) % 7 < 5
                                      ? "c"
                                      : "l"
                                }`}
                                pWidth={700}
                                pHeight={580}
                                triggerWidth={380}
                                triggerHeight={50}
                                theme={theme}
                                triggerClassName={`w-full rounded-xl border-4 p-4 px-0 overflow-hidden transition-all duration-300 ${
                                  isDarkMode
                                    ? "bg-zinc-900 border-zinc-800 hover:border-indigo-500/40"
                                    : "bg-white border-zinc-200 hover:border-indigo-300"
                                }`}
                              >
                                {() => (
                                  <div
                                    className={`flex flex-col gap-3 w-full p-2 pt-4`}
                                  >
                                    {/* INFO */}
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10 space-y-6">
                                      {/* Grid 1: Signs */}
                                      <div className="grid grid-cols-3 gap-3">
                                        <VitalItem
                                          icon={Activity}
                                          label="P. Arterial"
                                          value={c.pa}
                                          color="text-cyan-500"
                                          bg="bg-cyan-500/10"
                                          isDarkMode={isDarkMode}
                                        />
                                        <VitalItem
                                          icon={HeartPulse}
                                          label="F. Cardíaca"
                                          value={`${c.fc} bpm`}
                                          color="text-rose-500"
                                          bg="bg-rose-500/10"
                                          isDarkMode={isDarkMode}
                                        />
                                        <VitalItem
                                          icon={Wind}
                                          label="F. Respira."
                                          value={`${c.fr} rpm`}
                                          color="text-blue-500"
                                          bg="bg-blue-500/10"
                                          isDarkMode={isDarkMode}
                                        />
                                        <VitalItem
                                          icon={Thermometer}
                                          label="Temperatura"
                                          value={`${c.temp}°C`}
                                          color="text-orange-500"
                                          bg="bg-orange-500/10"
                                          isDarkMode={isDarkMode}
                                        />
                                        <VitalItem
                                          icon={Scale}
                                          label="Peso"
                                          value={`${c.peso} kg`}
                                          color="text-indigo-500"
                                          bg="bg-indigo-500/10"
                                          isDarkMode={isDarkMode}
                                        />
                                        <VitalItem
                                          icon={Ruler}
                                          label="Talla"
                                          value={`${c.talla} cm`}
                                          color="text-emerald-500"
                                          bg="bg-emerald-500/10"
                                          isDarkMode={isDarkMode}
                                        />
                                      </div>

                                      {/* IMC Dashboard */}
                                      <div
                                        className={`p-0 rounded-xl px-2 border ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-slate-100 border-gray-100 shadow-sm"} flex items-center justify-between`}
                                      >
                                        <div className="flex items-center gap-4 ">
                                          <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIMCCategory(c.imc).bg} ${getIMCCategory(c.imc).color}`}
                                          >
                                            <Calculator size={30} />
                                          </div>
                                          <div>
                                            <p
                                              className={`text-[12px] font-black uppercase tracking-widest ${isDarkMode ? "text-slate-200" : ""}`}
                                            >
                                              Índice de Masa Corporal
                                            </p>
                                            <p
                                              className={`text-2xl font-black ${getIMCCategory(c.imc).color}`}
                                            >
                                              {Number(c.imc || 0).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                        <div
                                          className={`px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest ${getIMCCategory(c.imc).bg} ${getIMCCategory(c.imc).color} ${getIMCCategory(c.imc).border.replace("border-", "border-opacity-30 border-")}`}
                                        >
                                          {getIMCCategory(c.imc).text}
                                        </div>
                                      </div>

                                      {/* Notes */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                          className={`p-6 rounded-3xl h-full ${isDarkMode ? "bg-zinc-900 text-slate-200" : "bg-slate-100 shadow-sm"}`}
                                        >
                                          <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                            <Calendar size={12} /> Enfermedad
                                            Actual
                                          </h5>
                                          <p className="text-sm font-bold text-indigo-500 mb-2 italic">
                                            "{c.mc}"
                                          </p>
                                          <p className="text-sm leading-relaxed opacity-70 whitespace-pre-wrap">
                                            {c.evad}
                                          </p>
                                        </div>
                                        <div
                                          className={`p-6 rounded-3xl h-full ${isDarkMode ? "bg-zinc-900 border-emerald-500" : "bg-slate-100 shadow-sm"}`}
                                        >
                                          <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">
                                            <AlertCircle size={12} /> Conducta
                                            Médica
                                          </h5>
                                          <p
                                            className={`text-sm font-bold opacity-80 whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-slate-200" : ""}`}
                                          >
                                            {c.cond}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </PopoverAnimado>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PopoverAnimado>
                );
              }

              return (
                <div
                  key={d}
                  ref={isToday ? todayRef : null}
                  className={cellClasses}
                >
                  {cellInside}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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
function VitalItem({ icon: Icon, label, value, color, bg, isDarkMode }: any) {
  return (
    <div
      className={`p-4 rounded-2xl flex items-start gap-4 shadow-sm ${isDarkMode ? "bg-zinc-800 border-zinc-800" : "bg-slate-100 border-gray-100"}`}
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

export default MostrarConsultas2;
