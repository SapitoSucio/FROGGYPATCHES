const fs = require('fs');
const vm = require('vm');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function extractInlineScript(html) {
  const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  if (matches.length === 0) {
    throw new Error('No inline script found in index.html');
  }
  return matches[matches.length - 1][1];
}

function createElement(id) {
  return {
    id,
    style: {},
    disabled: false,
    textContent: '',
    innerHTML: '',
    value: '',
    listeners: {},
    children: [],
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    },
    appendChild(node) {
      this.children.push(node);
      return node;
    },
    click() {
      if (this.listeners.click) {
        this.listeners.click({ preventDefault() {} });
      }
    },
  };
}

function run() {
  const html = fs.readFileSync('index.html', 'utf8');
  const script = extractInlineScript(html);

  const commandCalls = [];
  const timers = [];
  const intervals = [];

  const ids = [
    'clock-time', 'particles', 'toast', 'toast-msg', 'toast-icon',
    'patch-log', 'progress-fill', 'progress-pct', 'progress-speed',
    'btn-play', 'patch-count', 'patch-ver', 'players-online',
    'btn-login', 'btn-register', 'username', 'password',
  ];
  const elements = Object.fromEntries(ids.map((id) => [id, createElement(id)]));
  elements.particles.getContext = () => ({
    clearRect() {},
    beginPath() {},
    arc() {},
    fill() {},
    fillStyle: '',
  });
  elements.toast.classList = { add() {}, remove() {} };

  const document = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = createElement(id);
      }
      return elements[id];
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return createElement('dynamic');
    },
  };

  const sandbox = {
    console,
    Math,
    Date,
    document,
    window: null,
    performance: { now: () => Date.now() },
    fetch: async () => ({ ok: true, text: async () => '1 a.grf\n2 b.grf\n' }),
    requestAnimationFrame: () => 0,
    setTimeout(fn, ms) {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimeout() {},
    setInterval(fn, ms) {
      intervals.push({ fn, ms, active: true });
      return intervals.length - 1;
    },
    clearInterval(id) {
      if (intervals[id]) intervals[id].active = false;
    },
    external: {
      invoke(payload) {
        commandCalls.push(payload);
      },
    },
    addEventListener() {},
    open() {},
  };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { filename: 'index-inline-script.js' });

  // Run startup timeout(s) that trigger auto update.
  for (const t of timers.filter((x) => x.ms <= 300)) {
    t.fn();
  }

  assert(
    commandCalls.includes('start_update'),
    'Expected auto-start to invoke start_update on load'
  );

  // Clicking play during active update should request cancel.
  elements['btn-play'].click();
  assert(
    commandCalls.includes('cancel_update'),
    'Expected click during active update to invoke cancel_update'
  );

  console.log('PASS: auto-start update and cancel behavior verified');
}

try {
  run();
} catch (err) {
  console.error('FAIL:', err.message);
  process.exit(1);
}
