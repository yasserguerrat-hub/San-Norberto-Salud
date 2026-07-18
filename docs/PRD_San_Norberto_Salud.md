San Norberto Salud — PRD v1.0 

## **PRD** 

# **Documento de Requisitos del Producto** 

**Plataforma de Análisis Estadístico Sanitario — San Norberto Salud** 

SOCIEDAD DE SERVICIOS SOCIALES Y DE SALUD SAN NORBERTO Ltda. 

_Comuna de Melipilla, Región Metropolitana, Chile_ 

Versión 1.0 — Julio 2026 _Documento confidencial — uso interno_ 

Página 1 de 16 

San Norberto Salud — PRD v1.0 

## **Tabla de Contenidos** 

|**Tabla de Contenidos**.................................................................................................................................................... 2|
|---|
|**1. Introducción y Objetivo del Documento**................................................................................................................ 4|
|**1.1 Principios rectores**............................................................................................................................................. 4|
|**2. Visión General y Propósito Estratégico**................................................................................................................. 4|
|**2.1 Propósito estratégico**......................................................................................................................................... 4|
|**2.2 Usuarios objetivo**............................................................................................................................................... 4|
|**2.3 Página pública institucional**.............................................................................................................................. 5|
|**3. Alcance del Proyecto**................................................................................................................................................ 5|
|**3.1 Incluido en esta versión**..................................................................................................................................... 5|
|**3.2 Excluido de esta versión**.................................................................................................................................... 5|
|**3.3 Futuras ampliaciones posibles**.......................................................................................................................... 6|
|**4. Historia de Usuario Ancla y Sub-historias**............................................................................................................ 6|
|**4.1 Épica**................................................................................................................................................................... 6|
|**Criterios de aceptación de la épica**..................................................................................................................... 6|
|**4.2 Sub-historias por rol**.......................................................................................................................................... 6|
|**Usuario de clínica**................................................................................................................................................. 6|
|**Administrador — aprobación**............................................................................................................................. 6|
|**Administrador — configuración**........................................................................................................................ 6|
|**Administrador — investigación asistida**............................................................................................................ 6|
|**5. Inconsistencias Detectadas y Decisiones de Diseño**............................................................................................... 7|
|**6. Requisitos Funcionales (RF)**................................................................................................................................... 7|
|**6.1 Autenticación y roles**......................................................................................................................................... 7|
|**6.2 Catálogos y configuración**................................................................................................................................. 8|
|**6.3 Registro de datos**................................................................................................................................................ 8|
|**6.4 Cálculo de indicadores**...................................................................................................................................... 8|
|**6.5 Importación y exportación**................................................................................................................................ 8|
|**6.6 Inteligencia artificial (agnóstica de proveedor)**............................................................................................... 9|
|**6.7 Dashboard y visualización**................................................................................................................................. 9|
|**7. Requisitos No Funcionales (RNF)**.......................................................................................................................... 9|
|**7.1 Seguridad**............................................................................................................................................................ 9|
|**7.2 Cumplimiento y privacidad**.............................................................................................................................. 9|
|**7.3 Rendimiento y disponibilidad**......................................................................................................................... 10|
|**7.4 Usabilidad y accesibilidad**............................................................................................................................... 10|
|**7.5 Mantenibilidad y escalabilidad**....................................................................................................................... 10|
|**8. Roles y Permisos**.................................................................................................................................................... 10|
|**9. Arquitectura de Datos**........................................................................................................................................... 11|
|**9.1 Cálculos principales**......................................................................................................................................... 12|



Página 2 de 16 

San Norberto Salud — PRD v1.0 

|**Tasa por cada 100.000 habitantes**.................................................................................................................... 12|
|---|
|**Variación porcentual entre períodos**................................................................................................................ 12|
|**10. Arquitectura Técnica General**............................................................................................................................ 12|
|**Capa 1 — Frontend (SPA privada)**.................................................................................................................. 12|
|**Capa 2 — Backend como servicio**.................................................................................................................... 12|
|**Capa 3 — Adaptador de servicios externos (agnóstico de proveedor)**.......................................................... 12|
|**11. Stack Tecnológico**................................................................................................................................................ 13|
|**11.1 Selección final**................................................................................................................................................. 13|
|**11.2 Alternativas evaluadas por categoría**........................................................................................................... 14|
|**12. Lineamientos de Diseño UI/UX**.......................................................................................................................... 14|
|**12.1 Identidad visual**.............................................................................................................................................. 14|
|**12.2 Paleta de colores**............................................................................................................................................. 14|
|**12.3 Estructura de dashboard**............................................................................................................................... 14|
|**12.4 Accesibilidad y responsividad**....................................................................................................................... 14|
|**13. Fases de Implementación**.................................................................................................................................... 15|
|**13.1 Orden obligatorio**........................................................................................................................................... 15|
|**14. Anexo — Dependencias Técnicas**....................................................................................................................... 15|
|**14.1 Frontend**......................................................................................................................................................... 15|
|**14.2 Backend (funciones de servidor)**.................................................................................................................. 15|
|**14.3 Pruebas**........................................................................................................................................................... 16|



Página 3 de 16 

San Norberto Salud — PRD v1.0 

## **1. Introducción y Objetivo del Documento** 

Este documento define los requisitos funcionales, no funcionales, la arquitectura de datos y el stack tecnológico para el desarrollo de una aplicación web privada destinada a la gestión, validación y análisis de información estadística agregada sobre enfermedades y padecimientos en la comuna de Melipilla, Chile, para uso exclusivo de SOCIEDAD DE SERVICIOS SOCIALES Y DE SALUD SAN NORBERTO Ltda. ("San Norberto Salud"). 

