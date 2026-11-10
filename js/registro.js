// Registro de eventos: guarda una cola local y la envía a Google Sheets.
window.Registro = (function () {
  const K = 'ral_cola';
  let ctx = { pid: '', semestre: '', forma_pre: '' };
  const leer = () => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch (e) { return []; } };
  const guardar = (c) => { try { localStorage.setItem(K, JSON.stringify(c)); } catch (e) {} };
  let enviando = false;

  async function vaciar() {
    if (enviando || !CONFIG.ENDPOINT) return;
    const cola = leer();
    if (!cola.length) return;
    enviando = true;
    try {
      await fetch(CONFIG.ENDPOINT, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(cola)
      });
      const ahora = leer();
      guardar(ahora.slice(cola.length));
    } catch (e) { /* se reintenta en el siguiente evento */ }
    enviando = false;
  }

  function log(evento, d = {}) {
    const fila = Object.assign({
      ts: new Date().toISOString(), pid: ctx.pid, semestre: ctx.semestre, forma_pre: ctx.forma_pre,
      evento, seccion: '', item: '', habilidad: '', respuesta: '', correcta: '', error: '', texto: '', ms: '',
      extra: ''
    }, d);
    if (typeof fila.extra === 'object') fila.extra = JSON.stringify(fila.extra);
    fila.version = CONFIG.VERSION;
    const c = leer(); c.push(fila); guardar(c);
    vaciar();
  }
  window.addEventListener('online', vaciar);
  return { log, vaciar, contexto: (c) => { ctx = Object.assign(ctx, c); } };
})();
