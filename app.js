'use strict';
/* =====================================================
   Zpay DEMO app - app.js
   Sum dik tak a kal lo. Mi hming leh balance zawng zawng
   he phone/browser-ah chauh (localStorage) a dah a ni.
   ===================================================== */

/* ---------------- 1. Config (hei hi i sawn thei) ---------------- */
const STORE_KEY  = 'zpay.demo.v1';
const MAX_AMOUNT = 100000;           // pay theih tam ber (demo)
const START_BAL  = 10000;            // demo balance

const CONTACTS = [
  { name: 'Lalrinpuii',    upi: 'lalrinpuii@zpay' },
  { name: 'Zothanpuia',    upi: 'zothanpuia@zpay' },
  { name: 'Vanlalruata',   upi: 'vanlalruata@zpay' },
  { name: 'Lalmuanpuii',   upi: 'lalmuanpuii@zpay' },
  { name: 'Ramdinthara',   upi: 'ramdinthara@zpay' },
  { name: 'Lalduhsaka',    upi: 'lalduhsaka@zpay' },
  { name: 'Zonunsangi',    upi: 'zonunsangi@zpay' },
  { name: 'Hmangaihzuali', upi: 'hmangaihzuali@zpay' },
];
const BILLS = [
  { name: 'Electricity bill', upi: 'electricity@zpay' },
  { name: 'Water bill',       upi: 'water@zpay' },
  { name: 'DTH / Cable',      upi: 'dth@zpay' },
  { name: 'Broadband',        upi: 'broadband@zpay' },
];

/* ---------------- 2. Tiny helpers ---------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function mk(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function cleanText(s, n) {            // QR atanga lo kal text hi a thianghlim tur
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, n);
}
function money(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function moneyShort(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}
function fmtDate(ts) {
  return new Date(ts).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}
function newId() {
  return 'ZP' + Date.now().toString().slice(-8) + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}
function rupeesWords(n) {
  const r = Math.floor(n + 1e-9), p = Math.round((n - r) * 100);
  return r + ' rupees' + (p ? ' ' + p + ' paise' : '');
}
function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }

/* ---------------- 3. Icons ---------------- */
const ICONS = {
  scan:   '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18.2 14.4c2 .7 3.3 2.5 3.3 5.6"/>',
  phone:  '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  at:     '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
  zap:    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  file:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  qr:     '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4"/>',
  home:   '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  clock:  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  user:   '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  back:   '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  image:  '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
};
function svgIcon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
}
const LOGO = '<svg viewBox="0 0 48 48"><rect width="48" height="48" rx="13" fill="#5b3df5"/>' +
  '<path d="M15 15h18L15 33h18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<circle cx="35" cy="13.5" r="3.4" fill="#b6f23c"/></svg>';

/* ---------------- 4. State (localStorage) ---------------- */
function defaults() {
  return { name: 'Ka Hming', balance: START_BAL, pin: '1234', sound: true, voice: true, txns: [] };
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY));
    return Object.assign(defaults(), d && typeof d === 'object' ? d : {});
  } catch (e) { return defaults(); }
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }
let S = load();
function upiOf(name) {
  const s = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
  return (s || 'user') + '@zpay';
}
const myUPI = () => upiOf(S.name);