El documento consolida el planteamiento original de la solución, las inconsistencias detectadas durante su análisis, las decisiones tomadas para resolverlas, la historia de usuario ancla utilizada como palanca de derivación de requisitos, los requisitos funcionales (RF) y no funcionales (RNF) formalizados, y la propuesta tecnológica final, incluyendo alternativas evaluadas. 

### **1.1 Principios rectores** 

- La plataforma trabaja exclusivamente con datos estadísticos agregados; no almacena identificadores personales de pacientes (nombre, RUT, dirección, teléfono, ficha médica). 

- Toda acción sensible (crear, modificar, eliminar, importar, aprobar) requiere confirmación visible antes de ejecutarse. 

- Ninguna información generada por inteligencia artificial se guarda en tablas definitivas sin aprobación explícita de un administrador. 

- La arquitectura debe ser agnóstica de proveedor para cualquier servicio externo (inteligencia artificial, búsqueda web), de forma que las credenciales y el proveedor sean intercambiables por configuración. 

## **2. Visión General y Propósito Estratégico** 

La aplicación permitirá obtener, ingresar, almacenar, administrar, validar, visualizar, comparar y exportar información estadística agregada sobre enfermedades y padecimientos, considerando clínicas, sectores poblacionales, rangos de edad, sexo o género, población y períodos mensuales y anuales. 

### **2.1 Propósito estratégico** 

Los datos recopilados permitirán crear estudios de mercado y análisis sanitarios que apoyen la toma de decisiones de la empresa, identificando: 

- Enfermedades y padecimientos con mayor o menor incidencia. 

- Rangos de edad y diferencias por sexo o género más afectados. 

- Sectores poblacionales con índices de riesgo elevados. 

- Clínicas con mayor cantidad de atenciones y sus enfermedades más frecuentes. 

- Evolución mensual y anual de los casos, y cambios entre períodos. 

- Necesidades potenciales de recursos y servicios médicos. 

### **2.2 Usuarios objetivo** 

- Administrador general de San Norberto Salud (acceso total). 

- Usuarios autorizados asociados a cada clínica (acceso restringido a su propia clínica). 

No existen cuentas públicas, registro abierto de usuarios, ni acceso de empresas externas de salud. 

Página 4 de 16 

San Norberto Salud — PRD v1.0 

### **2.3 Página pública institucional** 

La aplicación cuenta con una página corporativa inicial con identidad, propósito, beneficios y botón de inicio de sesión. Esta página no muestra datos estadísticos, información de clínicas, reportes ni información administrativa. 

_<mark>Decisión de diseño: esta página se documenta como "de acceso no restringido técnicamente" (pública real), y no debe presentarse ante el cliente como un mecanismo de control de acceso. Mientras no exista dominio corporativo definitivo, la difusión de la URL se limita por criterio operativo, no por seguridad técnica.</mark>_ 

## **3. Alcance del Proyecto** 

### **3.1 Incluido en esta versión** 

- Aplicación web privada + página institucional pública 

- Autenticación, recuperación de contraseña y gestión de roles (administrador / usuario de clínica) 

- Gestión de clínicas, usuarios, enfermedades, padecimientos, rangos de edad, sexo o género y sectores 

- Gestión de población (comunal, por sector, demográfica) 

- Registro manual e importación de datos vía Excel/CSV con validación y vista previa 

- Prevención de duplicados y normalización de texto 

- Flujo de aprobación con Centro de Aprobaciones 

- Cálculo de tasas por 100.000 habitantes, variación porcentual y clasificación de riesgo 

- Dashboard con KPIs, gráficos, tablas, mapa de Melipilla y comparaciones entre clínicas/sectores/períodos 

- Exportación de reportes en PDF y Excel 

- Actualización en tiempo real de indicadores tras aprobación 

- Investigación asistida por un proveedor de inteligencia artificial agnóstico, con registro de fuentes y aprobación obligatoria 

- Predicciones estadísticas claramente diferenciadas de datos reales 

- Identidad visual institucional y propuesta de logotipo 

- Optimización para escritorio con adaptación responsive básica 

### **3.2 Excluido de esta versión** 

- Aplicación móvil nativa 

- Registro público de usuarios y acceso público al dashboard 

- Datos individuales de pacientes, datos personales sensibles y fichas clínicas 

- Integración automática con sistemas internos de clínicas o historiales clínicos 

- Firma electrónica y aprobación electrónica de junta de accionistas 

- Notificaciones operativas por correo, salvo recuperación técnica de contraseña 

- Diagnósticos médicos, recomendaciones médicas individuales o prescripción de tratamientos mediante IA 

- Automatización sin aprobación humana; eliminación o modificación automática de datos 

- Ingreso automático definitivo de información encontrada en internet 

- Facturación, pagos, suscripciones, portal público de estadísticas, agenda médica, telemedicina, inventario clínico 

- Auditoría histórica completa y versionada de cada cambio (se mantiene trazabilidad básica, ver RNF-18) 

Página 5 de 16 

San Norberto Salud — PRD v1.0 

- Georreferenciación avanzada mientras no existan polígonos o datos territoriales disponibles 

### **3.3 Futuras ampliaciones posibles** 

- Aplicación móvil, portal público de indicadores, notificaciones operativas 

- Integración con sistemas de clínicas mediante API oficiales 

- Reportes personalizables, más roles, flujos de aprobación adicionales 

- Modelos predictivos avanzados y análisis geoespacial avanzado 

- Historial de auditoría completo y versionado 

