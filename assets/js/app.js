'use strict';

/* ================================================================
   TRANSLATIONS
   ================================================================ */
const TRANSLATIONS = {
  es: {
    tagUpdate: 'Actualización', tagEvent: 'Evento', tagMaint: 'Mantenimiento', tagNews: 'Noticia',
    serverGmt: 'Servidor · GMT-6', statusOnline: 'Online',
    bannerEyebrow: 'Bienvenido al mundo de',
    bannerSub: 'La aventura te aguarda entre las nieblas de Midgard',
    latestNews: 'Últimas Noticias',
    noNewsTitle: 'No hay noticias publicadas',
    noNewsBody: 'Agrega entradas en assets/js/news-data.js para mostrarlas aquí.',
    readMore: 'Leer más ›',
    loginTitle: 'Iniciar Sesión', loginSub: 'Accede a tu cuenta de Vanaheim',
    labelUser: 'Usuario', placeholderUser: 'Tu nombre de aventurero',
    labelPass: 'Contraseña', placeholderPass: '••••••••••',
    rememberSession: 'Recordar sesión', forgotPass: '¿Olvidaste tu contraseña?',
    btnPlay: '▶ \u00A0Iniciar Sesión y Jugar',
    btnPlayOnly: '⚑ \u00A0Solo en patcher',
    btnUpdating: '↻ \u00A0Actualizando cliente...',
    btnVerifying: '… \u00A0Verificando parches...',
    btnNotReady: '⚠ \u00A0Cliente no listo',
    orDivider: 'o', btnRegister: 'Crear nueva cuenta',
    serverStatus: 'Estado del Servidor', statPlayers: 'Jugadores Online',
    statUptime: 'Uptime', statExpJob: 'Tasa Exp / Job', statDrop: 'Tasa Drop',
    patcherLabel: 'Patcher',
    patcherInit: 'Inicializando patcher...',
    patcherWaiting: 'Esperando estado real del patcher...',
    patcherConnecting: 'Conectando con servidor de parches...',
    patcherWebMode: 'Vista web sin bridge real del patcher.',
    patcherListLoaded: 'Lista real cargada: {n} parche(s) en plist.txt',
    patcherReady: 'Cliente actualizado — listo para jugar.',
    patcherError: 'Error: {msg}',
    patcherDownloading: 'Descargando parche {a}/{b}...',
    patcherInstalling: 'Instalando parche {a}/{b}...',
    patcherConcurrent: 'Descargando {a}/{b} | Instalando {c}/{b}',
    patcherApplied: 'Patch manual aplicado: {name}',
    patcherInProgress: 'Ya hay una actualización en progreso.',
    toastReady: '¡Cliente listo. Que comience la aventura!',
    toastError: 'Falló la actualización. Revisa el log.',
    toastUpdating: 'Iniciando actualización...',
    toastLaunching: 'Lanzando cliente, bienvenido {user}!',
    toastNeedBridge: 'Esta vista no tiene bridge del patcher.',
    toastPatching: 'Aún estamos verificando/actualizando parches.',
    toastNeedCreds: 'Ingresa tu usuario y contraseña.',
    toastApplied: 'Patch manual aplicado: {name}',
    toastInProgress: 'Ya hay un update en progreso.',
    speedVerified: 'lista verificada', speedWebMode: 'modo web',
    speedInstalling: 'instalando', speedBridgeErr: 'bridge error',
    speedNoBridge: 'sin bridge', speedStarting: 'iniciando', speedError: 'error',
    savedAccounts: 'Cuentas guardadas', clearAccounts: 'Limpiar',
    optionsTitle: 'Opciones', optTheme: 'Tema', optLang: 'Idioma',
    themeDark: 'Oscuro', themeLight: 'Claro',
    VanatoolsTitle: 'Vana Tools', ntWiki: 'Wiki', ntFluxCP: 'Control Panel',
    ntDiscord: 'Discord', ntStats: 'Estadísticas',
    srhTitle: 'SimpleROHook', srhLoading: 'Cargando configuración...',
    srhReady: 'Configuración cargada.', srhDirty: '{n} cambio(s) sin guardar.',
    srhSaved: 'Configuración guardada.', srhReload: 'Recargar',
    srhReset: 'Revertir cambios', srhSave: 'Guardar',
    srhNoBridge: 'Esta vista no tiene bridge del launcher.',
    srhEmpty: 'No hay opciones en esta sección.',
    srhLoadError: 'No se pudo leer simplerohook.ini: {msg}',
    srhSaveError: 'No se pudo guardar simplerohook.ini: {msg}'
  },
  en: {
    tagUpdate: 'Update', tagEvent: 'Event', tagMaint: 'Maintenance', tagNews: 'News',
    serverGmt: 'Server · GMT-6', statusOnline: 'Online',
    bannerEyebrow: 'Welcome to the world of',
    bannerSub: 'Adventure awaits you in the mists of Midgard',
    latestNews: 'Latest News',
    noNewsTitle: 'No news published yet',
    noNewsBody: 'Add entries in assets/js/news-data.js to show them here.',
    readMore: 'Read more ›',
    loginTitle: 'Sign In', loginSub: 'Access your Vanaheim account',
    labelUser: 'Username', placeholderUser: 'Your adventurer name',
    labelPass: 'Password', placeholderPass: '••••••••••',
    rememberSession: 'Remember session', forgotPass: 'Forgot your password?',
    btnPlay: '▶ \u00A0Sign In & Play',
    btnPlayOnly: '⚑ \u00A0Patcher only',
    btnUpdating: '↻ \u00A0Updating client...',
    btnVerifying: '… \u00A0Verifying patches...',
    btnNotReady: '⚠ \u00A0Client not ready',
    orDivider: 'or', btnRegister: 'Create new account',
    serverStatus: 'Server Status', statPlayers: 'Players Online',
    statUptime: 'Uptime', statExpJob: 'Exp / Job Rate', statDrop: 'Drop Rate',
    patcherLabel: 'Patcher',
    patcherInit: 'Initializing patcher...',
    patcherWaiting: 'Waiting for patcher status...',
    patcherConnecting: 'Connecting to patch server...',
    patcherWebMode: 'Web view — no real patcher bridge.',
    patcherListLoaded: 'List loaded: {n} patch(es) in plist.txt',
    patcherReady: 'Client updated — ready to play.',
    patcherError: 'Error: {msg}',
    patcherDownloading: 'Downloading patch {a}/{b}...',
    patcherInstalling: 'Installing patch {a}/{b}...',
    patcherConcurrent: 'Downloading {a}/{b} | Installing {c}/{b}',
    patcherApplied: 'Manual patch applied: {name}',
    patcherInProgress: 'An update is already in progress.',
    toastReady: 'Client ready. Let the adventure begin!',
    toastError: 'Update failed. Check the log.',
    toastUpdating: 'Starting update...',
    toastLaunching: 'Launching client, welcome {user}!',
    toastNeedBridge: 'This view has no patcher bridge.',
    toastPatching: 'Still verifying/updating patches.',
    toastNeedCreds: 'Enter your username and password.',
    toastApplied: 'Manual patch applied: {name}',
    toastInProgress: 'An update is already in progress.',
    speedVerified: 'list verified', speedWebMode: 'web mode',
    speedInstalling: 'installing', speedBridgeErr: 'bridge error',
    speedNoBridge: 'no bridge', speedStarting: 'starting', speedError: 'error',
    savedAccounts: 'Saved accounts', clearAccounts: 'Clear',
    optionsTitle: 'Options', optTheme: 'Theme', optLang: 'Language',
    themeDark: 'Dark', themeLight: 'Light',
    VanatoolsTitle: 'Vana Tools', ntWiki: 'Wiki', ntFluxCP: 'Control Panel',
    ntDiscord: 'Discord', ntStats: 'Statistics',
    srhTitle: 'SimpleROHook', srhLoading: 'Loading configuration...',
    srhReady: 'Configuration loaded.', srhDirty: '{n} unsaved change(s).',
    srhSaved: 'Configuration saved.', srhReload: 'Reload',
    srhReset: 'Revert changes', srhSave: 'Save',
    srhNoBridge: 'This view has no launcher bridge.',
    srhEmpty: 'There are no options in this section.',
    srhLoadError: 'Could not read simplerohook.ini: {msg}',
    srhSaveError: 'Could not save simplerohook.ini: {msg}'
  }
};