/* ---------------- 5. Sound + voice ---------------- */
let actx = null;
function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!actx) actx = new AC();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, start, dur, type, vol) {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + start;
  o.type = type || 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.22, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
const SOUNDS = {
  success: () => { [659.25, 830.61, 987.77, 1318.51].forEach((f, i) => tone(f, i * 0.11, 0.55, 'sine', 0.24)); },
  received: () => { tone(880, 0, 0.35, 'triangle', 0.3); tone(1174.66, 0.18, 0.6, 'triangle', 0.3); tone(1567.98, 0.38, 0.7, 'triangle', 0.26); },
  error: () => { tone(180, 0, 0.18, 'sawtooth', 0.2); tone(140, 0.2, 0.3, 'sawtooth', 0.2); },
  beep: () => { tone(1500, 0, 0.12, 'square', 0.12); },
  tick: () => { tone(900, 0, 0.04, 'square', 0.04); },
};
function snd(name, force) { if (S.sound || force) { try { SOUNDS[name](); } catch (e) {} } }
function speak(text, force) {
  try {
    if (!(S.voice || force) || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN'; u.rate = 0.95;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------------- 6. Toast / Flash / Sheet ---------------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2300);
}
let flashTimer;
function flash(title, sub) {
  $('#flash-t').textContent = title; $('#flash-s').textContent = sub;
  const f = $('#flash'); f.classList.remove('open'); void f.offsetWidth; f.classList.add('open');
  clearTimeout(flashTimer); flashTimer = setTimeout(() => f.classList.remove('open'), 3200);
}
$('#flash').addEventListener('click', () => $('#flash').classList.remove('open'));

let sheetOnClose = null;
function openSheet(o) {
  $('#sheet-title').textContent = o.title || '';
  $('#sheet-msg').textContent = o.message || '';
  const form = $('#sheet-form'); form.replaceChildren();
  (o.fields || []).forEach(f => {
    const l = mk('label', '', f.label);
    const i = document.createElement('input');
    i.name = f.name; i.type = f.type || 'text';
    if (f.placeholder) i.placeholder = f.placeholder;
    if (f.inputmode) i.inputMode = f.inputmode;
    if (f.maxlength) i.maxLength = f.maxlength;
    if (f.value != null) i.value = f.value;
    l.appendChild(i); form.appendChild(l);
  });
  const b = mk('button', 'btn primary big', o.submit || 'OK'); b.type = 'submit';
  form.appendChild(b);
  sheetOnClose = o.onClose || null;
  form.onsubmit = e => {
    e.preventDefault();
    const data = {};
    (o.fields || []).forEach(f => { data[f.name] = form.elements[f.name].value.trim(); });
    const keep = o.onSubmit ? o.onSubmit(data) === false : false;
    if (!keep) closeSheet(true);
  };
  $('#sheet').classList.add('open');
  const first = $('input', form); if (first) setTimeout(() => first.focus(), 80);
}
function closeSheet(submitted) {
  $('#sheet').classList.remove('open');
  const cb = sheetOnClose; sheetOnClose = null;
  if (cb) cb(!!submitted);
}

/* ---------------- 7. Navigation ---------------- */
const TABS = ['home', 'history', 'myqr', 'settings'];
let current = 'home';
const stack = ['home'];
function show(name) {
  current = name;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'v-' + name));
  $('#nav').classList.toggle('hide', !TABS.includes(name));
  $$('#nav [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  if (name === 'scan') startScan(); else stopScan();
  const r = { home: renderHome, history: renderHistory, myqr: renderMyQR, settings: renderSettings }[name];
  if (r) r();
  window.scrollTo(0, 0);
}
function go(name) { if (name === current) return; stack.push(name); show(name); }
function tab(name) { stack.length = 0; stack.push('home'); if (name !== 'home') stack.push(name); show(name); }
function back() { if (stack.length > 1) stack.pop(); show(stack[stack.length - 1]); }

/* ---------------- 8. Renderers ---------------- */
const AV_COLORS = ['#6d4aff', '#2f6bff', '#0ea5a5', '#e0612c', '#c026a3', '#2e9e4f', '#c99700', '#e5484d'];
function avatar(name) {
  const d = mk('div', 'av');
  let h = 0; for (const ch of String(name)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  d.style.background = AV_COLORS[h % AV_COLORS.length];
  d.textContent = (String(name).match(/[A-Za-z0-9]/) || ['?'])[0].toUpperCase();
  return d;
}
function fillTxnList(box, list, emptyMsg) {
  box.replaceChildren();
  if (!list.length) { box.appendChild(mk('div', 'empty', emptyMsg)); return; }
  list.forEach(t => {
    const row = mk('div', 'txn');
    row.appendChild(avatar(t.name));
    const mid = mk('div', 'tmid');
    mid.appendChild(mk('b', '', t.name));
    mid.appendChild(mk('small', '', fmtDate(t.ts) + (t.note ? ' · ' + t.note : '')));
    row.appendChild(mid);
    row.appendChild(mk('div', 'tamt ' + (t.type === 'in' ? 'in' : 'out'), (t.type === 'in' ? '+' : '−') + moneyShort(t.amt)));
    box.appendChild(row);
  });
}
let balShown = false;
function renderBalance() {
  $('#bal-val').textContent = balShown ? money(S.balance) : '₹ ••••••';
  $('#bal-btn').textContent = balShown ? 'Thup' : 'Balance en';
}
function renderHome() {
  $('#home-avatar').replaceChildren(avatar(S.name));
  const p = $('#people'); p.replaceChildren();
  CONTACTS.forEach(c => {
    const b = mk('button', 'person');
    const a = avatar(c.name); a.style.width = a.style.height = '52px';
    b.appendChild(a); b.appendChild(mk('span', 'pn', c.name));
    b.addEventListener('click', () => openPay({ name: c.name, upi: c.upi }));
    p.appendChild(b);
  });
  fillTxnList($('#recent'), S.txns.slice(0, 3), 'Transaction a la awm lo. Scan a, pay hmasa rawh!');
  renderBalance();
}
function renderHistory() {
  fillTxnList($('#hist'), S.txns, 'Transaction a la awm lo.');
}
function renderMyQR() {
  const upi = myUPI();
  $('#qr-av').replaceChildren(avatar(S.name));
  $('#qr-name').textContent = S.name;
  $('#qr-upi').textContent = upi;
  try {
    drawQR($('#qr-canvas'), 'upi://pay?pa=' + upi + '&pn=' + encodeURIComponent(S.name) + '&cu=INR');
  } catch (e) { toast('QR siam theih loh'); }
}
function renderSettings() {
  $('#set-name').value = S.name;
  $('#set-upi').value = myUPI();
  $('#set-pin').value = S.pin;
  $('#set-sound').checked = !!S.sound;
  $('#set-voice').checked = !!S.voice;
}
function drawQR(canvas, text) {
  const Q = window.QRCodeLib;
  const qr = new Q(-1, Q.ECL.M);
  qr.addData(text); qr.make();
  const n = qr.getModuleCount(), quiet = 2;
  const cell = Math.max(4, Math.floor(264 / (n + quiet * 2))), size = (n + quiet * 2) * cell;
  canvas.width = size; canvas.height = size;
  const c = canvas.getContext('2d');
  c.fillStyle = '#fff'; c.fillRect(0, 0, size, size);
  c.fillStyle = '#14122b';
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) c.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
}

/* contact / bill list view */
let listRef = [];
function openList(title, list) {
  listRef = list; $('#c-title').textContent = title; $('#c-search').value = '';
  renderList(); go('contacts');
}
function renderList() {
  const q = $('#c-search').value.trim().toLowerCase();
  const box = $('#c-list'); box.replaceChildren();
  const rows = listRef.filter(c => !q || c.name.toLowerCase().includes(q) || c.upi.includes(q));
  if (!rows.length) { box.appendChild(mk('div', 'empty', 'A awm lo')); return; }
  rows.forEach(c => {
    const b = mk('button', 'crow');
    b.appendChild(avatar(c.name));
    const mid = mk('div', 'tmid'); mid.appendChild(mk('b', '', c.name)); mid.appendChild(mk('small', '', c.upi));
    b.appendChild(mid);
    b.addEventListener('click', () => openPay({ name: c.name, upi: c.upi }));
    box.appendChild(b);
  });
}

/* ---------------- 9. Pay flow ---------------- */
let payee = null, amt = '', fixedAmt = false;

function openPay(p) {
  const upi = cleanText(p.upi, 60);
  if (upi.toLowerCase() === myUPI()) { snd('error'); toast('Nangma QR a ni, midang QR scan rawh'); return; }
  payee = { name: cleanText(p.name, 40) || upi, upi: upi };
  fixedAmt = !!(p.amount && p.amount > 0);
  amt = fixedAmt ? String(p.amount) : '';
  $('#pay-av').replaceChildren(avatar(payee.name));
  $('#pay-name').textContent = payee.name;
  $('#pay-upi').textContent = payee.upi;
  $('#pay-note').value = cleanText(p.note || '', 40);
  $('#pay-keys').style.display = fixedAmt ? 'none' : '';
  renderAmt();
  go('pay');
}
function renderAmt() {
  const a = parseFloat(amt);
  $('#pay-amt').textContent = '₹' + (amt || '0');
  const b = $('#pay-go');
  b.disabled = !(a > 0);
  b.textContent = a > 0 ? 'Pay ' + moneyShort(a) : 'Pay';
}
function keyAmount(k) {
  if (k === 'del') amt = amt.slice(0, -1);
  else if (k === '.') { if (!amt.includes('.')) amt = (amt || '0') + '.'; }
  else {
    if (amt.includes('.') && amt.split('.')[1].length >= 2) return;
    amt = (amt === '0') ? k : amt + k;
    if (parseFloat(amt) > MAX_AMOUNT) { amt = amt.slice(0, -1); toast('Max ' + moneyShort(MAX_AMOUNT)); }
  }
  renderAmt();
}
function buildKeypad(box, leftKey, onKey) {
  box.replaceChildren();
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', leftKey, '0', 'del'].forEach(k => {
    const b = mk('button', 'key', k === 'del' ? '⌫' : k);
    b.type = 'button';
    if (k === '') { b.classList.add('ghost'); b.disabled = true; }
    b.addEventListener('click', () => { snd('tick'); onKey(k); });
    box.appendChild(b);
  });
}