- Dominio corporativo propio y panel para la junta de accionistas 

## **4. Historia de Usuario Ancla y Sub-historias** 

Se utiliza una historia de usuario épica como palanca de derivación de todos los requisitos funcionales y no funcionales del documento, asegurando trazabilidad completa entre visión de negocio y especificación técnica. 

### **4.1 Épica** 

_<mark>Como administrador general de San Norberto Salud, quiero consolidar, validar y aprobar información estadística agregada de enfermedades por clínica, sector y período, para identificar patrones de riesgo poblacional en Melipilla y tomar decisiones informadas de asignación de recursos, sin exponer en ningún momento datos personales o identificables de pacientes.</mark>_ 

#### **Criterios de aceptación de la épica** 

- Ningún dato ingresado o importado puede asociarse a una persona identificable. 

- Todo registro nuevo pasa por un estado de revisión antes de impactar reportes oficiales. 

- Las tasas y niveles de riesgo solo se calculan cuando existe población base válida y asignada; si no existe, el sistema lo indica explícitamente. 

- Un usuario de clínica solo puede ver y operar sobre los datos de su propia clínica. 

- Toda acción destructiva exige confirmación explícita y muestra el impacto antes de ejecutarse. 

### **4.2 Sub-historias por rol** 

#### **Usuario de clínica** 

_<mark>Como usuario de clínica, quiero registrar o importar casos de mi clínica por enfermedad, edad, sexo, mes y año, para que se reflejen en las estadísticas de mi centro y sean enviados a aprobación del administrador.</mark>_ 

#### **Administrador — aprobación** 

_<mark>Como administrador, quiero revisar, comparar y aprobar o rechazar registros pendientes (manuales, importados o propuestos por IA), para asegurar que solo datos validados alimenten los reportes y el dashboard.</mark>_ 

#### **Administrador — configuración** 

_<mark>Como administrador, quiero configurar umbrales de riesgo y catálogos (enfermedades, rangos de edad, sectores) para adaptar la clasificación de riesgo a la realidad epidemiológica de Melipilla sin depender de cambios de código.</mark>_ 

#### **Administrador — investigación asistida** 

Página 6 de 16 

San Norberto Salud — PRD v1.0 

_<mark>Como administrador, quiero solicitar investigación asistida por un proveedor de IA sobre fuentes públicas oficiales, para acelerar la carga de datos de contexto, siempre revisando y aprobando manualmente antes de que se guarde como dato definitivo.</mark>_ 

## **5. Inconsistencias Detectadas y Decisiones de Diseño** 

Durante el análisis del planteamiento original se identificaron contradicciones y vacíos que fueron resueltos mediante decisiones explícitas antes de derivar los requisitos, evitando que la ambigüedad se propague al desarrollo. 

|**Ref.**|**Inconsistencia detectada**|**Decisión aplicada**|
|---|---|---|
|A|Estrategia "Mobile-First" declarada junto con prioridad<br>operativa de escritorio y ausencia de experiencia móvil<br>completa.|Se redefine como desktop-first con responsive<br>mínimo; Tailwind se usa como herramienta, no<br>como filosofía de priorización.|
|B|"sector_id" opcional en clínicas impide calcular tasas por<br>100.000 hab. cuando una clínica no tiene sector<br>asignado.|<br>"sector_id" pasa a ser obligatorio en la tabla<br>clinics.|
|C|La página institucional se declara "pública" pero se trata<br>como control de acceso mientras no exista dominio<br>propio.|Se documenta como pública sin datos sensibles;<br>no se presenta como control de seguridad real.|
|D|Se excluye "auditoría histórica completa" pero se exige<br>trazabilidad de aprobación (creado_por, aprobado_por,<br>fecha).|Se excluye el versionado histórico completo; se<br>mantiene trazabilidad básica como requisito<br>funcional, no como módulo de auditoría.|
|E|Se menciona "comparaciones autorizadas" para usuario<br>de clínica sin mecanismo definido en el modelo de datos.|<br>Se agrega el campo puede_ver_comparaciones<br>(booleano) en profiles, editable solo por el<br>administrador.|
|F|No existe referencia al marco legal chileno de protección<br>de datos aplicable a información sanitaria agregada.|<br>Se incorpora como requisito no funcional de<br>cumplimiento (Ley N.º 19.628 sobre Protección<br>de la Vida Privada).|
|G|Ausencia de requisitos no funcionales críticos: SLA,<br>backups, políticas de contraseña, volumetría esperada.|Se definen valores mínimos por defecto (ver<br>sección 7), ajustables según validación con el<br>cliente.|



## **6. Requisitos Funcionales (RF)** 

### **6.1 Autenticación y roles** 

|**ID**|**Requisito**|
|---|---|
|RF-01|El sistema debe permitir inicio de sesión solo mediante credenciales creadas por el administrador (sin<br>registro público).|
|RF-02|El sistema debe permitir recuperación de contraseña vía correo electrónico.|
|RF-03|El sistema debe restringir a cada usuario de clínica a los datos de su propia clínica mediante Row<br>Level Security.|
|RF-04|El administrador puede activar o desactivar el acceso a comparaciones por usuario (campo<br>puede_ver_comparaciones).|



Página 7 de 16 

San Norberto Salud — PRD v1.0 

### **6.2 Catálogos y configuración** 

|**ID**|**Requisito**|
|---|---|
|RF-05|El administrador puede crear, editar, desactivar y eliminar (sin dependencias) enfermedades,<br>padecimientos, rangos de edad, categorías de género y sectores.|
|RF-06|El sistema debe advertir superposición o vacíos en rangos de edad y umbrales de riesgo antes de<br>guardar.|
|RF-07|El administrador puede configurar umbrales de riesgo (tasa) y porcentuales por enfermedad, sector o<br>de forma global.|



