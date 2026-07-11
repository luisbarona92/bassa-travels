/* Bassa Travels — gestión de consentimiento de cookies (RGPD/AEPD).
   GA4 solo se carga tras "Aceptar". La elección se guarda 1 año en la cookie cookie_consent. */
(function () {
  var KEY = 'cookie_consent';
  var GA_ID = 'G-BDCEX8NHLB';

  function getConsent() {
    var m = document.cookie.match(/(?:^|;\s*)cookie_consent=(granted|denied)/);
    return m ? m[1] : null;
  }

  function setConsent(value) {
    document.cookie = KEY + '=' + value + '; max-age=31536000; path=/; SameSite=Lax';
  }

  function loadGA() {
    if (window.__bassaGaLoaded) return;
    window.__bassaGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function removeBanner() {
    var b = document.getElementById('bassa-cookies');
    if (b) b.remove();
  }

  /* Al rechazar, elimina también las cookies _ga instaladas en visitas anteriores */
  function clearGACookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        document.cookie = name + '=; max-age=0; path=/';
        document.cookie = name + '=; max-age=0; path=/; domain=.' + location.hostname;
      }
    });
  }

  function showBanner() {
    if (document.getElementById('bassa-cookies')) return;
    if (!document.getElementById('bassa-cookies-css')) {
      var st = document.createElement('style');
      st.id = 'bassa-cookies-css';
      st.textContent =
        '#bassa-cookies{position:fixed;left:1.2rem;bottom:1.2rem;z-index:9999;max-width:380px;' +
        'background:#1C1A17;color:rgba(255,255,255,0.75);border:1px solid rgba(255,255,255,0.12);' +
        'border-radius:2px;padding:1.1rem 1.2rem;font-family:"DM Sans",sans-serif;font-weight:300;' +
        'font-size:0.78rem;line-height:1.6;box-shadow:0 8px 30px rgba(0,0,0,0.25);}' +
        '#bassa-cookies p{margin:0 0 0.8rem;}' +
        '#bassa-cookies a{color:rgba(255,255,255,0.9);text-decoration:underline;text-underline-offset:2px;}' +
        '#bassa-cookies .bc-actions{display:flex;gap:0.6rem;}' +
        '#bassa-cookies button{flex:1;cursor:pointer;border-radius:2px;padding:0.55rem 0.9rem;' +
        'font-family:"DM Sans",sans-serif;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;' +
        'font-weight:500;transition:all 0.3s;}' +
        '#bassa-cookies button.bc-reject{background:transparent;color:rgba(255,255,255,0.65);' +
        'border:1px solid rgba(255,255,255,0.3);}' +
        '#bassa-cookies button.bc-reject:hover{color:#fff;border-color:rgba(255,255,255,0.6);}' +
        '#bassa-cookies button.bc-accept{background:#C4724A;color:#fff;border:1px solid #C4724A;}' +
        '#bassa-cookies button.bc-accept:hover{background:#b35e38;border-color:#b35e38;}' +
        '@media (max-width:600px){#bassa-cookies{left:0.8rem;right:0.8rem;bottom:0.8rem;max-width:none;}}';
      document.head.appendChild(st);
    }
    var lang = 'es';
    try { if (localStorage.getItem('bassa_lang') === 'en') lang = 'en'; } catch (e) {}
    var texts = {
      es: {
        aria: 'Aviso de cookies',
        msg: 'Usamos una cookie analítica (Google Analytics) para entender cómo se usa la web.',
        more: 'Más información',
        reject: 'Rechazar',
        accept: 'Aceptar'
      },
      en: {
        aria: 'Cookie notice',
        msg: 'We use an analytics cookie (Google Analytics) to understand how the site is used.',
        more: 'Learn more',
        reject: 'Decline',
        accept: 'Accept'
      }
    }[lang];
    var d = document.createElement('div');
    d.id = 'bassa-cookies';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', texts.aria);
    var inBlog = location.pathname.indexOf('/blog/') === 0 ||
                 location.pathname.indexOf('/propuestas/') === 0 ||
                 location.pathname.indexOf('/partners/') === 0 ||
                 location.pathname.indexOf('/contact/') === 0;
    var policyHref = (inBlog ? '../' : '') + 'cookies.html';
    d.innerHTML =
      '<p>' + texts.msg + ' ' +
      '<a href="' + policyHref + '">' + texts.more + '</a></p>' +
      '<div class="bc-actions">' +
      '<button type="button" class="bc-reject">' + texts.reject + '</button>' +
      '<button type="button" class="bc-accept">' + texts.accept + '</button>' +
      '</div>';
    document.body.appendChild(d);
    d.querySelector('.bc-accept').addEventListener('click', function () {
      setConsent('granted');
      removeBanner();
      loadGA();
    });
    d.querySelector('.bc-reject').addEventListener('click', function () {
      setConsent('denied');
      clearGACookies();
      removeBanner();
    });
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* Permite reabrir el aviso desde cualquier elemento con data-cookie-reset (p. ej. en cookies.html) */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-cookie-reset]') : null;
    if (t) {
      e.preventDefault();
      document.cookie = KEY + '=; max-age=0; path=/';
      showBanner();
    }
  });

  var consent = getConsent();
  if (consent === 'granted') {
    loadGA();
  } else if (consent === null) {
    onReady(showBanner);
  }
})();
