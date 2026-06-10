import { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  pdf,
  Font,
} from "@react-pdf/renderer";
import { FileDown, Loader2 } from "lucide-react";
import logoCemi from "../../assets/logoCEMI.png";
import { MostrarPacientes, type Paciente } from "../conexion/Paciente/Mostrar";
import {
  MostrarConsultasReal,
  type Consulta,
} from "../conexion/Consulta/Mostrar";
import { MostrarMedicos } from "../conexion/Doctor/Mostrar";
import type { Theme } from "../sidebars/Sidebar";

const FONT_SIZE_DATA = 8.5;
const LINE_HEIGHT_BOX = 11;
const LINE_HEIGHT_RATIO = LINE_HEIGHT_BOX / FONT_SIZE_DATA;

Font.register({
  family: "Helvetica-Bold",
  src: "https://fonts.gstatic.com/s/helveticaneue/v70/1ASp8n6W9akZ2Ez2Cj_S_XU.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 110, height: 45, objectFit: "contain" },
  headerRight: { textAlign: "center", width: 220 },
  headerInstitute: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
    letterSpacing: 2,
  },
  nameTable: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 12,
  },
  nameCell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  nameLabel: { fontSize: 7, textTransform: "uppercase", marginBottom: 5 },
  nameValue: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "baseline",
    width: "100%",
  },
  labelContainer: {
    width: 100,
  },
  fieldLabel: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  valueContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dotted",
    flexDirection: "row",
    paddingLeft: 10,
  },
  valueText: {
    fontWeight: "bold",
    fontSize: FONT_SIZE_DATA,
  },
  areaHeader: {
    fontWeight: "bold",
    textDecoration: "underline",
    marginTop: 12,
    marginBottom: 10,
    fontSize: 9.5,
  },
  dottedArea: {
    position: "relative",
    width: "100%",
  },
  lineBox: {
    height: LINE_HEIGHT_BOX,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dotted",
    width: "100%",
  },
  overlayText: {
    position: "absolute",
    top: 1,
    left: 15,
    right: 5,
    lineHeight: LINE_HEIGHT_RATIO,
    textAlign: "justify",
    fontWeight: "bold",
    fontSize: FONT_SIZE_DATA,
  },
  vitalsTable: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    marginBottom: 12,
  },
  vitalBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    marginRight: 8,
  },
  vitalLabel: { fontWeight: "bold", fontSize: 9 },
  vitalValue: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dotted",
    flexGrow: 1,
    marginLeft: 3,
    paddingLeft: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: 200,
    alignSelf: "center",
    paddingTop: 5,
  },
});

const LineasPunteadas = ({ count }: { count: number }) => (
  <View style={{ width: "100%" }}>
    {[...Array(count)].map((_, i) => (
      <View key={i} style={styles.lineBox} />
    ))}
  </View>
);

const CampoDato = ({
  label,
  value,
  width = "100%",
  labelWidth = 100,
  marginTop = 8,
}: any) => (
  <View style={{ ...styles.infoRow, width, marginTop }}>
    <View style={{ ...styles.labelContainer, width: labelWidth }}>
      <Text style={styles.fieldLabel}>{label}</Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  </View>
);