### **6.3 Registro de datos** 

|**ID**|**Requisito**|
|---|---|
|RF-08|El usuario de clínica puede crear registros estadísticos con: enfermedad, rango de edad, género,<br>sector, mes, año y cantidad de casos.|
|RF-09|El sistema debe validar campos obligatorios y rechazar cantidades negativas, fechas inválidas o<br>denominadores poblacionales en cero.|
|RF-10|Antes de guardar, el sistema debe verificar duplicados por combinación de clínica/sector,<br>enfermedad, edad, género, mes y año, mostrando el registro existente si hay coincidencia.|
|RF-11|Todo registro nuevo o modificado queda en estado "pendiente de revisión" hasta la aprobación del<br>administrador.|
|RF-12|El administrador puede aprobar, rechazar o solicitar corrección desde el Centro de Aprobaciones,<br>visualizando comparación antes/después.|



### **6.4 Cálculo de indicadores** 

|**ID**|**Requisito**|
|---|---|
|RF-13|El sistema debe calcular la tasa por 100.000 habitantes usando el denominador de población<br>correspondiente (comuna, sector, sector por edad, sector por género).|
|RF-14|Si no existe población compatible, el sistema debe mostrar "Datos de población insuficientes" y no<br>calcular ni clasificar riesgo.|
|RF-15|El sistema debe calcular la variación porcentual entre períodos, mostrando un aviso especial cuando<br>el valor anterior sea cero.|
|RF-16|Los indicadores deben recalcularse automáticamente tras la aprobación de un registro, mediante<br>actualización en tiempo real.|



### **6.5 Importación y exportación** 

|**ID**|**Requisito**|
|---|---|
|RF-17|El sistema debe ofrecer una plantilla descargable (Excel/CSV) con columnas, ejemplos y valores<br>permitidos.|
|RF-18|El sistema debe validar estructura, normalizar texto y detectar duplicados —incluyendo variaciones<br>menores de escritura— en cada fila importada.|
|RF-19|El usuario debe poder previsualizar, corregir o excluir filas antes de confirmar la importación.|
|RF-20|El sistema debe exportar reportes en PDF (con logo, filtros, período y gráficos) y en Excel (con hojas<br>de resumen, registros e indicadores).|



Página 8 de 16 

San Norberto Salud — PRD v1.0 

### **6.6 Inteligencia artificial (agnóstica de proveedor)** 

|**ID**|**Requisito**|
|---|---|
|RF-21|El administrador puede solicitar investigación asistida mediante un proveedor de IA configurable,<br>registrando institución, URL, fecha y nivel de confianza de la fuente, independientemente del<br>proveedor subyacente.|
|RF-22|Toda propuesta generada por el proveedor de IA queda en estado "propuesta" y no puede escribirse<br>en tablas definitivas sin aprobación explícita del administrador; esta regla se aplica a nivel de Edge<br>Function, no depende del proveedor.|
|RF-23|El sistema debe mostrar predicciones estadísticas diferenciadas visualmente de los datos reales, con<br>período, variables utilizadas y nivel de confianza.|
|RF-26|El sistema debe permitir cambiar el proveedor de inteligencia artificial y/o de búsqueda web<br>mediante configuración de servidor, sin requerir cambios en el modelo de datos ni en el frontend.|



### **6.7 Dashboard y visualización** 

|**ID**|**Requisito**|
|---|---|
|RF-24|El dashboard debe mostrar tarjetas de KPI, evolución mensual y anual, distribución por<br>enfermedad/edad/género, comparaciones y mapa de riesgo por sector.|
|RF-25|El mapa debe representar los sectores con color según nivel de riesgo, con soporte inicial por<br>coordenadas y preparación futura para capas GeoJSON.|



## **7. Requisitos No Funcionales (RNF)** 

### **7.1 Seguridad** 

|**ID**|**Requisito**|
|---|---|
|RNF-01|Row Level Security activo en todas las tablas privadas; ningún dato accesible sin política explícita.|
|RNF-02|Las credenciales de cualquier proveedor externo (IA, búsqueda web, mapas, correo) se gestionan<br>como secretos de servidor intercambiables, nunca expuestas en frontend ni en el repositorio de<br>código.|
|RNF-03|Toda ruta privada requiere sesión autenticada válida.|
|RNF-04|Política mínima de contraseñas gestionada por el proveedor de autenticación; expiración de sesión<br>configurable (sugerido: 8 horas de inactividad).|
|RNF-05|(Recomendado, a validar con el cliente) Habilitar autenticación de dos factores para el rol<br>administrador.|



### **7.2 Cumplimiento y privacidad** 

|**ID**|**Requisito**|
|---|---|
|RNF-06|El sistema no debe almacenar ni procesar identificadores personales (RUT, nombre, dirección,<br>teléfono, ficha médica) en ninguna tabla.|
|RNF-07|El tratamiento de datos agregados debe alinearse con la Ley N.º 19.628 sobre Protección de la Vida<br>Privada de Chile.|
|RNF-08|La página institucional pública debe documentarse como "acceso no restringido técnicamente", sin<br>presentarse como control de seguridad ante el cliente.|



Página 9 de 16 

San Norberto Salud — PRD v1.0 

### **7.3 Rendimiento y disponibilidad** 