/* ================================================================
   I18N
   ================================================================ */
const i18n = {
  lang: 'es',

  detect() {
    const saved = localStorage.getItem('vanaheim_lang');
    if (saved === 'es' || saved === 'en') return saved;
    const sys = (navigator.language || 'es').toLowerCase();
    return sys.startsWith('en') ? 'en' : 'es';
  },

  t(key, vars = {}) {
    const str = (TRANSLATIONS[this.lang] || TRANSLATIONS.es)[key]
      || TRANSLATIONS.es[key]
      || key;
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
  },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    // Update active lang pill (ES/EN only)
    document.querySelectorAll('.lang-pill').forEach(pill => {
      const code = pill.dataset.lang;
      if (code === 'es' || code === 'en') {
        pill.classList.toggle('active', code === this.lang);
      }
    });
    // Re-render dynamic content
    renderNews();
    syncLaunchButtonState();
  },

  setLang(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    this.lang = lang;
    localStorage.setItem('vanaheim_lang', lang);
    this.apply();
  },

  init() {
    this.lang = this.detect();
    this.apply();
  }
};

/* ================================================================
   THEME
   ================================================================ */
const themeManager = {
  KEY: 'vanaheim_theme',

  detect() {
    const saved = localStorage.getItem(this.KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  },

  apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    const input = document.getElementById('theme-toggle-input');
    if (input) input.checked = mode === 'light';
    const thumb = document.getElementById('theme-toggle-thumb');
    if (thumb) thumb.textContent = mode === 'light' ? '☀' : '☽';
    document.querySelectorAll('.lang-pill[data-lang^="__"]').forEach(pill => {
      const mapped = pill.dataset.lang === '__light__' ? 'light' : 'dark';
      pill.classList.toggle('active', mapped === mode);
    });
    setParticlePaletteForTheme(mode);
  },

  set(mode, persist = true) {
    if (mode !== 'light' && mode !== 'dark') return;
    if (persist) localStorage.setItem(this.KEY, mode);
    this.apply(mode);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.set(next, true);
  },

  init() {
    this.apply(this.detect());
    window.matchMedia?.('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(this.KEY)) {
        this.apply(e.matches ? 'light' : 'dark');
      }
    });
  }
};

/* ================================================================
   ACCOUNTS
   ================================================================ */
const accounts = {
  KEY: 'vanaheim_accounts',
  MAX: 6,

  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  add(login) {
    if (!login || !login.trim()) return;
    let list = this.load().filter(a => a.login !== login);
    list.unshift({ login, savedAt: Date.now() });
    if (list.length > this.MAX) list = list.slice(0, this.MAX);
    this.save(list);
    renderAccountSwitcher();
  },

  remove(login) {
    this.save(this.load().filter(a => a.login !== login));
    renderAccountSwitcher();
  },

  clear() {
    this.save([]);
    renderAccountSwitcher();
  }
};

/* ================================================================
   DOM refs
   ================================================================ */
const $ = id => document.getElementById(id);

const dom = {
  newsList: $('news-list'),
  patcherBar: document.querySelector('.patcher-bar'),
  backdrop: $('modal-backdrop'),
  modalEl: $('modal'),
  modalClose: $('modal-close'),
  modalTag: $('modal-tag'),
  modalTitle: $('modal-title'),
  modalDate: $('modal-date'),
  modalBody: $('modal-body'),
  clockTime: $('clock-time'),
  username: $('username'),
  password: $('password'),
  btnLaunch: $('btn-launch'),
  toast: $('toast'),
  toastIcon: $('toast-icon'),
  toastMsg: $('toast-msg'),
  patchLog: $('patch-log'),
  progressFill: $('progress-fill'),
  progressPct: $('progress-pct'),
  progressSpeed: $('progress-speed'),
  playersOnline: $('players-online'),
  patchVersion: document.querySelector('.patch-version-pill'),
  accountSwitcher: $('account-switcher'),
  accountList: $('account-list'),
  accountClear: $('account-clear'),
  panelOptions: $('panel-options'),
  panelVanatools: $('panel-Vanatools'),
  btnOptions: $('btn-options'),
  btnVanatools: $('btn-Vanatools'),
  themeToggleInput: $('theme-toggle-input'),
  btnSrhConfig: $('btn-srh-config'),
  srhBackdrop: $('srh-backdrop'),
  srhClose: $('srh-close'),
  srhPath: $('srh-path'),
  srhStatus: $('srh-status'),
  srhSections: $('srh-sections'),
  srhSettings: $('srh-settings'),
  srhReload: $('srh-reload'),
  srhReset: $('srh-reset'),
  srhSave: $('srh-save')
};