const HistoriaClinicaDocument = ({
  paciente,
  lastConsulta,
  medicoName,
}: {
  paciente: Paciente;
  lastConsulta: Consulta | null;
  medicoName: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={logoCemi} style={styles.logo} />
        <View style={styles.headerRight}>
          <Text style={styles.headerInstitute}>Centro de Especialidades</Text>
          <Text style={styles.headerInstitute}>Médicas e Integrales</Text>
        </View>
      </View>

      <Text style={styles.mainTitle}>HISTORIA CLINICA EXTERNA</Text>

      <View style={styles.nameTable}>
        <View style={styles.nameCell}>
          <Text style={styles.nameLabel}>Paterno</Text>
          <Text style={styles.nameValue}>{paciente.ap}</Text>
        </View>
        <View style={styles.nameCell}>
          <Text style={styles.nameLabel}>Materno</Text>
          <Text style={styles.nameValue}>{paciente.am || "-"}</Text>
        </View>
        <View style={{ ...styles.nameCell, borderRightWidth: 0 }}>
          <Text style={styles.nameLabel}>Nombres</Text>
          <Text style={styles.nameValue}>{paciente.nom}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <CampoDato
          label="Edad:"
          value={paciente.edad}
          width="15%"
          labelWidth={40}
        />
        <CampoDato
          label="Ocupación:"
          value={paciente.ocu || "-"}
          width="50%"
          labelWidth={70}
        />
        <CampoDato
          label="Fecha y Hora:"
          value={new Date().toLocaleString()}
          width="35%"
          labelWidth={80}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <CampoDato
          label="F. Nacimiento:"
          value={new Date(paciente.fech).toLocaleDateString()}
          width="50%"
          labelWidth={90}
        />
        <CampoDato
          label="Telf o Cel:"
          value={paciente.cel || "-"}
          width="50%"
          labelWidth={80}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <CampoDato
          label="Procedencia:"
          value={paciente.pro}
          width="50%"
          labelWidth={90}
        />
        <CampoDato
          label="Residencia:"
          value={paciente.res}
          width="50%"
          labelWidth={80}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <CampoDato
          label="Dirección:"
          value={paciente.dir}
          width="70%"
          labelWidth={90}
        />
        <CampoDato
          label="C.I.:"
          value={paciente.ci}
          width="30%"
          labelWidth={40}
        />
      </View>

      <CampoDato
        label="Nombre Tutor:"
        value={paciente.nomt || "-"}
        labelWidth={90}
      />

      <View style={{ marginTop: 5 }}>
        <Text style={styles.areaHeader}>MOTIVO DE CONSULTA:</Text>
        <View style={styles.dottedArea}>
          <LineasPunteadas count={1} />
          <Text style={styles.overlayText}>{lastConsulta?.mc || ""}</Text>
        </View>
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={styles.areaHeader}>ENFERMEDAD ACTUAL:</Text>
        <View style={styles.dottedArea}>
          <LineasPunteadas count={4} />
          <Text style={styles.overlayText}>{lastConsulta?.evad || ""}</Text>
        </View>
      </View>

      <Text style={{ ...styles.areaHeader, textDecoration: "underline" }}>
        EXAMEN FISICO GENERAL
      </Text>
      <View style={styles.vitalsTable}>
        <View style={styles.vitalBox}>
          <Text style={styles.vitalLabel}>PA:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.pa || ""}</Text>
        </View>
        <View style={styles.vitalBox}>
          <Text style={styles.vitalLabel}>FC:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.fc || ""}</Text>
        </View>
        <View style={styles.vitalBox}>
          <Text style={styles.vitalLabel}>FR:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.fr || ""}</Text>
        </View>
        <View style={styles.vitalBox}>
          <Text style={styles.vitalLabel}>T°:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.temp || ""}</Text>
        </View>
        <View style={styles.vitalBox}>
          <Text style={styles.vitalLabel}>Peso:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.peso || ""}</Text>
        </View>
        <View style={styles.vitalBox}>
          <Text style={styles.vitalLabel}>Talla:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.talla || ""}</Text>
        </View>
        <View style={{ ...styles.vitalBox, marginRight: 0 }}>
          <Text style={styles.vitalLabel}>IMC:</Text>
          <Text style={styles.vitalValue}>{lastConsulta?.imc || ""}</Text>
        </View>
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={styles.areaHeader}>CONDUCTA:</Text>
        <View style={styles.dottedArea}>
          <LineasPunteadas count={2} />
          <Text style={styles.overlayText}>{lastConsulta?.cond || ""}</Text>
        </View>
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={styles.areaHeader}>TRATAMIENTO:</Text>
        <View style={styles.dottedArea}>
          <LineasPunteadas count={3} />
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.footer}>FIRMA Y SELLO DEL MEDICO</Text>
        <Text style={{ textAlign: "center", fontSize: 9, marginTop: 3 }}>
          {medicoName}
        </Text>
      </View>
    </Page>
  </Document>
);

interface GenerarPDFProps {
  Id: number;
  theme: Theme;
}

const GenerarPDF = ({ Id, theme }: GenerarPDFProps) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [lastConsulta, setLastConsulta] = useState<Consulta | null>(null);
  const [medicoName, setMedicoName] = useState<string>("Médico de Turno");
  const [loading, setLoading] = useState(true);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [patientsData, consultationsData, doctorsData] =
          await Promise.all([
            MostrarPacientes(),
            MostrarConsultasReal(),
            MostrarMedicos(),
          ]);

        const pEncontrado = patientsData.find((p) => p.ci === Id);
        setPaciente(pEncontrado || null);

        if (pEncontrado) {
          const pConsultasSorted = consultationsData
            .filter((c) => c.idp === Id && !c.EstadoEliminado)
            .sort((a, b) => b.idc - a.idc);

          if (pConsultasSorted.length > 0) {
            setLastConsulta(pConsultasSorted[0]);
          }

          const medico = doctorsData.find((m) => m.mat === pEncontrado.matm);
          if (medico) {
            setMedicoName(`${medico.nomd} ${medico.apd} ${medico.amd || ""}`);
          }
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [Id]);

  const abrirPDF = async () => {
    if (!paciente) return;
    const blob = await pdf(
      <HistoriaClinicaDocument
        paciente={paciente}
        lastConsulta={lastConsulta}
        medicoName={medicoName}
      />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400 p-2 justify-center">
        <Loader2 className="animate-spin" size={14} />
        <span className="text-[9px] font-black uppercase tracking-widest">
          Cargando...
        </span>
      </div>
    );
  }

  if (!paciente) return null;

  return (
    <button
      onClick={abrirPDF}
      className={`group flex items-center gap-3 p-4 justify-center rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-102 active:scale-95 w-full ${
        isDarkMode
          ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      <FileDown size={18} className="text-green-500" />
      <span>Generar Documento</span>
    </button>
  );
};

export default GenerarPDF;