|**ID**|**Requisito**|
|---|---|
|RNF-09|El dashboard debe cargar los KPIs principales en menos de 3 segundos con hasta aproximadamente<br>50.000 registros históricos (valor a validar con el cliente).|
|RNF-10|La actualización en tiempo real de indicadores tras la aprobación debe completarse en menos de 5<br>segundos.|
|RNF-11|Disponibilidad objetivo del 99% (dependiente del SLA del proveedor de backend; a confirmar si se<br>requiere un nivel mayor).|
|RNF-12|Copias de respaldo automáticas diarias, con retención mínima de 30 días.|



### **7.4 Usabilidad y accesibilidad** 

|**ID**|**Requisito**|
|---|---|
|RNF-13|Cumplir contraste WCAG AA mínimo; ningún estado de riesgo debe depender solo del color (usar<br>ícono y etiqueta).|
|RNF-14|Navegación completa por teclado y etiquetas para lectores de pantalla en formularios críticos.|
|RNF-15|Todas las pantallas deben implementar los estados obligatorios: carga, vacío, error, sin permisos, sin<br>resultados, éxito, advertencia, error de validación, error de conexión y reintento.|



### **7.5 Mantenibilidad y escalabilidad** 

|**ID**|**Requisito**|
|---|---|
|RNF-16|La estructura de clinicas y sectores debe permitir agregar nuevos campos sin romper registros<br>existentes (migraciones aditivas).|
|RNF-17|El sistema debe soportar la incorporación futura de capas GeoJSON sin rediseño del modelo de<br>sectores.|
|RNF-18|Trazabilidad básica obligatoria (creado_por, aprobado_por, fecha_aprobación) en todo registro, sin<br>requerir un módulo de auditoría histórica completo en esta versión.|
|RNF-19|La arquitectura debe implementar un patrón adaptador (adapter/facade) en la capa de funciones de<br>servidor para servicios de IA y búsqueda, de forma que agregar o reemplazar un proveedor no<br>requiera modificar lógica de negocio, tablas ni políticas de acceso.|
|RNF-20|El sistema no debe acoplar nombres de proveedor específicos en el código de negocio; estos valores<br>deben vivir en configuración o variables de entorno.|
|RNF-21|Las reglas críticas de negocio (cálculo de tasas, prevención de duplicados) deben contar con pruebas<br>automatizadas a nivel de base de datos, además de pruebas de interfaz y de extremo a extremo.|



## **8. Roles y Permisos** 

|**Acción**|**Administrador**|**Usuario de clínica**|
|---|---|---|
|Consultar y gestionar toda la información|Sí|No|
|Consultar y gestionar datos de su propia clínica|Sí|Sí|
|Acceder a datos privados de otras clínicas|Sí|No|
|Crear, modificar, desactivar o eliminar usuarios|Sí|No|
|Acceder al módulo de gestión de usuarios|Sí|No|



Página 10 de 16 

San Norberto Salud — PRD v1.0 

|**Acción**<br>**Administrador**|**Usuario de clínica**|
|---|---|
|Modificar umbrales globales y catálogos protegidos<br>Sí|No|
|Aprobar o rechazar registros e importaciones<br>Sí|No|
|Aprobar propuestas de inteligencia artificial<br>Sí|No|
|Ver comparaciones entre clínicas o sectores<br>Sí|Solo si está autorizado<br>(puede_ver_comparaciones)|



## **9. Arquitectura de Datos** 

El modelo de datos se organiza en catálogos configurables, tablas de población, tablas de registros estadísticos y tablas de soporte a inteligencia artificial e importaciones. A continuación se detallan las entidades principales. 

|**Entidad**|**Descripción**|
|---|---|
|profiles|Datos complementarios de usuarios autenticados: id, auth_user_id, nombre, apellido,<br>correo, rol, clinic_id (opcional para admin), puede_ver_comparaciones, estado, fechas.|
|clinics|Clínicas de la comuna: id, nombre, nombre_corto, dirección, teléfono, correo, sector_id<br>(obligatorio), coordenadas, responsable, estado, fechas.|
|diseases|Catálogo de enfermedades y padecimientos: id, nombre, tipo, descripción, código de<br>referencia, estado.|
|age_ranges|Catálogo de rangos de edad (adolescencia, juventud, adultez media, tercera y cuarta<br>edad), con validación de superposición y cobertura.|
|gender_categories|Catálogo editable de sexo o género: femenino, masculino, otro, no informado.|
|sectors|Sectores o divisiones territoriales de Melipilla, preparados para evolucionar de nombres<br>a coordenadas o polígonos GeoJSON.|
|commune_population|Población total de la comuna por año, con fuente y estado de validación.|
|sector_population|Población total de cada sector por año.|
|demographic_population|<sup>Población por sector, año, rango de edad y género, con restricción única para evitar</sup><br>duplicados.|
|health_records|Registros estadísticos agregados: alcance (clínica o sector), clínica, sector, enfermedad,<br>edad, género, mes, año, cantidad de casos, estado, origen, fuente, creado_por,<br>aprobado_por, fecha_aprobación.|
|risk_thresholds|Umbrales de riesgo por tasa (bajo, medio, alto, extremo), configurables por enfermedad,<br>sector o de forma global.|
|percentage_thresholds|Umbrales porcentuales configurables por enfermedad, padecimiento o indicador.|
|data_sources|Fuentes utilizadas para datos externos o investigados por IA: institución, título, URL,<br>fecha, tipo, nivel de confianza.|
|import_batches /<br>import_rows|Control de importaciones desde Excel o CSV y de la validación fila por fila, incluyendo<br>duplicados y errores.|
|ai_research_requests /<br>ai_data_proposals|Solicitudes de investigación asistida y propuestas de datos generadas por el proveedor de<br>IA, sujetas a aprobación explícita antes de pasar a tablas definitivas.|



