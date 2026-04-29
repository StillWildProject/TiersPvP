import { initializeApp }                           from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, set, push, remove, onValue, update } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

// ═══════════════════════════════════════
//  TIERS
// ═══════════════════════════════════════
export const TIERS = [
  { id:'HT1', l:'HT1', n:'High Tier 1', c1:'#ff2244', c2:'#ff7030', glow:'rgba(255,34,68,.55)',  acc:'#ff2244', stars:3, crown:true  },
  { id:'HT2', l:'HT2', n:'High Tier 2', c1:'#ff7020', c2:'#ffb830', glow:'rgba(255,120,30,.45)', acc:'#ff7020', stars:2, crown:false },
  { id:'HT3', l:'HT3', n:'High Tier 3', c1:'#ffc020', c2:'#ffe860', glow:'rgba(255,200,30,.4)',  acc:'#ffc020', stars:1, crown:false },
  { id:'LT1', l:'LT1', n:'Low Tier 1',  c1:'#8ad4ff', c2:'#4080f0', glow:null, acc:'#6abaff', stars:0, crown:false },
  { id:'LT2', l:'LT2', n:'Low Tier 2',  c1:'#50b8f0', c2:'#2070cc', glow:null, acc:'#50b8f0', stars:0, crown:false },
  { id:'LT3', l:'LT3', n:'Low Tier 3',  c1:'#f060b8', c2:'#c030a0', glow:null, acc:'#f060b8', stars:0, crown:false },
  { id:'LT4', l:'LT4', n:'Low Tier 4',  c1:'#9050f0', c2:'#6020c8', glow:null, acc:'#9050f0', stars:0, crown:false },
  { id:'LT5', l:'LT5', n:'Low Tier 5',  c1:'#5a6878', c2:'#38444f', glow:null, acc:'#5a6878', stars:0, crown:false },
  { id:'UNRANKED', l:'?', n:'Unranked', c1:'#252d3a', c2:'#1a2030', glow:null, acc:'#2a3448', stars:0, crown:false },
];

