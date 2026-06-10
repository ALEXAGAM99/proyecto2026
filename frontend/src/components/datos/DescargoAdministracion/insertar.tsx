import { useState, useEffect } from "react";
import {
  ClipboardList,
  Save,
  AlertCircle,
  X,
  User,
  Package,
  Stethoscope,
  Clock,
  Calendar,
  Info,
  Activity,
  DollarSign,
  UserCheck,
  Archive,
} from "lucide-react";
import { useToast } from "../../common/ToastContext";
import { InsertarDescargo } from "../../conexion/DescargoAdministracion/Insertar";
import {
  MostrarPacientes,
  type Paciente,
} from "../../conexion/Paciente/Mostrar";
import {
  MostrarMedicamentosReal,
  type Medicamento,
} from "../../conexion/Inventario/Mostrar";

import { MostrarMedicos } from "../../conexion/Doctor/Mostrar";
import type { Theme } from "../../sidebars/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

interface InsertarDescargoProps {
  theme: Theme;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideHeader?: boolean;
}

const InsertarDescargoForm = ({
  theme,
  onSuccess,
  onCancel,
  hideHeader = false,
}: InsertarDescargoProps) => {
  const { showToast } = useToast();
  const isDarkMode = theme === "dark";
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [form, setForm] = useState({
    idp: 0,
    codm: 0,
    turnom: "0",
    fechi: new Date().toLocaleDateString("en-CA"),
    horai: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    fechalta: "",
    horalta: "",
    fechactual: new Date().toLocaleDateString("en-CA"),
    horactual: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    diag: "",
    cant: 1,
    costo: 0,
    resp: localStorage.getItem("usuarioActivo") || "Administrador",
    EstadoEliminado: false,
    FechaEliminacion: null,
    UsuarioElimino: null,
  });

  const selectedMed = medicamentos.find((m) => m.codm === form.codm);
  const isStockInsufficient = selectedMed
    ? selectedMed.numex < form.cant
    : false;

  useEffect(() => {
    const load = async () => {
      const [p, m, d] = await Promise.all([
        MostrarPacientes(),
        MostrarMedicamentosReal(),
        MostrarMedicos(),
      ]);
      setPacientes(p.filter((pa) => !pa.EstadoEliminado));
      setMedicamentos(m.filter((ma) => !ma.EstadoEliminado));

      const matActivo = localStorage.getItem("usuarioActivo");
      if (matActivo) {
        const me = d.find((da) => da.mat === matActivo);
        if (me) {
          setCurrentUser(me);
          setForm((prev) => ({ ...prev, turnom: me.mat }));
        }
      }
    };
    load();
  }, []);

  const handleCantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cant = Number(e.target.value);
    const med = medicamentos.find((m) => m.codm === form.codm);
    setForm({ ...form, cant, costo: med ? med.precio * cant : 0 });
  };

  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [busquedaMedicamento, setBusquedaMedicamento] = useState("");

  const handlePacienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;

    setBusquedaPaciente(texto);

    const pacienteEncontrado = pacientes.find(
      (p) => `${p.nom} ${p.ap}`.toLowerCase() === texto.toLowerCase(),
    );

    setForm((prev) => ({
      ...prev,
      idp: pacienteEncontrado ? pacienteEncontrado.ci : 0,
    }));
  };

  const handleMedicamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;

    setBusquedaMedicamento(texto);

    const medicamentoEncontrado = medicamentos.find(
      (m) => `${m.nomm}`.toLowerCase() === texto.toLowerCase(),
    );

    setForm((prev) => ({
      ...prev,
      codm: medicamentoEncontrado ? medicamentoEncontrado.codm : 0,
      costo: medicamentoEncontrado
        ? medicamentoEncontrado.precio * form.cant
        : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idp === 0 || form.codm === 0 || form.turnom === "0") {
      showToast("Complete todos los campos de selección", "warning");
      return;
    }

    if (!selectedMed) {
      showToast("Medicamento no encontrado", "warning");
      return;
    }

    if (isStockInsufficient) {
      showToast(
        `Stock insuficiente. Disponible: ${selectedMed?.numex}`,
        "warning",
      );
      return;
    }

    try {
      await InsertarDescargo({
        ...form,
        idp: Number(form.idp),
      } as any);

      showToast("Descargo registrado e inventario actualizado", "success");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast("Error en el proceso de registro.", "warning");
    }
  };

  const inputStyles = `w-full px-4 py-2.5 rounded-xl border transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-sky-500/30 focus:border-sky-500"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-sky-500/20 focus:border-sky-500"
  }`;

  const labelStyles = `text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1.5 ${
    isDarkMode ? "text-zinc-500" : "text-gray-400"
  }`;

  return (
    <div
      className={
        hideHeader
          ? "w-full"
          : `p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-gray-100"}`
      }
    >
      {!hideHeader && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-sky-500/10 text-sky-500 rounded-3xl">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">
                Registrar Descargo
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}
              >
                Stock actual:{" "}
                {selectedMed
                  ? `${selectedMed.numex} unidades`
                  : "Seleccione un insumo"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cerrar"
            className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}>
              <User size={14} /> Paciente Receptor
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <div className="relative">
                <input
                  name="idp"
                  type="text"
                  placeholder="Ingresar Paciente"
                  value={busquedaPaciente}
                  autoComplete="off"
                  list="paciente-consulta"
                  className={`${inputStyles}`}
                  onChange={handlePacienteChange}
                />

                <datalist id="paciente-consulta">
                  {pacientes
                    .filter((p) =>
                      `${p.nom} ${p.ap}`
                        .toLowerCase()
                        .includes(busquedaPaciente.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((paciente) => (
                      <option
                        key={paciente.ci}
                        value={`${paciente.nom} ${paciente.ap}`}
                      />
                    ))}
                </datalist>

                {busquedaPaciente && (
                  <AnimatePresence>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setBusquedaPaciente("");

                        setForm((prev) => ({
                          ...prev,
                          idp: 0,
                        }));
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                        isDarkMode
                          ? "text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                          : "text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      <X size={14} />
                    </motion.button>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>
              <Stethoscope size={14} /> Médico / Usuario a Cargo
            </label>
            <div className="relative">
              <Stethoscope
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                readOnly
                value={
                  currentUser
                    ? `${currentUser.nomd || ""} ${currentUser.apd || ""} (${currentUser.mat})`
                    : ""
                }
                className={`${inputStyles} pl-12 font-bold opacity-80 cursor-not-allowed`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_0.5fr_0.5fr] gap-6">
          <div className="md:col-span-1">
            <label className={labelStyles}>
              <Package size={14} /> Insumo / Medicamento
            </label>
            <div className="relative">
              <Package
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
              />
              <div className="relative">
                <input
                  name="codm"
                  type="text"
                  placeholder="Ingresar Medicamento"
                  value={busquedaMedicamento}
                  autoComplete="off"
                  list="medicamento-consulta"
                  className={`${inputStyles}`}
                  onChange={handleMedicamentoChange}
                />

                <datalist id="medicamento-consulta">
                  {medicamentos
                    .filter((m) =>
                      m.nomm
                        .toLowerCase()
                        .includes(busquedaMedicamento.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((medicamento) => (
                      <option
                        key={medicamento.codm}
                        value={`${medicamento.nomm}`}
                      />
                    ))}
                </datalist>

                {busquedaMedicamento && (
                  <AnimatePresence>
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => {
                        setBusquedaMedicamento("");

                        setForm((prev) => ({
                          ...prev,
                          codm: 0,
                        }));
                      }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                        isDarkMode
                          ? "text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
                          : "text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                      }`}
                    >
                      <X size={14} />
                    </motion.button>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>
              <Activity size={14} /> Cantidad
            </label>
            <div className="relative">
              <Archive
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="number"
                value={form.cant || ""}
                onChange={handleCantChange}
                min="1"
                placeholder="1"
                className={`${inputStyles} pl-12 font-bold ${isStockInsufficient ? "border-red-500 text-red-500 focus:ring-red-500/20 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]" : ""}`}
              />
              {isStockInsufficient && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-4 left-1 text-[9px] font-black text-red-500 uppercase tracking-tighter"
                >
                  Stock insuficiente (Disponible: {selectedMed?.numex})
                </motion.p>
              )}
            </div>
          </div>
          <div>
            <label className={labelStyles}>
              <DollarSign size={14} /> Costo Calculado
            </label>
            <div className="relative">
              <DollarSign
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
              />
              <input
                type="text"
                readOnly
                value={
                  form.costo > 0 ? `${form.costo.toFixed(2)} Bs.` : "0.00 Bs."
                }
                className={`${inputStyles} pl-12 font-mono font-black text-emerald-600 bg-zinc-50 dark:bg-zinc-900/30 border-dashed border-emerald-500/30`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyles}>
              <Calendar size={14} /> Fecha Administración
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="date"
                value={form.fechi}
                onChange={(e) => setForm({ ...form, fechi: e.target.value })}
                className={`${inputStyles} pl-12`}
              />
            </div>
          </div>
          <div>
            <label className={labelStyles}>
              <Clock size={14} /> Hora Registro
            </label>
            <div className="relative">
              <Clock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="time"
                value={form.horai}
                onChange={(e) => setForm({ ...form, horai: e.target.value })}
                className={`${inputStyles} pl-12 text-sm`}
              />
            </div>
          </div>
          <div>
            <label className={labelStyles}>
              <UserCheck size={14} /> Responsable
            </label>
            <div className="relative">
              <UserCheck
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                readOnly
                value={form.resp}
                className={`${inputStyles} pl-12 opacity-60 text-xs bg-zinc-50 dark:bg-zinc-900/30 font-bold`}
              />
            </div>
          </div>
        </div>

        <div className="mb-0">
          <label className={labelStyles}>
            <Info size={14} /> Diagnóstico / Observaciones Clínicas
          </label>
          <div className="relative">
            <Info size={18} className="absolute left-4 top-4 text-zinc-400" />
            <textarea
              value={form.diag}
              onChange={(e) => setForm({ ...form, diag: e.target.value })}
              className={`${inputStyles} pl-12 min-h-[80px] resize-none`}
              placeholder="Describa el motivo o diagnóstico de la administración..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row border-t mt-0 border-zinc-200 dark:border-zinc-900 items-center justify-between">
          <div className="flex items-center text-sky-500">
            <AlertCircle size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">
              Verifique los datos antes de confirmar
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                aria-label="Cancelar"
                onClick={onCancel}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-bold border-2 border-zinc-200 transition-all active:scale-95 ${
                  isDarkMode
                    ? "bg-zinc-900 text-zinc-400 hover:text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              aria-label="Guardar Cambios"
              disabled={isStockInsufficient}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-sky-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
            >
              <Save size={18} /> Registrar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InsertarDescargoForm;
