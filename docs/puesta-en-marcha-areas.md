# Puesta en marcha: áreas y recepción

Implementación repartida entre `alministerio` (cuentas, trámites, bandejas y avisos) y `paginaministerio` (formulario público). No se modifica Ultramail: se consume su API existente. Todos los resultados son privados en AlMinisterio; nunca se publican en las fichas de las áreas del sitio público.

## Orden de activación

1. Respaldar Neon y probar las migraciones en una rama descartable. Aplicar en orden `alministerio/drizzle/0068_area_access_and_submissions.sql` y `0069_site_form_submission.sql`, después de las migraciones anteriores. No ejecutar `db:push` como sustituto: no instala la función de recepción. Si la base ya usa el journal de Drizzle, ejecutar su mecanismo habitual de migración; si no, ejecutar ambos archivos SQL por separado en Neon y mantener registro. No volver a aplicar a mano tablas que ya creó el migrador.
2. Desplegar AlMinisterio con estas migraciones ya instaladas. Los tokens anteriores se invalidan: las personas deben iniciar sesión nuevamente. Mantener al menos un administrador aprobado existente. El registro público ahora siempre queda pendiente, nunca crea administradores automáticamente.
3. En Usuarios, aprobar cada cuenta eligiendo explícitamente perfil y áreas. Responsable de área exige al menos una de las 13 áreas. La capacitación queda desactivada; habilitarla después permite crear, editar, publicar y archivar solo dentro de las áreas asignadas. Comunicación puede gestionar trámites de todas las áreas, pero necesita asignaciones para consultar sus solicitudes.
4. En Trámites, configurar **Correo para avisos de resultados** y revisar los campos de cada formulario publicado. Los borradores pueden no tener correo. Los formularios anteriores sin correo conservan la ficha y temporalmente no reciben solicitudes. `general` recibe en Atención en sede; áreas desconocidas se rechazan.
5. Configurar Ultramail como se describe abajo, todavía sin activar el cron.
6. Configurar y desplegar paginaministerio con `DATABASE_URL`, `SUBMISSION_RATE_LIMIT_SECRET` privado de al menos 32 caracteres y `SUBMISSION_TRUSTED_IP_HEADER` adecuado al proxy. Ambas aplicaciones deben usar la misma `DATABASE_URL` de Postgres (Supabase o Neon). El sitio público no usa el driver HTTP de Neon. Los permisos mínimos del rol de recepción están en [recepcion-publica.md](./recepcion-publica.md).
7. Ejecutar una solicitud de prueba con datos de prueba y un correo autorizado. Comprobar la bandeja, el detalle y el CSV con cuenta del área. Con una cuenta de otra área, probar la URL privada y la exportación directa: no deben permitir acceso. Cambiar permisos y comprobar que se exige volver a ingresar.
8. Activar el cron externo cada minuto: `GET https://DOMINIO_ALMINISTERIO/api/cron/tick`, encabezado `Authorization: Bearer CRON_SECRET` o `x-cron-secret`. No poner secretos en la URL. Si existe protección de deployment, configurar también su bypass de automatización. Probar primero la llamada sin credencial (401) y con credencial. Revisar **Avisos** y el correo recibido.

## Plantilla de Ultramail

En el panel actual de Ultramail, crear una plantilla:

- Nombre: `AlMinisterio — solicitud recibida`.
- Asunto: `Nueva solicitud recibida en AlMinisterio`.
- HTML: contenido de [ultramail-solicitud.html](./ultramail-solicitud.html).
- Variables: `tramite`, `area`, `fecha`, `solicitud_id`, `url_resultado`.

El asunto es fijo para no reutilizar variables escapadas para HTML en texto plano. El adaptador escapa los metadatos, porque el motor actual de Ultramail hace reemplazo simple. No agregar respuestas ni datos personales al aviso. Elegir un remitente existente y verificado; generar una API key destinada a AlMinisterio. Guardar los identificadores de plantilla y remitente, no sus nombres.

