import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  BarChart2,
  Clock,
  FileSpreadsheet,
  Home,
} from "lucide-react";
import { createChart, AreaSeries } from "lightweight-charts";

// Importaciones de servicios
import { MostrarPacientes, type Paciente } from "../conexion/Paciente/Mostrar";
import {
  MostrarConsultasReal,
  type Consulta,
} from "../conexion/Consulta/Mostrar";
import {
  MostrarMedicamentosReal,
  type Medicamento,
} from "../conexion/Inventario/Mostrar";
import {
  MostrarDescargosReal,
  type DescargoAdministracion,
} from "../conexion/DescargoAdministracion/Mostrar";
import { DashboardSkeleton } from "../common/skeleton";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "indigo" | "emerald" | "blue" | "rose";
  alert?: boolean;
}

function KpiCard({
  icon,
  label,
  value,
  color,
  alert,
  isDark,
}: KpiCardProps & { isDark: boolean }) {
  const colorClasses = {
    indigo: "bg-indigo-500/10 text-indigo-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
    rose: "bg-rose-500/10 text-rose-600",
  };

  return (
    <div
      className={`p-5 transition-transform duration-300 hover:scale-102 rounded-3xl border flex items-center gap-4 ${alert ? "ring-2 ring-rose-500/20" : ""} ${isDark ? "bg-zinc-900/50 border-zinc-800 shadow-sm" : "bg-white border-zinc-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"}`}
    >
      <div
        className={`p-3 rounded-2xl ${colorClasses[color].split(" ")[0]} ${colorClasses[color].split(" ")[1]}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-[10px] uppercase font-black tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
        >
          {label}
        </p>
        <p
          className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-zinc-800"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

import type { Theme } from "../sidebars/Sidebar";

interface PantallaInicioProps {
  setActiveItem: (item: string) => void;
  inventoryThreshold: number;
  theme: Theme;
}

export function PantallaInicio({
  setActiveItem,
  inventoryThreshold,
  theme,
}: PantallaInicioProps) {
  const isDark = theme === "dark";

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [descargos, setDescargos] = useState<DescargoAdministracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7 DIAS");

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [p, c, m, d] = await Promise.all([
          MostrarPacientes(),
          MostrarConsultasReal(),
          MostrarMedicamentosReal(),
          MostrarDescargosReal(),
        ]);
        setPacientes(p);
        setConsultas(c);
        setMedicamentos(m);
        setDescargos(d);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);

    const normalized =
      typeof dateStr === "string" ? dateStr.replace("Z", "") : dateStr;
    const date = new Date(normalized);

    if (!isNaN(date.getTime())) return date;

    const baseDate = String(dateStr).split("T")[0].split(" ")[0];

    if (baseDate.includes("-")) {
      const [year, month, day] = baseDate.split("-").map(Number);
      return new Date(year, month - 1, day);
    } else if (baseDate.includes("/")) {
      const [day, month, year] = baseDate.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
    return date;
  };

  const totalPacientes = pacientes.filter((p) => !p.EstadoEliminado).length;
  const consultasHoy = consultas.filter((c) => {
    if (c.EstadoEliminado) return false;
    const date = getLocalDate(c.fechactual);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }).length;
  const chartData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
    });
    const income = descargos
      .filter((desc) => {
        if (desc.EstadoEliminado) return false;
        const descDate = getLocalDate(desc.fechi || desc.fechactual);
        return descDate.toDateString() === d.toDateString();
      })
      .reduce((acc, curr) => acc + Number(curr.costo || 0), 0);
    return { name: label, ingresos: income };
  });

  const ingresosSemanales = chartData.reduce(
    (acc, curr) => acc + curr.ingresos,
    0,
  );

  const alertasInventario = medicamentos.filter(
    (i) => !i.EstadoEliminado && i.numex < inventoryThreshold,
  ).length;

  const ingresosData = useMemo(() => {
    return [...Array(365)].map((_, i) => {
      const d = new Date();

      d.setDate(d.getDate() - (364 - i));

      const total = descargos
        .filter((desc) => {
          if (desc.EstadoEliminado) return false;

          const fecha = getLocalDate(desc.fechi || desc.fechactual);

          return fecha.toDateString() === d.toDateString();
        })
        .reduce((acc, curr) => acc + Number(curr.costo), 0);

      return {
        time: d.toISOString().split("T")[0],
        value: total,
      };
    });
  }, [descargos]);
  const ranges = useMemo(
    () => ({
      "7 DIAS": 7,
      "30 DIAS": 30,
      "90 DIAS": 90,
      "180 DIAS": 180,
      "1 AÑO": 365,
    }),
    [],
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: {
          color: isDark ? "#09090b" : "#ffffff",
        },
        textColor: isDark ? "#71717a" : "#52525b",
      },
      grid: {
        vertLines: {
          color: isDark ? "#27272a" : "#e4e4e7",
        },
        horzLines: {
          color: isDark ? "#27272a" : "#e4e4e7",
        },
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#4f46e5",
      topColor: "rgba(79,70,229,0.4)",
      bottomColor: "rgba(79,70,229,0.05)",
    });

    const filteredData = ingresosData.slice(
      -ranges[range as keyof typeof ranges],
    );
    series.setData(filteredData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth || 0,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [isDark, range, ingresosData, ranges]);

  if (loading) {
    return <DashboardSkeleton isDarkMode={isDark} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex flex-col gap-6 pb-10 min-h-full pt-8 px-0 py-0 transition-colors duration-300 ${isDark ? "bg-zinc-950 text-white" : "bg-transparent text-gray-900"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl text-indigo-500 shadow-lg ${isDark ? "bg-indigo-200 shadow-indigo-950/40" : "bg-indigo-200 shadow-indigo-100"}`}
          >
            <Home size={24} />
          </div>
          <div>
            <h1
              className={`text-2xl font-black tracking-tight text-indigo-500`}
            >
              Inicio
            </h1>
            <p
              className={`text-sm font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
            >
              Panel principal con el resumen general y estadísticas de la
              clínica.
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm w-fit ${isDark ? "bg-zinc-900/40 border-zinc-800 text-zinc-400" : "bg-white border-zinc-50 text-zinc-600"}`}
        >
          <Clock size={18} className="text-indigo-500" />
          <span className="text-sm font-bold">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Users />}
          label="Pacientes Registrados"
          value={totalPacientes}
          color="indigo"
          isDark={isDark}
        />
        <KpiCard
          icon={<ClipboardList />}
          label="Consultas (Hoy)"
          value={consultasHoy}
          color="emerald"
          isDark={isDark}
        />
        <KpiCard
          icon={<TrendingUp />}
          label="Ingresos (7 días)"
          value={`Bs. ${ingresosSemanales.toFixed(2)}`}
          color="blue"
          isDark={isDark}
        />
        <KpiCard
          icon={<AlertTriangle />}
          label="Alertas Farmacia"
          value={alertasInventario}
          color="rose"
          alert={alertasInventario > 0}
          isDark={isDark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div
          className={`lg:col-span-2 rounded-2xl shadow-sm border px-auto overflow-hidden flex flex-col h-[420px] ${isDark ? "bg-zinc-900/30 border-zinc-900" : "bg-white border-zinc-50"}`}
        >
          <div
            className={`p-5 pb-1 border-b flex justify-between items-center shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}
          >
            <h3
              className={`font-bold flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              <BarChart2 size={18} className="text-blue-500" /> Ingresos por
              Descargos ({range})
            </h3>
          </div>
          <div className="w-full  p-5 min-w-0">
            <div className="flex gap-2 mb-4 flex-wrap">
              {Object.keys(ranges).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    range === r
                      ? "bg-indigo-600 text-white"
                      : isDark
                        ? "bg-zinc-800"
                        : "bg-zinc-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div ref={chartContainerRef} className="w-full h-[240px]" />
          </div>
        </div>

        <div
          className={`rounded-2xl shadow-sm border overflow-hidden flex flex-col h-[420px] ${isDark ? "bg-zinc-900/30 border-zinc-900" : "bg-white border-zinc-50"}`}
        >
          <div
            className={`p-5 border-b shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}
          >
            <h3
              className={`font-bold flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              <AlertTriangle size={18} className="text-amber-500" /> Alertas de
              Bajo Stock
            </h3>
          </div>
          <div className="p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1">
            {medicamentos.filter(
              (i) => !i.EstadoEliminado && i.numex < inventoryThreshold,
            ).length === 0 ? (
              <div
                className={`text-center py-8 text-sm font-medium ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                No hay medicamentos con bajo stock.
              </div>
            ) : (
              medicamentos
                .filter(
                  (i) => !i.EstadoEliminado && i.numex < inventoryThreshold,
                )
                .map((item) => (
                  <div
                    key={item.codm}
                    className={`p-3 rounded-xl flex flex-col gap-1.5 shrink-0 border transition-all duration-200 ${
                      item.numex < 5
                        ? isDark
                          ? "bg-red-500/5 border-red-500/20"
                          : "bg-red-50 border-red-200"
                        : isDark
                          ? "bg-amber-500/5 border-amber-500/20"
                          : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4
                        className={`font-bold text-sm ${item.numex < 5 ? (isDark ? "text-red-400" : "text-red-500") : isDark ? "text-amber-400" : "text-amber-500"}`}
                      >
                        {item.nomm}
                      </h4>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          item.numex < 5
                            ? "bg-red-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {item.numex < 5 ? "Alerta" : "Bajo"}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mt-1">
                      <div>
                        <div
                          className={`text-[9px] uppercase font-bold tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
                        >
                          Stock
                        </div>
                        <div
                          className={`text-base font-black leading-none mt-0.5 ${isDark ? "text-white" : "text-zinc-800"}`}
                        >
                          {item.numex}{" "}
                          <span className="text-[10px] font-medium opacity-70 italic">
                            u.
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-[9px] uppercase font-bold tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
                        >
                          Precio
                        </div>
                        <div
                          className={`text-sm font-bold leading-none mt-0.5 ${isDark ? "text-white" : "text-zinc-800"}`}
                        >
                          Bs. {item.precio}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          className={`rounded-2xl lg:col-span-5 shadow-sm border overflow-hidden flex flex-col ${isDark ? "bg-zinc-900/30 border-zinc-900" : "bg-white border-zinc-50"}`}
        >
          <div
            className={`p-5 border-b flex justify-between items-center shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}
          >
            <h3
              className={`font-bold flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              <Clock size={18} className="text-indigo-500" /> Consultas
              Recientes
            </h3>
            <button
              onClick={() => setActiveItem("Consultas")}
              className="text-xs font-bold bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
            >
              Ver Todas
            </button>
          </div>
          <div
            className={`divide-y overflow-y-auto max-h-[400px] custom-scrollbar ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}
          >
            {consultas
              .filter((c) => !c.EstadoEliminado)
              .sort(
                (a, b) =>
                  getLocalDate(b.fechactual).getTime() -
                  getLocalDate(a.fechactual).getTime(),
              )
              .slice(0, 10)
              .map((consulta) => {
                const paciente = pacientes.find((p) => p.ci === consulta.idp);
                return (
                  <div
                    key={consulta.idc}
                    className={`p-4 transition-colors flex items-center justify-between ${isDark ? "hover:bg-zinc-800/40" : "hover:bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700"}`}
                      >
                        {paciente?.nom[0]}
                        {paciente?.ap[0]}
                      </div>
                      <div>
                        <p
                          className={`font-bold text-sm ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                        >
                          {paciente?.nom} {paciente?.ap}
                        </p>
                        <p
                          className={`text-xs line-clamp-1 max-w-[200px] sm:max-w-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
                        >
                          {consulta.mc}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span
                        className={`text-xs font-bold block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                      >
                        {getLocalDate(consulta.fechactual).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-200/60 text-zinc-600"}`}
                      >
                        {getLocalDate(consulta.fechactual).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div
          className={`rounded-2xl lg:col-span-7 shadow-sm border overflow-hidden flex flex-col ${isDark ? "bg-zinc-900/30 border-zinc-900" : "bg-white border-zinc-50"}`}
        >
          <div
            className={`p-5 border-b flex justify-between items-center shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}
          >
            <h3
              className={`font-bold flex items-center gap-2 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
            >
              <FileSpreadsheet size={18} className="text-emerald-500" /> Últimos
              Descargos (Admin)
            </h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead
                className={`text-[10px] uppercase font-black tracking-widest sticky top-0 z-10 ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-50 text-zinc-500"}`}
              >
                <tr>
                  <th className="px-5 py-4">Paciente</th>
                  <th className="px-5 py-4">Medicamento</th>
                  <th className="px-5 py-4 text-center">Cant.</th>
                  <th className="px-5 py-4 text-right">Costo</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}
              >
                {descargos
                  .filter((d) => !d.EstadoEliminado)
                  .sort(
                    (a, b) =>
                      new Date(b.fechactual).getTime() -
                      new Date(a.fechactual).getTime(),
                  )
                  .slice(0, 10)
                  .map((descargo) => {
                    const paciente = pacientes.find(
                      (p) => p.ci === descargo.idp,
                    );
                    const med = medicamentos.find(
                      (m) => m.codm === descargo.codm,
                    );
                    return (
                      <tr
                        key={descargo.idd}
                        className={`transition-colors ${isDark ? "hover:bg-zinc-800/40" : "hover:bg-zinc-50"}`}
                      >
                        <td className="px-5 py-3">
                          <p
                            className={`font-bold text-xs capitalize ${isDark ? "text-zinc-200" : "text-zinc-900"}`}
                          >
                            {paciente
                              ? `${paciente.nom} ${paciente.ap}`
                              : "Desconocido"}
                          </p>
                        </td>
                        <td className="px-2 py-3">
                          <p
                            className={`text-xs font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"}`}
                          >
                            {med?.nomm || `Cod: ${descargo.codm}`}
                          </p>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span
                            className={`text-xs font-black px-2 py-1 rounded-lg ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"}`}
                          >
                            {descargo.cant}
                          </span>
                        </td>
                        <td
                          className={`px-2 py-5 text-right font-black text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                        >
                          Bs. {Number(descargo.costo).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