const state = {
  pct: 0,
  patchReady: false,
  patching: false,
  updateRequested: false,
  backendSignalReceived: false
};

/* ================================================================
   NEWS
   ================================================================ */
function getLocalizedField(item, field) {
  if (i18n.lang !== 'es') {
    const key = `${field}_${i18n.lang}`;
    if (item[key]) return item[key];
  }
  return item[field] || '';
}

function getNewsData() {
  const raw = Array.isArray(window.NEWS_DATA) ? window.NEWS_DATA : [];
  return raw
    .filter(item => item && item.published !== false)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function formatNewsDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  const months = {
    es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  };
  const day = String(date.getDate()).padStart(2, '0');
  const month = (months[i18n.lang] || months.es)[date.getMonth()];
  return `${day} · ${month} · ${date.getFullYear()}`;
}

function getTagLabel(tag) {
  const map = { update: 'tagUpdate', event: 'tagEvent', maint: 'tagMaint' };
  return i18n.t(map[tag] || 'tagNews');
}

function escapeHtml(v) {
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function normalizeImageUrl(v) { return typeof v === 'string' ? v.trim() : ''; }

function clampPercent(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(200, Math.max(-200, Math.round(n))) : fallback;
}

function clampRange(v, min, max, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
}

function getCardImage(item) {
  const url = normalizeImageUrl(item.cardImage || item.image);
  if (!url) return null;
  return {
    url,
    posX: clampPercent(item.cardImagePosX, 100),
    posY: clampPercent(item.cardImagePosY, 50),
    zoom: clampRange(item.cardImageZoom, 50, 400, 110),
    maskSize: clampRange(item.cardMaskSize, 20, 200, 90)
  };
}

function getModalImages(item) {
  const list = [];
  const single = normalizeImageUrl(item.modalImage || item.image);
  if (Array.isArray(item.images) && item.images.length) {
    item.images.forEach(img => { const n = normalizeImageUrl(img); if (n) list.push(n); });
  } else if (single) {
    list.push(single);
  } else {
    const card = normalizeImageUrl(item.cardImage);
    if (card) list.push(card);
  }
  return list;
}

function renderNews() {
  const news = getNewsData();
  dom.newsList.innerHTML = '';

  if (!news.length) {
    dom.newsList.innerHTML = `
      <div class="news-card">
        <div class="news-tag update">${i18n.t('tagNews')}</div>
        <h3>${i18n.t('noNewsTitle')}</h3>
        <p>${i18n.t('noNewsBody')}</p>
        <div class="news-date">—</div>
      </div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  news.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.animationDelay = `${index * 0.055}s`;
    const ci = getCardImage(item);
    if (ci) card.classList.add('has-media');

    card.innerHTML = `
      ${ci ? `<div class="news-card-media" style="--news-card-image:url('${ci.url.replace(/'/g,'%27')}');--news-card-pos-x:${ci.posX}%;--news-card-pos-y:${ci.posY}%;--news-card-zoom:${ci.zoom}%;--news-card-mask-size:${ci.maskSize}%;"></div>` : ''}
      <div class="news-tag ${item.tag}">${getTagLabel(item.tag)}</div>
      <h3>${escapeHtml(getLocalizedField(item, 'title'))}</h3>
      <p>${escapeHtml(getLocalizedField(item, 'excerpt'))}</p>
      <div class="news-date">${formatNewsDate(item.createdAt)}</div>
      <div class="news-read-more">${i18n.t('readMore')}</div>`;

    card.addEventListener('click', () => openModal(item, card));
    frag.appendChild(card);
  });

  dom.newsList.appendChild(frag);
}

/* ================================================================
   MODAL — FLIP animation from card
   ================================================================ */
let _modalIsOpen = false;
const _supportsViewTransitions = typeof document.startViewTransition === 'function';
let _activeCardTransitionName = '';
let _activeTransitionCardEl = null;
let _modalSourceCardEl = null;
let _activeOpeningClipStyleEl = null;

function setPatcherBarViewTransitionName(name = '') {
  if (dom.patcherBar) dom.patcherBar.style.viewTransitionName = name;
}

function clearOpeningTransitionClipStyle() {
  if (_activeOpeningClipStyleEl && _activeOpeningClipStyleEl.parentNode) {
    _activeOpeningClipStyleEl.parentNode.removeChild(_activeOpeningClipStyleEl);
  }
  _activeOpeningClipStyleEl = null;
}

function installOpeningTransitionClipStyle(transitionName, cardEl) {
  clearOpeningTransitionClipStyle();
  if (!transitionName || !cardEl || !dom.patcherBar) return;

  const cardRect = cardEl.getBoundingClientRect();
  const patcherRect = dom.patcherBar.getBoundingClientRect();
  const overlapBottom = Math.ceil(cardRect.bottom - patcherRect.top);
  if (overlapBottom <= 0) return;

  const clipBottom = Math.min(overlapBottom, Math.ceil(cardRect.height));
  const style = document.createElement('style');
  style.setAttribute('data-vt-news-open-clip', transitionName);
  style.textContent = `
html.vt-news-opening::view-transition-image-pair(${transitionName}) {
  overflow: clip;
}
html.vt-news-opening::view-transition-old(${transitionName}) {
  clip-path: inset(0 0 ${clipBottom}px 0);
}`;
  document.head.appendChild(style);
  _activeOpeningClipStyleEl = style;
}

function makeViewTransitionName() {
  return `news-card-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function clearActiveViewTransitionNames(cardEl) {
  if (cardEl) cardEl.style.viewTransitionName = '';
  dom.modalEl.style.viewTransitionName = '';
  _activeCardTransitionName = '';
  _activeTransitionCardEl = null;
}

function setModalContent(newsItem) {
  const imgs = getModalImages(newsItem);
  const px = clampPercent(newsItem.modalImagePosX, 50);
  const py = clampPercent(newsItem.modalImagePosY, 50);
  const pz = clampRange(newsItem.modalImageZoom, 50, 400, 100);

  const imagesMarkup = imgs.map((url, i) => `
    <figure class="modal-news-figure">
      <div class="modal-news-image"
        role="img"
        aria-label="${escapeHtml(getLocalizedField(newsItem, 'title') || 'image')} ${i+1}"
        style="--modal-news-image:url('${url.replace(/'/g,'%27')}');--modal-news-pos-x:${px}%;--modal-news-pos-y:${py}%;--modal-news-zoom:${pz}%;">
      </div>
    </figure>`).join('');

  dom.modalTag.innerHTML = `<span class="news-tag ${newsItem.tag}">${getTagLabel(newsItem.tag)}</span>`;
  dom.modalTitle.textContent = getLocalizedField(newsItem, 'title');
  dom.modalDate.textContent = formatNewsDate(newsItem.createdAt);
  dom.modalBody.innerHTML = `${imagesMarkup}${getLocalizedField(newsItem, 'body') || ''}`;
  dom.modalBody.scrollTop = 0;
}

function openModal(newsItem, cardEl = null) {
  setPatcherBarViewTransitionName('');
  clearOpeningTransitionClipStyle();

  if (!_supportsViewTransitions || !cardEl) {
    _modalSourceCardEl = null;
    setModalContent(newsItem);
    dom.backdrop.classList.add('open');
    _modalIsOpen = true;
    updateParticleRuntime();
    return;
  }

  if (_activeCardTransitionName) clearActiveViewTransitionNames(_activeTransitionCardEl);

  _activeCardTransitionName = makeViewTransitionName();
  _activeTransitionCardEl = cardEl;
  _modalSourceCardEl = cardEl;
  installOpeningTransitionClipStyle(_activeCardTransitionName, cardEl);
  cardEl.style.viewTransitionName = _activeCardTransitionName;

  const vt = document.startViewTransition(() => {
    document.documentElement.classList.add('vt-news-opening');
    // old state: named card. new state: named modal.
    cardEl.style.viewTransitionName = '';
    dom.modalEl.style.viewTransitionName = _activeCardTransitionName;
    setModalContent(newsItem);
    dom.backdrop.classList.add('open');
    _modalIsOpen = true;
    updateParticleRuntime();
  });

  vt.finished
    .catch(() => {})
    .finally(() => {
      setPatcherBarViewTransitionName('');
      clearOpeningTransitionClipStyle();
      clearActiveViewTransitionNames(_activeTransitionCardEl);
      document.documentElement.classList.remove('vt-news-opening');
    });
}

function closeModal() {
  if (!_modalIsOpen) return;
  const sourceCard = _modalSourceCardEl;

  if (!_supportsViewTransitions || !sourceCard || !sourceCard.isConnected) {
    setPatcherBarViewTransitionName('');
    dom.backdrop.classList.remove('open');
    _modalIsOpen = false;
    _modalSourceCardEl = null;
    updateParticleRuntime();
    return;
  }

  if (_activeCardTransitionName) clearActiveViewTransitionNames(_activeTransitionCardEl);

  _activeCardTransitionName = makeViewTransitionName();
  _activeTransitionCardEl = sourceCard;
  setPatcherBarViewTransitionName('patcher-bar');
  dom.modalEl.style.viewTransitionName = _activeCardTransitionName;

  const vt = document.startViewTransition(() => {
    document.documentElement.classList.add('vt-news-closing');
    // old state: named modal. new state: named card.
    dom.modalEl.style.viewTransitionName = '';
    sourceCard.style.viewTransitionName = _activeCardTransitionName;
    dom.backdrop.classList.remove('open');
    _modalIsOpen = false;
    updateParticleRuntime();
  });

  vt.finished
    .catch(() => {})
    .finally(() => {
      clearActiveViewTransitionNames(sourceCard);
      setPatcherBarViewTransitionName('');
      document.documentElement.classList.remove('vt-news-closing');
      _modalSourceCardEl = null;
    });
}

/* ================================================================
   FLOAT PANELS (Gear + Star)
   ================================================================ */
function openPanel(which) {
  const panel = which === 'options' ? dom.panelOptions : dom.panelVanatools;
  const btn   = which === 'options' ? dom.btnOptions   : dom.btnVanatools;
  const other = which === 'options' ? dom.panelVanatools : dom.panelOptions;
  const otherBtn = which === 'options' ? dom.btnVanatools : dom.btnOptions;

  // Close the other panel first
  other.classList.remove('open');
  otherBtn.classList.remove('panel-active');

  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('panel-active', !isOpen);
}

function closePanels() {
  dom.panelOptions.classList.remove('open');
  dom.panelVanatools.classList.remove('open');
  dom.btnOptions.classList.remove('panel-active');
  dom.btnVanatools.classList.remove('panel-active');
}

/* ================================================================
   ACCOUNT SWITCHER
   ================================================================ */
function renderAccountSwitcher() {
  const list = accounts.load();
  if (!list.length) {
    dom.accountSwitcher.classList.remove('visible');
    return;
  }

  dom.accountSwitcher.classList.add('visible');

  // Update header label
  const titleEl = dom.accountSwitcher.querySelector('.account-switcher-title');
  if (titleEl) titleEl.textContent = i18n.t('savedAccounts');
  const clearEl = dom.accountSwitcher.querySelector('.account-switcher-clear');
  if (clearEl) clearEl.textContent = i18n.t('clearAccounts');

  dom.accountList.innerHTML = '';
  const frag = document.createDocumentFragment();

  list.forEach(acc => {
    const row = document.createElement('div');
    row.className = 'account-item';
    row.innerHTML = `
      <div class="account-avatar">${escapeHtml(acc.login.charAt(0))}</div>
      <div class="account-name">${escapeHtml(acc.login)}</div>
      <button class="account-remove" aria-label="Remove">×</button>`;

    row.querySelector('.account-remove').addEventListener('click', e => {
      e.stopPropagation();
      accounts.remove(acc.login);
    });

    row.addEventListener('click', () => {
      dom.username.value = acc.login;
      dom.password.focus();
    });

    frag.appendChild(row);
  });

  dom.accountList.appendChild(frag);
}

/* ================================================================
   CLOCK
   ================================================================ */
function updateClock() {
  const gmt6 = new Date(Date.now() - 6 * 3600000);
  const hh = String(gmt6.getUTCHours()).padStart(2, '0');
  const mm = String(gmt6.getUTCMinutes()).padStart(2, '0');
  const ss = String(gmt6.getUTCSeconds()).padStart(2, '0');
  dom.clockTime.textContent = `${hh}:${mm}:${ss}`;
}


const PARTICLE_COUNT = 1200;
const canvas = document.getElementById('particles');
const ctx = canvas ? canvas.getContext('2d') : null;
let W = 0, H = 0;
const particles = new Array(PARTICLE_COUNT); // Array fijo, no recrear
const PARTICLE_PALETTES = {
  dark: ['210,179,106', '90,138,110'],
  light: ['128,95,28', '17,70,30']
};
let _particlePalette = PARTICLE_PALETTES.dark;
let _particleAlphaBoost = 1;
let _particlesInitialized = false;
let _particlesRunning = false;
let _particlesRafId = 0;
let _pageVisible = document.visibilityState === 'visible';
let _windowFocused = document.hasFocus();
let _particlesPolicyAllowed = true;
let _particlesOpacity = 1;
let _particlesTargetOpacity = 1;

function setParticlePaletteForTheme(mode) {
  _particlePalette = mode === 'light' ? PARTICLE_PALETTES.light : PARTICLE_PALETTES.dark;
  _particleAlphaBoost = mode === 'light' ? 1.45 : 1;
}

function resizeCanvas() { 
  if (!canvas) return;
  W = canvas.width = innerWidth; 
  H = canvas.height = innerHeight; 
}

function resetParticle(p, initialLife = 0) {
  p.x = Math.random() * W;
  p.y = Math.random() * H;
  p.vx = (Math.random() - 0.5) * 0.28;
  p.vy = -Math.random() * 0.35 - 0.08;
  p.r = Math.random() * 1.3 + 0.3;
  p.life = initialLife;
  p.max = 200 + Math.random() * 260;
  p.active = true;
  p.c = Math.random() < 0.58 ? _particlePalette[0] : _particlePalette[1];
}

function initParticles() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles[i] = {};
    resetParticle(particles[i], Math.random() * 460);
  }
  _particlesInitialized = true;
}

function startParticles() {
  if (!canvas || !ctx) return;
  if (!_particlesInitialized) initParticles();
  if (_particlesRunning) return;
  _particlesRunning = true;
  _particlesRafId = requestAnimationFrame(animateParticles);
}

function updateParticleRuntime() {
  _particlesPolicyAllowed = !_modalIsOpen && _pageVisible && _windowFocused;
  _particlesTargetOpacity = _particlesPolicyAllowed ? 1 : 0;
  startParticles();
}

function animateParticles() {
  if (!_particlesRunning || !ctx) return;

  ctx.clearRect(0, 0, W, H);

  // Fade in/out smoothly instead of abrupt hide/show.
  _particlesOpacity += (_particlesTargetOpacity - _particlesOpacity) * 0.075;

  // Cachear propiedades de ctx fuera del loop
  const PI2 = Math.PI * 2;
  let respawnBudget = _particlesPolicyAllowed ? 16 : 0;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = particles[i];

    if (!p.active) {
      if (respawnBudget > 0) {
        resetParticle(p, Math.random() * 35);
        respawnBudget--;
      }
      continue;
    }

    p.life++;

    if (p.life > p.max) {
      if (_particlesPolicyAllowed) {
        resetParticle(p); // Reutilizar objeto, no crear nuevo
      } else {
        p.active = false; // No generar nuevas hasta recuperar foco/visibilidad
      }
      continue;
    }

    const alpha = Math.min(0.9, Math.sin((p.life / p.max) * Math.PI) * 0.45 * _particleAlphaBoost * _particlesOpacity);
    if (alpha < 0.003) {
      p.x += p.vx;
      p.y += p.vy;
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, PI2);
    ctx.fillStyle = `rgba(${p.c},${alpha})`;
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;
  }

  _particlesRafId = requestAnimationFrame(animateParticles);
}