// ── Kit SVG icons (inline, no external files needed) ──
const KIT_ICONS = {
  sword: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 4L6 24" stroke="#7ecfff" stroke-width="3" stroke-linecap="round"/>
    <path d="M26 4L28 8L24 6Z" fill="#b0e0ff"/>
    <path d="M6 24L4 28L8 26Z" fill="#7ecfff"/>
    <path d="M10 20L12 22" stroke="#b0e0ff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M8 18L10 20" stroke="#7ecfff" stroke-width="2" stroke-linecap="round"/>
    <rect x="4.5" y="21.5" width="5" height="2.5" rx="1" transform="rotate(-45 4.5 21.5)" fill="#a0c8e0"/>
  </svg>`,

  axe: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 22L22 10" stroke="#c0d0e0" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 10C24 7 28 6 28 6C28 6 27 10 24 12L20 14L18 12Z" fill="#b0bec5" stroke="#90a4ae" stroke-width="1"/>
    <path d="M10 22L8 25L11 26L14 24L12 22Z" fill="#90a4ae"/>
    <circle cx="16" cy="16" r="2" fill="#cfd8dc" opacity="0.5"/>
  </svg>`,

  nodebuff: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="20" rx="7" ry="9" fill="#d946a0" opacity="0.15"/>
    <ellipse cx="16" cy="20" rx="7" ry="9" stroke="#f472b6" stroke-width="1.5"/>
    <path d="M13 8C13 6.34 14.34 5 16 5C17.66 5 19 6.34 19 8V11H13V8Z" fill="#f9a8d4" stroke="#f472b6" stroke-width="1.2"/>
    <path d="M12 14H20" stroke="#f9a8d4" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="16" cy="20" r="3" fill="#f472b6" opacity="0.6"/>
    <path d="M14 19L16 21L18 18" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  pot: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="22" rx="8" ry="6" fill="#9f60ea" opacity="0.2"/>
    <path d="M8 16C8 12 10 10 16 10C22 10 24 12 24 16L22 24H10L8 16Z" fill="#7c3aed" opacity="0.7" stroke="#a78bfa" stroke-width="1.2"/>
    <ellipse cx="16" cy="16" rx="8" ry="4" fill="#8b5cf6" opacity="0.5"/>
    <path d="M14 6C14 5 15 4 16 4C17 4 18 5 18 6V9H14V6Z" fill="#c4b5fd" stroke="#a78bfa" stroke-width="1"/>
    <path d="M12 20C12 20 14 22 16 22C18 22 20 20 20 20" stroke="#c4b5fd" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="13" cy="17" r="1.5" fill="#ddd6fe" opacity="0.6"/>
  </svg>`,

  uhc: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L19.5 13H29L21.5 18.5L24.5 27.5L16 22L7.5 27.5L10.5 18.5L3 13H12.5Z" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M16 7L18.5 14H26L20 18L22.5 25L16 21L9.5 25L12 18L6 14H13.5Z" fill="#fcd34d" opacity="0.7"/>
    <circle cx="16" cy="17" r="3" fill="#fef3c7"/>
  </svg>`,

  stickfight: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 26L26 6" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
    <circle cx="26" cy="6" r="3" fill="#e879f9" opacity="0.8"/>
    <circle cx="6" cy="26" r="2" fill="#a855f7" opacity="0.7"/>
    <path d="M20 8L24 12" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <circle cx="14" cy="14" r="2.5" fill="#d8b4fe" opacity="0.4"/>
    <path d="M10 10L13 13" stroke="#c084fc" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </svg>`,

  soup: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15H25L23 23H9L7 15Z" fill="#92400e" opacity="0.4" stroke="#d97706" stroke-width="1.2"/>
    <ellipse cx="16" cy="15" rx="9" ry="3.5" fill="#b45309" opacity="0.5" stroke="#f59e0b" stroke-width="1"/>
    <path d="M10 12C10 10 11 9 13 9" stroke="#fcd34d" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <path d="M14 11C14 9 15 8 17 8" stroke="#fcd34d" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <circle cx="13" cy="18" r="1.5" fill="#fde68a" opacity="0.6"/>
    <circle cx="18" cy="20" r="1" fill="#fde68a" opacity="0.5"/>
    <path d="M9 23H23" stroke="#d97706" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
  </svg>`,

  bow: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4C10 10 10 22 8 28" stroke="#86efac" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M8 4C12 8 18 16 8 28" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5"/>
    <path d="M8 4L8 28" stroke="#86efac" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>
    <path d="M8 16H24" stroke="#d4d4d4" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M22 13L26 16L22 19" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1" stroke-linejoin="round"/>
    <circle cx="8" cy="4" r="1.5" fill="#4ade80" opacity="0.8"/>
    <circle cx="8" cy="28" r="1.5" fill="#4ade80" opacity="0.8"/>
  </svg>`,

  builduhc: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="18" width="8" height="8" rx="1" fill="#78350f" stroke="#d97706" stroke-width="1"/>
    <rect x="14" y="12" width="8" height="14" rx="1" fill="#92400e" stroke="#f59e0b" stroke-width="1"/>
    <rect x="24" y="6" width="5" height="20" rx="1" fill="#b45309" stroke="#fbbf24" stroke-width="1"/>
    <path d="M3 26H30" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M16 4L19.5 10H12.5Z" fill="#fcd34d" opacity="0.7"/>
  </svg>`,

  combo: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="16" r="5" fill="#ff6b6b" opacity="0.2" stroke="#ff4757" stroke-width="1.2"/>
    <circle cx="22" cy="16" r="5" fill="#ffa502" opacity="0.2" stroke="#ff6348" stroke-width="1.2"/>
    <path d="M7 14L10 17L13 12" stroke="#ff4757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 13L22 16L25 11" stroke="#ff6348" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 16H18" stroke="#ff6b35" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M16 14L18 16L16 18" stroke="#ff6b35" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  spleef: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="22" width="24" height="5" rx="1" fill="#38bdf8" opacity="0.15" stroke="#38bdf8" stroke-width="1"/>
    <rect x="4" y="22" width="7" height="5" rx="1" fill="#0ea5e9" opacity="0.5"/>
    <rect x="13" y="22" width="7" height="5" rx="1" fill="#0284c7" opacity="0.5"/>
    <path d="M16 4C18 8 20 12 16 16C12 20 10 20 12 24" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <circle cx="11" cy="10" r="3.5" fill="#bae6fd" opacity="0.25" stroke="#7dd3fc" stroke-width="1.2"/>
    <path d="M9 9L11 12L14 8" stroke="#7dd3fc" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  bedwars: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="18" width="24" height="8" rx="2" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1"/>
    <rect x="6" y="14" width="20" height="6" rx="1.5" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
    <rect x="6" y="13" width="7" height="4" rx="1" fill="#eff6ff" opacity="0.9"/>
    <rect x="19" y="13" width="7" height="4" rx="1" fill="#eff6ff" opacity="0.9"/>
    <path d="M4 22H28" stroke="#3b82f6" stroke-width="1" opacity="0.4"/>
    <rect x="6" y="26" width="3" height="3" rx="0.5" fill="#1d4ed8"/>
    <rect x="23" y="26" width="3" height="3" rx="0.5" fill="#1d4ed8"/>
    <circle cx="10" cy="15" r="1.5" fill="#93c5fd" opacity="0.5"/>
    <circle cx="22" cy="15" r="1.5" fill="#93c5fd" opacity="0.5"/>
  </svg>`,
};

function kitIcon(k) {
  const svg = KIT_ICONS[k.id];
  if (!svg) return `<span style="font-size:20px">${k.i}</span>`;
  return svg;
}

const KITS_DEF = [
  {id:'sword',     n:'Sword',     i:'⚔'},
  {id:'axe',       n:'Axe',       i:'🪓'},
  {id:'nodebuff',  n:'NoDebuff',  i:'💊'},
  {id:'pot',       n:'Pot',       i:'🧪'},
  {id:'uhc',       n:'UHC',       i:'🏆'},
  {id:'stickfight',n:'StickFight',i:'🪄'},
  {id:'soup',      n:'Soup',      i:'🍲'},
  {id:'bow',       n:'Bow',       i:'🏹'},
  {id:'builduhc',  n:'BuildUHC',  i:'🏗'},
  {id:'combo',     n:'Combo',     i:'💥'},
  {id:'spleef',    n:'Spleef',    i:'❄'},
  {id:'bedwars',   n:'BedWars',   i:'🛏'},
];

// ═══════════════════════════════════════
//  SVG BADGE CACHE
// ═══════════════════════════════════════
const BC = {};
let _bid = 0;

export function buildBadge(tid, px) {
  const key = tid + '_' + px;
  if (BC[key]) return BC[key];

  const t = TIERS.find(x => x.id === tid) || TIERS[TIERS.length - 1];
  const id = 'b' + (++_bid), R = px / 2, isHT = tid.startsWith('HT');

  // Crown
  const cw=px*.38, ch=px*.2, cx=R, cy=R-px*.13;
  const crown = t.crown
    ? `<path d="M${cx-cw/2},${cy+ch/2} L${cx-cw/2},${cy-ch*.2} L${cx-cw*.2},${cy+ch*.12} L${cx},${cy-ch*.5} L${cx+cw*.2},${cy+ch*.12} L${cx+cw/2},${cy-ch*.2} L${cx+cw/2},${cy+ch/2} Z" fill="#ffd700" opacity=".9"/>
       <line x1="${cx-cw/2}" y1="${cy+ch/2}" x2="${cx+cw/2}" y2="${cy+ch/2}" stroke="#ffaa00" stroke-width="${px*.024}" opacity=".7"/>`
    : '';

  // Stars
  const ss = px * .13;
  const sY = R + (t.crown ? px*.2 : px*.1);
  const tot = t.stars * ss + Math.max(0, t.stars-1) * px*.04;
  let stars = '', sx = R - tot/2;
  for (let i = 0; i < t.stars; i++) {
    stars += `<text x="${sx+ss/2}" y="${sY+ss*.38}" text-anchor="middle" font-size="${ss}" fill="rgba(255,255,255,.88)" font-family="serif">★</text>`;
    sx += ss + px*.04;
  }

  const lY = t.stars > 0
    ? (t.crown ? R-px*.06 : R+px*.07)
    : (t.crown ? R+px*.1 : R+px*.09);
  const fs = tid === 'UNRANKED' ? px*.24 : px*.22;

  const gf = isHT
    ? `<filter id="gf${id}" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="${px*.055}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
    : '';
  const anim = isHT ? ` class="badge-anim" style="--gc:${t.glow}"` : '';

  const svg = `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" xmlns="http://www.w3.org/2000/svg"${anim} style="display:block;overflow:visible;flex-shrink:0">
  <defs>
    ${gf}
    <radialGradient id="rg${id}" cx="38%" cy="28%" r="72%"><stop offset="0%" stop-color="${t.c1}"/><stop offset="100%" stop-color="${t.c2}"/></radialGradient>
    <radialGradient id="sh${id}" cx="30%" cy="20%" r="52%"><stop offset="0%" stop-color="rgba(255,255,255,.3)"/><stop offset="60%" stop-color="rgba(255,255,255,.05)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
    <radialGradient id="dk${id}" cx="65%" cy="72%" r="52%"><stop offset="0%" stop-color="rgba(0,0,0,.35)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient>
  </defs>
  <circle cx="${R}" cy="${R}" r="${R*.91}" fill="url(#rg${id})" ${isHT ? `filter="url(#gf${id})"` : ''}/>
  <circle cx="${R}" cy="${R}" r="${R*.91}" fill="url(#dk${id})"/>
  <circle cx="${R}" cy="${R}" r="${R*.91}" fill="url(#sh${id})"/>
  <circle cx="${R}" cy="${R}" r="${R*.91}" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="${px*.025}"/>
  <circle cx="${R}" cy="${R}" r="${R*.75}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${px*.016}" ${isHT ? 'stroke-dasharray="3 2.5"' : ''}/>
  ${crown}
  <text x="${R}" y="${lY+px*.023}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-weight="800" font-size="${fs}" fill="rgba(0,0,0,.5)">${t.l}</text>
  <text x="${R}" y="${lY}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-weight="800" font-size="${fs}" fill="rgba(255,255,255,.95)">${t.l}</text>
  ${stars}
</svg>`;

  BC[key] = svg;
  return svg;
}