Variables privadas en AlMinisterio:

```dotenv
ULTRAMAIL_URL=https://DOMINIO_ULTRAMAIL
ULTRAMAIL_API_KEY=CLAVE_PRIVADA
ULTRAMAIL_TEMPLATE_ID=ID_PLANTILLA
ULTRAMAIL_SENDER_ID=ID_REMITENTE
APP_PUBLIC_URL=https://DOMINIO_ALMINISTERIO
CRON_SECRET=SECRETO_PRIVADO
```

No usar prefijo `NEXT_PUBLIC_` para las credenciales ni copiarlas al sitio público. Se exige HTTPS en producción. El envío usa `POST /api/send` y `X-API-Key` exclusivamente desde el servidor.

## Operación de la cola

Cada solicitud y su aviso pendiente se guardan juntos. El destinatario queda congelado al recibirla. El cron reclama hasta cinco trabajos por ejecución, sin que dos ejecuciones reclamen el mismo aviso. Guarda intentos, último error e identificadores de confirmación de Ultramail. Después del primer fallo transitorio se programan hasta tres reintentos: 1, 5 y 30 minutos. Los fallos permanentes/configuración se muestran a Administración en **Avisos**, con paginación y reenvío manual.

Un fallo del correo nunca elimina la solicitud. Los avisos confirmados no se vuelven a procesar. Una ejecución interrumpida con estado ambiguo pasa a fallida después de cinco minutos: revisar el registro de Ultramail antes de usar **Reintentar aviso**, para evitar un correo duplicado. Un timeout de red también puede ocurrir después de una entrega SMTP: la API existente no ofrece idempotencia de entrega; revisar sus logs ante reclamos de duplicación.

## Histórico y pruebas

Retirar un trámite lo archiva. No se eliminan solicitudes ni imágenes anteriores. La bandeja conserva el área que recibió originalmente la solicitud, aunque luego cambie el trámite. Detalle y CSV usan los títulos/campos/opciones históricos; columnas renombradas se conservan por separado. El CSV tiene BOM UTF-8, CRLF, comillas y protección contra fórmulas para Excel.

Un reintento idéntico recupera la misma recepción incluso tras retirar o modificar el formulario. Se valida con el snapshot guardado y la huella ligada a cliente y respuestas; no permite recuperar solicitudes ajenas. Rotar el secreto de recepción o cambiar la IP impide confirmar intentos antiguos, aunque el registro original se conserva.

Verificaciones locales reproducibles:

```sh
# En alministerio
node --import tsx --test lib/*.test.ts lib/auth/*.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
# Instalar PGlite en un directorio temporal de pruebas y pasar su módulo:
node --import tsx scripts/verify-submission-db.mjs /RUTA_TEMP/node_modules/@electric-sql/pglite/dist/index.js

# En paginaministerio
node --import ../alministerio/node_modules/tsx/dist/loader.mjs --test tests/tramite-reception.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
```

El fixture PostgreSQL usa una base en memoria y nunca carga credenciales. Comprueba migraciones reales, rollback de solicitud/contador/aviso, histórico, límites, archivo, privilegios, aprobación atómica, revocación durante una edición y no reprocesar avisos confirmados. No sustituye la prueba de hosting, SMTP ni el recorrido visual con cuentas reales.

## Estado de activación — 28 de septiembre de 2026

