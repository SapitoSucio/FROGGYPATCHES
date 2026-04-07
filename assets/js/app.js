'use strict';

const TAG_LABELS = {
  update: 'Actualización',
  event: 'Evento',
  maint: 'Mantenimiento'
};

const $ = (id) => document.getElementById(id);

const dom = {
  newsList: $('news-list'),
  backdrop: $('modal-backdrop'),
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
  patchVersion: document.querySelector('.patch-version-pill')
};

const state = {
  pct: 0,
  patchReady: false,
  patching: false,
  updateRequested: false,
  backendSignalReceived: false
};

function getNewsData() {
  const rawNews = Array.isArray(window.NEWS_DATA) ? window.NEWS_DATA : [];

  return rawNews
    .filter((item) => item && item.published !== false)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function formatNewsDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} · ${month} · ${year}`;
}

function getTagLabel(tag) {
  return TAG_LABELS[tag] || 'Noticia';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeImageUrl(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function clampPercent(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(200, Math.max(-200, Math.round(parsed)));
}

function clampRange(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
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

  const modalSingle = normalizeImageUrl(item.modalImage || item.image);

  if (Array.isArray(item.images) && item.images.length) {
    item.images.forEach((img) => {
      const normalized = normalizeImageUrl(img);
      if (normalized) list.push(normalized);
    });
  } else if (modalSingle) {
    list.push(modalSingle);
  } else {
    const cardOnly = normalizeImageUrl(item.cardImage);
    if (cardOnly) list.push(cardOnly);
  }

  return list;
}

function renderNews() {
  const news = getNewsData();
  dom.newsList.innerHTML = '';

  if (!news.length) {
    dom.newsList.innerHTML = `
      <div class="news-card">
        <div class="news-tag update">Noticias</div>
        <h3>No hay noticias publicadas</h3>
        <p>Agrega entradas en <code>assets/js/news-data.js</code> para mostrarlas aquí.</p>
        <div class="news-date">—</div>
      </div>
    `;
    return;
  }

  const frag = document.createDocumentFragment();

  news.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.animationDelay = `${index * 0.055}s`;
    const cardImage = getCardImage(item);

    if (cardImage) {
      card.classList.add('has-media');
    }

    card.innerHTML = `
      ${cardImage ? `<div class="news-card-media" style="--news-card-image: url('${cardImage.url.replace(/'/g, '%27')}'); --news-card-pos-x: ${cardImage.posX}%; --news-card-pos-y: ${cardImage.posY}%; --news-card-zoom: ${cardImage.zoom}%; --news-card-mask-size: ${cardImage.maskSize}%;"></div>` : ''}
      <div class="news-tag ${item.tag}">${getTagLabel(item.tag)}</div>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <div class="news-date">${formatNewsDate(item.createdAt)}</div>
      <div class="news-read-more">Leer más ›</div>
    `;

    card.addEventListener('click', () => openModal(item));
    frag.appendChild(card);
  });

  dom.newsList.appendChild(frag);
}

function openModal(newsItem) {
  const modalImages = getModalImages(newsItem);
  const modalPosX = clampPercent(newsItem.modalImagePosX, 50);
  const modalPosY = clampPercent(newsItem.modalImagePosY, 50);
  const modalZoom = clampRange(newsItem.modalImageZoom, 50, 400, 100);
  const imagesMarkup = modalImages.map((imageUrl, index) => `
    <figure class="modal-news-figure">
      <div class="modal-news-image" role="img" aria-label="Imagen ${index + 1} de ${escapeHtml(newsItem.title || 'noticia')}" style="--modal-news-image: url('${imageUrl.replace(/'/g, '%27')}'); --modal-news-pos-x: ${modalPosX}%; --modal-news-pos-y: ${modalPosY}%; --modal-news-zoom: ${modalZoom}%;"></div>
    </figure>
  `).join('');

  dom.modalTag.innerHTML = `<span class="news-tag ${newsItem.tag}">${getTagLabel(newsItem.tag)}</span>`;
  dom.modalTitle.textContent = newsItem.title;
  dom.modalDate.textContent = formatNewsDate(newsItem.createdAt);
  dom.modalBody.innerHTML = `${imagesMarkup}${newsItem.body || ''}`;
  dom.modalBody.scrollTop = 0;
  dom.backdrop.classList.add('open');
}

function closeModal() {
  dom.backdrop.classList.remove('open');
}

function updateClock() {
  const gmt6 = new Date(Date.now() - 6 * 3600000);
  const hh = String(gmt6.getUTCHours()).padStart(2, '0');
  const mm = String(gmt6.getUTCMinutes()).padStart(2, '0');
  const ss = String(gmt6.getUTCSeconds()).padStart(2, '0');
  dom.clockTime.textContent = `${hh}:${mm}:${ss}`;
}

const canvas = $('particles');
const ctx = canvas.getContext('2d');
let W = 0;
let H = 0;
let particles = [];

function resizeCanvas() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.28,
    vy: -Math.random() * 0.35 - 0.08,
    r: Math.random() * 1.3 + 0.3,
    life: 0,
    max: 200 + Math.random() * 260,
    c: Math.random() < 0.6 ? '200,168,75' : '80,120,200'
  };
}

function initParticles() {
  particles = [];

  for (let i = 0; i < 70; i += 1) {
    const particle = createParticle();
    particle.life = Math.random() * particle.max;
    particles.push(particle);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);

  particles.forEach((particle, index) => {
    particle.life += 1;

    if (particle.life > particle.max) {
      particles[index] = createParticle();
      return;
    }

    const alpha = Math.sin((particle.life / particle.max) * Math.PI) * 0.45;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particle.c},${alpha})`;
    ctx.fill();

    particle.x += particle.vx;
    particle.y += particle.vy;
  });

  requestAnimationFrame(animateParticles);
}

