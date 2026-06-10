import React, { useState, useEffect } from "react";
import Sidebar, {
  type Theme,
  type ColorTheme,
} from "./components/sidebars/Sidebar";
import { MostrarPaciente } from "./components/datos/Paciente/mostrar";
import { InsertarPaciente } from "./components/datos/Paciente/insertar";
import { MostrarDoctor } from "./components/datos/Doctor/mostrar";
import { UnifiedPapelera } from "./components/datos/Papelera/index";
import { MostrarConsultas } from "./components/datos/Consultas/mostrar";
import { MostrarInventario } from "./components/datos/Inventario/mostrar";
import { MostrarDescargoAdministracion } from "./components/datos/DescargoAdministracion/mostrar";
import { MostrarMedicamentoExterno } from "./components/datos/MedicamentoExterno/mostrar";
import { LoginView } from "./components/datos/Usuario/login";
import { GestionUsuarios } from "./components/datos/Usuario/gestion";
import { PerfilUsuario } from "./components/datos/Usuario/perfil";
import { ToastProvider } from "./components/common/ToastContext";

import InsertarDoctor from "./components/datos/Doctor/insertar";
import InsertarConsultaForm from "./components/datos/Consultas/insertar";
import InsertarInventarioForm from "./components/datos/Inventario/insertar";
import InsertarDescargoForm from "./components/datos/DescargoAdministracion/insertar";
import InsertarExternoForm from "./components/datos/MedicamentoExterno/insertar";
import { PantallaInicio } from "./components/datos/Inicio";
import { AnimatePresence, motion } from "framer-motion";

