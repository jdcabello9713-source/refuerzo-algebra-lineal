# Refuerzo visual de álgebra lineal: piloto

Web estática para estudiantes de Matemática para economistas (Esan). Recorrido de 30 minutos: consentimiento, diagnóstico inicial, capítulo interactivo, diagnóstico final y resultados por habilidad.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Página del estudiante |
| `panel.html` | Panel interno (no está enlazado desde la página del estudiante) |
| `js/config.js` | URL de Apps Script. Único archivo que debes editar |
| `js/items.js` | Ítems de los diagnósticos, habilidades y tipos de error |
| `js/escenas.js` | Lecciones: textos, tareas, gráficos y ejercicios de práctica |
| `js/app.js` | Navegación, consentimiento, diagnósticos y resultados |
| `js/registro.js` | Envío de eventos a Google Sheets |
| `apps-script/Code.gs` | Código para la hoja de Google |
| `revision-items.html` | Documento de revisión de los ítems, generado desde `js/items.js` |

## Conexión con Google Sheets

1. Crea una hoja de cálculo nueva en Google Sheets.
2. Abre Extensiones > Apps Script, borra el contenido y pega `apps-script/Code.gs`.
3. Cambia el valor de `CLAVE` por una clave propia. Es la que pedirá el panel.
4. Implementar > Nueva implementación > Aplicación web. Ejecutar como: tú. Acceso: cualquier usuario.
5. Copia la URL que termina en `/exec` y pégala en `ENDPOINT` dentro de `js/config.js`.

La hoja `datos` se crea sola con el primer evento. Si cambias `Code.gs`, crea una versión nueva de la implementación.

## Publicación en GitHub Pages

1. Crea un repositorio y sube el contenido de esta carpeta.
2. Settings > Pages > Deploy from a branch > `main` / raíz.
3. Comparte el enlace `https://usuario.github.io/repositorio/`. El panel queda en `/panel.html`.

El repositorio debe ser público en una cuenta gratuita. El código de los ítems queda visible para quien sepa buscarlo; las respuestas de los estudiantes no, porque están en la hoja.

## Prueba local

```bash
python -m http.server 8765
```

Luego abre `http://localhost:8765`. Para repetir la sesión desde cero, ejecuta `RAL.reiniciar()` en la consola del navegador.

## Datos registrados

Cada fila es un evento con: hora, participante (iniciales y cuatro últimos dígitos del código), semestre, forma del diagnóstico inicial (A o B), evento, sección, ítem, habilidad, respuesta, acierto, tipo de error, sustento escrito, tiempo en milisegundos y datos adicionales.

| Evento | Momento |
|---|---|
| `consentimiento` | Acepta y empieza |
| `respuesta_pre`, `respuesta_post` | Confirma una pregunta de diagnóstico |
| `entrada_seccion`, `salida_seccion` | Cambia de sección (con tiempo de permanencia) |
| `paso_logrado`, `paso_saltado` | Completa u omite una tarea del gráfico |
| `practica` | Responde un ejercicio de práctica |
| `fin` | Llega a resultados (con duración total) |

## Diseño del diagnóstico

- 7 pares de ítems isomorfos, uno por habilidad. Cada par tiene forma A y forma B con la misma estructura y los mismos tipos de error en los distractores.
- Cada estudiante recibe al azar A al inicio y B al final, o al revés. La forma queda registrada.
- El orden de las alternativas se baraja en cada presentación y se registra.
- Tres ítems piden además un sustento escrito de una o dos líneas, para corregir con rúbrica.
- El diagnóstico inicial no muestra respuestas. El final explica cada una y nombra el error cometido.

## Pendientes

- Sustituir el consentimiento por el formato del comité de ética.
- Validar los ítems con otro docente (`revision-items.html`).
- Construir la rúbrica de los sustentos escritos.
- Capítulos siguientes, en el orden del sílabo: base y dimensión; determinante como área y rango; sistemas de ecuaciones; valores y vectores propios; formas cuadráticas.