function showToast(msg, icon = '⚑') {
  dom.toastMsg.textContent = msg;
  dom.toastIcon.textContent = icon;
  dom.toast.classList.add('show');
  setTimeout(() => dom.toast.classList.remove('show'), 3600);
}

function openExternalUrl(url) {
  if (!url) return;

  if (bridge.has()) {
    bridge.json('open_url', { url });
    return;
  }

  window.open(url, '_blank', 'noopener');
}

const bridge = {
  has() {
    return typeof window.external?.invoke === 'function';
  },

  invoke(payload) {
    if (!this.has()) return false;

    const request = typeof payload === 'string'
      ? payload
      : JSON.stringify(payload);

    try {
      const result = window.external.invoke(request);

      if (result && typeof result.then === 'function') {
        result.catch((err) => {
          state.patching = false;
          state.updateRequested = false;
          setPatchLog('warn', `Bridge error: ${String(err)}`);
          dom.progressSpeed.textContent = 'bridge error';
          dom.progressFill.classList.remove('active');
          syncLaunchButtonState();
        });
      }

      return true;
    } catch (err) {
      state.patching = false;
      state.updateRequested = false;
      setPatchLog('warn', `Bridge error: ${String(err)}`);
      dom.progressSpeed.textContent = 'bridge error';
      dom.progressFill.classList.remove('active');
      syncLaunchButtonState();
      return false;
    }
  },

  cmd(command) {
    return this.invoke(command);
  },

  json(fn, parameters) {
    return this.invoke({ function: fn, parameters });
  }
};

function setPatchLog(type, msg) {
  dom.patchLog.className = `patcher-log-line ${type}`;
  dom.patchLog.textContent = msg;
}

function setProgress(target, monotonic = false) {
  const boundedTarget = Math.max(0, Math.min(100, Number(target) || 0));
  const next = monotonic ? Math.max(state.pct, boundedTarget) : boundedTarget;
  state.pct = Math.round(next);
  dom.progressFill.style.width = `${state.pct}%`;
  dom.progressPct.textContent = `${state.pct}%`;
}

function syncLaunchButtonState() {
  if (!bridge.has()) {
    dom.btnLaunch.disabled = true;
    dom.btnLaunch.innerHTML = '⚑ &nbsp;Solo en patcher';
    return;
  }

  if (state.patchReady) {
    dom.btnLaunch.disabled = false;
    dom.btnLaunch.innerHTML = '▶ &nbsp;Iniciar Sesión y Jugar';
    return;
  }

  dom.btnLaunch.disabled = true;
  if (state.patching || state.updateRequested) {
    dom.btnLaunch.innerHTML = '↻ &nbsp;Actualizando cliente...';
    return;
  }

  if (!state.backendSignalReceived) {
    dom.btnLaunch.innerHTML = '… &nbsp;Verificando parches...';
    return;
  }

  dom.btnLaunch.innerHTML = '⚠ &nbsp;Cliente no listo';
}

