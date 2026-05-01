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

// ── Kit SVG icons — пиксельный стиль Minecraft ──
const KIT_ICONS = {

  // ⚔ SWORD — железный меч пиксельный
  sword: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect x="12" y="0" width="2" height="2" fill="#e8e8e8"/>
    <rect x="10" y="2" width="2" height="2" fill="#c8c8c8"/>
    <rect x="10" y="0" width="2" height="2" fill="#ffffff"/>
    <rect x="8"  y="4" width="2" height="2" fill="#c8c8c8"/>
    <rect x="8"  y="2" width="2" height="2" fill="#e8e8e8"/>
    <rect x="6"  y="6" width="2" height="2" fill="#a8a8a8"/>
    <rect x="6"  y="4" width="2" height="2" fill="#c8c8c8"/>
    <rect x="4"  y="8" width="2" height="2" fill="#888888"/>
    <rect x="4"  y="6" width="2" height="2" fill="#a8a8a8"/>
    <!-- guard -->
    <rect x="4"  y="8" width="4" height="2" fill="#888888"/>
    <rect x="2"  y="8" width="2" height="2" fill="#6a6a6a"/>
    <rect x="6"  y="8" width="4" height="2" fill="#6a6a6a"/>
    <!-- handle -->
    <rect x="4"  y="10" width="2" height="2" fill="#7a5c3a"/>
    <rect x="2"  y="12" width="2" height="2" fill="#5a4228"/>
    <rect x="0"  y="14" width="2" height="2" fill="#7a5c3a"/>
    <!-- shine -->
    <rect x="10" y="0"  width="1" height="1" fill="#ffffff" opacity="0.9"/>
    <rect x="8"  y="2"  width="1" height="1" fill="#ffffff" opacity="0.6"/>
  </svg>`,

  // 🪓 AXE — алмазный топор
  axe: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- handle -->
    <rect x="8"  y="12" width="2" height="2" fill="#5a4228"/>
    <rect x="6"  y="10" width="2" height="2" fill="#7a5c3a"/>
    <rect x="10" y="14" width="2" height="2" fill="#5a4228"/>
    <!-- blade top -->
    <rect x="2"  y="0"  width="8" height="2" fill="#4dd0e1"/>
    <rect x="0"  y="2"  width="2" height="2" fill="#26c6da"/>
    <rect x="2"  y="2"  width="6" height="2" fill="#80deea"/>
    <rect x="8"  y="2"  width="2" height="2" fill="#4dd0e1"/>
    <!-- blade mid -->
    <rect x="0"  y="4"  width="2" height="2" fill="#26c6da"/>
    <rect x="2"  y="4"  width="4" height="2" fill="#4dd0e1"/>
    <rect x="6"  y="4"  width="4" height="2" fill="#80deea"/>
    <!-- blade bot -->
    <rect x="2"  y="6"  width="6" height="2" fill="#4dd0e1"/>
    <rect x="4"  y="8"  width="4" height="2" fill="#26c6da"/>
    <!-- handle cont -->
    <rect x="6"  y="8"  width="2" height="2" fill="#7a5c3a"/>
    <rect x="8"  y="10" width="2" height="2" fill="#5a4228"/>
    <!-- shine -->
    <rect x="2"  y="0"  width="2" height="1" fill="#b2ebf2" opacity="0.8"/>
    <rect x="0"  y="2"  width="1" height="2" fill="#b2ebf2" opacity="0.6"/>
  </svg>`,

  // 💊 NODEBUFF — зелье без дебаффа (стакан с X)
  nodebuff: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- bottle neck -->
    <rect x="6"  y="0"  width="4" height="2" fill="#888888"/>
    <rect x="4"  y="2"  width="8" height="2" fill="#aaaaaa"/>
    <!-- bottle body -->
    <rect x="2"  y="4"  width="12" height="8" fill="#ff4488" opacity="0.85"/>
    <rect x="2"  y="4"  width="12" height="1"  fill="#ff88bb"/>
    <rect x="2"  y="4"  width="1"  height="8"  fill="#ff88bb" opacity="0.6"/>
    <!-- X mark -->
    <rect x="4"  y="6"  width="2" height="2" fill="#ffffff" opacity="0.9"/>
    <rect x="10" y="6"  width="2" height="2" fill="#ffffff" opacity="0.9"/>
    <rect x="6"  y="8"  width="2" height="2" fill="#ffffff" opacity="0.9"/>
    <rect x="8"  y="8"  width="2" height="2" fill="#ffffff" opacity="0.9"/>
    <rect x="4"  y="10" width="2" height="2" fill="#ffffff" opacity="0.9"/>
    <rect x="10" y="10" width="2" height="2" fill="#ffffff" opacity="0.9"/>
    <!-- bottom -->
    <rect x="2"  y="12" width="12" height="2" fill="#cc2266" opacity="0.9"/>
    <rect x="4"  y="14" width="8"  height="2" fill="#aa1144"/>
  </svg>`,

  // 🧪 POT — зелье (splash potion красный)
  pot: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- neck -->
    <rect x="6"  y="0"  width="4" height="1" fill="#777777"/>
    <rect x="5"  y="1"  width="6" height="2" fill="#999999"/>
    <!-- body -->
    <rect x="3"  y="3"  width="10" height="9" fill="#cc3333" opacity="0.9"/>
    <rect x="2"  y="5"  width="12" height="5" fill="#dd4444" opacity="0.9"/>
    <!-- shine -->
    <rect x="3"  y="3"  width="4"  height="1" fill="#ee8888" opacity="0.8"/>
    <rect x="3"  y="3"  width="1"  height="5" fill="#ee8888" opacity="0.5"/>
    <!-- bottom -->
    <rect x="3"  y="12" width="10" height="2" fill="#aa2222"/>
    <rect x="5"  y="14" width="6"  height="2" fill="#881111"/>
    <!-- splash drops -->
    <rect x="0"  y="7"  width="2" height="2" fill="#cc3333" opacity="0.7"/>
    <rect x="14" y="6"  width="2" height="2" fill="#cc3333" opacity="0.6"/>
    <rect x="1"  y="12" width="2" height="2" fill="#cc3333" opacity="0.5"/>
    <rect x="13" y="11" width="2" height="2" fill="#cc3333" opacity="0.5"/>
  </svg>`,

  // 🏆 UHC — золотое яблоко
  uhc: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- glow border -->
    <rect x="2"  y="1"  width="12" height="14" fill="#ffaa00" opacity="0.25"/>
    <!-- apple body -->
    <rect x="3"  y="2"  width="10" height="12" fill="#ff4444"/>
    <rect x="2"  y="4"  width="12" height="8"  fill="#ff5555"/>
    <!-- shine -->
    <rect x="4"  y="3"  width="4"  height="2"  fill="#ff8888" opacity="0.8"/>
    <rect x="4"  y="3"  width="1"  height="4"  fill="#ff8888" opacity="0.5"/>
    <!-- stem -->
    <rect x="7"  y="0"  width="2" height="3" fill="#5a8a30"/>
    <rect x="9"  y="1"  width="2" height="2" fill="#4a7a20"/>
    <!-- leaf -->
    <rect x="9"  y="0"  width="4" height="2" fill="#5a8a30"/>
    <!-- gold trim -->
    <rect x="2"  y="4"  width="12" height="1" fill="#ffcc00" opacity="0.8"/>
    <rect x="2"  y="11" width="12" height="1" fill="#ffcc00" opacity="0.8"/>
    <rect x="2"  y="4"  width="1"  height="8" fill="#ffcc00" opacity="0.8"/>
    <rect x="13" y="4"  width="1"  height="8" fill="#ffcc00" opacity="0.8"/>
  </svg>`,

  // 🪄 STICKFIGHT — деревянная палка с искрами
  stickfight: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- stick -->
    <rect x="12" y="0"  width="2" height="2" fill="#c8a060"/>
    <rect x="10" y="2"  width="2" height="2" fill="#b89050"/>
    <rect x="8"  y="4"  width="2" height="2" fill="#c8a060"/>
    <rect x="6"  y="6"  width="2" height="2" fill="#b89050"/>
    <rect x="4"  y="8"  width="2" height="2" fill="#c8a060"/>
    <rect x="2"  y="10" width="2" height="2" fill="#b89050"/>
    <rect x="0"  y="12" width="2" height="2" fill="#c8a060"/>
    <!-- enchant sparkles -->
    <rect x="14" y="2"  width="2" height="2" fill="#a855f7"/>
    <rect x="12" y="4"  width="2" height="1" fill="#c084fc"/>
    <rect x="0"  y="0"  width="2" height="2" fill="#7c3aed" opacity="0.8"/>
    <rect x="2"  y="2"  width="2" height="1" fill="#a855f7" opacity="0.7"/>
    <rect x="14" y="12" width="2" height="2" fill="#c084fc" opacity="0.6"/>
    <rect x="0"  y="14" width="2" height="2" fill="#7c3aed" opacity="0.5"/>
    <!-- center glow -->
    <rect x="7"  y="7"  width="2" height="2" fill="#e9d5ff" opacity="0.5"/>
  </svg>`,

  // 🍲 SOUP — грибной суп
  soup: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- bowl -->
    <rect x="1"  y="8"  width="14" height="6" fill="#a0522d"/>
    <rect x="0"  y="10" width="16" height="4" fill="#8b4513"/>
    <rect x="2"  y="14" width="12" height="2" fill="#6b3410"/>
    <!-- soup surface -->
    <rect x="1"  y="8"  width="14" height="2" fill="#d2691e"/>
    <rect x="2"  y="7"  width="12" height="2" fill="#cd5c1a"/>
    <!-- mushroom red -->
    <rect x="3"  y="4"  width="4" height="4" fill="#cc2200"/>
    <rect x="2"  y="5"  width="6" height="2" fill="#dd3311"/>
    <rect x="4"  y="3"  width="2" height="2" fill="#cc2200"/>
    <!-- mushroom dots -->
    <rect x="3"  y="4"  width="1" height="1" fill="#ffffff" opacity="0.9"/>
    <rect x="5"  y="5"  width="1" height="1" fill="#ffffff" opacity="0.9"/>
    <!-- mushroom stem -->
    <rect x="4"  y="7"  width="2" height="2" fill="#f5deb3"/>
    <!-- mushroom brown -->
    <rect x="9"  y="5"  width="4" height="3" fill="#8b4513"/>
    <rect x="8"  y="6"  width="6" height="2" fill="#a0522d"/>
    <rect x="10" y="4"  width="2" height="2" fill="#8b4513"/>
    <rect x="10" y="7"  width="2" height="2" fill="#f5deb3"/>
    <!-- steam -->
    <rect x="5"  y="0"  width="1" height="3" fill="#cccccc" opacity="0.4"/>
    <rect x="10" y="1"  width="1" height="3" fill="#cccccc" opacity="0.3"/>
  </svg>`,

  // 🏹 BOW — лук со стрелой
  bow: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- bow stave -->
    <rect x="2"  y="0"  width="2" height="2" fill="#8b6914"/>
    <rect x="1"  y="2"  width="2" height="2" fill="#7a5c10"/>
    <rect x="1"  y="4"  width="2" height="2" fill="#8b6914"/>
    <rect x="1"  y="6"  width="2" height="2" fill="#7a5c10"/>
    <rect x="1"  y="8"  width="2" height="2" fill="#8b6914"/>
    <rect x="1"  y="10" width="2" height="2" fill="#7a5c10"/>
    <rect x="1"  y="12" width="2" height="2" fill="#8b6914"/>
    <rect x="2"  y="14" width="2" height="2" fill="#7a5c10"/>
    <!-- bowstring -->
    <rect x="3"  y="1"  width="1" height="2" fill="#e8e8e8" opacity="0.8"/>
    <rect x="4"  y="3"  width="1" height="2" fill="#e8e8e8" opacity="0.7"/>
    <rect x="5"  y="5"  width="1" height="2" fill="#e8e8e8" opacity="0.7"/>
    <rect x="4"  y="7"  width="1" height="2" fill="#e8e8e8" opacity="0.7"/>
    <rect x="3"  y="9"  width="1" height="2" fill="#e8e8e8" opacity="0.7"/>
    <rect x="3"  y="11" width="1" height="2" fill="#e8e8e8" opacity="0.7"/>
    <rect x="3"  y="13" width="1" height="2" fill="#e8e8e8" opacity="0.8"/>
    <!-- arrow shaft -->
    <rect x="5"  y="7"  width="8" height="2" fill="#c8a060"/>
    <!-- arrowhead -->
    <rect x="13" y="6"  width="2" height="4" fill="#c0c0c0"/>
    <rect x="12" y="7"  width="2" height="2" fill="#e0e0e0"/>
    <!-- fletching -->
    <rect x="4"  y="6"  width="2" height="2" fill="#cc4444"/>
    <rect x="4"  y="9"  width="2" height="2" fill="#cc4444"/>
  </svg>`,

  // 🏗 BUILD UHC — пикруйт + золотое яблоко
  builduhc: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- pickaxe -->
    <rect x="0"  y="2"  width="2" height="2" fill="#80cbc4"/>
    <rect x="2"  y="0"  width="4" height="2" fill="#80cbc4"/>
    <rect x="2"  y="2"  width="2" height="2" fill="#4db6ac"/>
    <rect x="4"  y="2"  width="2" height="4" fill="#80cbc4"/>
    <rect x="4"  y="4"  width="2" height="2" fill="#4db6ac"/>
    <rect x="6"  y="2"  width="2" height="2" fill="#80cbc4"/>
    <!-- handle -->
    <rect x="6"  y="4"  width="2" height="2" fill="#a0785c"/>
    <rect x="8"  y="6"  width="2" height="2" fill="#8b6340"/>
    <rect x="10" y="8"  width="2" height="2" fill="#a0785c"/>
    <rect x="12" y="10" width="2" height="2" fill="#8b6340"/>
    <!-- mini apple -->
    <rect x="10" y="0"  width="6" height="6" fill="#ff5555"/>
    <rect x="10" y="0"  width="6" height="1" fill="#ffcc00" opacity="0.9"/>
    <rect x="10" y="5"  width="6" height="1" fill="#ffcc00" opacity="0.9"/>
    <rect x="12" y="0"  width="2" height="1" fill="#5a8a30"/>
    <rect x="11" y="1"  width="2" height="1" fill="#ff8888" opacity="0.7"/>
  </svg>`,

  // 💥 COMBO — два кулака / кристалл
  combo: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- end crystal top -->
    <rect x="6"  y="0"  width="4" height="2" fill="#ff88ff" opacity="0.9"/>
    <rect x="4"  y="2"  width="8" height="2" fill="#ff66ee" opacity="0.85"/>
    <rect x="2"  y="4"  width="12" height="4" fill="#cc44cc" opacity="0.8"/>
    <rect x="4"  y="8"  width="8" height="2" fill="#ff66ee" opacity="0.85"/>
    <rect x="6"  y="10" width="4" height="2" fill="#ff88ff" opacity="0.9"/>
    <!-- inner glow -->
    <rect x="5"  y="3"  width="6" height="6" fill="#ffffff" opacity="0.15"/>
    <rect x="6"  y="4"  width="4" height="4" fill="#ffccff" opacity="0.3"/>
    <!-- center -->
    <rect x="7"  y="5"  width="2" height="2" fill="#ffffff" opacity="0.8"/>
    <!-- base -->
    <rect x="4"  y="12" width="8" height="2" fill="#555555"/>
    <rect x="2"  y="14" width="12" height="2" fill="#444444"/>
    <!-- shine lines -->
    <rect x="3"  y="4"  width="1" height="4" fill="#ffaaff" opacity="0.5"/>
    <rect x="2"  y="5"  width="1" height="2" fill="#ffaaff" opacity="0.4"/>
  </svg>`,

  // ❄ SPLEEF — снежный шар / лопата
  spleef: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- shovel head -->
    <rect x="5"  y="0"  width="6" height="2" fill="#e0e0e0"/>
    <rect x="4"  y="2"  width="8" height="4" fill="#d0d0d0"/>
    <rect x="4"  y="2"  width="1" height="4" fill="#f0f0f0" opacity="0.8"/>
    <rect x="4"  y="2"  width="8" height="1" fill="#f0f0f0" opacity="0.6"/>
    <rect x="4"  y="5"  width="8" height="1" fill="#b0b0b0"/>
    <!-- handle -->
    <rect x="7"  y="6"  width="2" height="2" fill="#a07840"/>
    <rect x="7"  y="8"  width="2" height="2" fill="#8b6330"/>
    <rect x="7"  y="10" width="2" height="2" fill="#a07840"/>
    <rect x="7"  y="12" width="2" height="2" fill="#8b6330"/>
    <rect x="7"  y="14" width="2" height="2" fill="#a07840"/>
    <!-- snow particles -->
    <rect x="0"  y="0"  width="2" height="2" fill="#aaddff" opacity="0.8"/>
    <rect x="13" y="2"  width="2" height="2" fill="#aaddff" opacity="0.7"/>
    <rect x="1"  y="6"  width="2" height="2" fill="#aaddff" opacity="0.6"/>
    <rect x="13" y="8"  width="2" height="2" fill="#aaddff" opacity="0.5"/>
    <rect x="0"  y="12" width="2" height="2" fill="#aaddff" opacity="0.6"/>
    <rect x="14" y="13" width="2" height="2" fill="#aaddff" opacity="0.5"/>
  </svg>`,

  // 🛏 BEDWARS — кровать
  bedwars: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- frame -->
    <rect x="0"  y="6"  width="2" height="10" fill="#c0392b"/>
    <rect x="14" y="6"  width="2" height="10" fill="#c0392b"/>
    <rect x="0"  y="14" width="16" height="2"  fill="#922b21"/>
    <!-- mattress -->
    <rect x="2"  y="8"  width="12" height="6" fill="#ecf0f1"/>
    <rect x="2"  y="8"  width="12" height="1" fill="#ffffff"/>
    <rect x="2"  y="8"  width="1"  height="6" fill="#ffffff" opacity="0.5"/>
    <!-- pillow -->
    <rect x="3"  y="9"  width="4" height="3" fill="#bdc3c7"/>
    <rect x="3"  y="9"  width="4" height="1" fill="#dde3e5" opacity="0.8"/>
    <!-- blanket -->
    <rect x="7"  y="9"  width="7" height="4" fill="#e74c3c"/>
    <rect x="7"  y="9"  width="7" height="1" fill="#f1948a" opacity="0.7"/>
    <!-- headboard -->
    <rect x="0"  y="4"  width="16" height="4" fill="#c0392b"/>
    <rect x="0"  y="4"  width="16" height="1" fill="#e74c3c"/>
    <rect x="2"  y="5"  width="4"  height="2" fill="#922b21" opacity="0.5"/>
    <rect x="10" y="5"  width="4"  height="2" fill="#922b21" opacity="0.5"/>
    <!-- legs -->
    <rect x="1"  y="14" width="2" height="2" fill="#7b241c"/>
    <rect x="13" y="14" width="2" height="2" fill="#7b241c"/>
  </svg>`,

  // 🔨 MACE — булава (новый кит!)
  mace: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- head top -->
    <rect x="4"  y="0"  width="8" height="2" fill="#b8860b"/>
    <rect x="2"  y="2"  width="12" height="2" fill="#daa520"/>
    <!-- head body -->
    <rect x="1"  y="4"  width="14" height="4" fill="#ffd700"/>
    <rect x="1"  y="4"  width="14" height="1" fill="#ffe55a"/>
    <rect x="1"  y="4"  width="1"  height="4" fill="#ffe55a" opacity="0.6"/>
    <!-- spikes -->
    <rect x="0"  y="3"  width="2" height="2" fill="#b8860b"/>
    <rect x="14" y="3"  width="2" height="2" fill="#b8860b"/>
    <rect x="0"  y="5"  width="2" height="2" fill="#daa520"/>
    <rect x="14" y="5"  width="2" height="2" fill="#daa520"/>
    <rect x="3"  y="0"  width="2" height="2" fill="#b8860b"/>
    <rect x="11" y="0"  width="2" height="2" fill="#b8860b"/>
    <!-- head bottom -->
    <rect x="2"  y="8"  width="12" height="2" fill="#daa520"/>
    <rect x="4"  y="10" width="8" height="2" fill="#b8860b"/>
    <!-- handle -->
    <rect x="6"  y="10" width="4" height="2" fill="#8b6914"/>
    <rect x="6"  y="12" width="4" height="2" fill="#7a5c10"/>
    <rect x="6"  y="14" width="4" height="2" fill="#8b6914"/>
    <!-- pommel -->
    <rect x="5"  y="14" width="6" height="2" fill="#b8860b"/>
    <!-- enchant glow -->
    <rect x="2"  y="5"  width="2" height="2" fill="#c084fc" opacity="0.4"/>
    <rect x="12" y="5"  width="2" height="2" fill="#c084fc" opacity="0.4"/>
    <rect x="7"  y="2"  width="2" height="1" fill="#e9d5ff" opacity="0.5"/>
  </svg>`,
};

function kitIcon(k) {
  const svg = KIT_ICONS[k.id];
  if (!svg) return `<span style="font-size:18px;line-height:1">${k.i}</span>`;
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
  {id:'mace',      n:'Mace',      i:'🔨'},
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
      return kit
        ? `<span class="app-kit">
            <span style="display:inline-flex;width:14px;height:14px;image-rendering:pixelated">${kitIcon(kit)}</span>
            ${kit.n}
           </span>`
        : '';
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
      <div style="font-size:10px;color:var(--text3);margin-bottom:4px;display:flex;align-items:center;gap:5px;font-family:'JetBrains Mono',monospace">
        <span class="kit-icon-sm" id="kpv_${k.id}">${buildBadge(cur, 20)}</span>
        <span class="kit-icon-sm">${kitIcon(k)}</span>
        ${k.n}
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