/* ================================================================
   TOAST
   ================================================================ */
let _toastTimer = null;

function showToast(msg, icon = '⚑') {
  dom.toastMsg.textContent = msg;
  dom.toastIcon.textContent = icon;
  dom.toast.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => dom.toast.classList.remove('show'), 3600);
}

/* ================================================================
   BRIDGE
   ================================================================ */
function openExternalUrl(url) {
  if (!url) return;
  if (bridge.has()) { bridge.json('open_url', { url }); return; }
  window.open(url, '_blank', 'noopener');
}

const bridge = {
  has() { return typeof window.external?.invoke === 'function'; },

  invoke(payload) {
    if (!this.has()) return false;
    const req = typeof payload === 'string' ? payload : JSON.stringify(payload);
    try {
      const r = window.external.invoke(req);
      if (r && typeof r.then === 'function') {
        r.catch(err => {
          state.patching = false;
          state.updateRequested = false;
          setPatchLog('warn', `Bridge error: ${String(err)}`);
          dom.progressSpeed.textContent = i18n.t('speedBridgeErr');
          dom.progressFill.classList.remove('active');
          syncLaunchButtonState();
        });
      }
      return true;
    } catch (err) {
      state.patching = false;
      state.updateRequested = false;
      setPatchLog('warn', `Bridge error: ${String(err)}`);
      dom.progressSpeed.textContent = i18n.t('speedBridgeErr');
      dom.progressFill.classList.remove('active');
      syncLaunchButtonState();
      return false;
    }
  },

  cmd(command) { return this.invoke(command); },
  json(fn, parameters) { return this.invoke({ function: fn, parameters }); },

  request(fn, parameters = {}) {
    if (!this.has()) return Promise.resolve({ ok: false, error: i18n.t('srhNoBridge') });
    try {
      const req = JSON.stringify({ function: fn, parameters });
      return Promise.resolve(window.external.invoke(req))
        .then(result => result || { ok: true })
        .catch(err => ({ ok: false, error: String(err) }));
    } catch (err) {
      return Promise.resolve({ ok: false, error: String(err) });
    }
  }
};