function humanFileSize(size) {
  if (!size || size <= 0) return '0 B';

  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const n = size / Math.pow(1024, i);

  return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function requestStartUpdate(showFeedback = false) {
  if (!bridge.has() || state.patchReady || state.patching || state.updateRequested) return;

  state.updateRequested = true;
  state.patching = true;
  state.patchReady = false;
  syncLaunchButtonState();

  dom.progressFill.classList.add('active');
  setPatchLog('info', 'Conectando con servidor de parches...');
  dom.progressSpeed.textContent = 'iniciando';

  const sent = bridge.cmd('start_update');

  if (!sent) {
    state.updateRequested = false;
    state.patching = false;
    setPatchLog('warn', 'Bridge no disponible.');
    dom.progressSpeed.textContent = 'sin bridge';
    syncLaunchButtonState();
    return;
  }

  if (showFeedback) {
    showToast('Iniciando actualización...', '↻');
  }
}

function parsePatchList(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//'));
}

async function loadPatchListSummary() {
  try {
    const response = await fetch('./plist.txt', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const raw = await response.text();
    const lines = parsePatchList(raw);

    if (dom.patchVersion) {
      dom.patchVersion.textContent = `plist ${lines.length}`;
    }

    setPatchLog('info', `Lista real cargada: ${lines.length} parche(s) en plist.txt`);
    dom.progressSpeed.textContent = 'lista verificada';
  } catch {
    setPatchLog('warn', 'Vista web sin bridge real del patcher.');
    dom.progressSpeed.textContent = 'modo web';
    dom.progressFill.classList.remove('active');
  }
}

function patchingStatusReady() {
  state.backendSignalReceived = true;
  state.patchReady = true;
  state.patching = false;
  state.updateRequested = false;

  setProgress(100);
  setPatchLog('ok', 'Cliente actualizado — listo para jugar.');
  dom.progressSpeed.textContent = '—';
  dom.progressFill.classList.remove('active');

  if (dom.patchVersion) {
    dom.patchVersion.textContent = 'ready';
  }

  syncLaunchButtonState();
  showToast('Cliente listo. ¡Que comience la aventura!', '✦');
}

function patchingStatusError(errorMsg) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = false;
  state.updateRequested = false;

  setPatchLog('warn', `Error: ${errorMsg}`);
  dom.progressSpeed.textContent = 'error';
  dom.progressFill.classList.remove('active');
  syncLaunchButtonState();
  showToast('Falló la actualización. Revisa el log.', '⚠');
}

function patchingStatusDownloading(nbDownloaded, nbTotal, bytesDownloaded, bytesTotal, bytesPerSec) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = true;

  const pct = bytesTotal > 0
    ? (100 * bytesDownloaded) / bytesTotal
    : (nbTotal > 0 ? (100 * nbDownloaded) / nbTotal : 0);

  setProgress(pct, true);
  setPatchLog('warn', `Descargando parche ${nbDownloaded}/${nbTotal}...`);

  const speed = bytesPerSec > 0 ? `${humanFileSize(bytesPerSec)}/s` : '—';
  const totals = bytesTotal > 0
    ? `${humanFileSize(bytesDownloaded)} / ${humanFileSize(bytesTotal)}`
    : `${humanFileSize(bytesDownloaded)} descargados`;

  dom.progressSpeed.textContent = `${speed} · ${totals}`;

  if (dom.patchVersion) {
    dom.patchVersion.textContent = `patch ${nbDownloaded}/${nbTotal}`;
  }
  syncLaunchButtonState();
}

function patchingStatusInstalling(nbInstalled, nbTotal) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = true;

  const pct = nbTotal > 0 ? (100 * nbInstalled) / nbTotal : 0;
  setProgress(pct, true);
  setPatchLog('info', `Instalando parche ${nbInstalled}/${nbTotal}...`);
  dom.progressSpeed.textContent = 'instalando';
  syncLaunchButtonState();
}

function patchingStatusDownloadAndInstall(nbDownloaded, nbInstalled, nbTotal, bytesPerSec) {
  state.backendSignalReceived = true;
  state.patchReady = false;
  state.patching = true;

  const pct = nbTotal > 0
    ? (100 * (nbDownloaded + nbInstalled)) / (2 * nbTotal)
    : 0;

  setProgress(pct, true);
  setPatchLog('warn', `Descargando ${nbDownloaded}/${nbTotal} | Instalando ${nbInstalled}/${nbTotal}`);

  const speed = bytesPerSec > 0 ? `${humanFileSize(bytesPerSec)}/s` : '—';
  dom.progressSpeed.textContent = `${speed} · descarga+instalación concurrente`;

  if (dom.patchVersion) {
    dom.patchVersion.textContent = `conc. ${nbDownloaded}/${nbInstalled}/${nbTotal}`;
  }
  syncLaunchButtonState();
}

function patchingStatusPatchApplied(fileName) {
  setPatchLog('ok', `Patch manual aplicado: ${fileName}`);
  showToast(`Patch manual aplicado: ${fileName}`, '✦');
}

function notificationInProgress() {
  setPatchLog('info', 'Ya hay una actualización en progreso.');
  showToast('Ya hay un update en progreso.', '⚠');
}

