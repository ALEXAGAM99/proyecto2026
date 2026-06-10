# Especificaciones Técnicas del Sistema - Archivo de Base de Datos y Conexiones

Este documento detalla todas las tablas, campos y relaciones activas en el sistema actual tras la verificación del Backend y Frontend.

---

## 1. Tabla: `MEDICO` (Profesionales y Usuarios)
Centraliza el acceso y la auditoría del sistema.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| **`mat`** | `VARCHAR` | **PK**. Matrícula médica o ID único de acceso. |
| `nomd` | `VARCHAR` | Nombre del médico o administrador. |
| `apd` | `VARCHAR` | Apellido paterno. |
| `amd` | `VARCHAR` | Apellido materno. |
| `contra` | `VARCHAR` | Password (usado en login y cambios de perfil). |
| `tipo` | `VARCHAR` | Rol del sistema: `"doctor"` o `"administrador"`. |
| `EstadoEliminado` | `BIT` | 0 = Activo, 1 = Papelera. |
| `FechaEliminacion`| `DATETIME`| Momento exacto del borrado lógico. |
| `UsuarioElimino` | `VARCHAR` | Referencia al usuario que realizó la baja. |

---

## 2. Tabla: `PACIENTE` (Registro clínico principal)
Contiene la información demográfica de los pacientes.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| **`ci`** | `INT` | **PK**. Carnet de Identidad del paciente. |
| `ap` | `VARCHAR` | Apellido paterno. |
| `am` | `VARCHAR` | Apellido materno. |
| `nom` | `VARCHAR` | Nombre(s). |
| `edad` | `INT` | Edad actual del paciente. |
| `ocu` | `VARCHAR` | Ocupación o profesión. |
| `fech` | `DATE` | Fecha de nacimiento. |
| `cel` | `BIGINT` | Número de contacto telefónico. |
| `pro` | `VARCHAR` | Lugar de procedencia/origen. |
| `res` | `VARCHAR` | Ciudad/Lugar de residencia actual. |
| `dir` | `VARCHAR` | Dirección exacta de domicilio. |
| `nomt` | `VARCHAR` | Nombre del tutor responsale (si aplica). |
| **`matm`** | `VARCHAR` | **FK**. Matrícula del médico asignado (`MEDICO.mat`). |
| `EstadoEliminado` | `BIT` | Control de papelera. |

---

## 3. Tabla: `CONSULTA` (Historial de visitas)
Almacena los datos clínicos de cada atención médica.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| **`idc`** | `INT` | **PK**. Identificador único de la consulta. |
| **`idp`** | `INT` | **FK**. CI del paciente atendido (`PACIENTE.ci`). |
| `mc` | `TEXT` | Motivo de Consulta. |
| `evad` | `TEXT` | Evolución y Enfermedad Actual / Diagnóstico. |
| `pa` | `VARCHAR` | Presión Arterial (ej. "120/80"). |
| `fc` | `INT` | Frecuencia Cardíaca (bpm). |
| `fr` | `INT` | Frecuencia Respiratoria (rpm). |
| `temp` | `FLOAT` | Temperatura corporal (°C). |
| `peso` | `FLOAT` | Peso en Kilogramos. |
| `talla` | `INT` | Talla en Centímetros. |
| `imc` | `FLOAT` | Índice de Masa Corporal (Auto-calculado). |
| `cond` | `TEXT` | Conducta médica y tratamiento indicado. |
| `EstadoEliminado` | `BIT` | Control de papelera. |

---

## 4. Tabla: `MEDICAMENTO` (Inventario Interno)
Control de existencias de la farmacia propia del centro.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| **`codm`** | `INT` | **PK**. Código interno del fármaco. |
| `nomm` | `VARCHAR` | Nombre comercial o genérico del medicamento. |
| `fechv` | `DATE` | Fecha de vencimiento/expiración. |
| `numex` | `INT` | Existencias actuales en stock. |
| `precio` | `DECIMAL` | Precio de venta o costo unitario. |
| `frecuso`| `VARCHAR` | Clasificación por frecuencia de uso / especialidad. |
| `obs` | `TEXT` | Observaciones adicionales del lote. |
| `EstadoEliminado` | `BIT` | Control de papelera. |

---

## 5. Tabla: `DESCARGO_ADMINISTRATIVO` (Salida de Insumos)
Relación de medicamentos entregados a un paciente específico.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| **`idd`** | `INT` | **PK**. ID del descargo administrativo. |
| **`idp`** | `INT` | **FK**. CI del paciente beneficiario (`PACIENTE.ci`). |
| **`codm`** | `INT` | **FK**. Código del medicamento del inventario (`MEDICAMENTO.codm`). |
| `turnom` | `VARCHAR` | Turno de entrega (Mañana, Tarde, Noche). |
| `fechi` | `DATE` | Fecha de inicio del tratamiento. |
| `horai` | `TIME` | Hora de inicio del tratamiento. |
| `diag` | `VARCHAR` | Diagnóstico por el cual se hizo el descargo. |
| `cant` | `INT` | Unidades retiradas del stock. |
| `costo` | `FLOAT` | Costo económico del descargo realizado. |
| `resp` | `VARCHAR` | Nombre del personal responsable del descargo. |
| `EstadoEliminado` | `BIT` | Control de papelera. |

---

## 6. Tabla: `MEDICAMENTO_EXTERNO` (Medicamentos del usuario)
Tratamientos que el paciente ya está tomando y no pertenecen al inventario.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| **`idme`** | `INT` | **PK**. ID único del registro externo. |
| **`idp`** | `INT` | **FK**. CI del paciente dueño del fármaco (`PACIENTE.ci`). |
| `nomme` | `VARCHAR` | Nombre del medicamento externo. |
| `descrip`| `VARCHAR` | Descripción de la dosis o composición. |
| `obs` | `TEXT` | Observaciones sobre su administración. |
| `EstadoEliminado` | `BIT` | Control de papelera. |

---

## 7. Tabla: `AUDITORIA` (Logs de Seguridad)
Registro de accesos al sistema.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `usuario` | `VARCHAR`| **FK**. Matrícula del médico (`MEDICO.mat`). |
| `evento` | `VARCHAR`| Tipo de acción: `"login"`, `"salida"`, `"error"`. |
| `ip` | `VARCHAR`| Dirección de red del dispositivo cliente. |
| `navegador`| `VARCHAR`| Datos del Navegador/Sistema Operativo. |
| `fecha` | `DATETIME`| Marca de tiempo automática de la acción. |

---

## 8. Resumen de Relaciones (Foreign Keys)
*   **Médicos**: Identificados por `mat` (Matrícula). Aparecen como `matm` en pacientes y como `UsuarioElimino` en todas las tablas con papelera.
*   **Pacientes**: Identificados por `ci`. Son el centro de `IDP` en Consultas, Descargos y Medicamento Externo.
*   **Inventario**: Identificado por `codm`. Se conecta con `DESCARGO_ADMINISTRATIVO` para restar stock.