Página 11 de 16 

San Norberto Salud — PRD v1.0 

### **9.1 Cálculos principales** 

#### **Tasa por cada 100.000 habitantes** 

_<mark>Tasa = (cantidad de casos / población correspondiente) × 100.000</mark>_ 

El denominador se selecciona según el análisis: población total de la comuna, del sector, del sector para un rango de edad, o del sector para un sexo o género. Si no existe población compatible, no se calcula la tasa y se indica "Datos de población insuficientes". 

#### **Variación porcentual entre períodos** 

_<mark>Variación = ((valor actual - valor anterior) / valor anterior) × 100</mark>_ 

Si el valor anterior es cero, no se realiza la división; se muestra una indicación especial explicando que no es posible calcular una variación porcentual convencional. 

## **10. Arquitectura Técnica General** 

La solución se organiza en tres capas: interfaz de usuario (frontend), plataforma de backend como servicio, y una capa adaptadora agnóstica de proveedor para servicios de inteligencia artificial y búsqueda externa. 

#### **Capa 1 — Frontend (SPA privada)** 

- React 18 + TypeScript + Vite, consumiendo el backend mediante el SDK oficial del proveedor de backend. 

#### **Capa 2 — Backend como servicio** 

- Autenticación de usuarios y manejo de sesión. 

- Base de datos relacional con seguridad a nivel de fila (Row Level Security). 

- Almacenamiento de archivos (plantillas, logotipos, importaciones). 

- Canales de actualización en tiempo real. 

- Funciones de servidor (Edge Functions) para lógica protegida y llamadas externas. 

- Funciones y vistas SQL para cálculos estadísticos centralizados. 

#### **Capa 3 — Adaptador de servicios externos (agnóstico de proveedor)** 

- Interfaz interna única para el proveedor de inteligencia artificial, seleccionado por variable de entorno. 

- Interfaz interna única para el proveedor de búsqueda web, seleccionado por variable de entorno. 

- Ningún nombre de proveedor específico se referencia en la lógica de negocio ni en el modelo de datos. 

Página 12 de 16 

San Norberto Salud — PRD v1.0 

## **11. Stack Tecnológico** 

### **11.1 Selección final** 

|**Categoría**|**Tecnología elegida**|**Justificación**|
|---|---|---|
|Framework frontend|React 18 + Vite + TypeScript|SPA privada sin necesidad de SSR/SEO; ecosistema más<br>maduro para las librerías requeridas (tablas, gráficos,<br>mapas).|
|UI Kit|ShadCN sobre Radix + Tailwind<br>CSS|Accesible por defecto, control total de estilos, coherente<br>con identidad clínica institucional.|
|Data fetching|TanStack Query|Cache automático y sincronización con actualizaciones en<br>tiempo real.|
|Estado global de UI|Zustand|Liviano, ideal para filtros compartidos del dashboard<br>(período, sector).|
|Formularios y<br>validación|React Hook Form + Zod|Alto rendimiento; un único esquema de validación<br>reutilizable en cliente y servidor.|
|Tablas de datos|TanStack Table|Headless, se integra completamente con el theming de<br>ShadCN.|
|Gráficos|Recharts (Nivo como<br>complemento para mapas de<br>calor)|Balance entre simplicidad de implementación y calidad<br>visual.|
|Mapas|MapLibre GL JS|Open source, sin costo por uso, agnóstico de proveedor,<br>soporta GeoJSON nativo.|
|Exportación Excel|ExcelJS|Permite exportar con colores de riesgo y formato<br>condicional, más completo que alternativas básicas.|
|Lectura CSV|PapaParse|Estándar de la industria, soporta streaming para archivos<br>grandes.|
|Exportación PDF|Puppeteer/Playwright (servicio<br>dedicado) o pdf-lib (dentro de<br>funciones de servidor)|Puppeteer ofrece mejor fidelidad visual (HTML a PDF);<br>pdf-lib mantiene todo dentro de la infraestructura de<br>funciones de servidor.|
|Backend como<br>servicio|Supabase (PostgreSQL,<br>autenticación, almacenamiento,<br>tiempo real, funciones de<br>servidor)|Row Level Security nativo, velocidad de desarrollo y<br>madurez de integración con React.|
|Capa de IA agnóstica|<sup>Vercel AI SDK dentro de</sup><br>funciones de servidor|Ya diseñado para intercambiar proveedores por<br>configuración; evita construir el patrón adaptador desde<br>cero.|
|Pruebas|Vitest (unitarias) + Playwright<br>(extremo a extremo) + pgTAP<br>(funciones SQL)|Cobertura en los tres niveles: frontend, flujo completo y<br>reglas de negocio críticas en base de datos.|
|Manejo de fechas|date-fns|Liviano y suficiente al operar en un único huso horario.|
|Notificaciones de<br>interfaz|Sonner|Mismo lenguaje visual que ShadCN para confirmaciones<br>de guardado y aprobación.|



Página 13 de 16 

San Norberto Salud — PRD v1.0 

### **11.2 Alternativas evaluadas por categoría** 

