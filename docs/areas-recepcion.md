# Acceso por áreas y recepción — implementación

Plan aprobado: cuentas personales; roles admin/general/area; general se presenta como Comunicación. Aprobación exige perfil explícito y áreas para responsables. Cada asignación puede habilitar gestión después de capacitación. Comunicación crea/publica, áreas consultan/exportan. Resultados privados. Correo por trámite, aviso con enlace vía Ultramail. Guardado e incorporación a cola atómicos. Histórico conservado.

## Contratos compartidos

AlMinisterio: `userAreaMemberships(userId, areaSlug, canManageTramites)`; `users.accessVersion`; `siteTramites.notificationEmail`, `archivedAt`; `siteTramiteSubmissions(id, tramiteId, idempotencyKey, tramiteTitle, areaSlug, fieldsSnapshot, answers, createdAt)`; `siteTramiteEmailJobs(id, submissionId, recipient, status, attempts, nextAttemptAt, lockedAt, lastError, providerMessageId, providerLogId, createdAt, updatedAt)`.

Sesión: `areaMemberships: { areaSlug: string; canManageTramites: boolean }[]`, `accessVersion: number`. Funciones puras `canAccessArea(session, slug)`, `canManageAreaTramites(session, slug)`, `defaultSessionPath(session)` en `lib/auth/area-access.ts`. `general` y `admin` gestionan trámites globalmente. `general` lee resultados solo de áreas asignadas; admin de todas. `general` ministerial se resuelve a atencion-sede.

## Trabajo

- [x] Esquema, migraciones y contrato de recepción.
- [x] Acceso, aprobación y navegación por áreas.
- [x] CMS: correo por trámite, aislamiento de gestión y archivo.
- [x] Sitio público: persistencia, validación, idempotencia y límites.
- [x] Bandejas, detalle histórico y CSV.
- [x] Cola persistente, integración Ultramail y reenvío administrativo.
- [x] Tipos, lint de archivos modificados, pruebas de comportamiento, revisión integrada y guía de puesta en marcha.

## Decisiones de ejecución

Se trabaja en los directorios solicitados; rama AlMinisterio `codex/areas-solicitudes`. No se modifica el trabajo previo de Ultramail. La configuración del remitente, plantilla, API key y cron de producción se documenta sin enviar mensajes ni desplegar durante el desarrollo. El bootstrap de registro público no concede administración automáticamente: todos los nuevos registros deben ser aprobados por un administrador existente.

Ruling: retirar siempre archiva, incluso sin envíos — evita pérdida si el retiro compite con una solicitud — costo: conservar borradores/imágenes en almacenamiento.

Ruling: lease de envío interrumpido pasa a fallido y requiere revisión/manual — la API Ultramail no permite confirmar idempotencia SMTP tras una respuesta perdida — costo: intervención administrativa ante interrupciones.

Ruling: las fichas de áreas del sitio público no muestran resultados personales — «página de cada área» es la bandeja privada de AlMinisterio, siguiendo el plan aprobado — costo: responsables necesitan login.

## Revisión integrada

Revisor independiente, solo lectura: tres hallazgos importantes reproducidos y corregidos con RED→GREEN. SQL de CMS verifica actor aprobado/versión vigente también al persistir tras subir imagen; CSV conserva títulos históricos renombrados y etiquetas de opciones; reintentos consultan primero el snapshot persistido y recuperan su recepción aunque cambie o se retire el formulario. Hallazgo de avisos antiguos: se agregó paginación para mantener su reenvío accesible. UUIDs malformados y alias `general` en rutas privadas se rechazan antes de consultar.

PostgreSQL aislado con migraciones reales: aprobado; incluye aprobación/asignaciones atómicas, protección del último administrador, sesión obsoleta, revocación entre inicio y commit del CMS, recepción y outbox atómicos, límites e idempotencia, privilegios e histórico, cola sin reprocesar confirmados. Producción/SMTP y recorrido visual quedan para activación según [puesta-en-marcha-areas.md](./puesta-en-marcha-areas.md).

Verificación final: 26/26 pruebas AlMinisterio y 11/11 recepción pública; fixture PostgreSQL aprobado; TypeScript sin errores en ambos; builds de producción aprobados (Next 15 AlMinisterio, webpack en Next 16 público); lint de archivos modificados sin errores y `git diff --check` limpio. Lint global público conserva dos errores previos `react-hooks/set-state-in-effect` en `components/Header.tsx:26` y `components/Select.tsx:110`, sin cambios de esta tarea. AlMinisterio mantiene advertencias preexistentes de imágenes/accesibilidad.

La skill `next-dev-loop` no pudo completar la verificación visual: AlMinisterio usa Next 15 (la skill exige ≥16.3) y no existe `agent-browser` instalado. No se actualizaron versiones ni se instaló globalmente para sortearlo; la comprobación de navegador/hosting se deja explícita para puesta en marcha. Turbopack público no puede abrir su puerto de worker en el sandbox; webpack compila correctamente. No se efectuó merge/push/commit ni despliegue.

## Contrato de recepción pública

`site_tramite_submissions.request_fingerprint text NOT NULL` liga el intento UUID al cliente y sus respuestas con HMAC. La acción pública solo devuelve `{ ok, errors, receiptId? }`; el DTO de trámite agrega `acceptsSubmissions` y nunca expone `notification_email`.

La migración `0069_site_form_submission.sql`, después de `0068`, define `public.receive_site_tramite_submission(id uuid, tramite_id uuid, idempotency_key uuid, request_fingerprint text, rate_key text, raw_fields jsonb, fields_snapshot jsonb, answers jsonb) RETURNS TABLE(status text, receipt_id uuid)`. Estados: `accepted`, `replayed`, `rate_limited`, `unavailable`, `conflict`, `configuration_changed`. Usa los valores de correo, título y área del registro original, con `general` → `atencion-sede`, y guarda solicitud + trabajo pendiente + contador en una transacción. La función usa privilegios del llamador y revoca ejecución a `PUBLIC`.

Sitio público: `SUBMISSION_RATE_LIMIT_SECRET` de al menos 32 caracteres y `SUBMISSION_TRUSTED_IP_HEADER` sobrescrito por el proveedor (Netlify por defecto). Cupo persistente de diez solicitudes aceptadas por cliente en diez minutos; reintentos idénticos no consumen cupo ni duplican avisos. Ver `docs/recepcion-publica.md` para puesta en marcha y permisos de base de datos.
