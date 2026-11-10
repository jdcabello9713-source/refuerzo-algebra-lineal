// Motor de la aplicación: recorrido secuencial, consentimiento, diagnósticos, lecciones y resultados.
(function () {
  const $ = (s, e = document) => e.querySelector(s);
  const vista = $('#vista');
  const K = 'ral_estado';
  const RUTA = [
    { id: 'inicio', t: 'Presentación', g: 'Inicio' },
    { id: 'pre', t: 'Diagnóstico inicial', g: 'Inicio' },
    ...LECCIONES.map((l) => ({ id: l.id, t: `${l.num} ${l.titulo}`, g: 'Capítulo 1. Combinación y dependencia lineal', lec: l })),
    { id: 'post', t: 'Diagnóstico final', g: 'Cierre' },
    { id: 'cierre', t: 'Resultados', g: 'Cierre' }
  ];
  let E = { pid: '', sem: '', forma: '', idx: 0, max: 0, q: { pre: 0, post: 0 }, r: { pre: {}, post: {} }, pasos: {}, t0: 0 };
  try { const g = JSON.parse(localStorage.getItem(K)); if (g && g.pid) E = g; } catch (e) {}
  const guardar = () => { try { localStorage.setItem(K, JSON.stringify(E)); } catch (e) {} };
  let board = null, tEntrada = Date.now();

  function nav() {
    let g = '', h = '';
    RUTA.forEach((r, i) => {
      if (r.g !== g) { g = r.g; h += `<p class="nav-g">${g}</p>`; }
      const hecho = i < E.max, act = i === E.idx;
      const bloqueado = i > E.max || ((r.id === 'pre' || r.id === 'post' || r.id === 'inicio') && i < E.max);
      h += `<button class="nav-i${act ? ' act' : ''}" data-i="${i}" ${bloqueado ? 'disabled' : ''} ${act ? 'aria-current="step"' : ''}><span class="est">${hecho ? '✓' : ''}</span><span>${r.t}</span></button>`;
    });
    $('#nav').innerHTML = h;
    $('#nav').querySelectorAll('button:not(:disabled)').forEach((b) => b.addEventListener('click', () => ir(+b.dataset.i)));
    const pct = Math.round(100 * E.max / (RUTA.length - 1));
    $('#barra-av').style.width = pct + '%';
    $('#avance-txt').textContent = E.pid ? `Avance: ${pct}% · Participante ${E.pid}` : 'Duración aproximada: 30 minutos';
  }

  function ir(i) {
    if (board) { try { JXG.JSXGraph.freeBoard(board); } catch (e) {} board = null; }
    const sale = RUTA[E.idx];
    if (E.pid && i !== E.idx) Registro.log('salida_seccion', { seccion: sale.id, ms: Date.now() - tEntrada });
    E.idx = i; E.max = Math.max(E.max, i); guardar(); tEntrada = Date.now();
    nav();
    const r = RUTA[i];
    vista.innerHTML = '';
    ({ inicio: vInicio, pre: () => vTest('pre'), post: () => vTest('post'), cierre: vCierre }[r.id] || (() => vLeccion(r.lec)))();
    vista.firstElementChild && vista.firstElementChild.classList.add('entra');
    window.scrollTo(0, 0); vista.focus({ preventScroll: true });
    if (E.pid) Registro.log('entrada_seccion', { seccion: r.id });
  }
  const siguiente = () => ir(Math.min(E.idx + 1, RUTA.length - 1));

  /* ---------- Presentación y consentimiento ---------- */
  function vInicio() {
    vista.innerHTML = `<div class="estrecho">
      <p class="sobre">Matemática para economistas</p>
      <h1>Refuerzo visual de álgebra lineal</h1>
      <p class="lead">Esta sesión repasa temas que ya viste en clase, ahora con gráficos que puedes manipular. Forma parte de una investigación sobre el aprendizaje del álgebra lineal en estudiantes de Economía.</p>
      <h2>Contenido de la sesión</h2>
      <div class="filas">
        <div class="fila"><span>Diagnóstico inicial</span><span>7 preguntas sin retroalimentación. 7 minutos.</span></div>
        <div class="fila"><span>Capítulo 1</span><span>Combinación lineal, conjunto generador y dependencia lineal en R² y R³, con gráficos interactivos. 15 minutos.</span></div>
        <div class="fila"><span>Diagnóstico final</span><span>7 preguntas con explicación de cada respuesta. 8 minutos.</span></div>
      </div>
      <p class="nota">Se recomienda usar una laptop y completar la sesión de una sola vez, sin apuntes.</p>
      <h2>Consentimiento informado</h2>
      <div class="consent" tabindex="0">
        <p><b>Propósito.</b> El estudio evalúa si una práctica breve con representaciones gráficas manipulables mejora la comprensión de temas de álgebra lineal en estudiantes que ya los estudiaron.</p>
        <p><b>Participación.</b> Responderás un diagnóstico inicial, recorrerás un capítulo interactivo y responderás un diagnóstico final. La sesión dura alrededor de 30 minutos. Participar es voluntario y puedes retirarte en cualquier momento cerrando la página, sin ninguna consecuencia.</p>
        <p><b>Datos registrados.</b> Se guardan tus respuestas, el tiempo que tomas en cada sección y tus interacciones con los gráficos. No se registra tu nombre. Te identificarás con tus iniciales y los cuatro últimos dígitos de tu código, que solo sirven para distinguir a un participante de otro.</p>
        <p><b>Uso y confidencialidad.</b> Los datos se usarán únicamente con fines académicos y se presentarán de forma agregada. Tus resultados no afectan ninguna calificación ni se comparten con tus profesores de manera individual.</p>
        <p><b>Responsable.</b> Juan Diego Cabello, jefe de práctica de Matemática para economistas, Universidad Esan. Puedes escribirle para resolver dudas o pedir que tus datos se eliminen.</p>
      </div>
      <label class="check"><input type="checkbox" id="acepto"><span>He leído la información anterior y acepto participar de forma voluntaria.</span></label>
      <div class="campos">
        <label class="campo">Iniciales<input id="ini" maxlength="4" autocomplete="off" placeholder="JDC"></label>
        <label class="campo">Cuatro últimos dígitos del código<input id="cod" maxlength="4" inputmode="numeric" autocomplete="off" placeholder="0000"></label>
        <label class="campo">Semestre en que llevaste el curso<select id="sem"><option value="">Elige</option>${['2026-2', '2026-1', '2026-0', '2025-2', '2025-1', '2025-0', '2024-2', 'Antes de 2024-2', 'Otro curso de álgebra lineal'].map((x) => `<option>${x}</option>`).join('')}</select></label>
      </div>
      <div class="acciones"><button class="btn pri" id="go" disabled>Comenzar el diagnóstico inicial</button><span class="nota" id="aviso"></span></div>
    </div>`;
    const ok = () => $('#acepto').checked && /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,4}$/.test($('#ini').value.trim()) && /^\d{4}$/.test($('#cod').value.trim()) && $('#sem').value;
    vista.addEventListener('input', () => { $('#go') && ($('#go').disabled = !ok()); });
    $('#go').addEventListener('click', () => {
      E.pid = $('#ini').value.trim().toUpperCase() + '-' + $('#cod').value.trim();
      E.sem = $('#sem').value; E.forma = Math.random() < 0.5 ? 'A' : 'B'; E.t0 = Date.now();
      Registro.contexto({ pid: E.pid, semestre: E.sem, forma_pre: E.forma });
      Registro.log('consentimiento', { respuesta: 'acepta', extra: { pantalla: [screen.width, screen.height], ua: navigator.userAgent.slice(0, 120) } });
      siguiente();
    });
  }

  /* ---------- Diagnósticos ---------- */
  const baraja = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function figura(el, f) {
    const b = ESC.tablero(el, 4.5);
    [['a', ESC.COL.a], ['b', ESC.COL.b], ['c', ESC.COL.c]].forEach(([n, col]) => {
      const p = ESC.punto(b, f[n], n, col, { fixed: true, size: 1 });
      ESC.flecha(b, [0, 0], p, col);
    });
    return b;
  }

  function vTest(fase) {
    const forma = fase === 'pre' ? E.forma : (E.forma === 'A' ? 'B' : 'A');
    const n = E.q[fase];
    if (n === 0 && !E.r[fase]._intro) {
      vista.innerHTML = `<div class="estrecho"><p class="sobre">${fase === 'pre' ? 'Antes del capítulo' : 'Después del capítulo'}</p>
        <h1>${fase === 'pre' ? 'Diagnóstico inicial' : 'Diagnóstico final'}</h1>
        <p class="lead">${fase === 'pre'
          ? 'Son 7 preguntas sobre temas que ya estudiaste. Responde con lo que recuerdas, sin apuntes. En esta parte no verás las respuestas correctas: las explicaciones llegan al final de la sesión.'
          : 'Son 7 preguntas del mismo tipo que las iniciales, con otros enunciados. Después de confirmar cada respuesta verás su explicación.'}</p>
        <p>Algunas preguntas piden <b>sustentar la elección en una o dos líneas</b>. Ese sustento importa tanto como la alternativa.</p>
        <div class="acciones"><button class="btn pri" id="go">Empezar</button></div></div>`;
      $('#go').addEventListener('click', () => { E.r[fase]._intro = 1; guardar(); ir(E.idx); });
      return;
    }
    if (n >= ITEMS.length) { siguiente(); return; }
    const par = ITEMS[n], it = par[forma], ops = baraja(it.ops.map((o, i) => Object.assign({ k: i }, o)));
    const t0 = Date.now();
    vista.innerHTML = `<div class="estrecho">
      <p class="sobre">${fase === 'pre' ? 'Diagnóstico inicial' : 'Diagnóstico final'} · Pregunta ${n + 1} de ${ITEMS.length}</p>
      <div class="pasos-ind">${ITEMS.map((_, i) => `<span class="${i < n ? 'hecho' : i === n ? 'act' : ''}"></span>`).join('')}</div>
      <p class="enun">${it.enun}</p>
      ${it.cita ? `<p class="enun cita">${it.cita}</p>` : ''}
      ${it.fig ? '<div class="figmini" id="fig"></div>' : ''}
      <div class="ops" role="radiogroup">${ops.map((o, i) => `<button class="op" role="radio" aria-checked="false" data-k="${o.k}"><span class="l">${'abcd'[i]}</span><span>${o.t}</span></button>`).join('')}</div>
      ${par.abierta ? `<label class="campo" style="margin-top:16px;max-width:720px">Sustenta tu elección en una o dos líneas<textarea id="sust" maxlength="500"></textarea></label>` : ''}
      <div id="retro"></div>
      <div class="acciones"><button class="btn pri" id="conf" disabled>${fase === 'pre' ? 'Confirmar y continuar' : 'Confirmar respuesta'}</button></div>
    </div>`;
    if (it.fig) board = figura($('#fig'), it.fig);
    let sel = null, cerrado = false;
    const listo = () => sel !== null && (!par.abierta || $('#sust').value.trim().length >= 8);
    vista.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
      if (cerrado) return;
      vista.querySelectorAll('.op').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('sel'); b.setAttribute('aria-checked', 'true'); sel = +b.dataset.k; $('#conf').disabled = !listo();
    }));
    par.abierta && $('#sust').addEventListener('input', () => { $('#conf').disabled = !listo(); });
    $('#conf').addEventListener('click', () => {
      if (cerrado) { E.q[fase] = n + 1; guardar(); ir(E.idx); return; }
      const o = it.ops[sel], bien = !!o.ok;
      E.r[fase][par.id] = { ok: bien, err: o.err || '' };
      Registro.log('respuesta_' + fase, { seccion: fase, item: par.id + forma, habilidad: par.h, respuesta: sel, correcta: bien ? 1 : 0,
        error: o.err || '', texto: par.abierta ? $('#sust').value.trim() : '', ms: Date.now() - t0, extra: { orden: ops.map((x) => x.k) } });
      if (fase === 'pre') { E.q[fase] = n + 1; guardar(); ir(E.idx); return; }
      cerrado = true; E.q[fase] = n + 1; guardar(); E.q[fase] = n;      // si recarga, avanza; en pantalla sigue la explicación
      vista.querySelectorAll('.op').forEach((b) => {
        b.disabled = true; const k = +b.dataset.k;
        if (it.ops[k].ok) b.classList.add('bien'); else if (k === sel) b.classList.add('mal');
      });
      par.abierta && ($('#sust').disabled = true);
      $('#retro').innerHTML = `<div class="retro entra"><p class="ver ${bien ? 'si' : 'no'}">${bien ? 'Respuesta correcta' : 'Respuesta incorrecta'}</p><p>${it.exp}</p>${!bien && o.err ? `<p class="nota">Error identificado: ${ERRORES[o.err].toLowerCase()}.</p>` : ''}</div>`;
      $('#conf').textContent = n + 1 < ITEMS.length ? 'Siguiente pregunta' : 'Ver resultados';
    });
  }

  /* ---------- Lecciones ---------- */
  function vLeccion(L) {
    const st = E.pasos[L.id] || (E.pasos[L.id] = { p: 0, ok: [], fin: false });
    vista.innerHTML = `<div class="leccion">
      <section>
        <p class="sobre">Capítulo 1 · Sección ${L.num}</p>
        <h1>${L.titulo}</h1>
        <p class="lead">${L.entrada}</p>
        <div class="pasos-ind" id="ind"></div>
        <div id="paso"></div>
        <div id="post-pasos"></div>
      </section>
      <section class="col-g">
        <div class="tablero" id="tab" role="img" aria-label="Gráfico interactivo de la sección ${L.num}"></div>
        <div class="ctrl" id="ctrl"></div>
        <div class="lectura" id="lec" aria-live="off"></div>
      </section>
    </div>`;
    const tPaso = { t: Date.now() };
    const ctx = { tablero: $('#tab'), ctrl: $('#ctrl'), lectura: $('#lec'), paso: () => st.p,
      cambio: (s) => { const P = L.pasos[st.p]; if (!st.ok[st.p] && P.ok(s)) { st.ok[st.p] = 1; guardar(); Registro.log('paso_logrado', { seccion: L.id, item: 'paso' + (st.p + 1), ms: Date.now() - tPaso.t }); pintaTarea(true); } } };
    const esc = L.montar(ctx); board = esc.board;

    function pintaTarea(anima) {
      const P = L.pasos[st.p], ok = !!st.ok[st.p], t = $('#tarea');
      if (!t) return;
      t.classList.toggle('ok', ok);
      t.querySelector('.estado').textContent = ok ? '✓ Logrado' : 'Pendiente';
      $('#desc').innerHTML = ok ? `<p class="descubre">${P.descubre}</p>` : '';
      $('#sig').disabled = !ok; $('#salta').hidden = ok;
    }
    function pintaPaso() {
      const P = L.pasos[st.p], ult = st.p === L.pasos.length - 1;
      $('#ind').innerHTML = L.pasos.map((_, i) => `<span class="${st.ok[i] && i !== st.p ? 'hecho' : i === st.p ? 'act' : ''}"></span>`).join('');
      $('#paso').innerHTML = `<div class="entra"><p class="paso-n">Paso ${st.p + 1} de ${L.pasos.length}</p>
        <div class="paso-txt">${P.html}</div>
        <div class="tarea" id="tarea"><div><span class="q">En el gráfico</span>${P.tarea}</div><span class="estado"></span></div>
        <div id="desc" aria-live="polite"></div>
        <div class="acciones"><button class="btn" id="ant" ${st.p === 0 ? 'disabled' : ''}>Paso anterior</button>
        <button class="btn pri" id="sig">${ult ? 'Ir a la práctica' : 'Siguiente paso'}</button>
        <button class="enlace" id="salta">Continuar sin completar</button></div></div>`;
      pintaTarea();
      $('#ant').addEventListener('click', () => { st.p--; cambia(); });
      const avanza = (salto) => {
        if (salto) Registro.log('paso_saltado', { seccion: L.id, item: 'paso' + (st.p + 1), ms: Date.now() - tPaso.t });
        if (ult) { st.fin = true; guardar(); $('#paso').querySelector('.acciones').remove(); practica(); } else { st.p++; cambia(); }
      };
      $('#sig').addEventListener('click', () => avanza(false));
      $('#salta').addEventListener('click', () => avanza(true));
    }
    function cambia() { guardar(); tPaso.t = Date.now(); pintaPaso(); board.update(); }

    function practica() {
      const cont = $('#post-pasos'); let intento = 0;
      const nuevo = () => {
        const ej = L.practica(), t0 = Date.now(); intento++;
        cont.innerHTML = `<div class="practica entra"><h2>Práctica</h2><p class="enun" style="font-size:16px">${ej.enun}</p>
          ${ej.tipo === 'num'
            ? `<p style="font-weight:400">${ej.campos.map((c, i) => `${c.etq}<input class="num" data-i="${i}" inputmode="decimal" autocomplete="off">${c.fin || ''}`).join(' ')}</p>`
            : `<div class="ops">${ej.ops.map((o, i) => `<button class="op" data-i="${i}"><span class="l">${'abcd'[i]}</span><span>${o.t}</span></button>`).join('')}</div>`}
          <div id="pr-retro"></div>
          <div class="acciones">${ej.tipo === 'num' ? '<button class="btn pri" id="pr-ok">Comprobar</button>' : ''}<button class="btn" id="pr-otro" hidden>Otro ejercicio</button><button class="btn pri" id="pr-sig" hidden>${E.idx + 1 < RUTA.length && RUTA[E.idx + 1].lec ? 'Siguiente sección' : 'Ir al diagnóstico final'}</button></div>
          ${L.eco ? `<div class="caja-eco" id="eco" hidden>${L.eco}</div>` : ''}</div>`;
        const cierra = (bien, resp) => {
          Registro.log('practica', { seccion: L.id, item: 'intento' + intento, respuesta: resp, correcta: bien ? 1 : 0, ms: Date.now() - t0, extra: { enun: ej.enun.replace(/<[^>]+>/g, '') } });
          $('#pr-retro').innerHTML = `<div class="retro entra"><p class="ver ${bien ? 'si' : 'no'}">${bien ? 'Correcto' : 'Revisa el procedimiento'}</p><p>${ej.sol}</p></div>`;
          $('#pr-ok') && ($('#pr-ok').hidden = true); $('#pr-otro').hidden = false; $('#pr-sig').hidden = false;
          $('#eco') && ($('#eco').hidden = false);
          cont.querySelectorAll('input,.op').forEach((x) => { x.disabled = true; });
        };
        if (ej.tipo === 'num') $('#pr-ok').addEventListener('click', () => {
          const v = [...cont.querySelectorAll('input.num')].map((x) => parseFloat(x.value.replace(',', '.').replace('−', '-')));
          if (v.some(isNaN)) { $('#pr-retro').innerHTML = '<p class="nota">Completa todos los campos con números.</p>'; return; }
          cierra(v.every((x, i) => Math.abs(x - ej.campos[i].val) < 1e-6), v.join(';'));
        });
        else cont.querySelectorAll('.op').forEach((b) => b.addEventListener('click', () => {
          const i = +b.dataset.i, bien = !!ej.ops[i].ok;
          cont.querySelectorAll('.op').forEach((x, j) => { if (ej.ops[j].ok) x.classList.add('bien'); else if (j === i) x.classList.add('mal'); });
          cierra(bien, i);
        }));
        $('#pr-otro').addEventListener('click', nuevo);
        $('#pr-sig').addEventListener('click', siguiente);
      };
      nuevo();
    }
    pintaPaso(); board.update();
    if (st.fin) practica();
  }

  /* ---------- Resultados ---------- */
  function vCierre() {
    const pre = E.r.pre, post = E.r.post;
    const n = (r) => ITEMS.filter((p) => r[p.id] && r[p.id].ok).length;
    const min = E.t0 ? Math.round((Date.now() - E.t0) / 60000) : 0;
    if (!E.fin) { E.fin = 1; guardar(); Registro.log('fin', { respuesta: `${n(pre)}/${n(post)}`, ms: Date.now() - E.t0 }); }
    const filas = ITEMS.map((p) => {
      const a = pre[p.id] || {}, b = post[p.id] || {};
      const nota = b.ok ? (a.ok ? 'Dominada desde el inicio' : 'Mejoró en la sesión') : `Por reforzar: ${ERRORES[b.err] ? ERRORES[b.err].toLowerCase() : 'sin respuesta'}`;
      return `<tr><td>${HABILIDADES[p.h]}</td><td class="${a.ok ? 'si' : 'no'}">${a.ok ? 'Correcta' : 'Incorrecta'}</td><td class="${b.ok ? 'si' : 'no'}">${b.ok ? 'Correcta' : 'Incorrecta'}</td><td class="nota">${nota}</td></tr>`;
    }).join('');
    vista.innerHTML = `<div class="estrecho"><p class="sobre">Sesión completada</p><h1>Resultados de tu sesión</h1>
      <p class="lead">Tus respuestas quedaron registradas. La tabla compara cada habilidad antes y después del capítulo.</p>
      <div class="datos"><div class="dato"><b>${n(pre)} de ${ITEMS.length}</b><span>Diagnóstico inicial</span></div><div class="dato"><b>${n(post)} de ${ITEMS.length}</b><span>Diagnóstico final</span></div><div class="dato"><b>${min} min</b><span>Duración de la sesión</span></div><div class="dato"><b>${E.pid}</b><span>Código de participante</span></div></div>
      <h2>Diagnóstico por habilidad</h2>
      <table><thead><tr><th>Habilidad</th><th>Inicial</th><th>Final</th><th>Diagnóstico</th></tr></thead><tbody>${filas}</tbody></table>
      <p class="nota" style="margin-top:18px">Puedes volver a las secciones del capítulo desde el menú para repasar. Gracias por participar.</p></div>`;
  }

  if (E.pid) Registro.contexto({ pid: E.pid, semestre: E.sem, forma_pre: E.forma });
  window.RAL = { reiniciar: () => { localStorage.removeItem(K); location.reload(); }, ir, estado: () => E };
  ir(E.pid ? E.idx : 0);
})();