|**Categoría**|**Alternativas consideradas y motivo de descarte**|
|---|---|
|Data fetching|SWR (más liviano, menos features de cache); Redux Toolkit (robusto pero<br>sobredimensionado para este alcance).|
|Formularios|Formik + Yup (más antiguo, más re-renders); Valibot (bundle menor, ecosistema más joven).|
|Tablas|AG Grid Community (funciones tipo Excel avanzadas, pero estilo propio y versión avanzada<br>de pago); Mantine DataTable (choca con el sistema de diseño ShadCN).|
|Gráficos|Visx (control total tipo D3, más código); Chart.js (liviano pero basado en canvas, menos<br>idiomático en React).|
|Mapas|Leaflet (muy maduro pero renderizado 2D más simple); Google Maps API (descartada por<br>atar la solución a un proveedor específico, contrario al criterio de agnosticismo).|
|PDF|jsPDF + autotable (simple pero generado en cliente, menos seguro para reportes<br>institucionales).|
|Framework frontend|Vue 3 (ecosistema de componentes tipo ShadCN menos maduro); Svelte/SvelteKit (menor<br>disponibilidad de desarrolladores para mantenimiento de largo plazo); Angular (curva de<br>aprendizaje alta, sobredimensionado); Next.js (SSR/SEO no aportan valor en una SPA<br>privada detrás de login).|



## **12. Lineamientos de Diseño UI/UX** 

### **12.1 Identidad visual** 

Nombre legal: SOCIEDAD DE SERVICIOS SOCIALES Y DE SALUD SAN NORBERTO Ltda. — Nombre visible: San Norberto Salud. 

Estilo: clínico, moderno, institucional, profesional, confiable, claro y orientado a datos. 

### **12.2 Paleta de colores** 

- Azul clínico como color principal; verde salud como color secundario. 

- Blanco para superficies; grises suaves para fondos; azul oscuro para textos. 

- Colores de riesgo editables: bajo (verde), medio (amarillo), alto (naranja), extremo (rojo), siempre acompañados de ícono y etiqueta. 

### **12.3 Estructura de dashboard** 

- Menú lateral, encabezado superior, migas de navegación, tarjetas de KPI, panel de filtros, gráficos, tablas, alertas y acciones rápidas. 

- Menú principal: Dashboard, Clínicas, Sectores, Población, Enfermedades y Padecimientos, Registros, Comparaciones, Reportes, Investigación IA, Aprobaciones, Usuarios, Configuración — visible según permisos. 

### **12.4 Accesibilidad y responsividad** 

- Navegación completa por teclado, contraste adecuado, foco visible y etiquetas para lectores de pantalla. 

- Prioridad de diseño en escritorio, con adaptación responsive básica para tablets: menú colapsable, tablas con desplazamiento horizontal, sin priorizar una experiencia móvil completa. 

Página 14 de 16 

San Norberto Salud — PRD v1.0 

## **13. Fases de Implementación** 

### **13.1 Orden obligatorio** 

|**Orden**|**Actividad**|
|---|---|
|1|Diseñar el frontend completo con datos de prueba claramente identificados como demo.|
|2|Validar el diseño visual con el propietario del producto.|
|3|Conectar la plataforma de backend (creación de proyecto, tablas, relaciones, restricciones e índices).|
|4|Configurar autenticación y seguridad (Row Level Security, políticas por rol y clínica).|
|5|Implementar datos y lógica de negocio (formularios, dashboard, filtros, aprobación).|
|6|Implementar importaciones y exportaciones (Excel, CSV, PDF).|
|7|Implementar mapas (MapLibre, sectores, niveles de riesgo).|
|8|Implementar actualización en tiempo real.|
|9|Implementar la capa de inteligencia artificial agnóstica de proveedor.|
|10|Realizar pruebas de permisos, duplicados, cálculos y reportes (Vitest, Playwright, pgTAP).|



_<mark>Si el usuario propietario del producto adjunta un diseño de frontend, dashboard o logotipo, este debe utilizarse como referencia visual principal. No se debe modificar arbitrariamente estructura, paleta, componentes, jerarquía o distribución; los cambios por accesibilidad, seguridad o usabilidad deben mantener el lenguaje visual y explicar el ajuste realizado.</mark>_ 

### **13.2 Estado actual de implementación (nota viva)**

_Esta sección se actualiza a medida que avanza el desarrollo; no reemplaza el alcance ni las decisiones de las secciones anteriores, solo registra qué está conectado a Supabase real hoy._