/* ================================================================
   PATCHER STATE
   ================================================================ */
function setPatchLog(type, msg) {
  dom.patchLog.className = `patcher-log-line ${type}`;
  dom.patchLog.textContent = msg;
}

function setProgress(target, monotonic = false) {
  const bounded = Math.max(0, Math.min(100, Number(target) || 0));
  const next = monotonic ? Math.max(state.pct, bounded) : bounded;
  state.pct = Math.round(next);
  dom.progressFill.style.width = `${state.pct}%`;
  dom.progressPct.textContent = `${state.pct}%`;
}

function syncLaunchButtonState() {
  if (!bridge.has()) {
    dom.btnLaunch.disabled = true;
    dom.btnLaunch.innerHTML = i18n.t('btnPlayOnly');
    return;
  }
  if (state.patchReady) {
    dom.btnLaunch.disabled = false;
    dom.btnLaunch.innerHTML = i18n.t('btnPlay');
    return;
  }
  dom.btnLaunch.disabled = true;
  if (state.patching || state.updateRequested) {
    dom.btnLaunch.innerHTML = i18n.t('btnUpdating');
    return;
  }
  if (!state.backendSignalReceived) {
    dom.btnLaunch.innerHTML = i18n.t('btnVerifying');
    return;
  }
  dom.btnLaunch.innerHTML = i18n.t('btnNotReady');
}