/* PIN */
let pinVal = '', pinBusy = false;
function openPin() {
  pinVal = ''; pinBusy = false; renderPin();
  $('#pin-sub').textContent = 'Pay ' + moneyShort(parseFloat(amt)) + ' → ' + payee.name;
  $('#pin-hint').textContent = S.pin;
  go('pin');
}
function renderPin() { $$('#pin-dots i').forEach((d, i) => d.classList.toggle('on', i < pinVal.length)); }
function keyPin(k) {
  if (pinBusy) return;
  if (k === 'del') pinVal = pinVal.slice(0, -1);
  else if (pinVal.length < 4) pinVal += k;
  renderPin();
  if (pinVal.length === 4) { pinBusy = true; setTimeout(checkPin, 160); }
}
function checkPin() {
  if (pinVal === S.pin) { startPayment(); return; }
  snd('error'); vibrate([140]);
  const d = $('#pin-dots'); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake');
  toast('PIN a dik lo');
  pinVal = ''; pinBusy = false; renderPin();
}

/* Payment (demo: sum dik tak a kal lo) */
function setResult(state) { $('#v-result').dataset.state = state; }
function startPayment() {
  const a = Math.round(parseFloat(amt) * 100) / 100;
  const note = cleanText($('#pay-note').value, 40);
  setResult('proc'); go('result');
  setTimeout(() => {
    if (!(a > 0) || a > S.balance) {
      $('#rc-err').textContent = 'Balance a tlem. I balance: ' + money(S.balance);
      setResult('bad'); snd('error'); vibrate([200]); return;
    }
    S.balance = Math.round((S.balance - a) * 100) / 100;
    const t = { id: newId(), type: 'out', name: payee.name, upi: payee.upi, amt: a, note: note, ts: Date.now() };
    S.txns.unshift(t); S.txns = S.txns.slice(0, 100); save();
    $('#rc-amt').textContent = money(a);
    $('#rc-to').textContent = 'Paid to ' + t.name;
    $('#rc-upi').textContent = t.upi;
    $('#rc-id').textContent = t.id;
    $('#rc-time').textContent = fmtDate(t.ts);
    setResult('ok');
    snd('success'); speak('Payment successful. ' + rupeesWords(a) + ' paid.'); vibrate([80, 50, 120]);
  }, 1500);
}

