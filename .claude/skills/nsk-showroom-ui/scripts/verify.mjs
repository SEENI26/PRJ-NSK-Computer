#!/usr/bin/env node
/**
 * Sweep every NSK route at every required breakpoint.
 *
 *   node --experimental-websocket verify.mjs [baseUrl] [--full]
 *
 * Reports, per route and width: horizontal overflow, missing H1, broken
 * images, console errors and exceptions, CLS, and page height. Height is worth
 * watching — a mobile number close to the desktop one usually means the layout
 * shrank rather than reflowed.
 *
 * Why CDP and not `--screenshot --virtual-time-budget`: pages here run rAF
 * loops (the hero particle field, the three.js workstation). Under virtual
 * time those consume the budget instantly and the page snapshots blank, which
 * looks exactly like a broken layout and is not one. Real wall-clock time over
 * CDP is the only reliable way to see this site.
 *
 * Node 20 needs --experimental-websocket; Node 21+ has WebSocket by default.
 */

const BASE = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:3101';
const FULL = process.argv.includes('--full');
const PORT = 9222;

const ROUTES = [
  ['/', 'home'],
  ['/gaming-pcs', 'gaming'],
  ['/professional-pcs', 'professional'],
  ['/hardware', 'hardware'],
  ['/accessories', 'accessories'],
  ['/about', 'about'],
];

// The brief names these six. The short sweep keeps one desktop and one phone.
const WIDTHS = FULL ? [1920, 1440, 1366, 768, 430, 390] : [1440, 390];

/** Pre-existing at the time of writing: the lazy-route fallback is shorter
 *  than the real pages, so the footer jumps once on first paint. Flagged
 *  rather than silently ignored, so a genuine regression still stands out. */
const KNOWN_CLS = 0.16;

async function connect() {
  let targets;
  try {
    targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  } catch {
    console.error(
      `\nCannot reach Chrome on :${PORT}. Start it first:\n\n` +
      `  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\\n` +
      `    --headless --disable-gpu --use-gl=swiftshader --enable-unsafe-swiftshader \\\n` +
      `    --remote-debugging-port=${PORT} --user-data-dir=/tmp/nsk-cdp about:blank &\n`,
    );
    process.exit(1);
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  let logs = [];

  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails;
      logs.push('EXCEPTION ' + (d.exception?.description || d.text || '').slice(0, 140));
    }
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) {
      logs.push(m.params.type + ': ' +
        m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 140));
    }
  });

  await new Promise((r) => ws.addEventListener('open', r));
  const send = (method, params = {}) => new Promise((res) => {
    const i = ++id; pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evaluate = async (expr) =>
    (await send('Runtime.evaluate', { expression: expr, returnByValue: true }))
      .result?.result?.value;

  await send('Runtime.enable');
  await send('Page.enable');
  return { send, evaluate, ws, drainLogs: () => { const l = logs; logs = []; return l; } };
}

const PROBE = `(() => {
  const de = document.documentElement;
  const imgs = [...document.images];
  return JSON.stringify({
    overflow: de.scrollWidth > innerWidth + 1 ? de.scrollWidth : 0,
    h1: document.querySelectorAll('h1').length,
    height: document.body.scrollHeight,
    cls: +(window.__cls || 0).toFixed(3),
    images: imgs.length,
    broken: imgs.filter(i => i.complete && i.naturalWidth === 0).length,
  });
})()`;

async function main() {
  const { send, evaluate, ws, drainLogs } = await connect();
  let failures = 0;

  console.log(`\nNSK route sweep — ${BASE}\n${'='.repeat(74)}`);

  for (const [path, name] of ROUTES) {
    for (const width of WIDTHS) {
      drainLogs();
      await send('Emulation.setDeviceMetricsOverride',
        { width, height: 900, deviceScaleFactor: 1, mobile: width < 800 });
      // Blank between routes so CLS is measured per page, not accumulated.
      await send('Page.navigate', { url: 'about:blank' });
      await new Promise((r) => setTimeout(r, 250));
      await send('Page.navigate', { url: BASE + path });
      await evaluate(`window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())
        if(!e.hadRecentInput) window.__cls += e.value;}).observe({type:'layout-shift',buffered:true});`);
      await new Promise((r) => setTimeout(r, 4000));

      const d = JSON.parse(await evaluate(PROBE));
      const problems = [];
      if (d.overflow) problems.push(`H-OVERFLOW ${d.overflow}px`);
      if (d.h1 !== 1) problems.push(d.h1 === 0 ? 'NO H1' : `${d.h1} H1s`);
      if (d.broken) problems.push(`${d.broken} BROKEN IMG`);
      if (d.cls > KNOWN_CLS) problems.push(`CLS ${d.cls}`);
      const errs = drainLogs().filter((l) => !l.includes('[vite]'));
      if (errs.length) problems.push(errs.join(' | '));

      if (problems.length) failures += 1;
      console.log(
        `${name.padEnd(14)}${String(width).padStart(5)}  ` +
        `h=${String(d.height).padStart(6)} cls=${String(d.cls).padEnd(6)} ` +
        `img=${String(d.images).padEnd(3)} ` +
        (problems.length ? `FAIL  ${problems.join(' ; ')}` : 'ok'),
      );
    }
  }

  console.log('='.repeat(74));
  console.log(failures ? `\n${failures} check(s) failed.\n` : '\nAll routes clean.\n');
  ws.close();
  process.exit(failures ? 1 : 0);
}

main();