// ═══════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════
const LSg = k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const LSs = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const ti   = id => TIERS.find(t => t.id === id) || TIERS[TIERS.length - 1];
const pt   = (p, k) => (p.kits && p.kits[k]) || 'UNRANKED';
const esc  = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ava  = n => `https://mc-heads.net/avatar/${encodeURIComponent(n)}/56`;

function bestTier(p) {
  const ord = TIERS.map(t => t.id);
  let best = 'UNRANKED';
  S.kits.forEach(k => { const t = pt(p, k.id); if (ord.indexOf(t) < ord.indexOf(best)) best = t; });
  return best;
}

// ═══════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════
function toast(m, tp = 'ok') {
  const w = document.getElementById('tw');
  const d = document.createElement('div');
  d.className = 'toast ' + tp;
  d.textContent = (tp === 'ok' ? '✓ ' : '✗ ') + m;
  w.appendChild(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('show')));
  setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 350); }, 2600);
}

// ═══════════════════════════════════════
//  DISCORD WEBHOOK
// ═══════════════════════════════════════
async function sendWebhook(content, embed) {
  const url = S.webhookUrl;
  if (!url || !url.startsWith('https://discord.com/api/webhooks/')) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, embeds: embed ? [embed] : [] }),
    });
  } catch (e) {
    console.warn('Webhook error:', e);
  }
}

function webhookNewApp(app) {
  const kitNames = (app.kits || [])
    .map(k => { const kit = S.kits.find(x => x.id === k); return kit ? `${kit.i} ${kit.n}` : k; })
    .join(', ');
  sendWebhook(null, {
    title: '📨 Новая заявка на ранг',
    color: 0xff8c00,
    fields: [
      { name: '🎮 Ник', value: app.nick, inline: true },
      { name: '💬 Discord', value: app.discord || 'не указан', inline: true },
      { name: '⚔ Киты', value: kitNames || 'не выбраны', inline: false },
      { name: '💭 Комментарий', value: app.comment || 'нет', inline: false },
    ],
    footer: { text: 'PvPRanks · Тестеры' },
    timestamp: new Date().toISOString(),
  });
}