/* Sum dawn (demo) */
function receiveMoney(from, a) {
  a = Math.round(a * 100) / 100;
  S.balance = Math.round((S.balance + a) * 100) / 100;
  S.txns.unshift({ id: newId(), type: 'in', name: from, upi: upiOf(from), amt: a, note: '', ts: Date.now() });
  S.txns = S.txns.slice(0, 100); save();
  snd('received'); speak('Received ' + rupeesWords(a) + ' from ' + from); vibrate([120, 60, 120]);
  flash(moneyShort(a) + ' dawn a ni', from + ' hnen atangin');
  renderBalance();
}

/* ---------------- 10. QR parsing ---------------- */
/* parseUPI:start */
function parseUPI(text) {
  text = String(text || '').trim();
  if (/^upi:\/\//i.test(text)) {
    const q = text.indexOf('?');
    if (q < 0) return null;
    let p;
    try { p = new URLSearchParams(text.slice(q + 1)); } catch (e) { return null; }
    const pa = (p.get('pa') || '').trim();
    if (!/^[\w.\-]{2,}@[A-Za-z][A-Za-z0-9.\-]{1,}$/.test(pa)) return null;
    let am = parseFloat(p.get('am'));
    am = (isFinite(am) && am > 0 && am <= MAX_AMOUNT) ? Math.round(am * 100) / 100 : null;
    return { upi: pa, name: cleanText(p.get('pn'), 40) || pa, amount: am, note: cleanText(p.get('tn'), 40) };
  }
  if (/^[\w.\-]{2,}@[A-Za-z][A-Za-z0-9.\-]{1,}$/.test(text)) return { upi: text, name: text, amount: null, note: '' };
  return null;
}
/* parseUPI:end */

