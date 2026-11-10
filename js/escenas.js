// Escenas interactivas del capítulo 1. Cada lección define sus pasos (texto, tarea y condición de logro),
// la construcción del tablero y un generador de ejercicios de práctica.
(function () {
  const COL = { a: '#5B2135', b: '#6f7a84', c: '#AE0E16', t: '#b8933d', ink: '#2f2a2c', eje: '#cfc8c0', suave: '#e9e3dc' };
  const A = '<i class="v ca">a</i>', B = '<i class="v cb">b</i>', C = '<i class="v cc">c</i>';
  const EPS = 1e-9;
  const fmt = (x) => { const r = Math.round(x * 100) / 100; return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−'); };
  const par = (x, y) => `(${fmt(x)}, ${fmt(y)})`;
  const det = (a, b) => a[0] * b[1] - a[1] * b[0];
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const nulo = (a) => Math.abs(a[0]) < EPS && Math.abs(a[1]) < EPS;
  const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const elige = (arr) => arr[rnd(0, arr.length - 1)];
  const coef = (k, v, primero) => {            // término "k·v" con signo, para ecuaciones
    const s = k < 0 ? '−' : (primero ? '' : '+');
    return `${s}${primero ? '' : ' '}${fmt(Math.abs(k))}${v}${' '}`.replace(/^ /, '');
  };

  function clasifica(a, b) {
    if (nulo(a) || nulo(b)) return 'nulo';
    if (Math.abs(det(a, b)) < EPS) return dot(a, b) > 0 ? 'superpuestos' : 'opuestos';
    return 'independiente';
  }

  function tablero(el, lim = 6.5, ejes = true) {
    JXG.Options.text.useMathJax = false;
    const b = JXG.JSXGraph.initBoard(el, {
      boundingbox: [-lim, lim, lim, -lim], keepaspectratio: true, axis: false, showCopyright: false,
      showNavigation: false, pan: { enabled: false }, zoom: { enabled: false }
    });
    if (ejes) {
      b.create('grid', [], { strokeColor: '#f1ece6', strokeWidth: 1, majorStep: 1, minorElements: 0 });
      const op = { strokeColor: COL.eje, strokeWidth: 1, fixed: true, highlight: false,
        ticks: { strokeColor: COL.eje, majorHeight: 6, minorTicks: 0, ticksDistance: 2, insertTicks: false,
          label: { fontSize: 11, strokeColor: '#8d8580' } } };
      b.create('axis', [[0, 0], [1, 0]], op);
      b.create('axis', [[0, 0], [0, 1]], op);
    }
    return b;
  }
  function punto(b, xy, nombre, color, extra = {}) {
    return b.create('point', xy, Object.assign({
      name: `<u>${nombre}</u>`, size: 4, fillColor: color, strokeColor: '#fff', strokeWidth: 1.5,
      highlightFillColor: color, highlightStrokeColor: color, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5,
      label: { offset: [9, 9], fontSize: 16, strokeColor: color, cssStyle: 'font-style:italic;font-family:Cambria,Georgia,serif' }
    }, extra));
  }
  const oculto = (b, fx, fy) => b.create('point', [fx, fy], { visible: false, name: '' });
  function flecha(b, p, q, color, extra = {}) {
    return b.create('arrow', [p, q], Object.assign({ strokeColor: color, strokeWidth: 2.6, fixed: true, highlight: false,
      lastArrow: { type: 2, size: 5 } }, extra));
  }
  function slider(id, etq, min, max, paso, val) {
    return `<label class="sl"><span>${etq}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${paso}" value="${val}"><output id="${id}-o">${fmt(val)}</output></label>`;
  }
  function ligaSliders(ctx, ids, b) {
    const val = {};
    ids.forEach((id) => {
      const el = ctx.ctrl.querySelector('#' + id);
      val[id] = +el.value;
      el.addEventListener('input', () => { val[id] = +el.value; ctx.ctrl.querySelector(`#${id}-o`).textContent = fmt(val[id]); b.update(); });
    });
    val.set = (id, v) => { const el = ctx.ctrl.querySelector('#' + id); el.value = v; val[id] = +el.value; ctx.ctrl.querySelector(`#${id}-o`).textContent = fmt(val[id]); };
    return val;
  }

  /* ---------- 1.1 Combinación lineal ---------- */
  const L1 = {
    id: 's1', num: '1.1', titulo: 'Combinación lineal de dos vectores',
    entrada: 'Una combinación lineal multiplica cada vector por un escalar y suma los resultados. El gráfico muestra cada operación por separado.',
    pasos: [
      { html: `<p>El escalar α multiplica a ${A}. El resultado α${A} <b>permanece sobre la misma recta</b> que ${A}: el escalar cambia su distancia, nunca su dirección.</p><p>Cuando <b>α es negativo, el vector cambia de sentido</b> y apunta hacia el lado contrario.</p>`,
        tarea: 'Mueve el deslizador de α hasta un valor negativo.', ok: (s) => s.negAlfa,
        descubre: `α${A} cruzó el origen y ahora es opuesto a ${A}. Sigue sobre la misma recta.` },
      { html: `<p>Ahora entra β${B}. Se dibuja <b>a continuación de α${A}</b>, y el vector que va del origen hasta el final del recorrido es ${C} = α${A} + β${B}.</p><p>${C} es una <b>combinación lineal</b> de ${A} y ${B}. Cada par de escalares produce un vector distinto.</p>`,
        tarea: 'Ajusta α y β hasta que <i class="v cc">c</i> llegue al punto marcado en (3, 0).', ok: (s) => s.enMeta,
        descubre: `Para salir de la región entre ${A} y ${B} hizo falta un escalar negativo.` },
      { html: `<p>El vector nulo ∅ también es una combinación lineal: <b>α = β = 0</b> siempre lo produce. Esta es la <b>solución trivial</b>.</p><p>La pregunta de fondo en este capítulo es si existe <b>otra manera</b> de llegar al vector nulo. Con ${A} y ${B} en direcciones distintas, no existe.</p>`,
        tarea: 'Lleva <i class="v cc">c</i> al origen usando los deslizadores.', ok: (s) => s.enOrigen,
        descubre: 'Con estos dos vectores, la única manera fue α = 0 y β = 0.' }
    ],
    montar(ctx) {
      const b = tablero(ctx.tablero);
      ctx.ctrl.innerHTML = slider('alfa', 'Escalar α', -3, 3, 0.25, 1.5) + slider('beta', 'Escalar β', -3, 3, 0.25, 1);
      const v = ligaSliders(ctx, ['alfa', 'beta'], b);
      const s = { negAlfa: false, enMeta: false, enOrigen: false };
      const PA = punto(b, [2, 1], 'a', COL.a), PB = punto(b, [1, 2], 'b', COL.b);
      const conB = () => ctx.paso() >= 1;
      flecha(b, [0, 0], PA, COL.a, { strokeWidth: 1.4, strokeOpacity: 0.45 });
      flecha(b, [0, 0], PB, COL.b, { strokeWidth: 1.4, strokeOpacity: 0.45, visible: conB });
      PB.setAttribute({ visible: conB });
      const QA = oculto(b, () => v.alfa * PA.X(), () => v.alfa * PA.Y());
      const QC = oculto(b, () => v.alfa * PA.X() + (conB() ? v.beta * PB.X() : 0), () => v.alfa * PA.Y() + (conB() ? v.beta * PB.Y() : 0));
      flecha(b, [0, 0], QA, COL.a);
      flecha(b, QA, QC, COL.b, { dash: 2, visible: conB });
      flecha(b, [0, 0], QC, COL.c, { strokeWidth: 3.2, visible: conB });
      b.create('text', [() => QA.X() / 2, () => QA.Y() / 2, 'α<u>a</u>'], { anchorX: 'right', anchorY: 'bottom', fontSize: 13, strokeColor: COL.a, fixed: true });
      b.create('text', [() => (QA.X() + QC.X()) / 2, () => (QA.Y() + QC.Y()) / 2, 'β<u>b</u>'], { anchorX: 'left', anchorY: 'top', fontSize: 13, strokeColor: COL.b, visible: conB, fixed: true });
      b.create('text', [() => QC.X(), () => QC.Y(), '&nbsp;<u>c</u>'], { anchorX: 'left', anchorY: 'bottom', fontSize: 16, strokeColor: COL.c, visible: conB, fixed: true, cssStyle: 'font-style:italic;font-family:Cambria,Georgia,serif' });
      b.create('point', [3, 0], { name: 'meta (3, 0)', fixed: true, size: 5, face: 'o', fillColor: '#fff', strokeColor: COL.t, strokeWidth: 2,
        visible: () => ctx.paso() === 1, label: { offset: [8, -14], fontSize: 12, strokeColor: '#86651a' } });
      ctx.ctrl.querySelector('#beta').closest('.sl').style.visibility = 'hidden';
      b.on('update', () => {
        ctx.ctrl.querySelector('#beta').closest('.sl').style.visibility = conB() ? 'visible' : 'hidden';
        if (v.alfa < 0) s.negAlfa = true;
        if (conB() && Math.hypot(QC.X() - 3, QC.Y()) < 1e-6) s.enMeta = true;
        if (ctx.paso() === 2 && Math.hypot(QC.X(), QC.Y()) < 1e-6) s.enOrigen = true;
        ctx.lectura.innerHTML = conB()
          ? `${C} = α${A} + β${B}<br>${C} = ${fmt(v.alfa)}·${par(PA.X(), PA.Y())} + ${v.beta < 0 ? '(' + fmt(v.beta) + ')' : fmt(v.beta)}·${par(PB.X(), PB.Y())} = <span class="cc">${par(QC.X(), QC.Y())}</span>`
          : `α${A} = ${fmt(v.alfa)}·${par(PA.X(), PA.Y())} = <span class="ca">${par(QA.X(), QA.Y())}</span>`;
        ctx.cambio(s);
      });
      return { board: b, estado: s };
    },
    practica() {
      const a = [rnd(-3, 3), rnd(1, 3)], b = [rnd(1, 3), rnd(-3, 3)], p = elige([2, 3, -2]), q = elige([-1, 2, -3]);
      const r = [p * a[0] + q * b[0], p * a[1] + q * b[1]];
      return { tipo: 'num',
        enun: `Sean ${A} = ${par(...a)} y ${B} = ${par(...b)}. Calcula ${C} = ${fmt(p)}${A} ${q < 0 ? '−' : '+'} ${fmt(Math.abs(q))}${B}.`,
        campos: [{ etq: `${C} = (`, val: r[0] }, { etq: ',', val: r[1], fin: ')' }],
        sol: `${fmt(p)}·${par(...a)} ${q < 0 ? '−' : '+'} ${fmt(Math.abs(q))}·${par(...b)} = ${par(p * a[0], p * a[1])} + ${par(q * b[0], q * b[1])} = ${par(...r)}.` };
    }
  };

  /* ---------- 1.2 Conjunto generador ---------- */
  const L2 = {
    id: 's2', num: '1.2', titulo: 'Conjunto generador en R²',
    entrada: `Un conjunto es generador cuando sus combinaciones lineales alcanzan cualquier vector del espacio. El gráfico busca por ti los escalares que llevan a ${C}.`,
    pasos: [
      { html: `<p>El vector ${C} es el objetivo. La página calcula los escalares α y β que cumplen α${A} + β${B} = ${C} y dibuja el recorrido.</p><p>Mientras ${A} y ${B} tengan direcciones distintas, <b>siempre existe un único par de escalares</b>. El conjunto {${A}, ${B}} <b>genera todo R²</b>.</p>`,
        tarea: 'Arrastra <i class="v cc">c</i> a otro cuadrante y observa los escalares.', ok: (s) => s.otroCuadrante,
        descubre: 'Los escalares cambiaron de signo, pero la combinación siguió existiendo y fue única.' },
      { html: `<p>El conjunto deja de generar el plano cuando ${B} cae sobre la recta de ${A}. Todas las combinaciones quedan <b>atrapadas en esa recta</b>.</p><p>Tener dos vectores en R² no garantiza generar R². Importa su dirección, no su cantidad.</p>`,
        tarea: 'Arrastra <i class="v cb">b</i> hasta alinearlo con <i class="v ca">a</i>, dejando a <i class="v cc">c</i> fuera de la recta.', ok: (s) => s.sinSolucion,
        descubre: `Ninguna combinación de ${A} y ${B} llega a ${C}. El sistema de ecuaciones no tiene solución.` },
      { html: `<p>Con ${A} y ${B} alineados todavía se generan los vectores de la recta. Para esos vectores hay <b>infinitas combinaciones</b>, porque ${A} y ${B} hacen el mismo trabajo.</p><p>Un mismo conjunto produce los tres casos de un sistema de ecuaciones: solución única, ninguna solución o infinitas soluciones.</p>`,
        tarea: 'Sin separar <i class="v ca">a</i> y <i class="v cb">b</i>, lleva <i class="v cc">c</i> sobre la recta.', ok: (s) => s.infinitas,
        descubre: `${C} volvió a ser alcanzable, ahora de infinitas maneras. Uno de los dos vectores sobra.` }
    ],
    montar(ctx) {
      const b = tablero(ctx.tablero);
      ctx.ctrl.innerHTML = '';
      const s = { otroCuadrante: false, sinSolucion: false, infinitas: false };
      const PA = punto(b, [2, 1], 'a', COL.a), PB = punto(b, [-1, 2], 'b', COL.b), PC = punto(b, [3, 4], 'c', COL.c);
      const a = () => [PA.X(), PA.Y()], bb = () => [PB.X(), PB.Y()], c = () => [PC.X(), PC.Y()];
      const D = () => det(a(), bb());
      const indep = () => Math.abs(D()) > EPS;
      const dir = () => (nulo(a()) ? bb() : a());             // dirección de la recta cuando son paralelos
      const enRecta = () => !nulo(dir()) ? Math.abs(det(dir(), c())) < EPS : nulo(c());
      const alfa = () => indep() ? det(c(), bb()) / D() : (enRecta() && !nulo(a()) ? dot(c(), a()) / dot(a(), a()) : 0);
      const beta = () => indep() ? det(a(), c()) / D() : (enRecta() && nulo(a()) && !nulo(bb()) ? dot(c(), bb()) / dot(bb(), bb()) : 0);
      const hay = () => indep() || enRecta();
      b.create('line', [[0, 0], oculto(b, () => dir()[0] || 1e-3, () => dir()[1])], { strokeColor: COL.t, strokeWidth: 9, strokeOpacity: 0.28, fixed: true, highlight: false, visible: () => !indep() && !nulo(dir()) });
      flecha(b, [0, 0], PA, COL.a, { strokeWidth: 1.6, strokeOpacity: 0.5 });
      flecha(b, [0, 0], PB, COL.b, { strokeWidth: 1.6, strokeOpacity: 0.5 });
      const QA = oculto(b, () => alfa() * PA.X(), () => alfa() * PA.Y());
      flecha(b, [0, 0], QA, COL.a, { visible: hay });
      flecha(b, QA, PC, COL.b, { dash: 2, visible: () => hay() && Math.abs(beta()) > EPS });
      flecha(b, [0, 0], PC, COL.c, { strokeWidth: 3, strokeOpacity: () => hay() ? 1 : 0.35 });
      b.on('update', () => {
        const cc = c();
        if (ctx.paso() === 0 && (cc[0] < 0 || cc[1] < 0) && indep()) s.otroCuadrante = true;
        if (ctx.paso() >= 1 && !indep() && !nulo(a()) && !nulo(bb()) && !enRecta()) s.sinSolucion = true;
        if (ctx.paso() >= 2 && !indep() && !nulo(a()) && !nulo(bb()) && enRecta() && !nulo(cc)) s.infinitas = true;
        let h;
        if (indep()) h = `<span class="tipo ind">Solución única</span>${C} = ${fmt(alfa())}${A} ${beta() < 0 ? '−' : '+'} ${fmt(Math.abs(beta()))}${B}<br><span class="nota">{${A}, ${B}} genera todo R².</span>`;
        else if (enRecta()) h = `<span class="tipo ct">Infinitas soluciones</span>Una de ellas: ${C} = ${fmt(alfa())}${A} + ${fmt(beta())}${B}<br><span class="nota">{${A}, ${B}} solo genera la recta resaltada.</span>`;
        else h = `<span class="tipo dep">Sin solución</span>${C} está fuera de la recta que genera {${A}, ${B}}.<br><span class="nota">No existen α y β que cumplan α${A} + β${B} = ${C}.</span>`;
        ctx.lectura.innerHTML = h;
        ctx.cambio(s);
      });
      return { board: b, estado: s };
    },
    practica() {
      let a, b;
      do { a = [rnd(1, 3), rnd(-2, 2)]; b = [rnd(-2, 2), rnd(1, 3)]; } while (Math.abs(det(a, b)) < 1);
      const p = elige([-2, -1, 2, 3]), q = elige([-2, -1, 1, 2]);
      const c = [p * a[0] + q * b[0], p * a[1] + q * b[1]];
      return { tipo: 'num',
        enun: `Sean ${A} = ${par(...a)} y ${B} = ${par(...b)}. Halla los escalares que cumplen α${A} + β${B} = ${par(...c)}.`,
        campos: [{ etq: 'α =', val: p }, { etq: 'β =', val: q }],
        sol: `El sistema es ${fmt(a[0])}α ${b[0] < 0 ? '−' : '+'} ${fmt(Math.abs(b[0]))}β = ${fmt(c[0])} y ${fmt(a[1])}α ${b[1] < 0 ? '−' : '+'} ${fmt(Math.abs(b[1]))}β = ${fmt(c[1])}. Su única solución es α = ${fmt(p)}, β = ${fmt(q)}.` };
    }
  };

  /* ---------- 1.3 Dependencia lineal en R² ---------- */
  const NOMBRES = { superpuestos: 'Vectores superpuestos', opuestos: 'Vectores opuestos', nulo: 'Un vector es nulo', independiente: 'Conjunto independiente' };
  function ecuacion(a, b, tipo) {
    if (tipo === 'independiente') return `α${A} + β${B} = ∅ solo se cumple con α = β = 0.`;
    if (tipo === 'nulo') {
      if (nulo(a) && nulo(b)) return `1${A} + 1${B} = ∅. Cualquier par de escalares cumple la ecuación.`;
      return nulo(b) ? `0${A} + 1${B} = ∅, una solución distinta de la trivial.` : `1${A} + 0${B} = ∅, una solución distinta de la trivial.`;
    }
    const k = dot(a, b) / dot(a, a);
    return `${B} = ${fmt(k)}${A}, por lo tanto ${fmt(k)}${A} − 1${B} = ∅.`;
  }
  const L3 = {
    id: 's3', num: '1.3', titulo: 'Conjuntos dependientes en R²',
    entrada: 'Un conjunto es dependiente cuando el vector nulo se obtiene con una combinación distinta de la trivial. En R², dos vectores solo pueden lograrlo de tres maneras.',
    pasos: [
      { html: `<p>Primer caso: <b>vectores superpuestos</b>. ${B} está sobre la recta de ${A} y apunta hacia el mismo lado, así que ${B} = k${A} con k positivo.</p><p>Uno de los dos <b>no aporta una dirección nueva</b>. Esa redundancia es la dependencia lineal.</p>`,
        tarea: 'Arrastra <i class="v cb">b</i> hasta que quede superpuesto con <i class="v ca">a</i>.', ok: (s) => s.superpuestos,
        descubre: 'La lectura muestra la combinación no trivial que produce el vector nulo.' },
      { html: `<p>Segundo caso: <b>vectores opuestos</b>. ${B} está sobre la misma recta que ${A}, pero apunta al lado contrario: ${B} = k${A} con k negativo.</p><p>Que apunten a lados contrarios <b>no los vuelve independientes</b>. Siguen compartiendo una sola recta.</p>`,
        tarea: 'Arrastra <i class="v cb">b</i> hasta que quede opuesto a <i class="v ca">a</i>.', ok: (s) => s.opuestos,
        descubre: 'El escalar k cambió de signo. El conjunto sigue siendo dependiente.' },
      { html: `<p>Tercer caso: <b>uno de los vectores es el nulo</b>. El vector nulo se obtiene de cualquier otro vector multiplicándolo por 0, así que siempre es combinación lineal de los demás.</p><p><b>Todo conjunto que contiene al vector nulo es dependiente</b>, sin importar cómo sea el otro vector.</p>`,
        tarea: 'Arrastra <i class="v cb">b</i> hasta el origen.', ok: (s) => s.nulo,
        descubre: `El escalar de ${B} puede ser cualquiera y el de ${A} es 0. Hay infinitas soluciones no triviales.` },
      { html: `<p>Fuera de esos tres casos, dos vectores en R² son <b>independientes</b> y forman un conjunto base. Al agregar un tercer vector ${C}, la base ya lo genera.</p><p>Por eso <b>tres vectores en R² siempre forman un conjunto dependiente</b>, aunque tengan tres direcciones distintas. Hay más vectores que dimensiones.</p>`,
        tarea: 'Separa <i class="v ca">a</i> y <i class="v cb">b</i>, y luego mueve <i class="v cc">c</i> a cualquier posición.', ok: (s) => s.tercero,
        descubre: `${C} siempre puede escribirse con ${A} y ${B}. La ecuación de la lectura es la solución no trivial.` }
    ],
    montar(ctx) {
      const b = tablero(ctx.tablero);
      ctx.ctrl.innerHTML = `<div class="grupo"><button class="btn" data-c="sup">Superpuestos</button><button class="btn" data-c="opu">Opuestos</button><button class="btn" data-c="nul">Uno nulo</button><button class="btn" data-c="ind">Independientes</button></div><p class="nota" style="margin:0">Los botones muestran un ejemplo de cada caso. También puedes arrastrar los vectores.</p>`;
      const s = { superpuestos: false, opuestos: false, nulo: false, tercero: false };
      const PA = punto(b, [2, 1], 'a', COL.a), PB = punto(b, [-1, 3], 'b', COL.b);
      const PC = punto(b, [1, -3], 'c', COL.c, { visible: () => ctx.paso() === 3 });
      const a = () => [PA.X(), PA.Y()], bb = () => [PB.X(), PB.Y()], c = () => [PC.X(), PC.Y()];
      const tipo = () => clasifica(a(), bb());
      const dir = () => (nulo(a()) ? bb() : a());
      b.create('line', [[0, 0], oculto(b, () => dir()[0] || 1e-3, () => dir()[1])], { strokeColor: COL.t, strokeWidth: 9, strokeOpacity: 0.28, fixed: true, highlight: false,
        visible: () => tipo() !== 'independiente' && !nulo(dir()) });
      flecha(b, [0, 0], PA, COL.a, { strokeWidth: 3 });
      flecha(b, [0, 0], PB, COL.b, { strokeWidth: 3, visible: () => !nulo(bb()) });
      const conC = () => ctx.paso() === 3 && tipo() === 'independiente';
      const al = () => det(c(), bb()) / det(a(), bb()), be = () => det(a(), c()) / det(a(), bb());
      const QA = oculto(b, () => conC() ? al() * PA.X() : 0, () => conC() ? al() * PA.Y() : 0);
      flecha(b, [0, 0], QA, COL.a, { strokeWidth: 1.6, dash: 2, visible: conC });
      flecha(b, QA, PC, COL.b, { strokeWidth: 1.6, dash: 2, visible: conC });
      flecha(b, [0, 0], PC, COL.c, { strokeWidth: 3, visible: () => ctx.paso() === 3 });
      const casos = { sup: [[2, 1], [4, 2]], opu: [[2, 1], [-3, -1.5]], nul: [[2, 1], [0, 0]], ind: [[2, 1], [-1, 3]] };
      ctx.ctrl.querySelectorAll('[data-c]').forEach((bt) => bt.addEventListener('click', () => {
        const k = casos[bt.dataset.c];
        PA.moveTo(k[0], 350); PB.moveTo(k[1], 350, { callback: () => b.update() });
      }));
      let c0 = null;
      b.on('update', () => {
        const t = tipo(), p = ctx.paso();
        if (t === 'superpuestos' && p === 0) s.superpuestos = true;
        if (t === 'opuestos' && p === 1) s.opuestos = true;
        if (t === 'nulo' && p === 2) s.nulo = true;
        if (p === 3) { if (!c0) c0 = c().join(); if (t === 'independiente' && c().join() !== c0) s.tercero = true; }
        let h = `<span class="tipo ${t === 'independiente' ? 'ind' : 'dep'}">${NOMBRES[t]}${t === 'independiente' ? '' : ': conjunto dependiente'}</span>${ecuacion(a(), bb(), t)}`;
        if (conC()) h = `<span class="tipo dep">{${A}, ${B}, ${C}}: conjunto dependiente</span>${C} = ${fmt(al())}${A} ${be() < 0 ? '−' : '+'} ${fmt(Math.abs(be()))}${B}, por lo tanto ${fmt(al())}${A} ${be() < 0 ? '−' : '+'} ${fmt(Math.abs(be()))}${B} − 1${C} = ∅.`;
        ctx.lectura.innerHTML = h;
        ctx.cambio(s);
      });
      return { board: b, estado: s };
    },
    practica() {
      const t = elige(['superpuestos', 'opuestos', 'nulo', 'independiente']);
      const a = [elige([1, 2, 3, -1, -2]), elige([1, 2, -1, 3])];
      let b;
      if (t === 'superpuestos') { const k = elige([2, 3]); b = [k * a[0], k * a[1]]; }
      else if (t === 'opuestos') { const k = elige([-1, -2, -3]); b = [k * a[0], k * a[1]]; }
      else if (t === 'nulo') b = [0, 0];
      else b = [a[1] + elige([0, 1]), -a[0]];
      const exp = { superpuestos: `${B} = ${fmt(b[0] / a[0])}${A}, con escalar positivo.`, opuestos: `${B} = ${fmt(b[0] / a[0])}${A}, con escalar negativo.`,
        nulo: `${B} es el vector nulo, y todo conjunto que lo contiene es dependiente.`, independiente: `${B} no es múltiplo de ${A} y ninguno es nulo.` };
      return { tipo: 'opc', enun: `Clasifica el conjunto formado por ${A} = ${par(...a)} y ${B} = ${par(...b)}.`,
        ops: ['superpuestos', 'opuestos', 'nulo', 'independiente'].map((k) => ({ t: k === 'independiente' ? 'Independiente' : `Dependiente: ${NOMBRES[k].toLowerCase()}`, ok: k === t })),
        sol: exp[t] };
    }
  };

  /* ---------- 1.4 Dependencia en R³ ---------- */
  const L4 = {
    id: 's4', num: '1.4', titulo: 'Dependencia lineal en R³',
    entrada: 'En R³ la idea es la misma con una dimensión más. Dos vectores independientes generan un plano, y el tercer vector decide si el conjunto es dependiente.',
    pasos: [
      { html: `<p>${A} y ${B} son independientes y <b>generan un plano</b> que pasa por el origen, dibujado como una lámina. El vector ${C} sale de ese plano.</p><p>Ninguno de los tres puede construirse con los otros dos. El conjunto {${A}, ${B}, ${C}} es <b>independiente</b> y forma una base de R³.</p>`,
        tarea: 'Gira la vista para ver cómo <i class="v cc">c</i> se separa del plano.', ok: (s) => s.giro,
        descubre: `La línea punteada marca la altura de ${C} sobre el plano de ${A} y ${B}.` },
      { html: `<p>Al bajar ${C} hasta el plano, pasa a ser una <b>combinación lineal de ${A} y ${B}</b>. El conjunto se vuelve dependiente.</p><p>${C} <b>no es múltiplo de ${A} ni de ${B}</b>. En R³ ya no basta revisar los vectores por pares: tres vectores son dependientes cuando <b>comparten un mismo plano</b>.</p>`,
        tarea: 'Lleva la altura a 0, con α y β distintos de 0.', ok: (s) => s.coplanar,
        descubre: 'En R² la dependencia era compartir una recta. En R³ también lo es compartir un plano.' },
      { html: `<p>Los casos de R² siguen presentes. Si además β = 0, ${C} queda <b>superpuesto u opuesto a ${A}</b>. El conjunto ya era dependiente y lo sigue siendo.</p><p>La regla general: un conjunto es dependiente cuando <b>algún vector es combinación lineal de los demás</b>. Rectas y planos compartidos son la forma en que eso se ve.</p>`,
        tarea: 'Con la altura en 0, lleva β a 0 y deja α distinto de 0.', ok: (s) => s.alineado,
        descubre: `${C} quedó sobre la recta de ${A}. Todo supraconjunto de un conjunto dependiente es dependiente.` }
    ],
    montar(ctx) {
      const b = tablero(ctx.tablero, 5.2, false);
      ctx.ctrl.innerHTML = slider('giro', 'Girar la vista', -80, 80, 1, 28) + slider('al3', 'Escalar α', -1.5, 1.5, 0.25, 0.75)
        + slider('be3', 'Escalar β', -1.5, 1.5, 0.25, 0.75) + slider('alt', 'Altura sobre el plano', -2, 3, 0.25, 2.5);
      const v = ligaSliders(ctx, ['giro', 'al3', 'be3', 'alt'], b);
      const s = { giro: false, coplanar: false, alineado: false };
      const a3 = [3, 0.6, 0], b3 = [0.4, 3, 0], EL = 0.42;
      const P = (f) => {                      // proyección de un punto 3D (función) a la pantalla
        const X = () => { const p = f(), az = v.giro * Math.PI / 180; return -p[0] * Math.sin(az) + p[1] * Math.cos(az); };
        const Y = () => { const p = f(), az = v.giro * Math.PI / 180; return -(p[0] * Math.cos(az) + p[1] * Math.sin(az)) * Math.sin(EL) + p[2] * Math.cos(EL); };
        return oculto(b, X, Y);
      };
      const O = P(() => [0, 0, 0]);
      const c3 = () => [v.al3 * a3[0] + v.be3 * b3[0], v.al3 * a3[1] + v.be3 * b3[1], v.alt];
      b.create('polygon', [[-4, -4, 0], [4, -4, 0], [4, 4, 0], [-4, 4, 0]].map((q) => P(() => q)),
        { fillColor: COL.t, fillOpacity: 0.13, highlight: false, fixed: true, borders: { strokeColor: COL.t, strokeWidth: 1, strokeOpacity: 0.5, highlight: false, fixed: true }, vertices: { visible: false } });
      [[4.6, 0, 0, 'x'], [0, 4.6, 0, 'y'], [0, 0, 4.2, 'z']].forEach((e) => {
        const Q = P(() => e);
        b.create('segment', [O, Q], { strokeColor: COL.eje, strokeWidth: 1, fixed: true, highlight: false });
        b.create('text', [() => Q.X(), () => Q.Y(), e[3]], { fontSize: 12, strokeColor: '#8d8580', fixed: true });
      });
      const TA = P(() => a3), TB = P(() => b3), TC = P(c3), PIE = P(() => [c3()[0], c3()[1], 0]);
      b.create('segment', [PIE, TC], { strokeColor: COL.c, strokeWidth: 1.2, dash: 2, fixed: true, highlight: false, visible: () => Math.abs(v.alt) > EPS });
      b.create('segment', [O, PIE], { strokeColor: COL.c, strokeWidth: 1, dash: 2, strokeOpacity: 0.5, fixed: true, highlight: false, visible: () => Math.abs(v.alt) > EPS });
      flecha(b, O, TA, COL.a, { strokeWidth: 3 }); flecha(b, O, TB, COL.b, { strokeWidth: 3 }); flecha(b, O, TC, COL.c, { strokeWidth: 3.2 });
      const et = (T, n, col) => b.create('text', [() => T.X(), () => T.Y(), `&nbsp;<u>${n}</u>`], { fontSize: 16, strokeColor: col, fixed: true, anchorY: 'bottom', cssStyle: 'font-style:italic;font-family:Cambria,Georgia,serif' });
      et(TA, 'a', COL.a); et(TB, 'b', COL.b); et(TC, 'c', COL.c);
      const g0 = v.giro;
      b.on('update', () => {
        const p = ctx.paso(), plano = Math.abs(v.alt) < EPS;
        if (Math.abs(v.giro - g0) >= 20) s.giro = true;
        if (p >= 1 && plano && v.al3 !== 0 && v.be3 !== 0) s.coplanar = true;
        if (p >= 2 && plano && v.be3 === 0 && v.al3 !== 0) s.alineado = true;
        let h;
        if (!plano) h = `<span class="tipo ind">Conjunto independiente</span>${C} está a una altura de ${fmt(v.alt)} sobre el plano de ${A} y ${B}.<br><span class="nota">Ningún vector es combinación lineal de los otros dos.</span>`;
        else if (v.al3 === 0 && v.be3 === 0) h = `<span class="tipo dep">Conjunto dependiente</span>${C} es el vector nulo: 0${A} + 0${B} + 1${C} = ∅.`;
        else h = `<span class="tipo dep">Conjunto dependiente</span>${C} = ${fmt(v.al3)}${A} ${v.be3 < 0 ? '−' : '+'} ${fmt(Math.abs(v.be3))}${B}, por lo tanto ${fmt(v.al3)}${A} ${v.be3 < 0 ? '−' : '+'} ${fmt(Math.abs(v.be3))}${B} − 1${C} = ∅.<br><span class="nota">${v.be3 === 0 ? `${C} está sobre la recta de ${A}.` : (v.al3 === 0 ? `${C} está sobre la recta de ${B}.` : `Los tres vectores comparten un plano.`)}</span>`;
        ctx.lectura.innerHTML = h;
        ctx.cambio(s);
      });
      return { board: b, estado: s };
    },
    practica() {
      const p = elige([2, 3, -2]), q = elige([-1, 2, -3, 4]);
      return { tipo: 'num',
        enun: `En R³, ${A} y ${B} son independientes y ${C} = ${fmt(p)}${A} ${q < 0 ? '−' : '+'} ${fmt(Math.abs(q))}${B}. Completa la solución no trivial que demuestra que {${A}, ${B}, ${C}} es dependiente.`,
        campos: [{ etq: '', val: -p, fin: `${A} +` }, { etq: '', val: -q, fin: `${B} + 1${C} = ∅` }],
        sol: `Al pasar todo a un lado: ${fmt(-p)}${A} ${-q < 0 ? '−' : '+'} ${fmt(Math.abs(q))}${B} + 1${C} = ∅. Los escalares no son todos nulos, así que el conjunto es dependiente.` };
    },
    eco: `<h3>Aplicación en contextos económicos</h3><p>En econometría, las variables explicativas de un modelo son vectores columna. Si una de ellas es combinación lineal de las demás, el conjunto es dependiente y el modelo no puede separar el efecto de cada variable. Ese caso se conoce como multicolinealidad perfecta.</p><p>Un ejemplo es incluir el ingreso en soles, el ingreso en dólares y el tipo de cambio fijo que los relaciona: una variable es múltiplo de otra, igual que dos vectores superpuestos.</p>`
  };

  window.LECCIONES = [L1, L2, L3, L4];
  window.ESC = { tablero, flecha, punto, COL };
})();