function webhookStatusChange(app, newStatus) {
  const statusEmoji = { approved:'✅', rejected:'❌', inprogress:'⏳' }[newStatus] || '🔄';
  const statusText  = { approved:'Принято', rejected:'Отклонено', inprogress:'В процессе' }[newStatus] || newStatus;
  sendWebhook(null, {
    title: `${statusEmoji} Заявка обновлена`,
    color: newStatus === 'approved' ? 0x2ed57a : newStatus === 'rejected' ? 0xff3a52 : 0x5865f2,
    fields: [
      { name: '🎮 Ник', value: app.nick, inline: true },
      { name: '📋 Статус', value: statusText, inline: true },
    ],
    footer: { text: 'PvPRanks · Тестеры' },
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
let DB = null;
let USE_LOCAL = false;

const S = {
  players: [], kits: [...KITS_DEF], log: [], apps: [],
  ph: btoa('admin123'), tph: btoa('tester123'),
  srv: 'LT 5-2', webhookUrl: '',
  isAdmin: false, isTester: false,
  selP: null, tf: 'all', appFilter: 'all',
};

// ═══════════════════════════════════════
//  FIREBASE
// ═══════════════════════════════════════
function setSyncStatus(st) {
  const dot = document.getElementById('syncDot');
  if (!dot) return;
  dot.className = 'sync-dot' + (st === 'on' ? '' : st === 'off' ? ' off' : ' sync');
  dot.title = st === 'on' ? 'Подключено' : st === 'off' ? 'Нет связи' : 'Подключение...';
}

function subscribeAll() {
  let _connected = false;
  const _timeout = setTimeout(() => {
    if (!_connected) {
      setSyncStatus('off');
      renderBoard(); renderGrid();
      toast('Нет связи с Firebase. Проверь конфиг.', 'err');
    }
  }, 6000);

  onValue(ref(DB, 'players'), snap => {
    _connected = true; clearTimeout(_timeout);
    const data = snap.val() || {};
    S.players = Object.entries(data).map(([id, v]) => ({ ...v, id }));
    setSyncStatus('on');
    renderBoard(); renderGrid();
    const ap = document.getElementById('pg-admin');
    if (ap && ap.style.display !== 'none') rAL();
  }, e => { clearTimeout(_timeout); setSyncStatus('off'); toast('Firebase: ' + e.message, 'err'); });

  onValue(ref(DB, 'config'), snap => {
    const d = snap.val() || {};
    if (d.kits)       S.kits = d.kits;
    if (d.ph)         S.ph = d.ph;
    if (d.tph)        S.tph = d.tph;
    if (d.webhookUrl) S.webhookUrl = d.webhookUrl;
    if (d.srv) {
      S.srv = d.srv;
      const el = document.getElementById('bsub');
      if (el) el.textContent = `Официальный рейтинг сервера ${d.srv} · Нажми на игрока`;
    }
  });

  onValue(ref(DB, 'apps'), snap => {
    const data = snap.val() || {};
    S.apps = Object.entries(data).map(([id, v]) => ({ ...v, id }));
    S.apps.sort((a, b) => b.createdAt - a.createdAt);
    const appList = document.getElementById('appList');
    const tp = document.getElementById('pg-testers');
    if (appList && tp && tp.style.display !== 'none') renderApps();
    const cnt = document.getElementById('appsCount');
    if (cnt) cnt.textContent = S.apps.length;
  });

  onValue(ref(DB, 'log'), snap => {
    const data = snap.val() || {};
    S.log = Object.values(data).sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 100);
    rLog();
  });
}

async function dbSet(path, val) {
  if (USE_LOCAL) { _localSet(path, val); return; }
  await set(ref(DB, path), val);
}
async function dbUpdate(path, val) {
  if (USE_LOCAL) { _localSet(path, val); return; }
  await update(ref(DB, path), val);
}
async function dbPush(path, val) {
  if (USE_LOCAL) { const id = uid(); _localSet(path + '/' + id, { ...val, id }); return id; }
  const r = await push(ref(DB, path), val);
  return r.key;
}
async function dbRemove(path) {
  if (USE_LOCAL) { _localRemove(path); return; }
  await remove(ref(DB, path));
}

function _localSet(path, val) {
  const parts = path.split('/');
  if (parts[0] === 'players' && parts[1]) {
    const idx = S.players.findIndex(p => p.id === parts[1]);
    if (idx >= 0) S.players[idx] = val; else S.players.push(val);
  } else if (parts[0] === 'config' && parts[1]) {
    S[parts[1]] = val;
  } else if (parts[0] === 'apps' && parts[1]) {
    const idx = S.apps.findIndex(a => a.id === parts[1]);
    if (idx >= 0) S.apps[idx] = { ...S.apps[idx], ...val }; else S.apps.push(val);
  }
  _localSave();
  renderBoard(); renderGrid(); rLog();
}
function _localRemove(path) {
  const parts = path.split('/');
  if (parts[0] === 'players') S.players = S.players.filter(p => p.id !== parts[1]);
  if (parts[0] === 'apps')    S.apps    = S.apps.filter(a => a.id !== parts[1]);
  _localSave();
  renderBoard(); renderGrid();
}
function _localLoad() {
  S.players    = LSg('pvr_p') || [];
  S.kits       = LSg('pvr_k') || [...KITS_DEF];
  S.ph         = LSg('pvr_ph') || btoa('admin123');
  S.tph        = LSg('pvr_th') || btoa('tester123');
  S.srv        = LSg('pvr_s') || 'LT 5-2';
  S.apps       = LSg('pvr_apps') || [];
  S.log        = LSg('pvr_l') || [];
  S.webhookUrl = LSg('pvr_wh') || '';
}
function _localSave() {
  LSs('pvr_p', S.players); LSs('pvr_k', S.kits);
  LSs('pvr_ph', S.ph);     LSs('pvr_th', S.tph);
  LSs('pvr_s', S.srv);     LSs('pvr_apps', S.apps);
  LSs('pvr_l', S.log);     LSs('pvr_wh', S.webhookUrl);
}

function addLog(m) {
  const entry = { t: new Date().toLocaleTimeString(), m, ts: Date.now() };
  if (USE_LOCAL) { S.log.unshift(entry); _localSave(); rLog(); return; }
  push(ref(DB, 'log'), entry);
}

// ═══════════════════════════════════════
//  INIT
// ═══════════════════════════════════════
let _launched = false;
function launchApp() {
  if (_launched) return;
  _launched = true;
  if (USE_LOCAL) setSyncStatus('off');
  // pre-warm badge cache
  const SIZES = [20, 26, 44, 46];
  TIERS.forEach(t => SIZES.forEach(s => buildBadge(t.id, s)));
  goBoard();
  const sub = document.getElementById('bsub');
  if (sub) sub.textContent = `Официальный рейтинг сервера ${S.srv} · Нажми на игрока`;
}


function _startFirebase(cfg) {
  setSyncStatus('sync');
  try {
    const app = initializeApp(cfg);
    DB = getDatabase(app);
    launchApp();
    subscribeAll();
  } catch (e) {
    setSyncStatus('off');
    launchApp();
    toast('Ошибка Firebase: ' + e.message, 'err');
  }
}

// ═══════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════
function showPage(id) {
  ['pg-board','pg-profile','pg-testers','pg-admin']
    .forEach(p => { const el = document.getElementById(p); if (el) el.style.display = 'none'; });
  const target = document.getElementById(id);
  if (target) target.style.display = '';
}
function setTab(t) {
  document.querySelectorAll('.ntab,.bnb').forEach(x => x.classList.remove('active'));
  document.getElementById('tb-' + t)?.classList.add('active');
  document.getElementById('bn-' + t)?.classList.add('active');
}

window.goBoard = function () {
  showPage('pg-board'); setTab('board');
  document.getElementById('si').value = '';
  renderBoard(); renderGrid();
};
window.goTesters = function () {
  showPage('pg-testers'); setTab('testers');
  renderTesters();
};
window.reqAdmin = function () {
  if (S.isAdmin) { showPage('pg-admin'); setTab('admin'); rAdmin(); return; }
  document.getElementById('lwTitle').textContent = '🔐 Вход';
  document.getElementById('lwSub').textContent   = 'Панель администратора';
  document.getElementById('lw').style.display    = 'flex';
  document.getElementById('lpass').value         = '';
  document.getElementById('lerr').style.display  = 'none';
  setTimeout(() => document.getElementById('lpass').focus(), 60);
};
window.hideLg = function () { document.getElementById('lw').style.display = 'none'; };
window.doLogin = function () {
  if (btoa(document.getElementById('lpass').value) === S.ph) {
    S.isAdmin = true; S.isTester = true;
    hideLg();
    document.getElementById('alout').style.display = '';
    showPage('pg-admin'); setTab('admin'); rAdmin();
    toast('Добро пожаловать, Admin!');
  } else {
    document.getElementById('lerr').style.display = 'block';
  }
};
window.logout = function () {
  S.isAdmin = false; S.isTester = false;
  document.getElementById('alout').style.display    = 'none';
  document.getElementById('tLogoutBtn').style.display = 'none';
  document.getElementById('tLoginBtn').style.display  = '';
  document.getElementById('appsSection').style.display = 'none';
  goBoard(); toast('Вышли', 'err');
};

// Tester login
window.showTLogin = function () {
  document.getElementById('tLoginCard').style.display = '';
  document.getElementById('tpass').value = '';
  document.getElementById('tlerr').style.display = 'none';
  setTimeout(() => document.getElementById('tpass').focus(), 60);
};
window.hideTLogin = function () { document.getElementById('tLoginCard').style.display = 'none'; };
window.doTLogin = function () {
  if (btoa(document.getElementById('tpass').value) === S.tph) {
    S.isTester = true;
    hideTLogin();
    document.getElementById('tLoginBtn').style.display   = 'none';
    document.getElementById('tLogoutBtn').style.display  = '';
    document.getElementById('appsSection').style.display = '';
    renderApps();
    toast('Вошли как тестер!');
  } else {
    document.getElementById('tlerr').style.display = 'block';
  }
};
window.tLogout = function () {
  if (S.isAdmin) return;
  S.isTester = false;
  document.getElementById('tLogoutBtn').style.display   = 'none';
  document.getElementById('tLoginBtn').style.display    = '';
  document.getElementById('appsSection').style.display  = 'none';
};

// ═══════════════════════════════════════
//  BOARD
// ═══════════════════════════════════════
function renderBoard() { renderStats(); renderFilter(); }

function renderStats() {
  const act = S.players.filter(p => p.status !== 'banned').length;
  const rnk = S.players.filter(p => bestTier(p) !== 'UNRANKED').length;
  document.getElementById('srow').innerHTML = [
    [S.players.length,'Игроков'],[act,'Активных'],[rnk,'С рангом'],[S.kits.length,'Китов']
  ].map(([v,l]) => `<div class="sc"><div class="sv">${v}</div><div class="sl">${l}</div></div>`).join('');
}

function renderFilter() {
  const cnt = {};
  TIERS.forEach(t => cnt[t.id] = 0);
  S.players.forEach(p => { const b = bestTier(p); cnt[b] = (cnt[b] || 0) + 1; });
  const used = TIERS.filter(t => cnt[t.id] > 0);
  let h = `<button class="fc${S.tf==='all'?' active':''}" onclick="setF('all')">Все (${S.players.length})</button>`;
  used.forEach(t => { h += `<button class="fc${S.tf===t.id?' active':''}" onclick="setF('${t.id}')">${t.l} (${cnt[t.id]})</button>`; });
  document.getElementById('frow').innerHTML = h;
}
window.setF = function (id) { S.tf = id; renderFilter(); renderGrid(); };

let _gt = null;
window.renderGrid = function () { if (_gt) clearTimeout(_gt); _gt = setTimeout(_doGrid, 70); };

function _doGrid() {
  const g = document.getElementById('pgrid');
  const q = document.getElementById('si').value.toLowerCase().trim();
  const ord = TIERS.map(t => t.id);
  let ps = [...S.players];
  if (q)        ps = ps.filter(p => p.nick.toLowerCase().includes(q));
  if (S.tf !== 'all') ps = ps.filter(p => bestTier(p) === S.tf);
  ps.sort((a, b) => ord.indexOf(bestTier(a)) - ord.indexOf(bestTier(b)));

  if (!ps.length) {
    const isOff  = document.getElementById('syncDot')?.classList.contains('off');
    const isSync = document.getElementById('syncDot')?.classList.contains('sync');
    let ico='👥', et='Нет игроков', es='Добавьте через панель администратора', extra='';
    if (q)              { ico='🔍'; et='Не найдено'; es='Попробуй другой запрос'; }
    else if (isSync)    { ico='⏳'; et='Загрузка...'; es='Подключаемся к Firebase'; }
    else if (isOff && !USE_LOCAL) {
      ico='📡'; et='Нет связи с Firebase'; es='Проверь правила базы данных (Rules → .read/.write: true)';
    }
    g.innerHTML = `<div class="empty"><span class="ei">${ico}</span><div class="et">${et}</div><div class="es">${es}</div>${extra}</div>`;
    return;
  }

  // Build global rank map (position across ALL players, not just filtered)
  const allSorted = [...S.players]
    .filter(p => p.status !== 'banned')
    .sort((a, b) => ord.indexOf(bestTier(a)) - ord.indexOf(bestTier(b)));
  const rankMap = {};
  allSorted.forEach((p, i) => { rankMap[p.id] = i + 1; });

  g.innerHTML = ps.map((p, i) => {
    const bt = bestTier(p), info = ti(bt);
    const sc = p.status === 'banned' ? 'banned' : p.status === 'retired' ? 'retired' : '';
    const rank = rankMap[p.id];
    const rankLabel = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank ? `#${rank}` : '';
    const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : rank === 3 ? 'rank-bronze' : 'rank-num';
    const tags = [];
    if (p.isAdmin)           tags.push(`<span class="tag t-a">ADMIN</span>`);
    if (p.isTester)          tags.push(`<span class="tag t-t">TESTER</span>`);
    if (p.verified)          tags.push(`<span class="tag t-v">✓</span>`);
    if (p.status==='retired')tags.push(`<span class="tag t-r">ret</span>`);
    if (p.status==='banned') tags.push(`<span class="tag t-b">ban</span>`);
    const d = i < 12 ? `animation-delay:${i*.027}s` : 'animation:none';
    return `<div class="pcard ${sc}" onclick="openProfile('${p.id}')" style="${d}">
      <div class="pcard-strip" style="background:${info.acc}"></div>
      ${rank ? `<div class="pcard-rank ${rankClass}">${rankLabel}</div>` : ''}
      <div class="pcard-ava">
        <img src="${ava(p.nick)}" width="56" height="56" loading="lazy" decoding="async"
          onerror="this.parentNode.innerHTML='<div class=fb>${esc((p.nick||'?')[0]).toUpperCase()}</div>'">
      </div>
      <div class="pn">${esc(p.nick)}</div>
      <div class="pcard-badge">${buildBadge(bt, 44)}</div>
      ${tags.length ? `<div class="tags">${tags.join('')}</div>` : ''}
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════
//  PROFILE
// ═══════════════════════════════════════
window.openProfile = function (id) {
  const p = S.players.find(x => x.id === id); if (!p) return;
  showPage('pg-profile'); setTab('board');
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Compute global rank
  const ord = TIERS.map(t => t.id);
  const allSorted = [...S.players]
    .filter(x => x.status !== 'banned')
    .sort((a, b) => ord.indexOf(bestTier(a)) - ord.indexOf(bestTier(b)));
  const globalRank = allSorted.findIndex(x => x.id === id) + 1;
  const rankEmoji = globalRank === 1 ? '🥇' : globalRank === 2 ? '🥈' : globalRank === 3 ? '🥉' : null;

  // Compute per-kit rank
  const kitRankMap = {};
  S.kits.forEach(k => {
    const sorted = [...S.players]
      .filter(x => x.status !== 'banned' && pt(x, k.id) !== 'UNRANKED')
      .sort((a, b) => ord.indexOf(pt(a, k.id)) - ord.indexOf(pt(b, k.id)));
    const pos = sorted.findIndex(x => x.id === id);
    kitRankMap[k.id] = pos >= 0 ? pos + 1 : null;
  });

  const tags = [];
  if (p.isAdmin)           tags.push(`<span class="tag t-a">ADMIN</span>`);
  if (p.isTester)          tags.push(`<span class="tag t-t">TESTER</span>`);
  if (p.verified)          tags.push(`<span class="tag t-v">✓ verified</span>`);
  if (p.status==='retired')tags.push(`<span class="tag t-r">retired</span>`);
  if (p.status==='banned') tags.push(`<span class="tag t-b">banned</span>`);
  const meta = [];
  if (p.discord) meta.push('Discord: ' + esc(p.discord));
  if (p.uuid)    meta.push('UUID: ' + esc(p.uuid).slice(0, 14) + '...');

  // Global rank display
  const rankDisp = rankEmoji
    ? `<span class="profile-rank-big">${rankEmoji}</span>`
    : globalRank
      ? `<span class="profile-rank-num">#${globalRank}</span>`
      : '';

  document.getElementById('ph').innerHTML = `
    <div class="phero-in">
      <div class="pava-lg">
        <img src="${ava(p.nick)}" width="72" height="72" loading="eager" decoding="async"
          onerror="this.parentNode.innerHTML='<div class=fb>${esc((p.nick||'?')[0]).toUpperCase()}</div>'">
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <div class="pname">${esc(p.nick)}</div>
          ${rankDisp}
        </div>
        <div class="ptags">${tags.join('') || '<span style="color:var(--text3);font-size:13px">Активный</span>'}</div>
        ${globalRank ? `<div class="profile-rank-line">Место в общем рейтинге: <b>#${globalRank}</b> из ${S.players.filter(x=>x.status!=='banned').length}</div>` : ''}
      </div>
    </div>
    ${meta.length ? `<div class="pmeta">${meta.join(' · ')}</div>` : ''}`;

  document.getElementById('kg').innerHTML = S.kits.map((k, i) => {
    const t = pt(p, k.id);
    const kr = kitRankMap[k.id];
    const krDisp = kr === 1 ? '🥇' : kr === 2 ? '🥈' : kr === 3 ? '🥉' : kr ? `#${kr}` : null;
    const d = i < 8 ? `animation-delay:${i*.03}s` : 'animation:none';
    return `<div class="kcard" style="${d}">
      <div class="kcard-ico">${kitIcon(k)}</div>
      <div class="kcard-badge">${buildBadge(t, 46)}</div>
      <div class="kcard-name">${k.n}</div>
      ${krDisp ? `<div class="kcard-rank">${krDisp}</div>` : ''}
    </div>`;
  }).join('');
};

// ═══════════════════════════════════════
//  TESTERS PAGE
// ═══════════════════════════════════════
function renderTesters() {
  // Kit checkboxes
  document.getElementById('apKitChecks').innerHTML = S.kits.map(k =>
    `<label class="kit-check">
      <input type="checkbox" name="apkit" value="${k.id}">
      <span class="kit-svg">${kitIcon(k)}</span>
      <span>${k.n}</span>
    </label>`
  ).join('');

  // Show apps section if tester/admin
  if (S.isTester || S.isAdmin) {
    document.getElementById('appsSection').style.display  = '';
    document.getElementById('tLoginBtn').style.display    = 'none';
    document.getElementById('tLogoutBtn').style.display   = '';
    renderApps();
  } else {
    document.getElementById('appsSection').style.display = 'none';
    document.getElementById('tLoginBtn').style.display   = '';
    document.getElementById('tLogoutBtn').style.display  = 'none';
  }

  // Tester list (always visible)
  const testers = S.players.filter(p => p.isTester || p.isAdmin);
  document.getElementById('testerCount').textContent = testers.length;
  if (!testers.length) {
    document.getElementById('testerList').innerHTML =
      `<div style="text-align:center;padding:28px;color:var(--text3);font-size:13px">Нет тестеров — назначьте в панели</div>`;
    return;
  }
  const appsDone = id => S.apps.filter(a => a.testerId === id && a.status === 'approved').length;
  document.getElementById('testerList').innerHTML = testers.map(p => `
    <div class="tester-card">
      <div class="tester-ava">
        <img src="${ava(p.nick)}" width="40" height="40" loading="lazy" style="border-radius:50%;object-fit:cover;display:block"
          onerror="this.parentNode.innerHTML='<div class=fb>${esc((p.nick||'?')[0]).toUpperCase()}</div>'">
      </div>
      <div>
        <div class="tester-name">${esc(p.nick)}</div>
        <div class="tester-stats">Проверок: ${appsDone(p.id)} · ${p.isAdmin ? 'Администратор' : 'Тестер'}</div>
      </div>
      <div class="tester-badge">${p.isAdmin ? 'ADMIN' : 'TESTER'}</div>
    </div>`).join('');
}

function renderApps() {
  const all  = S.apps;
  const cnts = {
    all:        all.length,
    pending:    all.filter(a => a.status === 'pending').length,
    inprogress: all.filter(a => a.status === 'inprogress').length,
    approved:   all.filter(a => a.status === 'approved').length,
    rejected:   all.filter(a => a.status === 'rejected').length,
  };
  document.getElementById('appsCount').textContent = all.length;
  document.getElementById('appFilterRow').innerHTML =
    [['all','Все'],['pending','Ожидают'],['inprogress','В процессе'],['approved','Принятые'],['rejected','Отклонённые']]
      .map(([id, lbl]) => `<button class="fc${S.appFilter===id?' active':''}" onclick="setAppF('${id}')">${lbl} (${cnts[id]})</button>`)
      .join('');

  let apps = [...all];
  if (S.appFilter !== 'all') apps = apps.filter(a => a.status === S.appFilter);

  if (!apps.length) {
    document.getElementById('appList').innerHTML =
      `<div style="text-align:center;padding:28px;color:var(--text3);font-size:13px">Заявок нет</div>`;
    return;
  }

  document.getElementById('appList').innerHTML = apps.map((a, i) => {
    const stCls = { pending:'st-pending', approved:'st-approved', rejected:'st-rejected', inprogress:'st-inprogress' }[a.status] || 'st-pending';
    const stLbl = { pending:'Ожидает', approved:'Принято', rejected:'Отклонено', inprogress:'В процессе' }[a.status] || 'Ожидает';
    const date  = new Date(a.createdAt).toLocaleDateString('ru', { day:'2-digit', month:'2-digit' });
    const kitList = (a.kits || []).map(k => {
      const kit = S.kits.find(x => x.id === k);
      return kit ? `<span class="app-kit">${kit.i} ${kit.n}</span>` : '';
    }).join('');

    const actions = [];
    if (S.isTester || S.isAdmin) {
      if (a.status === 'pending')
        actions.push(`<button class="btn bor bsm" onclick="setAppStatus('${a.id}','inprogress')">▶ Взять</button>`);
      if (a.status === 'inprogress')
        actions.push(`<button class="btn bgn bsm" onclick="setAppStatus('${a.id}','approved')">✓ Принять</button>`);
      if (a.status !== 'rejected' && a.status !== 'approved')
        actions.push(`<button class="btn bd bsm" onclick="setAppStatus('${a.id}','rejected')">✗ Отклонить</button>`);
      if (S.isAdmin)
        actions.push(`<button class="btn bg2 bsm" onclick="delApp('${a.id}')">🗑</button>`);
      if (a.status === 'inprogress')
        actions.push(`
          <input class="fi" type="text" placeholder="Заметка тестера..." id="note_${a.id}"
            style="flex:1;min-width:100px;font-size:12px;padding:5px 10px;border-radius:10px"
            value="${esc(a.testerNote||'')}"
            onkeydown="if(event.key==='Enter')saveNote('${a.id}')">
          <button class="btn bg2 bsm" onclick="saveNote('${a.id}')">💾</button>`);
    }

    return `<div class="app-card ${a.status}" style="animation-delay:${i*.03}s">
      <div class="app-top">
        <div class="app-ava">
          <img src="${ava(a.nick)}" width="34" height="34" loading="lazy" style="border-radius:50%;object-fit:cover;display:block"
            onerror="this.parentNode.innerHTML='<div class=fb style=font-size:13px>${esc((a.nick||'?')[0]).toUpperCase()}</div>'">
        </div>
        <div>
          <div class="app-name">${esc(a.nick)}</div>
          ${a.discord ? `<div style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace">${esc(a.discord)}</div>` : ''}
        </div>
        <span class="app-status ${stCls}">${stLbl}</span>
        <div class="app-date">${date}</div>
      </div>
      ${kitList ? `<div class="app-kits">${kitList}</div>` : ''}
      ${a.comment ? `<div class="app-comment">"${esc(a.comment)}"</div>` : ''}
      ${a.testerNote ? `<div class="app-note">📝 ${esc(a.testerNote)}</div>` : ''}
      ${actions.length ? `<div class="app-actions">${actions.join('')}</div>` : ''}
    </div>`;
  }).join('');
}

window.setAppF = function (id) { S.appFilter = id; renderApps(); };

window.setAppStatus = async function (id, status) {
  const a = S.apps.find(x => x.id === id); if (!a) return;
  const upd = { status };
  if (status === 'inprogress') {
    const tester = S.players.find(p => p.isAdmin || p.isTester);
    upd.testerId = tester?.id || null;
  }
  await dbUpdate('apps/' + id, upd);
  // Merge locally so webhook gets updated data
  Object.assign(a, upd);
  webhookStatusChange(a, status);
  addLog(`Заявка ${a.nick}: ${status}`);
  toast('Статус обновлён');
};

window.saveNote = async function (id) {
  const inp = document.getElementById('note_' + id); if (!inp) return;
  await dbUpdate('apps/' + id, { testerNote: inp.value.trim() });
  toast('Заметка сохранена');
};

window.delApp = async function (id) {
  if (!confirm('Удалить заявку?')) return;
  await dbRemove('apps/' + id);
  toast('Удалено', 'err');
};

window.submitApp = async function () {
  const nick    = document.getElementById('apNick').value.trim();
  const discord = document.getElementById('apDis').value.trim();
  if (!nick) { toast('Введи ник', 'err'); return; }
  const kits = [...document.querySelectorAll('input[name="apkit"]:checked')].map(x => x.value);
  if (!kits.length) { toast('Выбери хотя бы 1 кит', 'err'); return; }
  const comment = document.getElementById('apComment').value.trim();
  const app = { nick, discord, kits, comment, status: 'pending', createdAt: Date.now(), testerNote: '' };
  await dbPush('apps', app);
  document.getElementById('apNick').value    = '';
  document.getElementById('apDis').value     = '';
  document.getElementById('apComment').value = '';
  document.querySelectorAll('input[name="apkit"]').forEach(x => x.checked = false);
  addLog('Новая заявка: ' + nick);
  webhookNewApp(app);
  toast('Заявка отправлена! ✓');
};

// ═══════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════
function rAdmin() {
  rAL(); rKRF(); rKML(); rLog();
  document.getElementById('srvn').value      = S.srv;
  document.getElementById('tpwd').value      = atob(S.tph);
  document.getElementById('webhookUrl').value = S.webhookUrl || '';
}

window.rAL = function () {
  const q  = document.getElementById('as').value.toLowerCase();
  const el = document.getElementById('apl');
  let ps = S.players;
  if (q) ps = ps.filter(p => p.nick.toLowerCase().includes(q));
  if (!ps.length) { el.innerHTML = `<div style="font-size:13px;color:var(--text3);padding:10px 0">Нет игроков</div>`; return; }
  el.innerHTML = ps.map(p => {
    const bt = bestTier(p), sel = S.selP === p.id;
    return `<div class="aprow${sel?' sel':''}" onclick="selAP('${p.id}')">
      <div style="width:28px;height:28px;border-radius:50%;overflow:hidden;flex-shrink:0">
        <img src="${ava(p.nick)}" width="28" height="28" loading="lazy" style="border-radius:50%;object-fit:cover;display:block" onerror="this.style.display='none'">
      </div>
      <div style="flex:1;min-width:0">
        <div class="apn">${esc(p.nick)}</div>
        <div class="api">${p.isAdmin?'admin ':p.isTester?'tester ':''+(p.status||'active')}</div>
      </div>
      <div style="flex-shrink:0">${buildBadge(bt, 24)}</div>
    </div>`;
  }).join('');
};

window.selAP = function (id) {
  S.selP = id;
  const p = S.players.find(x => x.id === id); if (!p) return;
  document.getElementById('fId').value   = id;
  document.getElementById('fNick').value = p.nick  || '';
  document.getElementById('fUUID').value = p.uuid  || '';
  document.getElementById('fDis').value  = p.discord || '';
  document.getElementById('fSt').value   = p.status || 'active';
  document.getElementById('fVer').checked = !!p.verified;
  document.getElementById('fAdm').checked = !!p.isAdmin;
  document.getElementById('fTst').checked = !!p.isTester;
  document.getElementById('ft').textContent = 'Редактировать: ' + p.nick;
  document.getElementById('delbtn').style.display = '';
  rKRF(p); window.rAL();
};

function rKRF(player) {
  document.getElementById('krf').innerHTML = S.kits.map(k => {
    const cur = player ? pt(player, k.id) : 'UNRANKED';
    return `<div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:4px;display:flex;align-items:center;gap:4px;font-family:'JetBrains Mono',monospace">
        <span id="kpv_${k.id}">${buildBadge(cur, 20)}</span>${k.i} ${k.n}
      </div>
      <select class="fsel" id="kit_${k.id}" style="font-size:12px;padding:7px 10px"
        onchange="document.getElementById('kpv_${k.id}').innerHTML=buildBadge(this.value,20)">
        ${TIERS.map(t => `<option value="${t.id}"${cur===t.id?' selected':''}>${t.l} — ${t.n}</option>`).join('')}
      </select>
    </div>`;
  }).join('');
}

window.clrF = function () {
  S.selP = null;
  ['fId','fNick','fUUID','fDis'].forEach(i => document.getElementById(i).value = '');
  document.getElementById('fSt').value   = 'active';
  document.getElementById('fVer').checked = false;
  document.getElementById('fAdm').checked = false;
  document.getElementById('fTst').checked = false;
  document.getElementById('ft').textContent       = 'Добавить игрока';
  document.getElementById('delbtn').style.display = 'none';
  rKRF(); window.rAL();
};

window.saveP = async function () {
  const nick = document.getElementById('fNick').value.trim();
  if (!nick) { toast('Введите ник', 'err'); return; }
  const id = document.getElementById('fId').value || uid();
  const kits = {};
  S.kits.forEach(k => { const el = document.getElementById('kit_' + k.id); if (el) kits[k.id] = el.value; });
  const p = {
    id, nick,
    uuid:     document.getElementById('fUUID').value.trim(),
    discord:  document.getElementById('fDis').value.trim(),
    status:   document.getElementById('fSt').value,
    verified: document.getElementById('fVer').checked,
    isAdmin:  document.getElementById('fAdm').checked,
    isTester: document.getElementById('fTst').checked,
    kits, updatedAt: Date.now(),
  };
  const isNew = !S.players.find(x => x.id === id);
  await dbSet('players/' + id, p);
  addLog((isNew ? 'Добавлен: ' : 'Обновлён: ') + nick);
  toast('Сохранено ✓');
  clrF();
};

window.delP = async function () {
  const id = document.getElementById('fId').value; if (!id) return;
  const p = S.players.find(x => x.id === id);
  if (!confirm('Удалить ' + p?.nick + '?')) return;
  await dbRemove('players/' + id);
  addLog('Удалён: ' + p?.nick);
  toast('Удалён', 'err');
  clrF();
};

window.addKit = async function () {
  const n   = document.getElementById('nkn').value.trim();
  const ico = document.getElementById('nki').value.trim() || '⚔';
  if (!n) { toast('Введите название', 'err'); return; }
  const id = n.toLowerCase().replace(/\s+/g, '_');
  if (S.kits.find(k => k.id === id)) { toast('Уже есть', 'err'); return; }
  const newKits = [...S.kits, { id, n, i: ico }];
  await dbSet('config/kits', newKits);
  if (USE_LOCAL) { S.kits = newKits; _localSave(); }
  document.getElementById('nkn').value = '';
  document.getElementById('nki').value = '';
  toast('Кит добавлен');
  rKML();
};

window.removeKit = async function (id) {
  if (S.kits.length <= 1) { toast('Минимум 1', 'err'); return; }
  if (!confirm('Удалить?')) return;
  const newKits = S.kits.filter(k => k.id !== id);
  await dbSet('config/kits', newKits);
  if (USE_LOCAL) { S.kits = newKits; _localSave(); }
  toast('Удалён', 'err');
  rKML();
};

function rKML() {
  document.getElementById('kml').innerHTML = S.kits.map(k =>
    `<span class="kml-chip">${k.i} ${k.n}
      <span class="kml-chip-x" onclick="removeKit('${k.id}')">✕</span>
    </span>`).join('');
}

function rLog() {
  const el = document.getElementById('lgl'); if (!el) return;
  if (!S.log.length) { el.innerHTML = `<div style="font-size:12px;color:var(--text3);padding:6px 0">Пусто</div>`; return; }
  el.innerHTML = S.log.slice(0, 50).map(l =>
    `<div class="le"><span class="lt2">[${l.t}]</span><span class="la"> › </span><span>${esc(l.m)}</span></div>`
  ).join('');
}

window.chPass = async function () {
  const p1 = document.getElementById('np1').value;
  const p2 = document.getElementById('np2').value;
  if (!p1) { toast('Введите пароль', 'err'); return; }
  if (p1 !== p2) { toast('Не совпадают', 'err'); return; }
  S.ph = btoa(p1);
  await dbSet('config/ph', S.ph);
  if (USE_LOCAL) _localSave();
  document.getElementById('np1').value = '';
  document.getElementById('np2').value = '';
  toast('Пароль изменён ✓');
};

window.saveSet = async function () {
  const n   = document.getElementById('srvn').value.trim();
  const tp  = document.getElementById('tpwd').value.trim();
  const wh  = document.getElementById('webhookUrl').value.trim();
  if (!n) { toast('Введите название', 'err'); return; }
  S.webhookUrl = wh;
  await dbSet('config/srv', n);
  if (tp) await dbSet('config/tph', btoa(tp));
  await dbSet('config/webhookUrl', wh);
  if (USE_LOCAL) { S.srv = n; if (tp) S.tph = btoa(tp); _localSave(); }
  const sub = document.getElementById('bsub');
  if (sub) sub.textContent = `Официальный рейтинг сервера ${n} · Нажми на игрока`;
  toast('Сохранено ✓');
};


// ═══════════════════════════════════════
//  🔥 FIREBASE CONFIG — ВСТАВЬ СВОИ ДАННЫЕ
// ═══════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:      'AIzaSyD9rFMlMT4B3uaMrfDfW50fy7MxPdxpvqE',
  appId:       '1:703021307281:web:732594c02145bcc71e7630',
  databaseURL: 'https://pvprank-653e8-default-rtdb.europe-west1.firebasedatabase.app',
  projectId:   'pvprank-653e8',
};
// ══════════════════════════════════════

// Запуск
showPage('pg-board'); setTab('board');
_startFirebase(FIREBASE_CONFIG);
