/* Botón «Diseña tu ruta»: abre el planificador (/disena-tu-indonesia.html?embed=1) en una ventana tipo chat.
   PC: ventana de 420 px abajo a la derecha. Móvil: hoja que sube desde abajo.
   Los enlaces a /disena-tu-indonesia.html de la página abren la ventana en vez de cambiar de página.
   La ventana no se carga hasta el primer clic. */
(function () {
  if (window.__rutaWidget) return; window.__rutaWidget = true;
  var URL_PLAN = '/disena-tu-indonesia.html';

  var css = '' +
    '.ruta-fab{position:fixed;right:calc(1.4rem + env(safe-area-inset-right,0px));bottom:calc(1.4rem + env(safe-area-inset-bottom,0px));z-index:900;display:flex;align-items:center;gap:.6rem;background:#C4724A;color:#fff;border:0;border-radius:999px;padding:.85rem 1.25rem .85rem 1rem;font:500 .78rem/1 "DM Sans",system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 28px rgba(28,26,23,.28);transition:transform .25s,background .25s,opacity .25s}' +
    '.ruta-fab:hover{background:#b35e38;transform:translateY(-2px)}' +
    '.ruta-fab svg{width:22px;height:22px;flex:none}' +
    '.ruta-fab.abierto{opacity:0;pointer-events:none;transform:scale(.8)}' +
    '.ruta-panel{position:fixed;right:calc(1.4rem + env(safe-area-inset-right,0px));bottom:calc(1.4rem + env(safe-area-inset-bottom,0px));z-index:901;width:420px;height:min(700px,calc(100vh - 7rem));background:#F5F0E8;border-radius:14px;box-shadow:0 18px 60px rgba(28,26,23,.35);display:flex;flex-direction:column;overflow:hidden;transform-origin:bottom right;transform:scale(.92) translateY(12px);opacity:0;pointer-events:none;visibility:hidden;transition:transform .28s ease,opacity .28s ease,visibility 0s linear .28s}' +
    '.ruta-panel.abierto{transform:none;opacity:1;pointer-events:auto;visibility:visible;transition:transform .28s ease,opacity .28s ease}' +
    '.ruta-panel header{display:flex;align-items:center;gap:.8rem;background:#1C1A17;color:#fff;padding:.9rem 1rem .9rem 1.2rem}' +
    '.ruta-panel header .t{flex:1;min-width:0}' +
    '.ruta-panel header strong{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;font-size:1.3rem;line-height:1.1}' +
    '.ruta-panel header small{display:block;font:300 .72rem "DM Sans",system-ui,sans-serif;color:rgba(255,255,255,.65);margin-top:.15rem}' +
    '.ruta-panel header button{background:none;border:1px solid rgba(255,255,255,.3);color:#fff;width:34px;height:34px;border-radius:50%;font-size:1.1rem;line-height:1;cursor:pointer;flex:none}' +
    '.ruta-panel iframe{flex:1;width:100%;border:0;background:#F5F0E8}' +
    '.ruta-velo{display:none}' +
    '@media (max-width:600px){' +
      '.ruta-fab{padding:.8rem 1rem .8rem .9rem;font-size:.7rem}' +
      '.ruta-panel{left:0;right:0;bottom:0;width:auto;height:calc(100dvh - 3.5rem);border-radius:16px 16px 0 0;transform:translateY(100%);opacity:1}' +
      '.ruta-panel.abierto{transform:none}' +
      '.ruta-velo{display:block;position:fixed;inset:0;z-index:900;background:rgba(28,26,23,.45);opacity:0;pointer-events:none;transition:opacity .28s}' +
      '.ruta-velo.abierto{opacity:1;pointer-events:auto}' +
      'body:has(#bassa-cookies) .ruta-fab{display:none}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.ruta-fab,.ruta-panel,.ruta-velo{transition:none}}';

  function monta() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var w = document.createElement('div');
    w.innerHTML =
      '<button class="ruta-fab" id="ruta-fab" type="button" aria-haspopup="dialog" aria-controls="ruta-panel">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5V4l-6 2.5L9 4Z"/><path d="M9 4v13M15 6.5v13"/></svg>' +
        '<span>Diseña tu ruta</span></button>' +
      '<div class="ruta-velo" id="ruta-velo"></div>' +
      '<div class="ruta-panel" id="ruta-panel" role="dialog" aria-label="Diseña tu Indonesia" aria-hidden="true">' +
        '<header><div class="t"><strong>Diseña tu Indonesia</strong><small>Cinco preguntas. Tu ruta, al momento.</small></div>' +
        '<button type="button" id="ruta-cerrar" aria-label="Cerrar">×</button></header>' +
        '<iframe id="ruta-iframe" title="Planificador de rutas"></iframe></div>';
    while (w.firstChild) document.body.appendChild(w.firstChild);

    var fab = document.getElementById('ruta-fab'), panel = document.getElementById('ruta-panel'),
        velo = document.getElementById('ruta-velo'), fr = document.getElementById('ruta-iframe'),
        cerrarBtn = document.getElementById('ruta-cerrar');

    function abrir(e) {
      if (e) e.preventDefault();
      if (!fr.getAttribute('src')) fr.setAttribute('src', URL_PLAN + '?embed=1');
      [panel, velo, fab].forEach(function (x) { x.classList.add('abierto'); });
      panel.setAttribute('aria-hidden', 'false');
      if (typeof window.closeDrawer === 'function') { try { window.closeDrawer(); } catch (_) {} }
      setTimeout(function () { cerrarBtn.focus(); }, 300);
      try { if (window.gtag) window.gtag('event', 'planificador_abrir'); } catch (_) {}
    }
    function cerrar() {
      [panel, velo, fab].forEach(function (x) { x.classList.remove('abierto'); });
      panel.setAttribute('aria-hidden', 'true'); fab.focus();
    }
    fab.addEventListener('click', abrir);
    velo.addEventListener('click', cerrar);
    cerrarBtn.addEventListener('click', cerrar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('abierto')) cerrar(); });
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var h = a.getAttribute('href');
      if (h === URL_PLAN || h === 'https://bassatravels.com' + URL_PLAN) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // abrir en pestaña nueva sigue funcionando
        abrir(e);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