function bindExternalLinks() {
  const DRAG_CLICK_THRESHOLD_PX = 3;
  const links = document.querySelectorAll(
    '.topbar-nav a[href], .forgot-link[href], .btn-register[href]'
  );

  links.forEach((link) => {
    const externalUrl = link.getAttribute('href');
    if (!externalUrl || externalUrl === '#') {
      return;
    }
    // Disable native anchor navigation entirely; we open URLs via bridge only.
    link.setAttribute('href', '#');

    let pointerDownX = 0;
    let pointerDownY = 0;
    let pointerIsDown = false;
    let dragged = false;

    const open = () => {
      openExternalUrl(externalUrl);
    };

    link.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      pointerIsDown = true;
      dragged = false;
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
    });

    link.addEventListener('pointermove', (event) => {
      if (!pointerIsDown || dragged) return;
      const dx = event.clientX - pointerDownX;
      const dy = event.clientY - pointerDownY;
      if ((dx * dx + dy * dy) >= (DRAG_CLICK_THRESHOLD_PX * DRAG_CLICK_THRESHOLD_PX)) {
        dragged = true;
      }
    });

    link.addEventListener('pointerup', () => {
      if (!pointerIsDown) return;
      pointerIsDown = false;
      if (dragged) {
        dragged = false;
        return;
      }
      open();
    });

    link.addEventListener('pointerleave', () => {
      if (pointerIsDown) {
        dragged = true;
      }
    });

    link.addEventListener('lostpointercapture', () => {
      if (pointerIsDown) {
        dragged = true;
      }
    });

    link.addEventListener('dragstart', (event) => {
      event.preventDefault();
      dragged = true;
      pointerIsDown = false;
    });

    link.addEventListener('pointercancel', () => {
      if (pointerIsDown) {
        dragged = true;
      }
      pointerIsDown = false;
    });

    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      // Opening is handled on pointerup for mouse/touch and on keydown for keyboard.
    });

    link.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      open();
    });
  });
}

function handleLaunch() {
  if (!state.patchReady || state.patching || state.updateRequested) {
    showToast('Aún estamos verificando/actualizando parches.', '↻');
    return;
  }

  const login = dom.username.value.trim();
  const password = dom.password.value;

  if (!login || !password) {
    showToast('Ingresa tu usuario y contraseña.', '⚠');
    return;
  }

  if (!bridge.has()) {
    showToast('Esta vista no tiene bridge del patcher.', '⚑');
    return;
  }

  bridge.json('login', { login, password });
  showToast(`Lanzando cliente, bienvenido ${login}!`, '▶');
}

function initPatcherStartup() {
  dom.playersOnline.innerHTML = '—<span>sin telemetría</span>';

  if (dom.patchVersion) {
    dom.patchVersion.textContent = '—';
  }

  dom.progressSpeed.textContent = '—';
  setPatchLog('info', 'Esperando estado real del patcher...');
  syncLaunchButtonState();

  if (bridge.has()) {
    requestStartUpdate(false);
    return;
  }

  let attempts = 0;

  const probe = setInterval(() => {
    attempts += 1;

    if (bridge.has()) {
      clearInterval(probe);
      requestStartUpdate(false);
      return;
    }

    if (attempts >= 40) {
      clearInterval(probe);
      loadPatchListSummary();
      syncLaunchButtonState();
    }
  }, 250);
}

/* Exponer callbacks globales por si el patcher los invoca desde fuera */
window.patchingStatusReady = patchingStatusReady;
window.patchingStatusError = patchingStatusError;
window.patchingStatusDownloading = patchingStatusDownloading;
window.patchingStatusInstalling = patchingStatusInstalling;
window.patchingStatusDownloadAndInstall = patchingStatusDownloadAndInstall;
window.patchingStatusPatchApplied = patchingStatusPatchApplied;
window.notificationInProgress = notificationInProgress;

/* Si tu patcher usa nombres snake_case, también quedan disponibles */
window.patching_status_ready = patchingStatusReady;
window.patching_status_error = patchingStatusError;
window.patching_status_downloading = patchingStatusDownloading;
window.patching_status_installing = patchingStatusInstalling;
window.patching_status_download_and_install = patchingStatusDownloadAndInstall;
window.patching_status_patch_applied = patchingStatusPatchApplied;
window.notification_in_progress = notificationInProgress;

dom.modalClose.addEventListener('click', closeModal);

dom.backdrop.addEventListener('click', (e) => {
  if (e.target === dom.backdrop) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

dom.btnLaunch.addEventListener('click', handleLaunch);

['username', 'password'].forEach((id) => {
  $(id).addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleLaunch();
    }
  });
});

renderNews();
bindExternalLinks();

updateClock();
setInterval(updateClock, 1000);

resizeCanvas();
addEventListener('resize', resizeCanvas);
initParticles();
animateParticles();

initPatcherStartup();