function humanFileSize(size) {
  if (!size || size <= 0) return '0 B';
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  return `${(size / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

/* ================================================================
   PUBLIC PATCHER CALLBACKS
   ================================================================ */
function patchingStatusReady() {
  state.backendSignalReceived = true;
  state.patchReady = true;
  state.patching = false;
  state.updateRequested = false;
  setProgress(100);
  setPatchLog('ok', i18n.t('patcherReady'));
  dom.progressSpeed.textContent = '—';
  dom.progressFill.classList.remove('active');
  if (dom.patchVersion) dom.patchVersion.textContent = 'ready';
  syncLaunchButtonState();
  showToast(i18n.t('toastReady'), '✦');
}

function patchingStatusError(errorMsg) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = false;
  state.updateRequested = false;
  setPatchLog('warn', i18n.t('patcherError', { msg: errorMsg }));
  dom.progressSpeed.textContent = i18n.t('speedError');
  dom.progressFill.classList.remove('active');
  syncLaunchButtonState();
  showToast(i18n.t('toastError'), '⚠');
}

function patchingStatusDownloading(nbDownloaded, nbTotal, bytesDownloaded, bytesTotal, bytesPerSec) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = true;
  const pct = bytesTotal > 0
    ? (100 * bytesDownloaded) / bytesTotal
    : (nbTotal > 0 ? (100 * nbDownloaded) / nbTotal : 0);
  setProgress(pct, true);
  setPatchLog('warn', i18n.t('patcherDownloading', { a: nbDownloaded, b: nbTotal }));
  const speed = bytesPerSec > 0 ? `${humanFileSize(bytesPerSec)}/s` : '—';
  const totals = bytesTotal > 0
    ? `${humanFileSize(bytesDownloaded)} / ${humanFileSize(bytesTotal)}`
    : `${humanFileSize(bytesDownloaded)}`;
  dom.progressSpeed.textContent = `${speed} · ${totals}`;
  if (dom.patchVersion) dom.patchVersion.textContent = `patch ${nbDownloaded}/${nbTotal}`;
  syncLaunchButtonState();
}

function patchingStatusInstalling(nbInstalled, nbTotal) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = true;
  const pct = nbTotal > 0 ? (100 * nbInstalled) / nbTotal : 0;
  setProgress(pct, true);
  setPatchLog('info', i18n.t('patcherInstalling', { a: nbInstalled, b: nbTotal }));
  dom.progressSpeed.textContent = i18n.t('speedInstalling');
  syncLaunchButtonState();
}

function patchingStatusDownloadAndInstall(nbDownloaded, nbInstalled, nbTotal, bytesPerSec) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = true;
  const pct = nbTotal > 0 ? (100 * (nbDownloaded + nbInstalled)) / (2 * nbTotal) : 0;
  setProgress(pct, true);
  setPatchLog('warn', i18n.t('patcherConcurrent', { a: nbDownloaded, b: nbTotal, c: nbInstalled }));
  const speed = bytesPerSec > 0 ? `${humanFileSize(bytesPerSec)}/s` : '—';
  dom.progressSpeed.textContent = `${speed} · dl+install`;
  if (dom.patchVersion) dom.patchVersion.textContent = `conc. ${nbDownloaded}/${nbInstalled}/${nbTotal}`;
  syncLaunchButtonState();
}

function patchingStatusPatchApplied(fileName) {
  setPatchLog('ok', i18n.t('patcherApplied', { name: fileName }));
  showToast(i18n.t('toastApplied', { name: fileName }), '✦');
}

function notificationInProgress() {
  setPatchLog('info', i18n.t('patcherInProgress'));
  showToast(i18n.t('toastInProgress'), '⚠');
}

/* ================================================================
   PATCHER STARTUP
   ================================================================ */
function requestStartUpdate(showFeedback = false) {
  if (!bridge.has() || state.patchReady || state.patching || state.updateRequested) return;
  state.updateRequested = true;
  state.patching = true;
  state.patchReady = false;
  syncLaunchButtonState();
  dom.progressFill.classList.add('active');
  setPatchLog('info', i18n.t('patcherConnecting'));
  dom.progressSpeed.textContent = i18n.t('speedStarting');
  const sent = bridge.cmd('start_update');
  if (!sent) {
    state.updateRequested = false;
    state.patching = false;
    setPatchLog('warn', i18n.t('patcherWebMode'));
    dom.progressSpeed.textContent = i18n.t('speedNoBridge');
    syncLaunchButtonState();
    return;
  }
  if (showFeedback) showToast(i18n.t('toastUpdating'), '↻');
}

function parsePatchList(raw) {
  return raw.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('//'));
}

async function loadPatchListSummary() {
  try {
    const r = await fetch('./plist.txt', { cache: 'no-store' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const lines = parsePatchList(await r.text());
    if (dom.patchVersion) dom.patchVersion.textContent = `plist ${lines.length}`;
    setPatchLog('info', i18n.t('patcherListLoaded', { n: lines.length }));
    dom.progressSpeed.textContent = i18n.t('speedVerified');
  } catch {
    setPatchLog('warn', i18n.t('patcherWebMode'));
    dom.progressSpeed.textContent = i18n.t('speedWebMode');
    dom.progressFill.classList.remove('active');
  }
}

function initPatcherStartup() {
  dom.playersOnline.innerHTML = '—<span>…</span>';
  if (dom.patchVersion) dom.patchVersion.textContent = '—';
  dom.progressSpeed.textContent = '—';
  setPatchLog('info', i18n.t('patcherWaiting'));
  syncLaunchButtonState();

  if (bridge.has()) { requestStartUpdate(false); return; }

  let attempts = 0;
  const probe = setInterval(() => {
    attempts++;
    if (bridge.has()) { clearInterval(probe); requestStartUpdate(false); return; }
    if (attempts >= 40) { clearInterval(probe); loadPatchListSummary(); syncLaunchButtonState(); }
  }, 250);
}

/* ================================================================
   LAUNCH
   ================================================================ */
function handleLaunch() {
  if (!state.patchReady || state.patching || state.updateRequested) {
    showToast(i18n.t('toastPatching'), '↻');
    return;
  }
  const login = dom.username.value.trim();
  const password = dom.password.value;
  if (!login || !password) { showToast(i18n.t('toastNeedCreds'), '⚠'); return; }
  if (!bridge.has()) { showToast(i18n.t('toastNeedBridge'), '⚑'); return; }

  // Save account to history
  accounts.add(login);

  bridge.json('login', { login, password });
  showToast(i18n.t('toastLaunching', { user: login }), '▶');
}

/* ================================================================
   EXTERNAL LINKS
   ================================================================ */
function bindExternalLinks() {
  const THRESHOLD = 3;
  const links = document.querySelectorAll(
    '.topbar-nav a[href], .forgot-link[href], .btn-register[href], .Vanatools-link[data-href]'
  );

  links.forEach(link => {
    const isVanalink = link.hasAttribute('data-href');
    const externalUrl = isVanalink ? link.dataset.href : link.getAttribute('href');
    if (!externalUrl || externalUrl === '#') return;
    if (!isVanalink) link.setAttribute('href', '#');

    let downX = 0, downY = 0, isDown = false, dragged = false;
    const open = () => openExternalUrl(externalUrl);

    link.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      isDown = true; dragged = false; downX = e.clientX; downY = e.clientY;
    });
    link.addEventListener('pointermove', e => {
      if (!isDown || dragged) return;
      const dx = e.clientX - downX, dy = e.clientY - downY;
      if (dx * dx + dy * dy >= THRESHOLD * THRESHOLD) dragged = true;
    });
    link.addEventListener('pointerup', () => {
      if (!isDown) return; isDown = false;
      if (dragged) { dragged = false; return; } open();
    });
    link.addEventListener('pointerleave', () => { if (isDown) dragged = true; });
    link.addEventListener('lostpointercapture', () => { if (isDown) dragged = true; });
    link.addEventListener('dragstart', e => { e.preventDefault(); dragged = true; isDown = false; });
    link.addEventListener('pointercancel', () => { if (isDown) dragged = true; isDown = false; });
    link.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
    link.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); e.stopPropagation(); open();
    });
  });
}

/* ================================================================
   SIMPLEROHOOK CONFIG EDITOR
   ================================================================ */
const srhEditor = {
  path: '',
  sections: [],
  activeSection: '',
  original: new Map(),
  values: new Map(),
  dirty: new Set(),

  key(section, key) {
    return `${section}\u0000${key}`;
  },

  open() {
    closePanels();
    dom.srhBackdrop.classList.add('open');
    dom.btnSrhConfig.classList.add('panel-active');
    _modalIsOpen = true;
    updateParticleRuntime();
    if (!this.sections.length) this.load();
    else this.render();
  },

  close() {
    dom.srhBackdrop.classList.remove('open');
    dom.btnSrhConfig.classList.remove('panel-active');
    _modalIsOpen = false;
    updateParticleRuntime();
  },

  async load() {
    this.setStatus(i18n.t('srhLoading'), 'info');
    this.setBusy(true);
    const result = await bridge.request('read_simplerohook_config');
    this.setBusy(false);

    if (!result.ok) {
      this.sections = [];
      this.activeSection = '';
      this.setStatus(i18n.t('srhLoadError', { msg: result.error || 'unknown' }), 'warn');
      this.render();
      return;
    }

    this.path = result.path || 'simplerohook.ini';
    this.sections = result.config?.sections || [];
    this.activeSection = this.sections[0]?.name || '';
    this.original = new Map();
    this.values = new Map();
    this.dirty = new Set();

    this.sections.forEach(section => {
      section.entries.forEach(entry => {
        const id = this.key(section.name, entry.key);
        this.original.set(id, entry.value);
        this.values.set(id, entry.value);
      });
    });

    this.setStatus(i18n.t('srhReady'), 'ok');
    this.render();
  },

  async save() {
    const updates = Array.from(this.dirty).map(id => {
      const [section, key] = id.split('\u0000');
      return { section, key, value: this.values.get(id) || '' };
    });
    if (!updates.length) return;

    this.setBusy(true);
    const result = await bridge.request('write_simplerohook_config', { updates });
    this.setBusy(false);

    if (!result.ok) {
      this.setStatus(i18n.t('srhSaveError', { msg: result.error || 'unknown' }), 'warn');
      showToast(i18n.t('srhSaveError', { msg: result.error || 'unknown' }), '⚠');
      return;
    }

    updates.forEach(update => {
      this.original.set(this.key(update.section, update.key), update.value);
    });
    this.dirty.clear();
    this.setStatus(i18n.t('srhSaved'), 'ok');
    showToast(i18n.t('srhSaved'), '✦');
    this.render();
  },

  reset() {
    this.values = new Map(this.original);
    this.dirty.clear();
    this.setStatus(i18n.t('srhReady'), 'ok');
    this.render();
  },

  setBusy(isBusy) {
    dom.srhReload.disabled = isBusy;
    dom.srhReset.disabled = isBusy;
    dom.srhSave.disabled = isBusy;
  },

  setStatus(text, type = 'info') {
    dom.srhStatus.textContent = text;
    dom.srhStatus.className = `srh-status ${type}`;
  },

  updateDirtyState(id, value) {
    this.values.set(id, value);
    if (value === this.original.get(id)) this.dirty.delete(id);
    else this.dirty.add(id);
    if (this.dirty.size) this.setStatus(i18n.t('srhDirty', { n: this.dirty.size }), 'warn');
    else this.setStatus(i18n.t('srhReady'), 'ok');
    dom.srhSave.disabled = this.dirty.size === 0;
  },

  render() {
    dom.srhPath.textContent = this.path || 'simplerohook.ini';
    this.renderSections();
    this.renderSettings();
    dom.srhSave.disabled = this.dirty.size === 0;
  },

  renderSections() {
    dom.srhSections.innerHTML = '';
    const frag = document.createDocumentFragment();
    this.sections.forEach(section => {
      const btn = document.createElement('button');
      btn.className = 'srh-section-btn';
      btn.classList.toggle('active', section.name === this.activeSection);
      btn.type = 'button';
      btn.textContent = section.name;
      btn.addEventListener('click', () => {
        this.activeSection = section.name;
        this.render();
      });
      frag.appendChild(btn);
    });
    dom.srhSections.appendChild(frag);
  },

  renderSettings() {
    dom.srhSettings.innerHTML = '';
    const section = this.sections.find(item => item.name === this.activeSection);
    if (!section) return;
    if (!section.entries.length) {
      const empty = document.createElement('div');
      empty.className = 'srh-empty';
      empty.textContent = i18n.t('srhEmpty');
      dom.srhSettings.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    section.entries.forEach(entry => {
      const id = this.key(section.name, entry.key);
      const value = this.values.get(id) ?? entry.value ?? '';
      const row = document.createElement('label');
      row.className = `srh-setting srh-setting-${entry.value_type || 'text'}`;

      const name = document.createElement('span');
      name.className = 'srh-setting-name';
      name.textContent = entry.key;
      row.appendChild(name);

      row.appendChild(this.createControl(id, entry, value));
      frag.appendChild(row);
    });
    dom.srhSettings.appendChild(frag);
  },

  createControl(id, entry, value) {
    if (entry.value_type === 'bool') {
      const wrap = document.createElement('span');
      wrap.className = 'srh-switch';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = value === '1';
      input.addEventListener('change', () => this.updateDirtyState(id, input.checked ? '1' : '0'));
      const track = document.createElement('span');
      track.className = 'srh-switch-track';
      wrap.append(input, track);
      return wrap;
    }

    const wrap = document.createElement('span');
    wrap.className = 'srh-control-wrap';
    if (entry.value_type === 'color') {
      const swatch = document.createElement('span');
      swatch.className = 'srh-color-swatch';
      swatch.style.background = this.toCssColor(value);
      wrap.appendChild(swatch);
    }

    const input = document.createElement('input');
    input.className = 'srh-input';
    input.type = entry.value_type === 'number' ? 'number' : 'text';
    input.value = value;
    input.spellcheck = false;
    input.addEventListener('input', () => {
      if (entry.value_type === 'color') {
        const swatch = wrap.querySelector('.srh-color-swatch');
        if (swatch) swatch.style.background = this.toCssColor(input.value);
      }
      this.updateDirtyState(id, input.value);
    });
    wrap.appendChild(input);
    return wrap;
  },

  toCssColor(value) {
    const match = /^0x[0-9a-fA-F]{8}$/.exec(value || '');
    return match ? `#${value.slice(4)}` : 'transparent';
  }
};

