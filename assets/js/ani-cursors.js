'use strict';

(() => {
  const JIFFIES_TO_MS = 1000 / 60;
  const STYLE_ID = 'ani-cursor-runtime-styles';

  const CURSOR_FILES = {
    normal: ['./assets/cursors/ro-normal-select.ani', './Ro Normal Select.ani'],
    pointer: ['./assets/cursors/ro-link-select.ani', './Ro Link Select.ani'],
    text: ['./assets/cursors/ro-text-select.ani', './Ro Text Select.ani'],
    help: ['./assets/cursors/ro-help-select.ani', './Ro Help Select.ani']
  };

  const SELECTORS = {
    pointer: [
      'a[href]',
      'button',
      '[role="button"]',
      '.btn',
      '.nav-link',
      '.news-card',
      '.lang-pill',
      '.Vanatools-link',
      '.icon-btn',
      '.modal-close',
      '.account-item',
      '.account-remove',
      '.remember-check',
      'label[for]',
      'summary',
      'input[type="checkbox"]',
      'input[type="radio"]',
      'select'
    ].join(','),
    text: [
      'textarea',
      'input:not([type])',
      'input[type="text"]',
      'input[type="password"]',
      'input[type="email"]',
      'input[type="search"]',
      'input[type="url"]',
      'input[type="tel"]',
      'input[type="number"]',
      '[contenteditable]',
      '[contenteditable="true"]'
    ].join(','),
    help: [
      '[data-cursor="help"]',
      '[title]'
    ].join(',')
  };

  function chunkToBase64(bytes, chunkSize = 0x8000) {
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const slice = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      let part = '';
      for (let j = 0; j < slice.length; j++) {
        part += String.fromCharCode(slice[j]);
      }
      binary += part;
    }
    return btoa(binary);
  }

  function cursorUrlFromByteArray(dataArray) {
    return `data:image/x-icon;base64,${chunkToBase64(dataArray)}`;
  }

  function fourCC(view, offset) {
    if (offset + 4 > view.byteLength) return '';
    return String.fromCharCode(
      view.getUint8(offset),
      view.getUint8(offset + 1),
      view.getUint8(offset + 2),
      view.getUint8(offset + 3)
    );
  }

  function align2(n) {
    return n + (n % 2);
  }

  function parseDwordArray(bytes) {
    const out = [];
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let i = 0; i + 4 <= bytes.byteLength; i += 4) out.push(view.getUint32(i, true));
    return out;
  }

  function parseAniBytes(contents) {
    const view = new DataView(contents.buffer, contents.byteOffset, contents.byteLength);
    if (fourCC(view, 0) !== 'RIFF') throw new Error('Not a RIFF file');
    if (fourCC(view, 8) !== 'ACON') throw new Error('Not an ANI cursor');

    let metadata = null;
    let rate = null;
    let seq = null;
    const images = [];

    let offset = 12;
    while (offset + 8 <= view.byteLength) {
      const id = fourCC(view, offset);
      const size = view.getUint32(offset + 4, true);
      const dataStart = offset + 8;
      const dataEnd = Math.min(dataStart + size, view.byteLength);

      if (id === 'anih') {
        const vals = parseDwordArray(contents.subarray(dataStart, dataEnd));
        metadata = {
          nFrames: vals[1] || 0,
          nSteps: vals[2] || 0,
          iDispRate: vals[7] || 6
        };
      } else if (id === 'rate') {
        rate = parseDwordArray(contents.subarray(dataStart, dataEnd));
      } else if (id === 'seq ') {
        seq = parseDwordArray(contents.subarray(dataStart, dataEnd));
      } else if (id === 'LIST' && dataStart + 4 <= dataEnd) {
        const listType = fourCC(view, dataStart);
        if (listType === 'fram') {
          let frameOffset = dataStart + 4;
          while (frameOffset + 8 <= dataEnd) {
            const frameId = fourCC(view, frameOffset);
            const frameSize = view.getUint32(frameOffset + 4, true);
            const frameDataStart = frameOffset + 8;
            const frameDataEnd = Math.min(frameDataStart + frameSize, dataEnd);
            if (frameId === 'icon') {
              images.push(contents.subarray(frameDataStart, frameDataEnd));
            }
            frameOffset = frameDataStart + align2(frameSize);
          }
        }
      }

      offset = dataStart + align2(size);
    }

    if (!images.length) throw new Error('ANI contains no frames');

    const defaultRate = metadata?.iDispRate || 6;
    const stepCount = Math.max(seq?.length || 0, rate?.length || 0, metadata?.nSteps || 0, images.length);
    const rates = Array.from({ length: stepCount }, (_, i) => rate?.[i] ?? defaultRate);
    const durationUnits = rates.reduce((acc, val) => acc + (val || defaultRate), 0) || defaultRate;

    const frames = images.map(image => ({ url: cursorUrlFromByteArray(image), percents: [] }));
    let elapsed = 0;
    for (let i = 0; i < stepCount; i++) {
      const idx = seq ? (seq[i] ?? (i % images.length)) : (i % images.length);
      if (idx >= 0 && idx < frames.length) {
        frames[idx].percents.push((elapsed / durationUnits) * 100);
      }
      elapsed += rates[i] || defaultRate;
    }

    return {
      durationMs: durationUnits * JIFFIES_TO_MS,
      frames
    };
  }

  function buildAnimationCss(mode, ani) {
    const animationName = `ani-cursor-${mode}-${Math.random().toString(36).slice(2, 10)}`;
    const fallbackKeyword =
      mode === 'pointer' ? 'pointer' :
      mode === 'text' ? 'text' :
      mode === 'help' ? 'help' : 'auto';

    const keyframes = ani.frames
      .filter(frame => frame.percents.length)
      .map(frame => `${frame.percents.map(v => `${v}%`).join(', ')} { cursor: url("${frame.url}"), ${fallbackKeyword}; }`)
      .join('\n');

    const fallback = ani.frames[0]?.url;
    if (!fallback || !keyframes) return '';

    if (mode === 'normal') {
      return `
@keyframes ${animationName} {
${keyframes}
}
html {
  cursor: url("${fallback}"), auto;
  animation: ${animationName} ${ani.durationMs}ms step-end infinite;
}`;
    }

    const interactiveSelector = `${SELECTORS[mode]}:hover, ${SELECTORS[mode]}:focus, ${SELECTORS[mode]}:focus-visible, ${SELECTORS[mode]}:active`;
    return `
@keyframes ${animationName} {
${keyframes}
}
${interactiveSelector} {
  cursor: url("${fallback}"), ${fallbackKeyword};
  animation: ${animationName} ${ani.durationMs}ms step-end infinite;
}`;
  }

  async function fetchFirstAvailable(paths) {
    for (const path of paths) {
      try {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) continue;
        return new Uint8Array(await response.arrayBuffer());
      } catch {
        // Try next candidate path.
      }
    }
    return null;
  }

  async function installAnimatedCursors() {
    const modes = ['normal', 'pointer', 'text', 'help'];
    const cssBlocks = [];

    for (const mode of modes) {
      const bytes = await fetchFirstAvailable(CURSOR_FILES[mode]);
      if (!bytes) continue;
      try {
        const ani = parseAniBytes(bytes);
        const css = buildAnimationCss(mode, ani);
        if (css) cssBlocks.push(css);
      } catch (error) {
        console.warn(`[ani-cursor] No se pudo parsear ${mode}:`, error);
      }
    }

    if (!cssBlocks.length) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = cssBlocks.join('\n');
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installAnimatedCursors, { once: true });
  } else {
    installAnimatedCursors();
  }
})();