/* ---------------- 11. Scanner ---------------- */
let stream = null, scanning = false, scanLock = false, detector = null;
const video = $('#cam');

async function initDetector() {
  try {
    if ('BarcodeDetector' in window) {
      const f = await BarcodeDetector.getSupportedFormats();
      if (f.includes('qr_code')) detector = new BarcodeDetector({ formats: ['qr_code'] });
    }
  } catch (e) { detector = null; }
}
let jsqrPromise = null;
function ensureJsQR() {
  if (window.jsQR) return Promise.resolve(true);
  if (jsqrPromise) return jsqrPromise;
  const urls = ['jsQR.js', 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js', 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js'];
  jsqrPromise = (async () => {
    for (const u of urls) {
      const ok = await new Promise(res => {
        const s = document.createElement('script');
        s.src = u; s.onload = () => res(!!window.jsQR); s.onerror = () => res(false);
        document.head.appendChild(s);
      });
      if (ok) return true;
    }
    jsqrPromise = null; return false;
  })();
  return jsqrPromise;
}
function setScanMsg(t) { $('#scan-msg').textContent = t; }

async function startScan() {
  stopScan();
  scanLock = false; scanning = false;
  setScanMsg('Camera hawn mek...');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setScanMsg('Camera hman theih a ni lo. HTTPS (GitHub Pages) hmang rawh, emaw Gallery / Demo QR hmang rawh.');
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
  } catch (e) {
    const denied = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError');
    setScanMsg(denied ? 'Camera permission pe rawh (browser settings-ah Allow), emaw Gallery hmang rawh.' : 'Camera hawn theih a ni lo. Gallery / Demo QR hmang rawh.');
    return;
  }
  if (current !== 'scan') { stopScan(); return; }   // a lai-in dang kalsan tawh a nih chuan
  video.srcObject = stream;
  try { await video.play(); } catch (e) {}
  scanning = true;
  if (!detector) {
    setScanMsg('Scanner load mek...');
    const ok = await ensureJsQR();
    if (!ok) { setScanMsg('Scanner library load theih loh. Internet check rawh, emaw Demo QR hmang rawh.'); }
    else if (scanning) setScanMsg('QR code chu frame chhungah dah rawh');
  } else {
    setScanMsg('QR code chu frame chhungah dah rawh');
  }
  scanLoop();
}
function stopScan() {
  scanning = false;
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  try { video.srcObject = null; } catch (e) {}
}
const work = document.createElement('canvas');
function decodeJsQR(src, w, h) {
  if (!window.jsQR || !w || !h) return null;
  const scale = Math.min(1, 720 / Math.max(w, h));
  work.width = Math.round(w * scale); work.height = Math.round(h * scale);
  const c = work.getContext('2d', { willReadFrequently: true });
  c.drawImage(src, 0, 0, work.width, work.height);
  const img = c.getImageData(0, 0, work.width, work.height);
  const code = window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });
  return code && code.data ? code.data : null;
}
async function scanLoop() {
  if (!scanning) return;
  try {
    if (video.readyState >= 2 && video.videoWidth) {
      let text = null;
      if (detector) { const r = await detector.detect(video); if (r.length) text = r[0].rawValue; }
      else text = decodeJsQR(video, video.videoWidth, video.videoHeight);
      if (text && scanning) { onScanned(text); return; }
    }
  } catch (e) {}
  if (scanning) setTimeout(() => requestAnimationFrame(scanLoop), 90);
}
function onScanned(text) {
  if (scanLock) return;
  scanLock = true; scanning = false;
  snd('beep'); vibrate(60);
  const p = parseUPI(text);
  if (p) { openPay(p); if (current === 'scan') { scanLock = false; startScan(); } return; }
  stopScan();
  openSheet({
    title: 'Hei hi UPI QR a ni lo',
    message: cleanText(text, 200),
    submit: 'Scan nawn leh',
    onSubmit: () => {},
    onClose: () => { if (current === 'scan') startScan(); },
  });
}
$('#scan-demo').addEventListener('click', () => onScanned('upi://pay?pa=lalrinpuii@zpay&pn=Lalrinpuii&am=250&tn=Demo%20QR'));
$('#scan-file').addEventListener('change', async e => {
  const f = e.target.files && e.target.files[0]; e.target.value = '';
  if (!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = async () => {
    let text = null;
    try {
      if (detector) { const r = await detector.detect(img); if (r.length) text = r[0].rawValue; }
      if (!text && await ensureJsQR()) text = decodeJsQR(img, img.naturalWidth, img.naturalHeight);
    } catch (err) {}
    URL.revokeObjectURL(url);
    if (text) { scanLock = false; onScanned(text); } else toast('He photo-ah QR a hmuh loh');
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('Photo hawn theih loh'); };
  img.src = url;
});

/* ---------------- 12. Actions (button click) ---------------- */
function act(name) {
  switch (name) {
    case 'scan': go('scan'); break;
    case 'contacts': openList('Contacts', CONTACTS); break;
    case 'bills': openList('Bills', BILLS); break;
    case 'receive': tab('myqr'); break;
    case 'phone':
      openSheet({
        title: 'Phone number hmanga pay', submit: 'Hma pan',
        fields: [{ name: 'num', label: 'Phone number (digit 10)', inputmode: 'numeric', maxlength: 10, placeholder: '9876543210' }],
        onSubmit: d => {
          if (!/^\d{10}$/.test(d.num)) { toast('Digit 10 ziak rawh'); return false; }
          setTimeout(() => openPay({ name: '+91 ' + d.num, upi: d.num + '@zpay' }), 50);
        },
      });
      break;
    case 'upiid':
      openSheet({
        title: 'UPI ID hmanga pay', submit: 'Hma pan',
        fields: [{ name: 'id', label: 'UPI ID', placeholder: 'name@zpay' }],
        onSubmit: d => {
          const p = parseUPI(d.id);
          if (!p) { toast('UPI ID dik lo (entirna: name@zpay)'); return false; }
          setTimeout(() => openPay(p), 50);
        },
      });
      break;
    case 'recharge':
      openSheet({
        title: 'Mobile recharge', submit: 'Hma pan',
        fields: [
          { name: 'num', label: 'Phone number (digit 10)', inputmode: 'numeric', maxlength: 10 },
          { name: 'amt', label: 'Amount (₹)', inputmode: 'decimal', maxlength: 5, value: '199' },
        ],
        onSubmit: d => {
          const a = parseFloat(d.amt);
          if (!/^\d{10}$/.test(d.num)) { toast('Phone number digit 10 ziak rawh'); return false; }
          if (!(a > 0 && a <= 10000)) { toast('Amount dik lo'); return false; }
          setTimeout(() => openPay({ name: 'Recharge · ' + d.num, upi: 'recharge@zpay', amount: Math.round(a * 100) / 100 }), 50);
        },
      });
      break;
    case 'demo-receive':
      openSheet({
        title: 'Demo: sum dawn', message: 'Midang in sum an pek angin a ni ang (demo).', submit: 'Sum pek nghal',
        fields: [
          { name: 'from', label: 'Tuin nge pek?', value: 'Lalrinpuii', maxlength: 30 },
          { name: 'amt', label: 'Amount (₹)', inputmode: 'decimal', value: '100', maxlength: 7 },
        ],
        onSubmit: d => {
          const a = parseFloat(d.amt);
          if (!(a > 0 && a <= MAX_AMOUNT)) { toast('Amount dik lo'); return false; }
          setTimeout(() => receiveMoney(cleanText(d.from, 30) || 'Someone', a), 120);
        },
      });
      break;
    case 'sound-test': snd('success', true); speak('Payment successful. 100 rupees paid.', true); break;
    case 'reset':
      if (confirm('Demo data zawng zawng (balance, history) reset i duh tak tak em?')) {
        try { localStorage.removeItem(STORE_KEY); } catch (e) {}
        S = defaults(); save(); balShown = false; toast('Reset fel ta'); tab('home');
      }
      break;
    case 'done': tab('home'); break;
  }
}

/* ---------------- 13. Wire up ---------------- */
document.addEventListener('click', e => {
  const t = e.target;
  const a = t.closest('[data-act]'); if (a) { act(a.dataset.act); return; }
  const tb = t.closest('[data-tab]'); if (tb) { tab(tb.dataset.tab); return; }
  if (t.closest('[data-back]')) { back(); return; }
  if (t.closest('[data-close-sheet]')) closeSheet(false);
});
$('#bal-btn').addEventListener('click', () => { balShown = !balShown; renderBalance(); });
$('#c-search').addEventListener('input', renderList);
$('#pay-go').addEventListener('click', () => {
  const a = parseFloat(amt);
  if (!(a > 0)) return;
  if (a > S.balance) { snd('error'); toast('Balance a tlem (' + money(S.balance) + ')'); return; }
  openPin();
});

/* settings */
$('#set-name').addEventListener('change', e => {
  const n = cleanText(e.target.value, 30);
  if (!n) { e.target.value = S.name; toast('Hming ziak rawh'); return; }
  S.name = n; save(); renderSettings(); toast('Hming save fel');
});
$('#set-pin').addEventListener('change', e => {
  const v = e.target.value.trim();
  if (!/^\d{4}$/.test(v)) { e.target.value = S.pin; toast('PIN chu digit 4 a ni tur'); return; }
  S.pin = v; save(); toast('PIN thlak fel');
});
$('#set-sound').addEventListener('change', e => { S.sound = e.target.checked; save(); });
$('#set-voice').addEventListener('change', e => { S.voice = e.target.checked; save(); });

/* init */
$$('[data-icon]').forEach(el => { el.innerHTML = svgIcon(el.dataset.icon); });
$$('[data-logo]').forEach(el => { el.innerHTML = LOGO; });
buildKeypad($('#pay-keys'), '.', keyAmount);
buildKeypad($('#pin-keys'), '', keyPin);
initDetector().then(() => { if (!detector) ensureJsQR(); });
show('home');