/* ================================================================
   EXPOSE globals for patcher
   ================================================================ */
window.patchingStatusReady               = patchingStatusReady;
window.patchingStatusError               = patchingStatusError;
window.patchingStatusDownloading         = patchingStatusDownloading;
window.patchingStatusInstalling          = patchingStatusInstalling;
window.patchingStatusDownloadAndInstall  = patchingStatusDownloadAndInstall;
window.patchingStatusPatchApplied        = patchingStatusPatchApplied;
window.notificationInProgress            = notificationInProgress;

window.patching_status_ready             = patchingStatusReady;
window.patching_status_error             = patchingStatusError;
window.patching_status_downloading       = patchingStatusDownloading;
window.patching_status_installing        = patchingStatusInstalling;
window.patching_status_download_and_install = patchingStatusDownloadAndInstall;
window.patching_status_patch_applied     = patchingStatusPatchApplied;
window.notification_in_progress          = notificationInProgress;

/* ================================================================
   EVENT BINDINGS
   ================================================================ */

// Modal
dom.modalClose.addEventListener('click', closeModal);
dom.backdrop.addEventListener('click', e => { if (e.target === dom.backdrop) closeModal(); });

// Panels: gear + star
dom.btnOptions.addEventListener('click', e => { e.stopPropagation(); openPanel('options'); });
dom.btnVanatools.addEventListener('click', e => { e.stopPropagation(); openPanel('Vanatools'); });
dom.btnSrhConfig.addEventListener('click', e => { e.stopPropagation(); srhEditor.open(); });
dom.srhClose.addEventListener('click', () => srhEditor.close());
dom.srhReload.addEventListener('click', () => srhEditor.load());
dom.srhReset.addEventListener('click', () => srhEditor.reset());
dom.srhSave.addEventListener('click', () => srhEditor.save());
dom.srhBackdrop.addEventListener('click', e => { if (e.target === dom.srhBackdrop) srhEditor.close(); });