- **Paso 1 (frontend con datos de prueba)**: completo. SPA React/Vite/TS en `app/`, con datos demo (`IS_DEMO_DATA`).
- **Paso 3 (conectar backend) y Paso 4 (autenticación y RLS)**: iniciados en local (Docker), con alcance mínimo viable:
  - **Sección 6.1 completa contra Supabase real**: `RF-01` (login solo con cuentas creadas por el administrador; registro público deshabilitado a nivel de GoTrue y gestión de usuarios vía Edge Function `admin-users` con invitación por correo), `RF-02` (recuperación de contraseña por correo con página `/restablecer-contrasena`; en local los correos se capturan en Mailpit), `RF-03` (RLS verificado por rol/clínica) y `RF-04` (`puede_ver_comparaciones` editable por el administrador y aplicado por el guard de Comparaciones).
  - Conectado a Supabase real (`VITE_USE_SUPABASE=true`): catálogos `sectors`, `clinics`, `diseases`, `age_ranges`, `gender_categories`, `profiles`, el flujo núcleo `health_records` (RF-08 a RF-16), con Row Level Security activo (`RNF-01`).
  - **Sección 6.2 conectada a Supabase real**: `commune_population`, `sector_population`, `demographic_population` (gestión de población desde la página Población), `risk_thresholds` y `percentage_thresholds` (umbrales configurables desde Configuración, `RF-07`); la validación de superposición de rangos de edad (`RF-06`) opera sobre los datos reales.
  - **Secciones 6.3 y 6.4 verificadas contra Supabase real**: validaciones de formulario (`RF-09`), estado pendiente al crear y al modificar con limpieza de campos de aprobación (`RF-11`), Centro de Aprobaciones con aprobar/rechazar/solicitar corrección y motivo persistido (`RF-12`), ciclo de corrección completo (usuario de clínica edita registros en "requiere_correccion"), tasa por 100.000 con denominador real (`RF-13`), mensaje "Datos de población insuficientes" (`RF-14`) y aviso de variación con período anterior en cero (`RF-15`). `RF-16` verificado: la tabla `health_records` está en la publicación `supabase_realtime` y el frontend se suscribe globalmente (`useHealthRecordsRealtime`), invalidando dashboard y listas ante cualquier cambio — probado con una aprobación disparada fuera del navegador, reflejada sin recargar.
  - **Sección 6.5 (RF-17/18/19) verificada contra Supabase real**: plantilla CSV descargable, validación de estructura y normalización de texto contra los catálogos reales, detección de duplicados (incluida la fila con advertencia forzada a incluir), y previsualización con inclusión/exclusión fila por fila. Se conectó además `import_batches`/`import_rows` (antes sin usar en ningún flujo): cada carga queda registrada con su detalle por fila (`numero_fila`, `estado`, `errores`, `es_posible_duplicado`, `health_record_id`), cerrando el hueco entre el esquema del PRD §9 y la UI existente.
  - **RF-20 verificado contra Supabase real** (sin cambios de código: `ReportsPage`/`useReportData` ya dependían de repositorios ya conectados): exportación Excel con hojas Resumen/Registros/Indicadores (`exportReportToExcel`, ExcelJS) y exportación PDF vía impresión del navegador con logo, filtros, período y gráfico (`ReportPreview` + `window.print()`).
  - **Sección 6.6 (RF-21/22/23/26) implementada y verificada contra Supabase real**: nueva Edge Function `ai-research` con capa adaptadora agnóstica de proveedor (`AI_PROVIDER`, RNF-19/20) — proveedor `mock` por defecto (determinístico, sin API key) y `anthropic` como proveedor real de referencia. La función verifica que el llamante sea administrador activo (RF-21, probado con 403 para usuario de clínica), siempre crea la propuesta con `estado='propuesta'` sin importar el proveedor (RF-22, verificado con aprobación completa: `revisado_por`/`fecha_revision`), y registra las fuentes citadas en `data_sources`. `AiProposalCard` ya diferenciaba visualmente las propuestas de IA de los datos reales (RF-23, borde punteado + rótulo + nivel de confianza + variables). `data_sources`, `ai_research_requests` y `ai_data_proposals` conectados a Supabase real.
  - Con esto, todas las tablas del esquema del PRD §9 están conectadas a Supabase real; el modo demo (`IS_DEMO_DATA`) sigue disponible como fallback sin Docker.
  - **RF-25 implementado**: mapa real por coordenadas de sector (`SectorRiskMap`, MapLibre GL JS sobre teselas OSM sin costo ni API key) en reemplazo del mapa esquemático anterior, coloreado por nivel de riesgo con etiqueta visible (RNF-13), popup con población/tasa/riesgo, y fuente GeoJSON de puntos preparada para migrar a polígonos reales cuando `sectors.geojson` se complete (RNF-17). Verificado el pipeline de datos (coordenadas, colores por riesgo, "sin datos" cuando falta población) contra Supabase real; la verificación visual por captura de pantalla no fue posible en el entorno de pruebas automatizado (la pestaña queda en estado no-visible, lo que pausa el ciclo de render de WebGL) — pendiente de confirmación visual manual.
  - **RF-24 (dashboard)**: KPIs, gráficos y ranking de sectores ya verificados contra datos reales en iteraciones previas; no incluye el mapa (vive en la página Sectores).
  - Esquema y políticas RLS: `supabase/migrations/`. Instancia local vía `npx supabase start` (ver README del repositorio).
- **Paso 10 (pruebas)**: no iniciado; `RNF-21` (pgTAP, Vitest, Playwright sobre reglas críticas) queda para una fase posterior.

## **14. Anexo — Dependencias Técnicas** 

### **14.1 Frontend** 

- react, typescript, vite 

- tailwindcss, shadcn-ui 

- react-router-dom 

- @tanstack/react-query, @tanstack/react-table 

- zustand 

- react-hook-form, zod 

- recharts (+ nivo opcional) 

- maplibre-gl 

- lucide-react 

- papaparse, exceljs 

- date-fns 

- sonner 

### **14.2 Backend (funciones de servidor)** 

- SDK oficial del proveedor de backend (cliente de base de datos, autenticación, almacenamiento, tiempo real) 

- Vercel AI SDK (capa agnóstica de proveedor de inteligencia artificial) 

Página 15 de 16 

San Norberto Salud — PRD v1.0 

- Librería de generación de PDF compatible con el entorno de funciones de servidor, o servicio dedicado con Puppeteer/Playwright 

- pdf-lib como alternativa liviana dentro de funciones de servidor 

### **14.3 Pruebas** 

- Vitest (unitarias) 

- Playwright (extremo a extremo) 

- pgTAP (funciones SQL críticas: tasas y duplicados) 

_Fin del documento. Este PRD debe ser confirmado en modo conversación por el equipo de desarrollo antes de iniciar la generación de código, validando arquitectura, pantallas, tablas y relaciones, roles y permisos, reglas de seguridad, orden de implementación, integraciones, puntos que requieran credenciales o decisiones del propietario, riesgos técnicos detectados y funcionalidades fuera de alcance._ 

Página 16 de 16 

