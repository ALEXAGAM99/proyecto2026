import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Trash,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Lock,
  Sun,
  Moon,
  Contrast,
  Home,
  Package,
  Stethoscope,
  ClipboardCheck,
  Pill,
  Contact,
  Calendar,
  UserPlus,
  Command,
  X,
  Layout,
  RefreshCcw,
  GripVertical,
  ShieldCheck,
} from "lucide-react";
import arbol from "../../assets/arbol.png";
import { ContarTodosBorrados } from "../datos/Papelera/borrados";
import { useToast } from "../common/ToastContext";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { LoginView } from "../datos/Usuario/login";
import InsertarDoctor from "../datos/Doctor/insertar";
import { LogoutUsuario } from "../conexion/Usuario/Acceso";
import {
  startCircleTransition,
  getElementCenter,
} from "../../hooks/useCircleTransition";

export type Theme = "light" | "dark" | "hybrid";
export type ColorTheme = "blue" | "red" | "green" | "fuchsia";

interface SaaSSidebarProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (color: ColorTheme) => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
  customSearchData?: any[];
  onAddMember?: () => void;
  registrado: boolean;
  setRegistrado: (reg: boolean) => void;
  inventoryThreshold: number;
  setInventoryThreshold: (val: number) => void;
}

export default function Sidebar({
  theme,
  setTheme,
  colorTheme,
  setColorTheme,
  activeItem,
  setActiveItem,
  customSearchData = [],
  onAddMember,
  registrado,
  setRegistrado,
  inventoryThreshold,
  setInventoryThreshold,
}: SaaSSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, text: "", top: 0 });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthPopover, setShowAuthPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [borradosCount, setBorradosCount] = useState<number>(0);
  const { showToast } = useToast();
  const [isEditingSidebar, setIsEditingSidebar] = useState(false);
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

  const DEFAULT_MAIN_ORDER = [
    "Inicio",
    "Pacientes",
    "Consultas",
    "Inventario",
    "Descargo Administracion",
    "Medicamento Externo",
  ];

  const DEFAULT_ADMIN_ORDER = ["Doctores", "Datos Eliminados"];

  const [mainOrder, setMainOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem("sidebarMainOrder");
    return saved ? JSON.parse(saved) : DEFAULT_MAIN_ORDER;
  });

  const [adminOrder, setAdminOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem("sidebarAdminOrder");
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_ORDER;
  });

  const handleRestoreSidebar = () => {
    setMainOrder(DEFAULT_MAIN_ORDER);
    setAdminOrder(DEFAULT_ADMIN_ORDER);
    localStorage.setItem(
      "sidebarMainOrder",
      JSON.stringify(DEFAULT_MAIN_ORDER),
    );
    localStorage.setItem(
      "sidebarAdminOrder",
      JSON.stringify(DEFAULT_ADMIN_ORDER),
    );
    setIsEditingSidebar(false);
    showToast("Orden del sidebar restaurado con éxito", "success");
  };

  const handlePersonalize = () => {
    setIsEditingSidebar(!isEditingSidebar);
    if (!isEditingSidebar) {
      showToast(
        "Modo edición: Arrastra los elementos para reordenar",
        "primary",
      );
    } else {
      showToast("Cambios guardados", "success");
    }
  };

  useEffect(() => {
    localStorage.setItem("sidebarMainOrder", JSON.stringify(mainOrder));
    localStorage.setItem("sidebarAdminOrder", JSON.stringify(adminOrder));
  }, [mainOrder, adminOrder]);

  useEffect(() => {
    const fetchCount = async () => {
      const total = await ContarTodosBorrados();
      setBorradosCount(total);
    };
    fetchCount();

    window.addEventListener("update-borrados-count", fetchCount);

    const interval = setInterval(fetchCount, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("update-borrados-count", fetchCount);
    };
  }, []);

  const isDarkSidebar = theme === "dark" || theme === "hybrid";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const baseSearchData = [
    ...(registrado && isAdmin
      ? [
          {
            id: "nav-1",
            title: "Doctores",
            category: "Navegación (Admin)",
            icon: User,
            action: () => setActiveItem("Doctores"),
          },
          {
            id: "nav-2",
            title: "Datos Eliminados",
            category: "Navegación (Admin)",
            icon: Trash,
            action: () => setActiveItem("Datos Eliminados"),
          },
          {
            id: "nav-9",
            title: "Auditoría Global",
            category: "Navegación (Admin)",
            icon: Lock,
            action: () => setActiveItem("Gestion de Usuarios"),
          },
        ]
      : []),
    {
      id: "nav-3",
      title: "Inicio",
      category: "Navegación",
      icon: Home,
      action: () => setActiveItem("Inicio"),
    },
    {
      id: "nav-4",
      title: "Pacientes",
      category: "Navegación",
      icon: Contact,
      action: () => setActiveItem("Pacientes"),
    },
    {
      id: "nav-5",
      title: "Consultas",
      category: "Navegación",
      icon: Calendar,
      action: () => setActiveItem("Consultas"),
    },
    {
      id: "nav-6",
      title: "Inventario",
      category: "Navegación",
      icon: Contact,
      action: () => setActiveItem("Inventario"),
    },
    {
      id: "nav-7",
      title: "Descargo Administracion",
      category: "Navegación",
      icon: Contact,
      action: () => setActiveItem("Descargo Administracion"),
    },
    {
      id: "nav-8",
      title: "Medicamento Externo",
      category: "Navegación",
      icon: Contact,
      action: () => setActiveItem("Medicamento Externo"),
    },
    ...(registrado
      ? [
          {
            id: "act-1",
            title: "Registrar Nuevo Usuario",
            category: "Acciones",
            icon: UserPlus,
            action: () => {
              setShowAuthPopover(true);
              setIsSearchOpen(false);
            },
          },
        ]
      : []),
    {
      id: "act-2",
      title: "Registrar Nuevo Paciente",
      category: "Acciones",
      icon: UserPlus,
      action: () => {
        if (!registrado) {
          setShowAuthPopover(true);
          setIsSearchOpen(false);
          return;
        }
        setActiveItem("Insertar:Paciente");
        if (onAddMember) onAddMember();
      },
    },
    {
      id: "act-3",
      title: "Registrar Nueva Consulta",
      category: "Acciones",
      icon: Stethoscope,
      action: () => {
        if (!registrado) {
          setShowAuthPopover(true);
          setIsSearchOpen(false);
          return;
        }
        setActiveItem("Insertar:Consulta");
        if (onAddMember) onAddMember();
      },
    },
    {
      id: "act-4",
      title: "Registrar Inventario",
      category: "Acciones",
      icon: Package,
      action: () => {
        if (!registrado) {
          setShowAuthPopover(true);
          setIsSearchOpen(false);
          return;
        }
        setActiveItem("Insertar:Inventario");
        if (onAddMember) onAddMember();
      },
    },
    {
      id: "act-5",
      title: "Nueva Descargo Administracion",
      category: "Acciones",
      icon: ClipboardCheck,
      action: () => {
        if (!registrado) {
          setShowAuthPopover(true);
          setIsSearchOpen(false);
          return;
        }
        setActiveItem("Insertar:Descargo");
        if (onAddMember) onAddMember();
      },
    },
    {
      id: "act-6",
      title: "Registrar Medicamento Externo",
      category: "Acciones",
      icon: Pill,
      action: () => {
        if (!registrado) {
          setShowAuthPopover(true);
          setIsSearchOpen(false);
          return;
        }
        setActiveItem("Insertar:MedExterno");
        if (onAddMember) onAddMember();
      },
    },
    {
      id: "act-7",
      title: "Registrar Doctor",
      category: "Acciones",
      icon: UserPlus,
      action: () => {
        if (!registrado) {
          setShowAuthPopover(true);
          setIsSearchOpen(false);
          return;
        }
        if (!isAdmin) {
          showToast("Rol no autorizado para esta acción", "warning");
          return;
        }
        setShowAuthPopover(true);
        setIsSearchOpen(false);
      },
    },
    {
      id: "set-1",
      title: "Ver Ajustes y Preferencias",
      category: "Sistema",
      icon: Settings,
      action: () => setIsSettingsOpen(true),
    },
    ...(registrado
      ? [
          {
            id: "set-1-b",
            title: "Mi Perfil Personal",
            category: "Sistema",
            icon: User,
            action: () => setActiveItem("Ajustes:Perfil"),
          },
        ]
      : []),
    {
      id: "set-2",
      title: "Cambiar a Tema Oscuro",
      category: "Apariencia",
      icon: Moon,
      action: () => setTheme("dark"),
    },
    {
      id: "set-3",
      title: "Cambiar a Tema Claro",
      category: "Apariencia",
      icon: Sun,
      action: () => setTheme("light"),
    },
    {
      id: "set-4",
      title: "Cambiar a Tema Híbrido",
      category: "Apariencia",
      icon: Contrast,
      action: () => setTheme("hybrid"),
    },
    {
      id: "col-1",
      title: "Interfaz: Color Azul",
      category: "Apariencia",
      icon: Layout,
      action: () => setColorTheme("blue"),
    },
    {
      id: "col-2",
      title: "Interfaz: Color Rojo",
      category: "Apariencia",
      icon: Layout,
      action: () => setColorTheme("red"),
    },
    {
      id: "col-3",
      title: "Interfaz: Color Verde",
      category: "Apariencia",
      icon: Layout,
      action: () => setColorTheme("green"),
    },
    {
      id: "col-4",
      title: "Interfaz: Color Fuchsia",
      category: "Apariencia",
      icon: Layout,
      action: () => setColorTheme("fuchsia"),
    },
    {
      id: "sys-1",
      title: registrado ? "Cerrar Sesión Activa" : "Acceso Sistema (Login)",
      category: "Sistema",
      icon: registrado ? X : ShieldCheck,
      action: async () => {
        if (registrado) {
          try {
            const sesionId = localStorage.getItem("sesionId");
            if (sesionId) await LogoutUsuario(sesionId);
          } catch (err) {
            console.error("Error al notificar salida", err);
          }
          localStorage.removeItem("usuarioActivo");
          localStorage.removeItem("sesionId");
          localStorage.removeItem("contraseñaActivo");
          localStorage.setItem("registrado", "false");
          setRegistrado(false);
          setActiveItem("Inicio");
          setIsSettingsOpen(false);
          showToast("Sesión cerrada correctamente", "primary");
        } else {
          setShowAuthPopover(true);
          setIsSettingsOpen(false);
        }
      },
    },
  ];

  const searchData = [...baseSearchData, ...customSearchData];

  const filteredResults =
    searchQuery.trim() === ""
      ? searchData.filter((item) =>
          ["nav-3", "nav-4", "act-2", "set-1", "sys-2", "set-2"].includes(
            item.id,
          ),
        )
      : searchData.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const groupedResults = filteredResults.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof searchData>,
  );

  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ show: true, text, top: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  const getAccentColor = () => {
    switch (colorTheme) {
      case "red":
        return "red";
      case "green":
        return "green";
      case "blue":
        return "blue";
      case "fuchsia":
        return "fuchsia";
      default:
        return "blue";
    }
  };

  const accentColor = getAccentColor();

  const renderNavItem = (icon: any, label: string, badge?: string) => {
    const Icon = icon;
    const isActive =
      activeItem === label ||
      (label === "Pacientes" && activeItem.startsWith("Perfil:"));

    const themeStyles = {
      blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-700",
        iconActive: "text-blue-600",
        indicator: "bg-blue-600",
        badgeDark: "bg-blue-500/20 text-blue-400",
        badgeLight: "bg-blue-100 text-blue-700",
      },
      red: {
        bg: "bg-red-500/10",
        text: "text-red-700",
        iconActive: "text-red-600",
        indicator: "bg-red-600",
        badgeDark: "bg-red-500/20 text-red-400",
        badgeLight: "bg-red-100 text-red-700",
      },
      green: {
        bg: "bg-green-500/10",
        text: "text-green-700",
        iconActive: "text-green-600",
        indicator: "bg-green-600",
        badgeDark: "bg-green-500/20 text-green-400",
        badgeLight: "bg-green-100 text-green-700",
      },
      fuchsia: {
        bg: "bg-fuchsia-500/10",
        text: "text-fuchsia-700",
        iconActive: "text-fuchsia-500",
        indicator: "bg-fuchsia-500",
        badgeDark: "bg-fuchsia-500 text-fuchsia-200",
        badgeLight: "bg-fuchsia-100 text-fuchsia-700",
      },
    };

    const currentStyle =
      themeStyles[accentColor as keyof typeof themeStyles] || themeStyles.blue;

    return (
      <div
        className="relative flex items-center justify-center group/item"
        key={label}
        onMouseEnter={(e) => handleMouseEnter(e, label)}
        onMouseLeave={handleMouseLeave}
      >
        {isEditingSidebar && (
          <div
            className={`absolute left-[-8px] cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity z-10 ${isDarkSidebar ? "text-zinc-600" : "text-gray-400"}`}
          >
            <GripVertical size={16} />
          </div>
        )}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (isEditingSidebar) return;
            setActiveItem(label);
            setIsSettingsOpen(false);
          }}
          className={`relative flex items-center w-full py-2.5 rounded-lg font-medium transition-all duration-300 overflow-hidden group ${isCollapsed ? "justify-center px-0" : "px-3"} ${
            isActive
              ? `${currentStyle.bg} ${currentStyle.text}`
              : isDarkSidebar
                ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          } ${isEditingSidebar ? "pointer-events-none" : ""}`}
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${isActive ? `scale-y-100 ${currentStyle.indicator} opacity-100` : "scale-y-0 bg-transparent opacity-0"}`}
          ></div>

          <Icon
            className={`w-5 h-5 shrink-0 ml-0 transition-colors duration-300 ${isActive ? currentStyle.iconActive : isDarkSidebar ? "text-zinc-500 group-hover:text-zinc-300" : "text-gray-400 group-hover:text-gray-600"} ${isCollapsed ? "" : "mr-3 ml-1"}`}
          />

          {!isCollapsed && <span className="truncate ml-[-3px]">{label}</span>}
          {!isCollapsed && badge && (
            <span
              className={`ml-auto py-0.5 px-2 rounded-full text-[10px] font-bold transition-colors duration-300 ${
                isActive
                  ? isDarkSidebar
                    ? currentStyle.badgeDark
                    : currentStyle.badgeLight
                  : isDarkSidebar
                    ? "bg-zinc-900 text-zinc-100"
                    : "bg-gray-100 text-gray-900"
              }`}
            >
              {badge}
            </span>
          )}
        </a>
      </div>
    );
  };

  return (
    <div className="relative h-screen flex z-20">
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-0 bg-transparent"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
      <aside
        className={`h-full flex flex-col transition-all duration-300 relative z-20 ${isCollapsed ? "w-20" : "w-64"} ${isDarkSidebar ? "bg-zinc-950 border-r border-zinc-800" : "bg-white border-r border-gray-200"}`}
      >
        <div
          className={`h-16 flex items-center border-b relative shrink-0 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"} ${isDarkSidebar ? "border-zinc-800" : "border-gray-100"}`}
        >
          <div
            style={{
              boxShadow: `0 0 20px 2px ${accentColor != "fuchsia" ? accentColor : "fuchsia"}`,
            }}
            onClick={() => setActiveItem("Inicio")}
            className={`w-8 h-8 min-w-[2rem] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer`}
          >
            <img
              src={arbol}
              alt="Logo"
              className="w-8 h-8 object-contain"
              style={{
                filter: `drop-shadow(0 0 4px ${accentColor != "fuchsia" ? accentColor : "fuchsia"})`,
              }}
            />
          </div>
          {!isCollapsed && (
            <span
              className={`text-xl font-semibold tracking-tight ml-3 truncate transition-opacity duration-300 ${isDarkSidebar ? "text-zinc-100" : "text-gray-800"}`}
            >
              Cemi
            </span>
          )}

          <button
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              setIsSearchOpen(false);
            }}
            className={`absolute -right-4 top-4 border rounded-full p-2 shadow-sm z-50 transition-transform hover:scale-110 ${isDarkSidebar ? "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200" : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"} hover:cursor-pointer`}
          >
            {isCollapsed ? (
              <ChevronRight
                className={`w-4 h-4 ${
                  accentColor === "blue"
                    ? "text-blue-600"
                    : accentColor === "red"
                      ? "text-red-600"
                      : accentColor === "green"
                        ? "text-green-600"
                        : "text-fuchsia-600"
                } focus:outline-none`}
              />
            ) : (
              <ChevronLeft
                className={`w-4 h-4 ${
                  accentColor === "blue"
                    ? "text-blue-600"
                    : accentColor === "red"
                      ? "text-red-600"
                      : accentColor === "green"
                        ? "text-green-600"
                        : "text-fuchsia-600"
                } focus:outline-none`}
              />
            )}
          </button>
        </div>

        <div
          className={`px-4 pb-4 shrink-0 ${isCollapsed ? "flex justify-center" : ""}`}
        >
          {isCollapsed ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              onMouseEnter={(e) => handleMouseEnter(e, "Buscar (Cmd+K)")}
              onMouseLeave={handleMouseLeave}
              className={`p-2 rounded-lg transition-colors relative ${isSearchOpen ? (isDarkSidebar ? `bg-${accentColor}-500/20 text-${accentColor}-400` : `bg-${accentColor}-50 text-${accentColor}-600`) : isDarkSidebar ? "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800" : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
            >
              <Search className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm transition-all ${isDarkSidebar ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Buscar...</span>
              </div>
              <div
                className={`flex items-center gap-1 text-[12px] font-mono px-1.5 py-0.5 rounded border ${isDarkSidebar ? `bg-zinc-800 border-zinc-700 text-${accentColor}-600` : `bg-gray-100 border-gray-100 border-1 text-gray-400`}`}
              >
                <Command className="w-4 h-4" /> K
              </div>
            </button>
          )}
        </div>

        <nav
          className={`flex-1 px-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pb-4 ${isDarkSidebar ? "[&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700" : "[&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"}`}
        >
          {!isCollapsed &&
            (registrado && isAdmin ? (
              <p
                className={`px-2 text-xs font-bold uppercase tracking-wider mb-2 mt-2 ${isDarkSidebar ? "text-zinc-600" : "text-gray-400"}`}
              >
                Administrador
              </p>
            ) : null)}
          {isCollapsed && <div className="h-2"></div>}

          <Reorder.Group
            axis="y"
            values={adminOrder}
            onReorder={setAdminOrder}
            className="space-y-1 text-sm"
          >
            {adminOrder.map((label) => {
              const content = () => {
                if (label === "Doctores")
                  return registrado && isAdmin
                    ? renderNavItem(User, "Doctores")
                    : null;
                if (label === "Datos Eliminados")
                  return registrado && isAdmin
                    ? renderNavItem(
                        Trash,
                        "Datos Eliminados",
                        `${borradosCount}`,
                      )
                    : null;
                return null;
              };
              const itemContent = content();
              if (!itemContent) return null;

              return (
                <Reorder.Item
                  key={label}
                  value={label}
                  dragListener={isEditingSidebar}
                  className="list-none"
                >
                  {itemContent}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          {!isCollapsed && (
            <p
              className={`px-2 text-xs font-bold uppercase tracking-wider mb-2 mt-6 ${isDarkSidebar ? "text-zinc-600" : "text-gray-400"}`}
            >
              Principal
            </p>
          )}
          {isCollapsed && (
            <div
              className={`h-6 border-b mx-2 mb-4 ${isDarkSidebar ? "border-zinc-800" : "border-gray-100"}`}
            ></div>
          )}

          <Reorder.Group
            axis="y"
            values={mainOrder}
            onReorder={setMainOrder}
            className="space-y-1 text-sm"
          >
            {mainOrder.map((label) => {
              const content = () => {
                if (label === "Inicio") return renderNavItem(Home, "Inicio");
                if (label === "Pacientes")
                  return renderNavItem(Users, "Pacientes");
                if (label === "Consultas")
                  return renderNavItem(Stethoscope, "Consultas");
                if (label === "Inventario")
                  return renderNavItem(Package, "Inventario");
                if (label === "Descargo Administracion")
                  return renderNavItem(
                    ClipboardCheck,
                    "Descargo Administracion",
                  );
                if (label === "Medicamento Externo")
                  return renderNavItem(Pill, "Medicamento Externo");
                return null;
              };
              const itemContent = content();
              if (!itemContent) return null;

              return (
                <Reorder.Item
                  key={label}
                  value={label}
                  dragListener={isEditingSidebar}
                  className="list-none cursor-grab active:cursor-grabbing"
                >
                  {itemContent}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </nav>

        <div
          className={`p-4 border-t shrink-0 ${isDarkSidebar ? "border-zinc-800" : "border-gray-100"}`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "justify-center flex-col gap-3" : "gap-3 px-2"} py-2 rounded-lg transition-colors ${isDarkSidebar ? "hover:bg-zinc-900" : "hover:bg-gray-50"}`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-xs shadow-md ${
                isDarkSidebar
                  ? `bg-zinc-300 text-${colorTheme}-600 ring-1 ring-${colorTheme}-600`
                  : `bg-zinc-300 text-${colorTheme}-600 ring-1 ring-${colorTheme}-600`
              }`}
            >
              {registrado && localStorage.getItem("usuarioActivo") ? (
                localStorage
                  .getItem("usuarioActivo")
                  ?.substring(0, 2)
                  .toUpperCase()
              ) : (
                <User size={14} />
              )}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-black tracking-tight truncate ${isDarkSidebar ? "text-zinc-100" : "text-gray-900"}`}
                >
                  {registrado
                    ? localStorage.getItem("usuarioActivo")
                    : "Invitado"}
                </p>
                <button
                  onClick={async () => {
                    if (registrado) {
                      try {
                        const sesionId = localStorage.getItem("sesionId");
                        if (sesionId) await LogoutUsuario(sesionId);
                      } catch (err) {
                        console.error(
                          "Error al notificar salida al servidor",
                          err,
                        );
                      }

                      localStorage.removeItem("usuarioActivo");
                      localStorage.removeItem("sesionId");
                      localStorage.removeItem("contraseñaActivo");
                      localStorage.setItem("registrado", "false");
                      setRegistrado(false);
                      setActiveItem("Inicio");
                      setIsSettingsOpen(false);

                      showToast("Sesión cerrada correctamente", "primary");
                    } else {
                      setShowAuthPopover(true);
                      setIsSettingsOpen(false);
                    }
                  }}
                  className={`text-[12px] font-black uppercase tracking-widest truncate transition-colors cursor-pointer ${
                    isDarkSidebar
                      ? "text-zinc-600 hover:text-indigo-400"
                      : "text-gray-400 hover:text-indigo-600"
                  }`}
                >
                  {registrado ? "Cerrar Sesión" : "Acceso Sistema"}
                </button>
              </div>
            )}

            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              onMouseEnter={(e) => handleMouseEnter(e, "Ajustes")}
              onMouseLeave={handleMouseLeave}
              className={`shrink-0 p-1.5 rounded-md transition-colors relative hover:cursor-pointer ${isSettingsOpen ? (isDarkSidebar ? `bg-${accentColor}-500/20 text-${accentColor}-400` : `bg-${accentColor}-100 text-${accentColor}-600`) : isDarkSidebar ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"}`}
            >
              <div
                className={`flex items-center justify-center border-none rounded-full w-6 h-6 ${
                  isSettingsOpen ? "animate-[spin_5s_linear_infinite]" : ""
                }`}
              >
                <Settings
                  className={`w-6 h-6 ${colorTheme === "blue" ? "text-blue-600" : ""} ${colorTheme === "red" ? "text-red-600" : ""} ${colorTheme === "green" ? "text-green-600" : ""} ${colorTheme === "fuchsia" ? "text-fuchsia-600" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </aside>

      {tooltip.show && isCollapsed && (
        <div
          className={`
      fixed left-[88px] z-[100]
      px-3 py-2
      rounded-xl
      text-sm
      font-medium
      overflow-hidden
      ${
        theme === "dark" || theme === "hybrid"
          ? `bg-zinc-900 text-${colorTheme}-400 border text-white  ${colorTheme === "blue" ? "border-blue-800" : colorTheme === "red" ? "border-red-800" : colorTheme === "green" ? "border-green-800" : "border-fuchsia-800"} `
          : `bg-white backdrop-blur-md font-bold text-${colorTheme}-700`
      }
    `}
          style={{
            top: `${tooltip.top}px`,
            transform: "translateY(-50%)",
            textShadow:
              theme === "dark" || theme === "hybrid"
                ? colorTheme === "blue"
                  ? "0 0 6px rgba(59,130,246,1), 0 0 12px rgba(59,130,246,.9), 0 0 20px rgba(59,130,246,.7)"
                  : colorTheme === "red"
                    ? "0 0 6px rgba(239,68,68,1), 0 0 12px rgba(239,68,68,.9), 0 0 20px rgba(239,68,68,.7)"
                    : colorTheme === "green"
                      ? "0 0 6px rgba(16,185,129,1), 0 0 12px rgba(16,185,129,.9), 0 0 20px rgba(16,185,129,.7)"
                      : "0 0 6px rgba(217, 70, 239, 1), 0 0 12px rgba(217, 70, 239, .9), 0 0 20px rgba(217, 70, 239, .7)"
                : "none",
            boxShadow:
              colorTheme === "blue"
                ? `0px 0px 5px 2px rgba(59,130,246,${theme === "dark" || theme === "hybrid" ? 0.45 : 1})`
                : colorTheme === "red"
                  ? `0px 0px 5px 2px rgba(239,68,68,${theme === "dark" || theme === "hybrid" ? 0.45 : 1})`
                  : colorTheme === "green"
                    ? `0px 0px 5px 2px rgba(16,185,129,${theme === "dark" || theme === "hybrid" ? 0.45 : 1})`
                    : `0px 0px 5px 2px rgba(217, 70, 239, ${theme === "dark" || theme === "hybrid" ? 0.45 : 1})`,
          }}
        >
          <span className="relative z-10">{tooltip.text}</span>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 z-0"
            onClick={() => setIsSearchOpen(false)}
          ></div>

          <div
            className={`absolute top-[65px] left-[10px] ${isCollapsed ? "w-[300px]" : "w-[450px]"} rounded-xl shadow-2xl border overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top-left ${theme === "dark" ? "bg-zinc-900/95 backdrop-blur-sm border-zinc-800 shadow-black/50" : "bg-white/95 backdrop-blur-xl border-gray-200 shadow-gray-300/50"}`}
          >
            <div
              className={`flex items-center px-3 py-2 border-b ${theme === "dark" ? "border-zinc-800" : "border-gray-100"}`}
            >
              <Search
                className={`w-4 h-4 shrink-0 mr-2 ${theme === "dark" ? `text-${accentColor}-400` : `text-${accentColor}-500`}`}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pacientes, acciones, ajustes..."
                className={`w-full bg-transparent border-none focus:outline-none text-sm ${theme === "dark" ? "text-zinc-100 placeholder:text-zinc-500" : "text-gray-900 placeholder:text-gray-400"}`}
              />
              <div
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ml-2 ${theme === "dark" ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-gray-100 border-gray-200 text-gray-500"}`}
              >
                ESC
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2 scroll-smooth">
              {Object.keys(groupedResults).length === 0 ? (
                <div
                  className={`py-14 text-center ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}
                >
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron resultados para "{searchQuery}"</p>
                </div>
              ) : (
                Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <p
                      className={`text-xs font-semibold px-3 py-2 uppercase tracking-wider ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}
                    >
                      {category}
                    </p>
                    <div className="space-y-1">
                      {" "}
                      {(items as any[]).map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              item.action();
                              setIsSearchOpen(false);
                            }}
                            className={`w-full text-left px-3 py-3 text-sm rounded-xl flex items-center justify-between group transition-all ${theme === "dark" ? `hover:bg-${accentColor}-500/10 text-zinc-300 hover:text-${accentColor}-400` : `hover:bg-${accentColor}-50 text-gray-700 hover:text-${accentColor}-700`}`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg transition-colors ${theme === "dark" ? `bg-zinc-800 group-hover:bg-${accentColor}-500/20` : `bg-gray-100 group-hover:bg-${accentColor}-100`}`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-medium">{item.title}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              className={`px-4 py-3 border-t text-xs flex items-center justify-between ${theme === "dark" ? "border-zinc-800 bg-zinc-900/50 text-zinc-500" : "border-gray-100 bg-gray-50 text-gray-500"}`}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Command className="w-3 h-3" /> K para abrir
                </span>
                <span className="flex items-center gap-1"></span>
                <span className="flex items-center gap-1">
                  ↵ para seleccionar
                </span>
              </div>
              <span>{filteredResults.length} resultados</span>
            </div>
          </div>
        </div>
      )}

      <div
        className={`absolute top-0 left-full h-full shadow-[10px_0_20px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 z-19 overflow-hidden flex flex-col ${isSettingsOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-none"} ${isDarkSidebar ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"}`}
      >
        <div
          className={`h-16 flex items-center justify-between px-6 shrink-0 w-80 ${isDarkSidebar ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50/50 border-gray-100"}`}
        >
          <div className="flex items-center gap-2">
            <Settings
              className={`w-5 h-5 ${isDarkSidebar ? "text-zinc-400" : "text-gray-500"}`}
            />
            <h2
              className={`text-base font-semibold ${isDarkSidebar ? "text-zinc-100" : "text-gray-800"}`}
            >
              Ajustes del Sistema
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className={`p-1.5 rounded-lg active:scale-90 cursor-pointer transition-colors ${isDarkSidebar ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" : "text-gray-400 hover:bg-gray-200 hover:text-gray-700"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto p-4 w-80 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${isDarkSidebar ? "[&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700" : "[&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"}`}
        >
          <div className="space-y-6">
            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
              >
                Apariencia
              </h3>
              <div
                className={`flex p-1 rounded-lg ${isDarkSidebar ? "bg-zinc-900" : "bg-gray-100"}`}
              >
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setTheme("light"));
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${theme === "light" ? (isDarkSidebar ? "bg-zinc-800 text-zinc-100 shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDarkSidebar ? "text-zinc-500 hover:text-zinc-300" : "text-gray-500 hover:text-gray-700"} hover:cursor-pointer`}
                >
                  <Sun className="w-3.5 h-3.5" /> Claro
                </button>
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setTheme("hybrid"));
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${theme === "hybrid" ? (isDarkSidebar ? "bg-zinc-800 text-zinc-100 shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDarkSidebar ? "text-zinc-500 hover:text-zinc-300" : "text-gray-500 hover:text-gray-700"} hover:cursor-pointer`}
                >
                  <Contrast className="w-3.5 h-3.5" /> Híbrido
                </button>
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setTheme("dark"));
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${theme === "dark" ? (isDarkSidebar ? "bg-zinc-800 text-zinc-100 shadow-sm" : "bg-white text-gray-900 shadow-sm") : isDarkSidebar ? "text-zinc-500 hover:text-zinc-300" : "text-gray-500 hover:text-gray-700"} hover:cursor-pointer`}
                >
                  <Moon className="w-3.5 h-3.5" /> Oscuro
                </button>
              </div>
              <p
                className={`text-[10px] mt-2 ${isDarkSidebar ? "text-zinc-600" : "text-gray-500"}`}
              >
                * Híbrido: Menú oscuro, contenido claro.
              </p>
            </div>

            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
              >
                Color Principal
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setColorTheme("blue"));
                  }}
                  className={`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center transition-transform ${colorTheme === "blue" ? "scale-110 ring-2 ring-blue-600 ring-offset-2" : "hover:scale-105"} ${isDarkSidebar ? "ring-offset-zinc-950" : "ring-offset-white"} hover:cursor-pointer`}
                />
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setColorTheme("red"));
                  }}
                  className={`w-8 h-8 rounded-full bg-red-600 flex items-center justify-center transition-transform ${colorTheme === "red" ? "scale-110 ring-2 ring-red-600 ring-offset-2" : "hover:scale-105"} ${isDarkSidebar ? "ring-offset-zinc-950" : "ring-offset-white"} hover:cursor-pointer`}
                />
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setColorTheme("green"));
                  }}
                  className={`w-8 h-8 rounded-full bg-green-600 flex items-center justify-center transition-transform ${colorTheme === "green" ? "scale-110 ring-2 ring-green-600 ring-offset-2" : "hover:scale-105"} ${isDarkSidebar ? "ring-offset-zinc-950" : "ring-offset-white"} hover:cursor-pointer`}
                />
                <button
                  onClick={(e) => {
                    const { x, y } = getElementCenter(e.currentTarget);
                    startCircleTransition(x, y, () => setColorTheme("fuchsia"));
                  }}
                  className={`w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center transition-transform ${colorTheme === "fuchsia" ? "scale-110 ring-2 ring-fuchsia-600 ring-offset-2" : "hover:scale-105"} ${isDarkSidebar ? "ring-offset-zinc-950" : "ring-offset-white"} hover:cursor-pointer`}
                />
              </div>
            </div>

            {registrado && (
              <div>
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
                >
                  Cuenta
                </h3>
                <div className="space-y-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveItem("Ajustes:Perfil");
                      setIsSettingsOpen(false);
                    }}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDarkSidebar ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <User
                      className={`w-4 h-4 mr-3 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
                    />{" "}
                    Perfil Personal
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAuthPopover(true);
                      setIsSettingsOpen(false);
                    }}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDarkSidebar ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <UserPlus
                      className={`w-4 h-4 mr-3 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
                    />{" "}
                    Registrar Nuevo
                  </a>
                  {isAdmin && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveItem("Gestion de Usuarios");
                        setIsSettingsOpen(false);
                      }}
                      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isDarkSidebar ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    >
                      <Lock
                        className={`w-4 h-4 mr-3 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
                      />{" "}
                      Auditoría Global
                    </a>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-4 px-2 ${isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
              >
                Preferencias del Sistema
              </h3>

              <div className="space-y-4 px-2">
                <div
                  className={`p-4 rounded-2xl border transition-all ${isDarkSidebar ? "bg-zinc-900/40 border-zinc-800" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package
                        className={`w-4 h-4 ${isDarkSidebar ? "text-orange-400" : "text-orange-500"}`}
                      />
                      <span
                        className={`text-[11px] font-bold ${isDarkSidebar ? "text-zinc-300" : "text-gray-700"}`}
                      >
                        Bajo Stock Global
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {inventoryThreshold} unidades
                      </span>
                      <button
                        onClick={() => setInventoryThreshold(5)}
                        className={`p-1 rounded-md transition-all active:scale-90 ${isDarkSidebar ? "hover:bg-zinc-800 text-zinc-500 hover:text-orange-400" : "hover:bg-orange-50 text-gray-400 hover:text-orange-600"}`}
                        title="Restablecer a 5 unidades"
                      >
                        <RefreshCcw
                          size={14}
                          className="scale-130 hover:cursor-pointer"
                        />
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={inventoryThreshold}
                    onChange={(e) =>
                      setInventoryThreshold(parseInt(e.target.value))
                    }
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-grab active:cursor-grabbing accent-orange-500 mb-3"
                  />

                  <p
                    className={`text-[10px] leading-relaxed ${isDarkSidebar ? "text-zinc-500" : "text-gray-500"}`}
                  >
                    Cualquier medicamento cuyo stock sea menor a{" "}
                    <span className="font-bold text-orange-500">
                      {inventoryThreshold}
                    </span>{" "}
                    aparecerá en el panel de alertas.
                  </p>
                </div>

                <div
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg shadow-lg border-1 border-gray-200 transition-colors ${isEditingSidebar ? (isDarkSidebar ? "bg-zinc-800 text-emerald-400 ring-1 ring-emerald-500/50" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200") : isDarkSidebar ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <button
                    onClick={handlePersonalize}
                    className="flex items-center flex-1 text-left outline-none cursor-pointer"
                  >
                    <Layout
                      className={`w-4 h-4 mr-3 ${isEditingSidebar ? "text-emerald-500 animate-pulse" : isDarkSidebar ? "text-zinc-500" : "text-gray-400"}`}
                    />{" "}
                    Personalizar Sidebar
                  </button>
                  <div className="flex items-center gap-1">
                    {isEditingSidebar && (
                      <span className="text-[10px] bg-emerald-500 text-white px-1 rounded mr-2 animate-bounce">
                        ON
                      </span>
                    )}
                    <button
                      onClick={handleRestoreSidebar}
                      className={`p-1.5 rounded-md transition-all active:scale-90 group ${isDarkSidebar ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
                      title="Restaurar orden original"
                    >
                      <RefreshCcw
                        size={14}
                        className={`transition-colors ${isEditingSidebar ? "text-emerald-500" : "text-zinc-500"} group-hover:text-emerald-500 scale-130 `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`p-4 border-t shrink-0 w-80 ${isDarkSidebar ? "border-zinc-800 bg-zinc-900/30" : "border-gray-100 bg-gray-50"}`}
        >
          <button
            style={{display:'none'}}
            onClick={() => {
              if (registrado) {
                localStorage.removeItem("usuarioActivo");
                localStorage.removeItem("userObject");
                localStorage.removeItem("contraseñaActivo");
                localStorage.removeItem("sesionId");
                localStorage.setItem("registrado", "false");
                setRegistrado(false);
                setActiveItem("Inicio");
                setIsSettingsOpen(false);
                showToast("Sesión cerrada correctamente", "primary");
              } else {
                localStorage.setItem("usuarioActivo", "ADMIN_DEV");
                localStorage.setItem(
                  "userObject",
                  JSON.stringify({
                    mat: "ADMIN_DEV",
                    nomd: "Admin",
                    apd: "Desarrollador",
                    tipo: "administrador",
                  }),
                );
                localStorage.setItem("registrado", "true");
                setRegistrado(true);
                setActiveItem("Inicio");
                setIsSettingsOpen(false);
                showToast("Acceso Directo: Modo Administrador", "success");
              }
            }}
            className={`w-full py-2 border text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer ${
              isDarkSidebar
                ? "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            {registrado ? "Cerrar Sesión Activa" : "Acceso Directo (Admin)"}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showAuthPopover && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-zinc-950/20"
              onClick={() => setShowAuthPopover(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              className={`fixed bottom-5 z-50 p-0 rounded-2xl shadow-2xl border-2 ${isCollapsed ? "left-22" : "left-[16.5rem]"} ${colorTheme === "blue" ? "border-blue-400/60 shadow-blue-500/20" : colorTheme === "red" ? "border-red-400/60 shadow-red-500/20" : colorTheme === "green" ? "border-green-400/60 shadow-green-500/20" : "border-fuchsia-400/60 shadow-fuchsia-500/20"} ${isDarkSidebar && theme !== "hybrid" ? "bg-zinc-900 shadow-2xl shadow-black/50" : "bg-white"}`}
            >
              <div className="flex items-center gap-3 mb-3 p-6 pb-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner`}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-black text-sm uppercase tracking-tighter leading-none ${isDarkSidebar && theme !== "hybrid" ? "text-white" : "text-gray-900"}`}
                  >
                    {!registrado ? "Acceso Sistema" : "Registrar Médico"}
                  </h3>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    {!registrado
                      ? "Sistema Clínico CEMI"
                      : "Gestión de Personal"}
                  </p>
                </div>
                <button
                  onClick={() => setShowAuthPopover(false)}
                  className={`p-1.5 rounded-lg transition-colors bg-transparent hover:bg-red-500/10 text-zinc-400 hover:text-red-500`}
                >
                  <X size={18} />
                </button>
              </div>

              {registrado ? (
                <div className="animate-in fade-in slide-in-from-top-2 mt-[-20px] m-0 p-0 duration-300">
                  <InsertarDoctor
                    theme={
                      isDarkSidebar && theme !== "hybrid" ? "dark" : "light"
                    }
                    isPopover={true}
                    onSuccess={() => {
                      setShowAuthPopover(false);
                      showToast(
                        "Nuevo usuario registrado correctamente",
                        "success",
                      );
                    }}
                    onCancel={() => setShowAuthPopover(false)}
                  />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <LoginView
                    theme={isDarkSidebar ? "dark" : "light"}
                    isPopover={true}
                    onLogin={() => {
                      setRegistrado(true);
                      setShowAuthPopover(false);
                      setActiveItem("Inicio");
                    }}
                  />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