// Close panels on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#panel-options') && !e.target.closest('#btn-options') &&
      !e.target.closest('#panel-Vanatools') && !e.target.closest('#btn-Vanatools')) {
    closePanels();
  }
});

// Theme toggle
dom.themeToggleInput.addEventListener('change', () => {
  themeManager.set(dom.themeToggleInput.checked ? 'light' : 'dark', true);
});

// Lang pills (inside options panel)
document.querySelectorAll('.lang-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const code = pill.dataset.lang;
    if (code === 'es' || code === 'en') i18n.setLang(code);
  });
});

// Account switcher clear
dom.accountClear.addEventListener('click', () => accounts.clear());

// Launch button
dom.btnLaunch.addEventListener('click', handleLaunch);

// Enter to submit
['username', 'password'].forEach(id => {
  $(id).addEventListener('keydown', e => { if (e.key === 'Enter') handleLaunch(); });
});

// Escape: close modal or panels
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (dom.srhBackdrop.classList.contains('open')) { srhEditor.close(); return; }
    if (_modalIsOpen) { closeModal(); return; }
    closePanels();
  }
});

/* ================================================================
   INIT
   ================================================================ */
themeManager.init();
i18n.init();

renderAccountSwitcher();
bindExternalLinks();

updateClock();
setInterval(updateClock, 1000);

resizeCanvas();
initParticles();
updateParticleRuntime();
window.addEventListener('resize', resizeCanvas);
document.addEventListener('visibilitychange', () => {
  _pageVisible = document.visibilityState === 'visible';
  updateParticleRuntime();
});
window.addEventListener('focus', () => {
  _windowFocused = true;
  updateParticleRuntime();
});
window.addEventListener('blur', () => {
  _windowFocused = false;
  updateParticleRuntime();
});

initPatcherStartup();
