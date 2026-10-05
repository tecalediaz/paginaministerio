# Recepción pública de solicitudes

El formulario confirma «Solicitud enviada» después de guardar la solicitud y su aviso pendiente en una misma transacción. El número de recepción identifica el registro privado en AlMinisterio. La entrega del aviso ocurre por la cola de AlMinisterio y no condiciona la recepción.

## Configuración y puesta en marcha

1. Aplicar las migraciones de AlMinisterio `0068_area_access_and_submissions.sql` y `0069_site_form_submission.sql` antes de desplegar el sitio público. El sitio no ejecuta migraciones.
2. Configurar `DATABASE_URL` en el servidor. Su rol necesita lectura de `site_tramites`, `UPDATE(updated_at)` en esa tabla para obtener el bloqueo `FOR SHARE`, lectura/inserción de `site_tramite_submissions`, inserción en `site_tramite_email_jobs`, lectura/inserción/actualización de `site_submission_rate_limits` y ejecución de `public.receive_site_tramite_submission(uuid, uuid, uuid, text, text, jsonb, jsonb, jsonb)`. PostgreSQL [exige permiso de UPDATE sobre al menos una columna para SELECT FOR SHARE](https://www.postgresql.org/docs/current/sql-select.html). La función conserva los privilegios del rol que la llama; `PUBLIC` no puede ejecutarla. El dueño de la migración tiene acceso. Si se usa otro rol, otorgar explícitamente esos permisos a ese rol.
3. Crear `SUBMISSION_RATE_LIMIT_SECRET` con `openssl rand -hex 32`. Es privado y debe tener al menos 32 caracteres. El mismo secreto debe estar en todas las instancias del sitio. Cambiarlo invalida la identificación de los intentos anteriores.
4. Configurar `SUBMISSION_TRUSTED_IP_HEADER` con un encabezado sobrescrito por el proveedor: por defecto `x-nf-client-connection-ip` en Netlify, [identificado por Netlify como la IP de conexión en Functions](https://answers.netlify.com/t/upcoming-change-stripping-exposed-netlify-headers-from-function-and-proxy-requests/52665). Nunca confiar en un encabezado que el cliente pueda enviar sin que el proxy lo sustituya. Si falta o su valor no es una IP, los clientes comparten un límite conservador.
5. En Comunicación, configurar un correo de aviso válido para cada trámite, al menos un campo y un área reconocida, y publicarlo. `general` se asigna a Atención en sede. Un trámite existente sin correo conserva su ficha y muestra «Formulario no disponible»; un trámite archivado desaparece del sitio público.

## Validación, intentos y límites

El servidor lee la configuración original de Neon, valida los campos y conserva nombre normalizado, DNI y teléfono como dígitos, textos sin espacios exteriores y opciones admitidas. Nunca toma correo, área ni definición de campos del cliente. El DTO público tiene únicamente `acceptsSubmissions` para indicar disponibilidad; nunca incluye el correo de aviso.

Cada formulario genera un UUID al enviar y lo conserva durante los reintentos de esa instancia. Una huella HMAC liga ese UUID al trámite, las respuestas normalizadas y una identificación de la IP obtenida con HMAC. Un reintento idéntico devuelve la misma recepción sin duplicar solicitud ni aviso, ni consumir otro cupo. Reutilizar un UUID con otras respuestas o desde otro cliente devuelve un error general sin exponer información previa. Si la IP cambia, la solicitud ya recibida se conserva y el intento no confirma una recepción ajena; se debe consultar por los canales de la ficha.

Los intentos ya guardados se validan primero contra su snapshot histórico y su huella, antes de consultar la disponibilidad actual. Así un reintento idéntico recupera su recepción incluso si el formulario se archivó, se despublicó o cambió de campos después del guardado.

La función de base de datos serializa los intentos concurrentes, bloquea la configuración durante el guardado y revalida publicación, archivo, correo y área. Si la definición de campos cambió desde la validación de un envío nuevo, pide actualizar la página. El título y los campos guardados permiten leer y exportar la solicitud aunque el CMS cambie después. La transacción incluye contador de límite, solicitud y trabajo pendiente de aviso; si una inserción falla, todas se revierten.

Se permiten diez solicitudes aceptadas por IP en una ventana de diez minutos, compartida por los trámites. El contador persistente funciona entre instancias. El campo señuelo bloquea envíos automatizados evidentes. No se guardan IPs en claro, ni se registran respuestas o errores del proveedor de base de datos en logs de recepción.

Los contadores expirados pueden limpiarse periódicamente en mantenimiento con `DELETE FROM site_submission_rate_limits WHERE window_start < now() - interval '1 day'`; no eliminar solicitudes ni trabajos al hacer esta limpieza.

## Verificación local

Este proyecto no agrega dependencias de pruebas. Desde su raíz, con las dependencias de AlMinisterio instaladas:

```sh
node --import ../alministerio/node_modules/tsx/dist/loader.mjs --test tests/tramite-reception.test.ts
npx tsc --noEmit
npm run lint
```

Las pruebas de recepción ejercitan validación, normalización, rechazo de configuraciones inválidas, huella de reintentos y errores de persistencia. Las pruebas de la migración deben ejecutarse en una base descartable, nunca en producción.
