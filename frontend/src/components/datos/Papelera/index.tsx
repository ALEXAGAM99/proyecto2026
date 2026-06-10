import { useState } from "react";
import { Trash2, Users, Stethoscope, Calendar, Package } from "lucide-react";
import type { Theme } from "../../sidebars/Sidebar";

import { PacientesPapelera } from "../Paciente/papelera";
import { PapeleraDoctor } from "../Doctor/papelera";
import { ConsultasPapelera } from "../Consultas/papelera";
import { InventarioPapelera } from "../Inventario/papelera";
import { MedicamentoExternoPapelera } from "../MedicamentoExterno/papelera";
import { DescargoAdministracionPapelera } from "../DescargoAdministracion/papelera";

interface UnifiedPapeleraProps {
  theme: Theme;
}

type PapeleraSection =
  | "Doctor"
  | "Pacientes"
  | "Consultas"
  | "Inventario"
  | "Med. Externo"
  | "Descargos";

export function UnifiedPapelera({ theme }: UnifiedPapeleraProps) {
  const [activeSection, setActiveSection] = useState<PapeleraSection>("Doctor");
  const isDarkMode = theme === "dark";

  const tabs: { label: PapeleraSection; icon: any }[] = [
    { label: "Doctor", icon: Stethoscope },
    { label: "Pacientes", icon: Users },
    { label: "Consultas", icon: Calendar },
    { label: "Inventario", icon: Package },
    { label: "Med. Externo", icon: Package },
    { label: "Descargos", icon: Trash2 },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Doctor":
        return <PapeleraDoctor theme={theme} />;
      case "Pacientes":
        return <PacientesPapelera theme={theme} />;
      case "Consultas":
        return <ConsultasPapelera theme={theme} />;
      case "Inventario":
        return <InventarioPapelera theme={theme} />;
      case "Med. Externo":
        return <MedicamentoExternoPapelera theme={theme} />;
      case "Descargos":
        return <DescargoAdministracionPapelera theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-full space-y-8 animate-in fade-in duration-500 ${isDarkMode ? "text-zinc-100" : "text-gray-800"}`}
    >
      <div className="flex flex-col mt-5 md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1
            className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}
          >
            <Trash2 size={40} className="drop-shadow-2xl" />
            Papelera Unificada
          </h1>
          <p
            className={`${isDarkMode ? "text-zinc-500" : "text-gray-500"} text-sm mt-2 font-medium max-w-xl`}
          >
            Centro de recuperación y gestión de registros eliminados. Seleccione
            una categoría para gestionar los datos inactivos.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.label;
          return (
            <button
              key={tab.label}
              aria-label="Seleccionar categoría"
              onClick={() => setActiveSection(tab.label)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? "bg-red-500 text-white shadow-xl shadow-red-500/20"
                  : isDarkMode
                    ? "bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700"
                    : "bg-white text-gray-400 border border-gray-100 shadow-sm hover:shadow-md"
              }`}
            >
              <Icon size={18} className={isActive ? "animate-pulse" : ""} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pb-5">{renderActiveSection()}</div>
    </div>
  );
}