import "./App.css";
import MostrarConsultas2 from "./components/datos/Consultas/mostrar2";

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
  const [activeItem, setActiveItem] = useState("Inicio");
  const [registrado, setRegistrado] = useState(
    !!localStorage.getItem("usuarioActivo"),
  );
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const ustr = localStorage.getItem("userObject");
      if (ustr) {
        const u = JSON.parse(ustr);
        setIsAdmin(u.tipo === "administrador");
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  }, [registrado]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [vistaConsulta, setVistaConsulta] = useState("consultas");

  const [inventoryThreshold, setInventoryThreshold] = useState(() => {
    const saved = localStorage.getItem("inventoryThreshold");
    return saved ? parseInt(saved) : 15;
  });

  useEffect(() => {
    localStorage.setItem("inventoryThreshold", inventoryThreshold.toString());
  }, [inventoryThreshold]);

  const isDarkContent = theme === "dark";
  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleQuickAction = () => {
    handleRefresh();
  };

  React.useEffect(() => {
    setActiveItem("Inicio");
  }, [registrado]);

  const bgLight = {
    blue: "bg-blue-500/18",
    red: "bg-red-500/18",
    green: "bg-green-500/18",
    fuchsia: "bg-[#d946ef]/8",
  };

  const bgDark = "bg-zinc-900";

  const scrollbarStyles: Record<string, string> = {
    blue: [
      "[&::-webkit-scrollbar]:w-[7px]",
      "[&::-webkit-scrollbar-track]:rounded-full",
      "[&::-webkit-scrollbar-thumb]:rounded-full",
      isDarkContent
        ? "[&::-webkit-scrollbar-track]:bg-blue-500/[0.06] [&::-webkit-scrollbar-thumb]:bg-blue-500/50 [&::-webkit-scrollbar-thumb:hover]:bg-blue-400"
        : "[&::-webkit-scrollbar-track]:bg-blue-500/[0.08] [&::-webkit-scrollbar-thumb]:bg-blue-500/40 [&::-webkit-scrollbar-thumb:hover]:bg-blue-600/70",
    ].join(" "),
    red: [
      "[&::-webkit-scrollbar]:w-[7px]",
      "[&::-webkit-scrollbar-track]:rounded-full",
      "[&::-webkit-scrollbar-thumb]:rounded-full",
      isDarkContent
        ? "[&::-webkit-scrollbar-track]:bg-red-500/[0.06] [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb:hover]:bg-red-400"
        : "[&::-webkit-scrollbar-track]:bg-red-500/[0.08] [&::-webkit-scrollbar-thumb]:bg-red-500/40 [&::-webkit-scrollbar-thumb:hover]:bg-red-600/70",
    ].join(" "),
    green: [
      "[&::-webkit-scrollbar]:w-[7px]",
      "[&::-webkit-scrollbar-track]:rounded-full",
      "[&::-webkit-scrollbar-thumb]:rounded-full",
      isDarkContent
        ? "[&::-webkit-scrollbar-track]:bg-green-500/[0.06] [&::-webkit-scrollbar-thumb]:bg-green-500/50 [&::-webkit-scrollbar-thumb:hover]:bg-green-400"
        : "[&::-webkit-scrollbar-track]:bg-green-500/[0.08] [&::-webkit-scrollbar-thumb]:bg-green-500/40 [&::-webkit-scrollbar-thumb:hover]:bg-green-600/70",
    ].join(" "),
    fuchsia: [
      "[&::-webkit-scrollbar]:w-[7px]",
      "[&::-webkit-scrollbar-track]:rounded-full",
      "[&::-webkit-scrollbar-thumb]:rounded-full",
      isDarkContent
        ? "[&::-webkit-scrollbar-track]:bg-fuchsia-500/[0.06] [&::-webkit-scrollbar-thumb]:bg-fuchsia-500/50 [&::-webkit-scrollbar-thumb:hover]:bg-fuchsia-400"
        : "[&::-webkit-scrollbar-track]:bg-fuchsia-500/[0.08] [&::-webkit-scrollbar-thumb]:bg-fuchsia-500/40 [&::-webkit-scrollbar-thumb:hover]:bg-fuchsia-600/70",
    ].join(" "),
  };

  return (
    <ToastProvider>
      <div
        data-theme={theme}
        className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 ${isDarkContent ? "bg-zinc-950 text-zinc-100" : "bg-gray-50 text-gray-800"}`}
      >
        <Sidebar
          theme={theme}
          setTheme={setTheme}
          colorTheme={colorTheme}
          setColorTheme={setColorTheme}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          registrado={registrado}
          setRegistrado={setRegistrado}
          onAddMember={handleQuickAction}
          inventoryThreshold={inventoryThreshold}
          setInventoryThreshold={setInventoryThreshold}
        />

        <main
          className={`flex-1 flex flex-col h-full relative ${theme === "dark" ? bgDark : bgLight[colorTheme]} ${activeItem === "Consultas" ? "overflow-hidden" : "overflow-auto"} ${scrollbarStyles[colorTheme]}`}
        >
          <div
            className={`p-8 pt-2 w-full pb-0 mb-0  mt-0 ${activeItem === "Consultas" ? "h-full flex flex-col" : ""}`}
          >
            <header
              key={activeItem + "-header"}
              className="mb-2 animate-in h-[95vh] fade-in slide-in-from-bottom-4 duration-500"
            >
              {(() => {
                switch (true) {
                  case activeItem === "Inicio":
                    return (
                      <PantallaInicio
                        setActiveItem={setActiveItem}
                        inventoryThreshold={inventoryThreshold}
                        theme={theme}
                      />
                    );
                  case activeItem === "Pacientes":
                    return (
                      <>
                        <MostrarPaciente
                          theme={theme}
                          refreshTrigger={refreshTrigger}
                        />
                      </>
                    );
                  case activeItem === "Doctores":
                    return registrado && isAdmin ? (
                      <MostrarDoctor
                        theme={theme}
                        refreshTrigger={refreshTrigger}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Datos Eliminados":
                    return registrado && isAdmin ? (
                      <UnifiedPapelera theme={theme} />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Gestion de Usuarios":
                    return registrado && isAdmin ? (
                      <GestionUsuarios
                        theme={theme}
                        setRegistrado={setRegistrado}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Consultas":
                    return (
                      <>
                        <div
                          className={`fixed top-4 right-45 flex items-center gap-1 p-1 rounded-2xl border z-50 overflow-hidden ${
                            theme === "dark"
                              ? "bg-zinc-900 border-zinc-800"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                            }}
                            className={`absolute top-1 bottom-1 rounded-xl shadow-sm ${
                              vistaConsulta === "consultas"
                                ? "left-1 right-[50%]"
                                : "left-[50%] right-1"
                            } ${
                              theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                            }`}
                          />

                          <button
                            onClick={() => setVistaConsulta("consultas")}
                            className={`relative z-10 px-4 h-11 rounded-xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 flex-1 ${
                              vistaConsulta === "consultas"
                                ? theme === "dark"
                                  ? "text-white"
                                  : "text-zinc-800"
                                : theme === "dark"
                                  ? "text-zinc-400 hover:text-zinc-200"
                                  : "text-zinc-500 hover:text-zinc-700"
                            }`}
                          >
                            Consultas por paciente
                          </button>

                          <button
                            onClick={() => setVistaConsulta("consultas2")}
                            className={`relative z-10 px-4 h-10 rounded-xl text-sm font-medium whitespace-nowrap transition-all active:scale-95 flex-1 ${
                              vistaConsulta === "consultas2"
                                ? theme === "dark"
                                  ? "text-white"
                                  : "text-zinc-800"
                                : theme === "dark"
                                  ? "text-zinc-400 hover:text-zinc-200"
                                  : "text-zinc-500 hover:text-zinc-700"
                            }`}
                          >
                            Consultas por calendario
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={vistaConsulta}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{
                              duration: 0.25,
                              ease: "easeInOut",
                            }}
                            className="h-full"
                          >
                            {vistaConsulta === "consultas2" ? (
                              <MostrarConsultas2 theme={theme} />
                            ) : (
                              <MostrarConsultas theme={theme} />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </>
                    );
                  case activeItem === "Inventario":
                    return <MostrarInventario theme={theme} />;
                  case activeItem === "Descargo Administracion":
                    return <MostrarDescargoAdministracion theme={theme} />;
                  case activeItem === "Medicamento Externo":
                    return <MostrarMedicamentoExterno theme={theme} />;
                  case activeItem === "Login":
                    return (
                      <div className="max-w-md mx-auto py-10 animate-in zoom-in-95 duration-300">
                        <LoginView
                          theme={theme}
                          onLogin={() => {
                            setRegistrado(true);
                            setActiveItem("Inicio");
                          }}
                        />
                      </div>
                    );
                  // Casos para Inserción Directa
                  case activeItem === "Insertar:Paciente":
                    return registrado ? (
                      <InsertarPaciente
                        theme={theme}
                        onSuccess={() => setActiveItem("Pacientes")}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Insertar:Consulta":
                    return registrado ? (
                      <InsertarConsultaForm
                        theme={theme}
                        onSuccess={() => setActiveItem("Consultas")}
                        onCancel={() => setActiveItem("Consultas")}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Insertar:Inventario":
                    return registrado ? (
                      <InsertarInventarioForm
                        theme={theme}
                        onSuccess={() => setActiveItem("Inventario")}
                        onCancel={() => setActiveItem("Inventario")}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Insertar:Descargo":
                    return registrado ? (
                      <InsertarDescargoForm
                        theme={theme}
                        onSuccess={() =>
                          setActiveItem("Descargo Administracion")
                        }
                        onCancel={() =>
                          setActiveItem("Descargo Administracion")
                        }
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Insertar:MedExterno":
                    return registrado ? (
                      <InsertarExternoForm
                        theme={theme}
                        onSuccess={() => setActiveItem("Medicamento Externo")}
                        onCancel={() => setActiveItem("Medicamento Externo")}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Insertar:Doctor":
                    return registrado && isAdmin ? (
                      <InsertarDoctor
                        theme={theme}
                        onSuccess={() => setActiveItem("Doctores")}
                        onCancel={() => setActiveItem("Doctores")}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  case activeItem === "Ajustes:Perfil":
                    return registrado ? (
                      <PerfilUsuario
                        theme={theme}
                        usuarioActivo={
                          localStorage.getItem("usuarioActivo") || ""
                        }
                        onSuccess={() => {
                          // Opcional: manejar acciones tras éxito
                        }}
                      />
                    ) : (
                      <div className="max-w-md mx-auto">
                        <LoginView
                          theme={theme}
                          onLogin={() => setRegistrado(true)}
                        />
                      </div>
                    );
                  default:
                    return (
                      <PantallaInicio
                        setActiveItem={setActiveItem}
                        inventoryThreshold={inventoryThreshold}
                        theme={theme}
                      />
                    );
                }
              })()}
            </header>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