- MCP oficial de Neon registrado y autorizado. Proyecto existente `AlMinisterio`, rama principal `production`. La rama aislada `codex-areas-recepcion-20260928` conserva una copia para pruebas y caduca el 30 de septiembre a las 00:00 UTC. Las credenciales locales no se cambiaron a esa rama.
- Las migraciones `0068` y `0069` pasaron en la rama aislada con Drizzle: tablas, función, solicitud y aviso atómicos, idempotencia, área histórica, Atención en sede y reintento después del archivo. Los datos de prueba se revirtieron. Después se aplicaron ambas migraciones a producción con autorización del administrador. El journal preexistente estaba vacío; se ejecutaron exclusivamente estos dos archivos y Drizzle registró sus hashes y fechas, sin volver a ejecutar las migraciones anteriores.
- AlMinisterio publicado en [al-ministerio.vercel.app](https://al-ministerio.vercel.app), deployment `dpl_GK657UjDcC8eVvkpbmFEdcrmGj7p`. La bandeja privada redirige al login preservando `next`.
- MCP de Ultramail registrado y operativo. Su configuración local de cifrado se alineó con la del servidor, conservando la clave local anterior en la configuración privada; no se cambiaron las contraseñas SMTP. Remitente existente verificado: `cmmcuv35q0000nkcc0efo0k39`. Plantilla: `cmulru1kg00006ryo8n4xknwc`. API key exclusiva de resultados creada y guardada sin incluirla en este documento ni en código versionado.
- Variables privadas de Ultramail, URL estable y cron configuradas en AlMinisterio. El único formulario existente sin destinatario recibió `tecalediaz@gmail.com`, indicado por el administrador. Los destinatarios ya configurados no se sobrescriben.
- Un aviso técnico, explícitamente identificado como prueba y sin solicitud real, fue confirmado por la API de Ultramail a ese correo. Registro: `cmulsdyim0001lc04qhwgb3jd`. Esto prueba el adaptador y SMTP; no sustituye la prueba final del formulario público y la bandeja.
- Preparado el disparador `netlify/functions/alministerio-avisos.mjs`, con frecuencia de un minuto, autorización por encabezado, HTTPS, rechazo de redirecciones, confirmación JSON explícita y activación explícita. Pruebas: 26 de AlMinisterio, 18 del sitio público y fixture PostgreSQL aprobados; TypeScript de ambos proyectos aprobado. Build de producción de AlMinisterio aprobado por Vercel y build local webpack del sitio público aprobado.
- El administrador autorizó expresamente el alcance estándar de Netlify (`builds`, `functions`, `post_processing`, `runtime`). Se guardaron las seis variables de producción: base de datos, huella privada de recepción, encabezado de IP confiable y URL/secreto/activación del cron. No se amplió ningún plan de pago ni se copiaron credenciales de Ultramail al sitio público. El endpoint de AlMinisterio devuelve 401 sin credencial y 200 con confirmación explícita cuando se autoriza.
- Sitio público publicado en [paginaministerio-v2.netlify.app](https://paginaministerio-v2.netlify.app), deployment de producción `6abae7b94c95caefeeceda52`, estado `ready`. Netlify compiló Next.js 16.3 con su runtime 5.16.0, empaquetó el servidor y `alministerio-avisos`, y publicó el cron `* * * * *`.
- Prueba pública: DNI inválido rechazado; después, una solicitud válida con datos sintéticos y nombre **PRUEBA TÉCNICA — no es una inscripción real** mostró **Solicitud enviada**. Recepción `2beafe44-4247-4687-b5ec-0f291f817bea`, área `atencion-sede`, dos campos históricos. Neon confirmó el registro y su único aviso a `tecalediaz@gmail.com`; el disparador automático lo procesó y Ultramail confirmó entrega en un intento (log `cmulu07m10001l9040kt1hews`). El enlace privado exige login y conserva la ruta de retorno. Esta solicitud técnica se conserva en la bandeja; no se borraron resultados históricos.
- Verificación final: 26 pruebas de AlMinisterio y 18 del sitio público aprobadas, revisión independiente del disparador sin hallazgos críticos/importantes, TypeScript y `git diff --check` aprobados. No se probó visualmente el detalle/exportación con cuentas reales de cada perfil porque todavía no se definieron responsables; la autorización entre áreas, filtros, CSV y revocación sí están cubiertos por pruebas automatizadas y el fixture PostgreSQL.
- Las cuentas personales y asignaciones reales deben definirse en **Usuarios** por Administración. No se inventaron responsables ni se concedieron permisos a cuentas reales.
