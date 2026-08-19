<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arena Battle - Chiến đấu theo lượt</title>
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<style>
:root {
  --bg: #fdf9fb;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #bd3193;
  --accent-soft: rgba(189,49,147,.14);
  --accent2: #0891b2;
  --accent2-soft: rgba(8,145,178,.14);
  --border: rgba(15,23,42,.07);
  --enemy: #dc2626;
  --ally: #2563eb;
  --hp: #16a34a;
  --energy: #f59e0b;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}
.reveal {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp .6s ease forwards;
}
.reveal:nth-child(2) { animation-delay: .1s; }
.reveal:nth-child(3) { animation-delay: .2s; }
.reveal:nth-child(4) { animation-delay: .3s; }
.reveal:nth-child(5) { animation-delay: .4s; }
.reveal:nth-child(6) { animation-delay: .5s; }
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.btn-primary {
  background: var(--accent-soft);
  color: var(--text);
  border: 1px solid var(--accent);
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px var(--accent-soft);
}
.btn-primary:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.btn-secondary {
  background: var(--card);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
}
.btn-secondary:hover:not(:disabled) {
  border-color: var(--accent);
  transform: translateY(-2px);
}
.btn-secondary:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.tab-btn {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-weight: 600;
  font-family: 'Urbanist', sans-serif;
  transition: all .2s;
  font-size: 14px;
}
.tab-btn.active {
  background: var(--accent-soft);
  color: var(--text);
  border-bottom: 2px solid var(--accent);
}
.tab-btn:hover:not(.active) {
  color: var(--text);
}
.hp-bar {
  height: 8px;
  background: rgba(128,128,128,.15);
  border-radius: 4px;
  overflow: hidden;
}
.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--hp), #22c55e);
  transition: width .4s ease;
  border-radius: 4px;
}
.energy-bar {
  height: 5px;
  background: rgba(128,128,128,.15);
  border-radius: 3px;
  overflow: hidden;
}
.energy-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--energy), #fbbf24);
  transition: width .3s ease;
  border-radius: 3px;
}
.char-card {
  border-radius: 14px;
  padding: 12px;
  transition: all .3s;
  position: relative;
  overflow: hidden;
}
.char-card.ally {
  background: linear-gradient(135deg, rgba(37,99,235,.08), rgba(37,99,235,.02));
  border: 2px solid rgba(37,99,235,.3);
}
.char-card.enemy {
  background: linear-gradient(135deg, rgba(220,38,38,.08), rgba(220,38,38,.02));
  border: 2px solid rgba(220,38,38,.3);
}
.char-card.acting {
  animation: pulse .6s ease infinite;
  box-shadow: 0 0 20px var(--accent-soft);
}
.char-card.dead {
  opacity: .35;
  filter: grayscale(1);
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
.damage-popup {
  position: absolute;
  font-weight: 800;
  font-size: 22px;
  animation: floatUp 1s ease forwards;
  pointer-events: none;
  z-index: 10;
  text-shadow: 1px 1px 2px rgba(0,0,0,.3);
}
.damage-popup.dmg { color: #ef4444; }
.damage-popup.heal { color: #22c55e; }
.damage-popup.buff { color: #f59e0b; }
@keyframes floatUp {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-50px); }
}
.stage-node {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  transition: all .25s;
  border: 2px solid var(--border);
  background: var(--card);
  color: var(--muted);
  font-size: 14px;
}
.stage-node.unlocked {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}
.stage-node.unlocked:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px var(--accent-soft);
}
.stage-node.cleared {
  background: linear-gradient(135deg, var(--hp), #22c55e);
  border-color: var(--hp);
  color: white;
}
.stage-node.boss {
  width: 62px;
  height: 62px;
  font-size: 16px;
}
.stage-node.boss.unlocked {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border-color: #dc2626;
  color: white;
}
.stage-line {
  flex: 1;
  height: 3px;
  background: var(--border);
  margin: 0 4px;
  border-radius: 2px;
}
.stage-line.done {
  background: linear-gradient(90deg, var(--hp), #22c55e);
}
.battle-log {
  max-height: 180px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.6;
  padding: 10px;
  background: rgba(128,128,128,.04);
  border-radius: 8px;
}
.battle-log::-webkit-scrollbar { width: 4px; }
.battle-log::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.log-entry { padding: 2px 0; border-bottom: 1px solid var(--border); }
.log-entry:last-child { border-bottom: none; }
.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
}
.type-def { background: rgba(37,99,235,.15); color: #2563eb; }
.type-atk { background: rgba(220,38,38,.15); color: #dc2626; }
.type-skl { background: rgba(139,92,246,.15); color: #7c3aed; }
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.modal-content {
  background: var(--card);
  border-radius: 20px;
  padding: 28px;
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border);
}
.resource-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  font-weight: 600;
  font-size: 13px;
}
.skill-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
  padding: 8px 12px;
  background: rgba(128,128,128,.05);
  border-radius: 8px;
  margin-top: 6px;
}
.level-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
}
.avatar-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}
.avatar-kangu { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
.avatar-mega { background: linear-gradient(135deg, #dc2626, #b91c1c); }
.avatar-jaco { background: linear-gradient(135deg, #7c3aed, #6d28d9); }
.avatar-bot { background: linear-gradient(135deg, #64748b, #475569); }
.daily-item {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  text-align: center;
  transition: all .2s;
}
.daily-item.claimed {
  background: rgba(22,163,74,.08);
  border-color: var(--hp);
}
.daily-item.today {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: 0 0 12px var(--accent-soft);
}
.summon-result {
  animation: summonPop .5s ease;
}
@keyframes summonPop {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(3deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
.status-effect {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  margin: 1px;
}
.effect-stun { background: rgba(234,179,8,.25); color: #b45309; }
.effect-weaken { background: rgba(107,114,128,.25); color: #4b5563; }
.effect-dmgup { background: rgba(220,38,38,.2); color: #dc2626; }
.effect-healup { background: rgba(22,163,74,.2); color: #15803d; }
.effect-double { background: rgba(139,92,246,.2); color: #7c3aed; }
</style>
</head>
<body>
<div id="app"></div>

<script>
// ==================== GAME DATA ====================
const CHARACTERS = {
  kangu: {
    id: 'kangu',
    name: 'Kangu',
    type: 'DEF',
    baseHp: 150000000,
    baseAtk: 2950000,
    baseDef: 6400,
    baseSpd: 145,
    maxEnergy: 4,
    startEnergy: 0,
    basic: { name: 'Đánh thường', desc: 'Gây 85% ATK lên kẻ địch, hồi 1.7 năng lượng', atkPct: 0.85, energyGain: 1.7 },
    ult: { 
      name: 'Tia Năng Lượng', 
      desc: 'Phóng 1 tia năng lượng gây 200% ATK + 5% HP còn lại của địch. Gây hiệu ứng "suy giảm" (giảm 40% hồi phục). Lv150: +30% ATK kỹ năng',
      energyCost: 4,
      atkPct: 2.0,
      hpDmgPct: 0.05,
      applyWeaken: true
    },
    passives: [
      { level: 50, name: 'Bạo Tăng', desc: 'Mỗi 7% HP mất đi, ST gây ra tăng 1%' },
      { level: 80, name: 'Sốc Điện', desc: 'Đánh thường có 10% tỉ lệ choáng địch 1 hiệp' },
      { level: 100, name: 'Tia Song Song', desc: '75% tỉ lệ tung thêm 1 tia năng lượng gây 75% ST tia 1' }
    ]
  },
  mega: {
    id: 'mega',
    name: 'Mega Ner',
    type: 'ATK',
    baseHp: 220000000,
    baseAtk: 3150000,
    baseDef: 1900,
    baseSpd: 150,
    maxEnergy: 5,
    startEnergy: 0,
    basic: { name: 'Tung Nộ', desc: 'Gây ST diện rộng (toàn bộ địch) bằng 95% ATK, hồi 1.4 năng lượng', atkPct: 0.95, energyGain: 1.4, aoe: true },
    ult: {
      name: 'Xung Kích',
      desc: 'Dịch chuyển gây 280% ATK, tăng 15% ST bản thân trong 1 hiệp. Lv150: +8% ST sau đánh thường',
      energyCost: 5,
      atkPct: 2.8,
      selfDmgBuff: 0.15,
      buffDuration: 1
    },
    passives: [
      { level: 50, name: 'Năng Lượng Sẵn', desc: 'Đầu trận nhận sẵn 2 năng lượng' },
      { level: 80, name: 'Song Bích', desc: 'Nhận hiệu ứng "Song bích"' },
      { level: 100, name: 'Cuồng Nộ', desc: 'HP dưới 20%, tăng 10% ST gây ra' }
    ]
  },
  jaco: {
    id: 'jaco',
    name: 'Jaco',
    type: 'SKL',
    baseHp: 190000000,
    baseAtk: 2550000,
    baseDef: 3200,
    baseSpd: 155,
    maxEnergy: 4.5,
    startEnergy: 0,
    basic: { name: 'Đánh thường', desc: 'Gây 88% ATK lên 1 địch, hồi 1.2 năng lượng, đánh dấu "HP" lên đồng đội ít HP nhất (tối đa 3)', atkPct: 0.88, energyGain: 1.2 },
    ult: {
      name: 'Hồi Phục Cường Hóa',
      desc: 'Tung đánh thường cường hóa 105% ATK, hồi máu toàn đội 150% ATK. Lv150: hồi 175% ATK',
      energyCost: 4.5,
      atkPct: 1.05,
      healPct: 1.5,
      healAll: true
    },
    passives: [
      { level: 50, name: 'Tăng Cường Đồng Đội', desc: 'Dùng kỹ năng chủ động, 1 đồng đội ngẫu nhiên tăng 18% ST 1 hiệp' },
      { level: 80, name: 'Chữa Lành Thượng Thừa', desc: 'Đồng đội dưới 50% HP tăng 20% khả năng hồi phục từ Jaco' },
      { level: 100, name: 'Dấu Hiệu HP', desc: 'Đồng đội có 3 dấu "HP" được tăng 10% khả năng hồi phục' }
    ]
  }
};

// Tạo 5 chương, mỗi chương 7 ải
function generateStages() {
  const chapters = [];
  const chapterNames = ['Rừng Đen', 'Địa Ngục Băng Giá', 'Lửa Dị Thế', 'Vực Thẳm Vô Cực', 'Cung Điện Thần'];
  
  for (let c = 0; c < 5; c++) {
    const stages = [];
    for (let s = 0; s < 7; s++) {
      const isBoss = s === 6;
      const difficulty = c * 7 + s + 1;
      const multiplier = 1 + (difficulty - 1) * 0.12 + (isBoss ? 0.35 : 0);
      
      // Chọn bot ngẫu nhiên từ các nhân vật có sẵn
      const charIds = ['kangu', 'mega', 'jaco'];
      const enemies = [];
      for (let e = 0; e < 3; e++) {
        const botChar = charIds[(c + s + e) % 3];
        const base = CHARACTERS[botChar];
        enemies.push({
          charId: botChar,
          name: base.name + (isBoss ? ' BOSS' : ''),
          level: Math.min(250, 30 + difficulty * 6 + (isBoss ? 20 : 0)),
          hpMult: multiplier * (isBoss ? 1.5 : 1),
          atkMult: multiplier * (isBoss ? 1.2 : 1),
          defMult: multiplier * (isBoss ? 1.15 : 1),
          isBoss: isBoss
        });
      }
      
      stages.push({
        id: `${c + 1}-${s + 1}`,
        name: isBoss ? `BOSS ${chapterNames[c]}` : `Ấi ${s + 1}`,
        isBoss: isBoss,
        enemies: enemies,
        rewards: {
          exp: 50 + difficulty * 20 + (isBoss ? 200 : 0),
          gold: 1000 + difficulty * 300 + (isBoss ? 5000 : 0),
          vpnc: 5 + difficulty * 2 + (isBoss ? 30 : 0),
          diamond: isBoss ? 50 : (difficulty % 3 === 0 ? 10 : 0)
        }
      });
    }
    chapters.push({
      id: c + 1,
      name: `Chương ${c + 1}: ${chapterNames[c]}`,
      stages: stages
    });
  }
  return chapters;
}

const CHAPTERS = generateStages();

// ==================== GAME STATE ====================
let gameState = {
  playerLevel: 1,
  playerExp: 0,
  expToNext: 100,
  resources: {
    diamond: 500,
    gold: 50000,
    vpnc: 100,
    vntb: 0,
    ngocThanBi: 10
  },
  characters: {
    kangu: { level: 1, unlocked: true },
    mega: { level: 1, unlocked: true },
    jaco: { level: 1, unlocked: true }
  },
  team: ['kangu', 'mega', 'jaco'], // slot 1: hàng đầu, slot 2: sau, slot 3: bên cạnh
  progress: {
    maxClearedChapter: 0, // 0-indexed
    maxClearedStage: -1   // 0-indexed within chapter
  },
  dailyLogin: {
    lastLoginDate: null,
    currentStreak: 0,
    claimedDays: []
  },
  giftcodesUsed: [],
  summonedCharacters: ['kangu', 'mega', 'jaco']
};

// Load from localStorage
function loadGame() {
  try {
    const saved = localStorage.getItem('arenaBattleSave');
    if (saved) {
      const parsed = JSON.parse(saved);
      gameState = { ...gameState, ...parsed };
      // Ensure all keys exist
      gameState.resources = { ...{ diamond: 500, gold: 50000, vpnc: 100, vntb: 0, ngocThanBi: 10 }, ...parsed.resources };
      gameState.characters = { ...gameState.characters, ...parsed.characters };
    }
  } catch(e) {}
  checkDailyLogin();
}

function saveGame() {
  localStorage.setItem('arenaBattleSave', JSON.stringify(gameState));
}

function checkDailyLogin() {
  const today = new Date().toDateString();
  if (gameState.dailyLogin.lastLoginDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (gameState.dailyLogin.lastLoginDate === yesterday.toDateString()) {
      gameState.dailyLogin.currentStreak = Math.min(7, gameState.dailyLogin.currentStreak + 1);
    } else {
      gameState.dailyLogin.currentStreak = 1;
    }
    gameState.dailyLogin.lastLoginDate = today;
    if (gameState.dailyLogin.claimedDays.length >= 7) {
      gameState.dailyLogin.claimedDays = [];
    }
    saveGame();
  }
}

// ==================== STAT CALCULATIONS ====================
function getStats(charId, level) {
  const base = CHARACTERS[charId];
  const lvMult = 1 + (level - 1) * 0.025; // mỗi cấp tăng 2.5%
  return {
    hp: Math.floor(base.baseHp * lvMult),
    atk: Math.floor(base.baseAtk * lvMult),
    def: Math.floor(base.baseDef * lvMult),
    spd: base.baseSpd + Math.floor((level - 1) * 0.15),
    maxEnergy: base.maxEnergy
  };
}

function calcUpgradeCost(currentLevel) {
  return Math.floor(10 * Math.pow(1.08, currentLevel - 1));
}

function upgradeCharacter(charId) {
  const char = gameState.characters[charId];
  if (!char || char.level >= 250) return { success: false, msg: 'Đã đạt cấp tối đa' };
  const cost = calcUpgradeCost(char.level);
  if (gameState.resources.vpnc < cost) return { success: false, msg: 'VPNC không đủ' };
  
  gameState.resources.vpnc -= cost;
  char.level++;
  saveGame();
  return { success: true, msg: `Nâng cấp thành công lên Lv.${char.level}`, cost: cost };
}

function addExp(amount) {
  gameState.playerExp += amount;
  let leveledUp = false;
  while (gameState.playerExp >= gameState.expToNext && gameState.playerLevel < 150) {
    gameState.playerExp -= gameState.expToNext;
    gameState.playerLevel++;
    gameState.expToNext = Math.floor(100 * Math.pow(1.1, gameState.playerLevel - 1));
    leveledUp = true;
    // Thưởng lên cấp
    gameState.resources.diamond += 20;
    gameState.resources.vpnc += 5;
  }
  if (gameState.playerLevel >= 150) gameState.playerExp = 0;
  saveGame();
  return leveledUp;
}

// ==================== BATTLE SYSTEM ====================
let battleState = null;
let battleInterval = null;

function createBattleInstance(charId, level, isEnemy = false, customMult = null) {
  const base = CHARACTERS[charId];
  const stats = getStats(charId, level);
  let hp = stats.hp, atk = stats.atk, def = stats.def;
  
  if (customMult) {
    hp = Math.floor(hp * customMult.hpMult);
    atk = Math.floor(atk * customMult.atkMult);
    def = Math.floor(def * customMult.defMult);
  }
  
  let startEnergy = base.startEnergy;
  if (level >= 50 && charId === 'mega') startEnergy += 2;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    charId: charId,
    name: base.name,
    type: base.type,
    level: level,
    isEnemy: isEnemy,
    maxHp: hp,
    hp: hp,
    atk: atk,
    def: def,
    spd: stats.spd,
    energy: startEnergy,
    maxEnergy: stats.maxEnergy,
    alive: true,
    effects: [], // { type, duration, value }
    hpMarks: 0, // for Jaco
    ultReady: false,
    baseData: base
  };
}

function calcDamage(attacker, defender, atkPct, bonusFlat = 0) {
  let atk = attacker.atk;
  
  // Kangu passive 1: mỗi 7% HP mất, ST +1%
  if (attacker.charId === 'kangu' && attacker.level >= 50) {
    const hpLostPct = (1 - attacker.hp / attacker.maxHp) * 100;
    atk *= (1 + Math.floor(hpLostPct / 7) * 0.01);
  }
  
  // Mega passive 3: HP dưới 20% +10% ST
  if (attacker.charId === 'mega' && attacker.level >= 100 && attacker.hp / attacker.maxHp < 0.2) {
    atk *= 1.1;
  }
  
  // Buff ST
  const dmgBuff = attacker.effects.filter(e => e.type === 'dmgup').reduce((s, e) => s + e.value, 0);
  atk *= (1 + dmgBuff);
  
  let baseDmg = atk * atkPct + bonusFlat;
  
  // Giảm ST theo DEF: 100 DEF giảm 0.1%
  const defReduction = Math.min(0.85, defender.def * 0.001); // max giảm 85%
  let finalDmg = baseDmg * (1 - defReduction);
  
  return Math.max(1, Math.floor(finalDmg));
}

function applyDamage(target, damage, attacker, battle) {
  target.hp = Math.max(0, target.hp - damage);
  if (target.hp <= 0) {
    target.alive = false;
  }
  battle.log.push(`${attacker.name} gây ${formatNumber(damage)} ST lên ${target.name}${!target.alive ? ' [TIÊU DIỆT]' : ''}`);
  return damage;
}

function applyHeal(target, amount, healer, battle) {
  let healAmount = amount;
  
  // Giảm hồi phục do hiệu ứng suy giảm
  const weaken = target.effects.find(e => e.type === 'weaken');
  if (weaken) healAmount *= (1 - weaken.value);
  
  // Jaco passive 2: đồng đội dưới 50% HP +20% hồi từ Jaco
  if (healer && healer.charId === 'jaco' && healer.level >= 80 && target.hp / target.maxHp < 0.5) {
    healAmount *= 1.2;
  }
  
  // Jaco passive 3: 3 dấu HP +10% hồi
  if (healer && healer.charId === 'jaco' && healer.level >= 100 && target.hpMarks >= 3) {
    healAmount *= 1.1;
  }
  
  healAmount = Math.floor(healAmount);
  const actualHeal = Math.min(healAmount, target.maxHp - target.hp);
  target.hp = Math.min(target.maxHp, target.hp + healAmount);
  if (actualHeal > 0) {
    battle.log.push(`${healer ? healer.name : 'Hệ thống'} hồi ${formatNumber(actualHeal)} HP cho ${target.name}`);
  }
  return actualHeal;
}

function formatNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

function getTarget(attacker, allUnits) {
  // Mọi chiêu không ghi chú đều đánh lên tướng 1 (hàng đầu) của đội đối phương
  const enemies = allUnits.filter(u => u.isEnemy !== attacker.isEnemy && u.alive);
  if (enemies.length === 0) return null;
  
  // Ưu tiên tướng ở vị trí 1 (hàng đầu) - chỉ số dựa vào thứ tự trong mảng đội
  // Đơn giản hóa: chọn người còn sống đầu tiên trong danh sách địch
  return enemies[0];
}

function getLowestHpAlly(attacker, allUnits) {
  const allies = allUnits.filter(u => u.isEnemy === attacker.isEnemy && u.alive && u.id !== attacker.id);
  if (allies.length === 0) return null;
  return allies.reduce((a, b) => (a.hp / a.maxHp) < (b.hp / b.maxHp) ? a : b);
}

function startBattle(stage) {
  const team = gameState.team;
  const allies = team.map((charId, idx) => {
    const inst = createBattleInstance(charId, gameState.characters[charId].level, false);
    inst.slot = idx;
    return inst;
  });
  
  const enemies = stage.enemies.map((e, idx) => {
    const inst = createBattleInstance(e.charId, e.level, true, { hpMult: e.hpMult, atkMult: e.atkMult, defMult: e.defMult });
    inst.slot = idx;
    if (e.isBoss) inst.name = e.name;
    return inst;
  });
  
  const allUnits = [...allies, ...enemies];
  
  // Random đội đi trước
  const allyFirst = Math.random() < 0.5;
  
  battleState = {
    stage: stage,
    allies: allies,
    enemies: enemies,
    allUnits: allUnits,
    turn: 0,
    round: 1,
    allyFirst: allyFirst,
    log: [`Trận đấu bắt đầu! Đội ${allyFirst ? 'của bạn' : 'địch'} đi đầu.`],
    finished: false,
    victory: false,
    actionQueue: [],
    currentActor: null
  };
  
  return battleState;
}

function getActionOrder(battle) {
  const alive = battle.allUnits.filter(u => u.alive);
  // Sắp xếp theo SPD, đội đi trước được ưu tiên nhẹ
  alive.sort((a, b) => {
    const aBonus = (a.isEnemy === !battle.allyFirst) ? 0.5 : 0;
    const bBonus = (b.isEnemy === !battle.allyFirst) ? 0.5 : 0;
    return (b.spd + bBonus) - (a.spd + aBonus);
  });
  return alive;
}

function processEffects(unit, battle) {
  // Giảm duration hiệu ứng
  unit.effects = unit.effects.filter(e => {
    e.duration--;
    return e.duration > 0;
  });
}

function checkStun(unit) {
  return unit.effects.some(e => e.type === 'stun');
}

function performAction(unit, battle) {
  if (!unit.alive) return;
  
  processEffects(unit, battle);
  
  if (checkStun(unit)) {
    battle.log.push(`${unit.name} bị CHOÁNG, bỏ lượt!`);
    return;
  }
  
  const base = unit.baseData;
  let usedUlt = false;
  
  // Kiểm tra dùng kỹ năng chủ động
  if (unit.energy >= base.ult.energyCost) {
    usedUlt = true;
    unit.energy -= base.ult.energyCost;
    performUltimate(unit, battle);
  } else {
    performBasic(unit, battle);
  }
  
  // Kiểm tra kết thúc trận
  const allyAlive = battle.allies.some(u => u.alive);
  const enemyAlive = battle.enemies.some(u => u.alive);
  
  if (!allyAlive || !enemyAlive) {
    battle.finished = true;
    battle.victory = allyAlive;
    battle.log.push(battle.victory ? '=== CHIẾN THẮNG! ===' : '=== THUA BÀI ===');
  }
}

function performBasic(unit, battle) {
  const base = unit.baseData;
  const basic = base.basic;
  
  if (basic.aoe) {
    // Mega Ner: đánh toàn bộ địch
    const targets = battle.allUnits.filter(u => u.isEnemy !== unit.isEnemy && u.alive);
    battle.log.push(`${unit.name} dùng [${basic.name}] - Tấn công diện rộng!`);
    targets.forEach(t => {
      const dmg = calcDamage(unit, t, basic.atkPct);
      applyDamage(t, dmg, unit, battle);
    });
  } else {
    const target = getTarget(unit, battle.allUnits);
    if (target) {
      battle.log.push(`${unit.name} dùng [${basic.name}] tấn công ${target.name}`);
      const dmg = calcDamage(unit, target, basic.atkPct);
      applyDamage(target, dmg, unit, battle);
      
      // Kangu passive 2: 10% choáng
      if (unit.charId === 'kangu' && unit.level >= 80 && Math.random() < 0.1 && target.alive) {
        target.effects.push({ type: 'stun', duration: 1, value: 1 });
        battle.log.push(`${target.name} bị CHOÁNG trong 1 hiệp!`);
      }
      
      // Jaco basic: đánh dấu HP lên đồng đội ít HP nhất
      if (unit.charId === 'jaco') {
        const lowAlly = getLowestHpAlly(unit, battle.allUnits);
        if (lowAlly && lowAlly.hpMarks < 3) {
          lowAlly.hpMarks++;
          battle.log.push(`${lowAlly.name} nhận 1 dấu HP (${lowAlly.hpMarks}/3)`);
        }
      }
      
      // Mega Ner lv150 passive: +8% ST 1 hiệp sau đánh thường
      if (unit.charId === 'mega' && unit.level >= 150) {
        unit.effects.push({ type: 'dmgup', duration: 1, value: 0.08 });
      }
    }
  }
  
  unit.energy = Math.min(unit.maxEnergy, unit.energy + basic.energyGain);
}

function performUltimate(unit, battle) {
  const base = unit.baseData;
  const ult = base.ult;
  
  battle.log.push(`*** ${unit.name} MỞ KỸ NĂNG CHỦ ĐỘNG [${ult.name}] ***`);
  
  if (unit.charId === 'kangu') {
    const target = getTarget(unit, battle.allUnits);
    if (target) {
      let atkPct = ult.atkPct;
      if (unit.level >= 150) atkPct *= 1.3; // +30% ATK
      
      const bonusHpDmg = target.hp * ult.hpDmgPct;
      const dmg = calcDamage(unit, target, atkPct, bonusHpDmg);
      applyDamage(target, dmg, unit, battle);
      
      // Hiệu ứng suy giảm
      if (ult.applyWeaken && target.alive) {
        target.effects.push({ type: 'weaken', duration: 2, value: 0.4 });
        battle.log.push(`${target.name} bị SUY GIẢM hồi phục 40%`);
      }
      
      // Passive 3: 75% thêm 1 tia
      if (unit.level >= 100 && Math.random() < 0.75 && target.alive) {
        const extraDmg = Math.floor(dmg * 0.75);
        applyDamage(target, extraDmg, unit, battle);
        battle.log.push(`Tia phụ thêm! Gây thêm ${formatNumber(extraDmg)} ST`);
      }
    }
  }
  
  if (unit.charId === 'mega') {
    const target = getTarget(unit, battle.allUnits);
    if (target) {
      const dmg = calcDamage(unit, target, ult.atkPct);
      applyDamage(target, dmg, unit, battle);
      
      // Tăng ST bản thân
      unit.effects.push({ type: 'dmgup', duration: ult.buffDuration, value: ult.selfDmgBuff });
      battle.log.push(`${unit.name} tăng ${ult.selfDmgBuff * 100}% ST gây ra trong ${ult.buffDuration} hiệp`);
      
      // Passive 2: Song bích - thêm 1 đòn đánh thường
      if (unit.level >= 80 && target.alive) {
        battle.log.push(`[SONG BÍCH] ${unit.name} thêm 1 đòn!`);
        const extraDmg = calcDamage(unit, target, base.basic.atkPct);
        applyDamage(target, extraDmg, unit, battle);
      }
    }
  }
  
  if (unit.charId === 'jaco') {
    // Đánh thường cường hóa
    const target = getTarget(unit, battle.allUnits);
    if (target) {
      const dmg = calcDamage(unit, target, ult.atkPct);
      applyDamage(target, dmg, unit, battle);
    }
    
    // Hồi máu toàn đội
    let healPct = ult.healPct;
    if (unit.level >= 150) healPct = 1.75;
    const healAmount = unit.atk * healPct;
    
    const allies = battle.allUnits.filter(u => u.isEnemy === unit.isEnemy && u.alive);
    allies.forEach(a => {
      applyHeal(a, healAmount, unit, battle);
    });
    
    // Passive 1: buff 1 đồng đội ngẫu nhiên
    if (unit.level >= 50) {
      const otherAllies = allies.filter(a => a.id !== unit.id);
      if (otherAllies.length > 0) {
        const chosen = otherAllies[Math.floor(Math.random() * otherAllies.length)];
        chosen.effects.push({ type: 'dmgup', duration: 1, value: 0.18 });
        battle.log.push(`${chosen.name} được tăng 18% ST trong 1 hiệp`);
      }
    }
  }
}

function runBattleTurn() {
  if (!battleState || battleState.finished) return;
  
  const order = getActionOrder(battleState);
  if (order.length === 0) {
    battleState.finished = true;
    return;
  }
  
  const actor = order[battleState.turn % order.length];
  battleState.currentActor = actor;
  
  performAction(actor, battleState);
  
  battleState.turn++;
  if (battleState.turn % order.length === 0) {
    battleState.round++;
  }
  
  renderBattle();
  
  if (battleState.finished) {
    clearInterval(battleInterval);
    battleInterval = null;
    onBattleEnd();
  }
}

function onBattleEnd() {
  if (battleState.victory) {
    const rewards = battleState.stage.rewards;
    gameState.resources.gold += rewards.gold;
    gameState.resources.vpnc += rewards.vpnc;
    gameState.resources.diamond += rewards.diamond || 0;
    gameState.resources.vntb += Math.floor(rewards.gold / 10);
    
    const leveledUp = addExp(rewards.exp);
    
    // Cập nhật tiến độ
    const [chap, stg] = battleState.stage.id.split('-').map(Number);
    const chapIdx = chap - 1;
    const stgIdx = stg - 1;
    
    if (chapIdx > gameState.progress.maxClearedChapter || 
        (chapIdx === gameState.progress.maxClearedChapter && stgIdx > gameState.progress.maxClearedStage)) {
      gameState.progress.maxClearedChapter = chapIdx;
      gameState.progress.maxClearedStage = stgIdx;
    }
    
    saveGame();
    
    setTimeout(() => {
      showVictoryModal(rewards, leveledUp);
    }, 800);
  } else {
    setTimeout(() => {
      showDefeatModal();
    }, 800);
  }
}

// ==================== GIFTCODE ====================
const GIFTCODES = {
  'CODETUAN001': { diamond: 400, name: 'CODETUAN001' }
};

function redeemGiftcode(code) {
  code = code.trim().toUpperCase();
  if (gameState.giftcodesUsed.includes(code)) {
    return { success: false, msg: 'Giftcode đã được sử dụng' };
  }
  const gift = GIFTCODES[code];
  if (!gift) {
    return { success: false, msg: 'Giftcode không hợp lệ' };
  }
  
  if (gift.diamond) gameState.resources.diamond += gift.diamond;
  if (gift.gold) gameState.resources.gold += gift.gold;
  if (gift.vpnc) gameState.resources.vpnc += gift.vpnc;
  if (gift.ngocThanBi) gameState.resources.ngocThanBi += gift.ngocThanBi;
  
  gameState.giftcodesUsed.push(code);
  saveGame();
  
  let rewardText = [];
  if (gift.diamond) rewardText.push(`${gift.diamond} Kim Cương`);
  if (gift.gold) rewardText.push(`${gift.gold} Xu`);
  if (gift.vpnc) rewardText.push(`${gift.vpnc} VPNC`);
  if (gift.ngocThanBi) rewardText.push(`${gift.ngocThanBi} Viên Ngọc Thần Bí`);
  
  return { success: true, msg: `Đổi thành công! Nhận được: ${rewardText.join(', ')}` };
}

// ==================== SUMMON SYSTEM ====================
function summonCharacter() {
  if (gameState.resources.ngocThanBi < 1) {
    return { success: false, msg: 'Viên Ngọc Thần Bí không đủ' };
  }
  
  gameState.resources.ngocThanBi -= 1;
  
  // Random nhân vật (chỉ các nhân vật thường, trừ sự kiện)
  const available = ['kangu', 'mega', 'jaco'];
  const charId = available[Math.floor(Math.random() * available.length)];
  
  if (!gameState.summonedCharacters.includes(charId)) {
    gameState.summonedCharacters.push(charId);
    gameState.characters[charId].unlocked = true;
  } else {
    // Nhận vật phẩm thay thế nếu đã có
    gameState.resources.vpnc += 20;
    gameState.resources.gold += 5000;
  }
  
  saveGame();
  return { success: true, charId: charId, name: CHARACTERS[charId].name };
}

// ==================== DAILY LOGIN ====================
const DAILY_REWARDS = [
  { gold: 10000 },
  { vpnc: 15 },
  { gold: 20000 },
  { ngocThanBi: 2 },
  { gold: 30000 },
  { vpnc: 25 },
  { diamond: 100, ngocThanBi: 3 }
];

function claimDaily(day) {
  if (gameState.dailyLogin.claimedDays.includes(day)) {
    return { success: false, msg: 'Đã nhận phần thưởng này' };
  }
  if (day > gameState.dailyLogin.currentStreak) {
    return { success: false, msg: 'Chưa đến ngày nhận thưởng này' };
  }
  
  const reward = DAILY_REWARDS[day - 1];
  if (reward.gold) gameState.resources.gold += reward.gold;
  if (reward.vpnc) gameState.resources.vpnc += reward.vpnc;
  if (reward.diamond) gameState.resources.diamond += reward.diamond;
  if (reward.ngocThanBi) gameState.resources.ngocThanBi += reward.ngocThanBi;
  
  gameState.dailyLogin.claimedDays.push(day);
  saveGame();
  
  let txt = [];
  if (reward.gold) txt.push(`${reward.gold} Xu`);
  if (reward.vpnc) txt.push(`${reward.vpnc} VPNC`);
  if (reward.diamond) txt.push(`${reward.diamond} Kim Cương`);
  if (reward.ngocThanBi) txt.push(`${reward.ngocThanBi} Viên Ngọc`);
  
  return { success: true, msg: `Nhận thành công: ${txt.join(', ')}` };
}

// ==================== UI RENDERING ====================
let currentTab = 'home';
let currentChapter = 0;
let selectedStage = null;
let battleMode = false;

function render() {
  const app = document.getElementById('app');
  
  if (battleMode && battleState) {
    app.innerHTML = renderBattleScreen();
    return;
  }
  
  app.innerHTML = `
    <div style="max-width:1100px;margin:0 auto;padding:20px;">
      ${renderHeader()}
      ${renderTabs()}
      <div style="margin-top:20px;">
        ${currentTab === 'home' ? renderHome() : ''}
        ${currentTab === 'campaign' ? renderCampaign() : ''}
        ${currentTab === 'characters' ? renderCharacters() : ''}
        ${currentTab === 'summon' ? renderSummon() : ''}
        ${currentTab === 'giftcode' ? renderGiftcode() : ''}
        ${currentTab === 'events' ? renderEvents() : ''}
      </div>
    </div>
    ${renderModal()}
  `;
  
  attachEventListeners();
}

function renderHeader() {
  const r = gameState.resources;
  const expPct = gameState.playerLevel >= 150 ? 100 : (gameState.playerExp / gameState.expToNext * 100);
  return `
    <div class="card p-4 mb-4 reveal" style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:20px;">
          ${gameState.playerLevel}
        </div>
        <div>
          <div style="font-weight:700;font-size:16px;">Cấp Độ ${gameState.playerLevel}${gameState.playerLevel >= 150 ? ' (MAX)' : ''}</div>
          <div style="width:160px;" class="hp-bar">
            <div class="hp-fill" style="width:${expPct}%;background:linear-gradient(90deg,var(--accent),var(--accent2));"></div>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${gameState.playerExp}/${gameState.expToNext} EXP</div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <div class="resource-pill">
          <span style="color:#2563eb;">◆</span> ${r.diamond}
        </div>
        <div class="resource-pill">
          <span style="color:#b45309;">●</span> ${r.gold.toLocaleString()}
        </div>
        <div class="resource-pill">
          <span style="color:#7c3aed;">▲</span> ${r.vpnc}
        </div>
        <div class="resource-pill">
          <span style="color:#0891b2;">★</span> ${r.vntb}
        </div>
        <div class="resource-pill">
          <span style="color:#dc2626;">✦</span> ${r.ngocThanBi}
        </div>
      </div>
    </div>
  `;
}

function renderTabs() {
  const tabs = [
    { id: 'home', name: 'Trang Chủ', icon: '⌂' },
    { id: 'campaign', name: 'Ấi Chiến Đấu', icon: '⚔' },
    { id: 'characters', name: 'Nhân Vật', icon: '☻' },
    { id: 'summon', name: 'Triệu Hồi', icon: '✦' },
    { id: 'giftcode', name: 'Giftcode', icon: '❖' },
    { id: 'events', name: 'Sự Kiện', icon: '✧' }
  ];
  return `
    <div class="card p-2 reveal" style="display:flex;flex-wrap:wrap;gap:4px;">
      ${tabs.map(t => `
        <button class="tab-btn ${currentTab === t.id ? 'active' : ''}" data-tab="${t.id}">
          <span style="margin-right:6px;">${t.icon}</span>${t.name}
        </button>
      `).join('')}
    </div>
  `;
}

function renderHome() {
  return `
    <div class="reveal">
      <div class="card p-6 mb-4" style="background:linear-gradient(135deg,var(--accent-soft),var(--accent2-soft));">
        <h2 style="font-size:28px;font-weight:800;margin:0 0 8px;">Chào mừng đến với <span style="color:var(--accent);">Arena Battle</span></h2>
        <p style="color:var(--muted);margin:0;">Game chiến đấu theo lượt với hệ thống nhân vật phong phú</p>
      </div>
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
        <div class="card p-5 reveal">
          <h3 style="margin:0 0 12px;font-size:16px;color:var(--accent);">Đội Hình Hiện Tại</h3>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${gameState.team.map((charId, idx) => {
              const c = CHARACTERS[charId];
              const lv = gameState.characters[charId].level;
              const slotNames = ['Hàng Đầu (DEF)', 'Hậu Phương (ATK)', 'Bên Cạnh (SKL)'];
              return `
                <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:10px;background:rgba(128,128,128,.05);">
                  <div class="avatar-icon avatar-${charId}">${c.name[0]}</div>
                  <div style="flex:1;">
                    <div style="font-weight:700;">${c.name} <span class="type-badge type-${c.type.toLowerCase()}">${c.type}</span></div>
                    <div style="font-size:11px;color:var(--muted);">Lv.${lv} · ${slotNames[idx]}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <button class="btn-primary" style="width:100%;margin-top:14px;" data-tab="campaign">Bắt Đầu Chiến Đấu</button>
        </div>
        
        <div class="card p-5 reveal">
          <h3 style="margin:0 0 12px;font-size:16px;color:var(--accent2);">Tiến Độ Ấi</h3>
          <div style="font-size:36px;font-weight:800;color:var(--text);">
            ${gameState.progress.maxClearedChapter + 1}-${gameState.progress.maxClearedStage + 2}
          </div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px;">Ấi đã vượt qua</div>
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
            <div style="font-size:13px;color:var(--muted);margin-bottom:6px;">Gợi ý xuất trận:</div>
            <div style="font-size:12px;line-height:1.6;color:var(--text);">
              • Tướng 1: Chọn nhân vật <strong style="color:#2563eb;">DEF</strong> (HP cao)<br>
              • Tướng 2: Chọn nhân vật <strong style="color:#dc2626;">ATK</strong> (ST cao)<br>
              • Tướng 3: Chọn nhân vật <strong style="color:#7c3aed;">SKL</strong> (hỗ trợ)
            </div>
          </div>
        </div>
        
        <div class="card p-5 reveal">
          <h3 style="margin:0 0 12px;font-size:16px;color:#f59e0b;">Đăng Nhập Hằng Ngày</h3>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:12px;">
            ${DAILY_REWARDS.map((r, i) => {
              const day = i + 1;
              const claimed = gameState.dailyLogin.claimedDays.includes(day);
              const isToday = day === gameState.dailyLogin.currentStreak && !claimed;
              const canClaim = day <= gameState.dailyLogin.currentStreak;
              return `
                <div class="daily-item ${claimed ? 'claimed' : ''} ${isToday ? 'today' : ''}" 
                     style="cursor:${canClaim && !claimed ? 'pointer' : 'default'}"
                     data-daily="${day}">
                  <div style="font-size:10px;font-weight:700;color:var(--muted);">Ngày ${day}</div>
                  <div style="font-size:18px;margin:4px 0;">
                    ${r.diamond ? '◆' : r.ngocThanBi ? '✦' : r.vpnc ? '▲' : '●'}
                  </div>
                  <div style="font-size:9px;color:${claimed ? 'var(--hp)' : 'var(--muted)'};font-weight:600;">
                    ${claimed ? 'Đã nhận' : (r.diamond ? r.diamond + ' KC' : r.ngocThanBi ? r.ngocThanBi + ' VN' : r.vpnc ? r.vpnc + ' VP' : (r.gold/1000) + 'K X')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="font-size:12px;color:var(--muted);text-align:center;">
            Chuỗi hiện tại: <strong style="color:var(--accent);">${gameState.dailyLogin.currentStreak}/7</strong> ngày
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCampaign() {
  const chapter = CHAPTERS[currentChapter];
  const canAccess = (chapIdx, stgIdx) => {
    if (chapIdx < gameState.progress.maxClearedChapter) return true;
    if (chapIdx === gameState.progress.maxClearedChapter && stgIdx <= gameState.progress.maxClearedStage + 1) return true;
    return false;
  };
  const isCleared = (chapIdx, stgIdx) => {
    if (chapIdx < gameState.progress.maxClearedChapter) return true;
    if (chapIdx === gameState.progress.maxClearedChapter && stgIdx <= gameState.progress.maxClearedStage) return true;
    return false;
  };
  
  return `
    <div class="reveal">
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
        ${CHAPTERS.map((c, idx) => `
          <button class="tab-btn ${currentChapter === idx ? 'active' : ''}" data-chapter="${idx}">
            Chương ${idx + 1}
          </button>
        `).join('')}
      </div>
      
      <div class="card p-6 mb-4">
        <h3 style="margin:0 0 20px;font-size:20px;font-weight:800;">${chapter.name}</h3>
        
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
          ${chapter.stages.map((stage, idx) => {
            const cleared = isCleared(currentChapter, idx);
            const unlocked = canAccess(currentChapter, idx);
            const isBoss = stage.isBoss;
            return `
              ${idx > 0 ? `<div class="stage-line ${cleared ? 'done' : ''}"></div>` : ''}
              <div class="stage-node ${unlocked ? 'unlocked' : ''} ${cleared ? 'cleared' : ''} ${isBoss ? 'boss' : ''}"
                   data-stage="${currentChapter}-${idx}"
                   title="${stage.name}${unlocked ? '\nClick để vào trận' : '\nChưa mở khoá'}">
                ${isBoss ? 'B' : (idx + 1)}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      ${selectedStage ? renderStageDetail() : renderStageList(chapter, isCleared, canAccess)}
    </div>
  `;
}

function renderStageList(chapter, isClearedFn, canAccessFn) {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
      ${chapter.stages.map((stage, idx) => {
        const cleared = isClearedFn(currentChapter, idx);
        const unlocked = canAccessFn(currentChapter, idx);
        return `
          <div class="card p-4 reveal" style="opacity:${unlocked ? 1 : 0.5};cursor:${unlocked ? 'pointer' : 'not-allowed'};"
               data-stage="${currentChapter}-${idx}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-weight:700;font-size:15px;">${stage.name}</span>
              ${cleared ? '<span style="color:var(--hp);font-size:12px;font-weight:700;">✓ Đã qua</span>' : ''}
              ${stage.isBoss ? '<span class="type-badge" style="background:rgba(220,38,38,.15);color:#dc2626;">BOSS</span>' : ''}
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.5;">
              ${stage.enemies.map(e => `${CHARACTERS[e.charId].name} Lv.${e.level}`).join('<br>')}
            </div>
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);">
              Phần thưởng: ${stage.rewards.exp} EXP · ${stage.rewards.gold} Xu · ${stage.rewards.vpnc} VPNC
              ${stage.rewards.diamond ? ` · ${stage.rewards.diamond} KC` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderStageDetail() {
  const [chapIdx, stgIdx] = selectedStage.split('-').map(Number);
  const stage = CHAPTERS[chapIdx].stages[stgIdx];
  
  return `
    <div class="card p-6 reveal">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
        <div>
          <h3 style="margin:0 0 8px;font-size:22px;font-weight:800;">
            ${stage.name}
            ${stage.isBoss ? '<span class="type-badge" style="background:rgba(220,38,38,.15);color:#dc2626;margin-left:8px;">BOSS</span>' : ''}
          </h3>
          <div style="color:var(--muted);font-size:14px;margin-bottom:16px;">
            Phần thưởng: <strong>${stage.rewards.exp}</strong> EXP · 
            <strong>${stage.rewards.gold.toLocaleString()}</strong> Xu · 
            <strong>${stage.rewards.vpnc}</strong> VPNC
            ${stage.rewards.diamond ? ` · <strong style="color:#2563eb;">${stage.rewards.diamond}</strong> Kim Cương` : ''}
          </div>
        </div>
        <button class="btn-primary" id="startBattleBtn" style="font-size:16px;padding:14px 32px;">
          ⚔ Bắt Đầu Trận Đấu
        </button>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;">
        <div>
          <h4 style="margin:0 0 12px;color:var(--ally);font-weight:700;">Đội của bạn</h4>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${gameState.team.map((charId, idx) => {
              const c = CHARACTERS[charId];
              const lv = gameState.characters[charId].level;
              const stats = getStats(charId, lv);
              return `
                <div class="char-card ally" style="display:flex;align-items:center;gap:12px;">
                  <div class="avatar-icon avatar-${charId}">${c.name[0]}</div>
                  <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-weight:700;">${c.name} <span class="type-badge type-${c.type.toLowerCase()}">${c.type}</span></span>
                      <span style="font-size:12px;color:var(--muted);">Lv.${lv}</span>
                    </div>
                    <div style="font-size:11px;color:var(--muted);margin-top:2px;">
                      HP ${formatNumber(stats.hp)} · ATK ${formatNumber(stats.atk)} · DEF ${stats.def} · SPD ${stats.spd}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div>
          <h4 style="margin:0 0 12px;color:var(--enemy);font-weight:700;">Đội địch</h4>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${stage.enemies.map((e, idx) => {
              const c = CHARACTERS[e.charId];
              const stats = getStats(e.charId, e.level);
              return `
                <div class="char-card enemy" style="display:flex;align-items:center;gap:12px;">
                  <div class="avatar-icon avatar-bot">${c.name[0]}</div>
                  <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-weight:700;">${e.name} <span class="type-badge type-${c.type.toLowerCase()}">${c.type}</span></span>
                      <span style="font-size:12px;color:var(--muted);">Lv.${e.level}</span>
                    </div>
                    <div style="font-size:11px;color:var(--muted);margin-top:2px;">
                      HP ${formatNumber(Math.floor(stats.hp * e.hpMult))} · ATK ${formatNumber(Math.floor(stats.atk * e.atkMult))} · DEF ${Math.floor(stats.def * e.defMult)}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
      
      <button class="btn-secondary" style="margin-top:16px;" id="backToStages">← Quay lại danh sách ải</button>
    </div>
  `;
}

function renderCharacters() {
  return `
    <div class="reveal">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">
        ${Object.entries(CHARACTERS).map(([id, c]) => {
          const charState = gameState.characters[id];
          const stats = getStats(id, charState.level);
          const cost = calcUpgradeCost(charState.level);
          const canUpgrade = charState.level < 250 && gameState.resources.vpnc >= cost;
          
          return `
            <div class="card p-5">
              <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
                <div class="avatar-icon avatar-${id}" style="width:60px;height:60px;font-size:26px;">${c.name[0]}</div>
                <div style="flex:1;position:relative;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <h4 style="margin:0;font-size:18px;font-weight:800;">${c.name}</h4>
                    <span class="type-badge type-${c.type.toLowerCase()}">${c.type}</span>
                  </div>
                  <div style="font-size:12px;color:var(--muted);margin-top:4px;">
                    Cấp ${charState.level}${charState.level >= 250 ? ' (MAX)' : ''}
                  </div>
                  <span class="level-badge">Lv.${charState.level}</span>
                </div>
              </div>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;margin-bottom:14px;">
                <div style="padding:6px 10px;background:rgba(22,163,74,.08);border-radius:8px;">
                  <span style="color:var(--muted);">HP:</span> <strong>${formatNumber(stats.hp)}</strong>
                </div>
                <div style="padding:6px 10px;background:rgba(220,38,38,.08);border-radius:8px;">
                  <span style="color:var(--muted);">ATK:</span> <strong>${formatNumber(stats.atk)}</strong>
                </div>
                <div style="padding:6px 10px;background:rgba(37,99,235,.08);border-radius:8px;">
                  <span style="color:var(--muted);">DEF:</span> <strong>${stats.def}</strong>
                </div>
                <div style="padding:6px 10px;background:rgba(245,158,11,.08);border-radius:8px;">
                  <span style="color:var(--muted);">SPD:</span> <strong>${stats.spd}</strong>
                </div>
              </div>
              
              <div style="margin-bottom:10px;">
                <div style="font-size:12px;font-weight:700;margin-bottom:4px;">${c.basic.name}</div>
                <div class="skill-desc">${c.basic.desc}</div>
              </div>
              
              <div style="margin-bottom:10px;">
                <div style="font-size:12px;font-weight:700;margin-bottom:4px;color:var(--accent);">${c.ult.name} (${c.ult.energyCost} năng lượng)</div>
                <div class="skill-desc">${c.ult.desc}</div>
              </div>
              
              <div style="margin-bottom:14px;">
                <div style="font-size:12px;font-weight:700;margin-bottom:6px;color:var(--accent2);">Kỹ Năng Bị Động</div>
                ${c.passives.map(p => `
                  <div style="font-size:11px;padding:6px 10px;border-radius:6px;margin-bottom:4px;${charState.level >= p.level ? 'background:rgba(22,163,74,.06);border-left:3px solid var(--hp);' : 'background:rgba(128,128,128,.05);border-left:3px solid var(--border);opacity:0.6;'}">
                    <strong>${p.name}</strong> ${charState.level >= p.level ? '' : `<span style="color:var(--muted);">(Mở Lv.${p.level})</span>`}
                    <div style="color:var(--muted);margin-top:2px;">${p.desc}</div>
                  </div>
                `).join('')}
              </div>
              
              <button class="btn-primary upgrade-btn" style="width:100%;" 
                      data-char="${id}" 
                      ${!canUpgrade ? 'disabled' : ''}>
                ${charState.level >= 250 ? 'Đã đạt cấp tối đa' : `Nâng Cấp (${cost} VPNC)`}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderSummon() {
  return `
    <div class="reveal">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div class="card p-6">
          <h3 style="margin:0 0 8px;font-size:20px;font-weight:800;color:var(--accent);">Khu Vui Chơi</h3>
          <p style="color:var(--muted);font-size:14px;margin:0 0 20px;">Đăng nhập hằng ngày để nhận phần thưởng hấp dẫn</p>
          
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:16px;">
            ${DAILY_REWARDS.map((r, i) => {
              const day = i + 1;
              const claimed = gameState.dailyLogin.claimedDays.includes(day);
              const isToday = day === gameState.dailyLogin.currentStreak && !claimed;
              const canClaim = day <= gameState.dailyLogin.currentStreak;
              return `
                <div class="daily-item ${claimed ? 'claimed' : ''} ${isToday ? 'today' : ''}"
                     style="cursor:${canClaim && !claimed ? 'pointer' : 'default'};padding:10px 6px;"
                     data-daily="${day}">
                  <div style="font-size:10px;font-weight:700;color:var(--muted);">${day}</div>
                  <div style="font-size:20px;margin:4px 0;">
                    ${r.diamond ? '◆' : r.ngocThanBi ? '✦' : r.vpnc ? '▲' : '●'}
                  </div>
                  <div style="font-size:9px;color:${claimed ? 'var(--hp)' : 'var(--muted)'};font-weight:600;">
                    ${claimed ? '✓' : (r.diamond ? r.diamond : r.ngocThanBi ? r.ngocThanBi : r.vpnc ? r.vpnc : Math.floor(r.gold/1000)+'K')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div style="text-align:center;padding:12px;background:rgba(128,128,128,.05);border-radius:10px;">
            <div style="font-size:13px;color:var(--muted);">Chuỗi đăng nhập</div>
            <div style="font-size:28px;font-weight:800;color:var(--accent);">${gameState.dailyLogin.currentStreak}<span style="font-size:14px;color:var(--muted);"> / 7 ngày</span></div>
          </div>
        </div>
        
        <div class="card p-6">
          <h3 style="margin:0 0 8px;font-size:20px;font-weight:800;color:var(--accent2);">Triệu Hồi Nhân Vật</h3>
          <p style="color:var(--muted);font-size:14px;margin:0 0 20px;">
            Sử dụng Viên Ngọc Thần Bí để triệu hồi nhân vật mới
          </p>
          
          <div style="text-align:center;padding:30px;background:linear-gradient(135deg,var(--accent-soft),var(--accent2-soft));border-radius:14px;margin-bottom:16px;">
            <div style="font-size:60px;margin-bottom:10px;">✦</div>
            <div style="font-size:14px;color:var(--muted);margin-bottom:4px;">Viên Ngọc Thần Bí còn lại</div>
            <div style="font-size:36px;font-weight:800;color:var(--accent);">${gameState.resources.ngocThanBi}</div>
          </div>
          
          <button class="btn-primary" id="summonBtn" style="width:100%;font-size:16px;padding:14px;"
                  ${gameState.resources.ngocThanBi < 1 ? 'disabled' : ''}>
            ✦ Triệu Hồi (1 Viên Ngọc)
          </button>
          
          <div style="margin-top:16px;padding:12px;background:rgba(128,128,128,.04);border-radius:10px;font-size:12px;color:var(--muted);">
            <strong style="color:var(--text);">Ghi chú:</strong> Triệu hồi ngẫu nhiên 1 trong các nhân vật có trong game. Nếu đã có nhân vật đó, bạn sẽ nhận được vật phẩm thay thế.
          </div>
        </div>
      </div>
      
      <div id="summonResult" style="margin-top:16px;"></div>
    </div>
  `;
}

function renderGiftcode() {
  return `
    <div class="reveal" style="max-width:500px;margin:0 auto;">
      <div class="card p-6 text-center">
        <div style="font-size:50px;margin-bottom:12px;">❖</div>
        <h3 style="margin:0 0 8px;font-size:22px;font-weight:800;">Nhập Giftcode</h3>
        <p style="color:var(--muted);font-size:14px;margin:0 0 24px;">Nhập mã giftcode để nhận phần thưởng đặc biệt</p>
        
        <div style="display:flex;gap:10px;margin-bottom:16px;">
          <input type="text" id="giftcodeInput" placeholder="Nhập giftcode..." 
                 style="flex:1;padding:12px 16px;border:1px solid var(--border);border-radius:12px;font-size:14px;font-family:'Urbanist',sans-serif;outline:none;"
                 onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
          <button class="btn-primary" id="redeemBtn">Đổi</button>
        </div>
        
        <div id="giftcodeMsg" style="min-height:24px;font-size:13px;"></div>
        
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);text-align:left;">
          <div style="font-size:12px;color:var(--muted);">
            <strong style="color:var(--text);">Lưu ý:</strong><br>
            • Mỗi giftcode chỉ có thể sử dụng 1 lần<br>
            • Giftcode có thời hạn sử dụng<br>
            • Theo dõi fanpage để cập nhật giftcode mới
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderEvents() {
  return `
    <div class="reveal" style="max-width:600px;margin:0 auto;">
      <div class="card p-8 text-center" style="background:linear-gradient(135deg,var(--accent-soft),var(--accent2-soft));">
        <div style="font-size:60px;margin-bottom:16px;">✧</div>
        <h3 style="margin:0 0 12px;font-size:24px;font-weight:800;">Sự Kiện Sắp Đến</h3>
        <p style="color:var(--muted);font-size:15px;margin:0 0 24px;line-height:1.7;">
          Chúng tôi sẽ sớm cập nhật các sự kiện thú vị với nhiều phần thưởng hấp dẫn.<br>
          Hãy quay lại thường xuyên để không bỏ lỡ!
        </p>
        <div style="display:inline-block;padding:10px 24px;background:var(--card);border-radius:20px;font-size:13px;color:var(--muted);border:1px solid var(--border);">
          Đang cập nhật...
        </div>
      </div>
    </div>
  `;
}

// ==================== BATTLE UI ====================
function renderBattleScreen() {
  const b = battleState;
  return `
    <div style="max-width:1100px;margin:0 auto;padding:16px;">
      <div class="card p-4 mb-4" style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong style="font-size:16px;">${b.stage.name}</strong>
          <span style="color:var(--muted);font-size:13px;margin-left:12px;">Round ${b.round}</span>
        </div>
        <button class="btn-secondary" id="exitBattle">Thoát trận</button>
      </div>
      
      <div class="card p-6 mb-4" style="background:linear-gradient(180deg,rgba(37,99,235,.03),rgba(220,38,38,.03));">
        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;">
          <!-- Allies -->
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${b.allies.map(u => renderBattleUnit(u)).join('')}
          </div>
          
          <div style="text-align:center;font-size:32px;font-weight:800;color:var(--muted);">VS</div>
          
          <!-- Enemies -->
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${b.enemies.map(u => renderBattleUnit(u)).join('')}
          </div>
        </div>
      </div>
      
      <div class="card p-4">
        <div style="font-weight:700;margin-bottom:8px;font-size:14px;">Nhật Ký Trận Đấu</div>
        <div class="battle-log" id="battleLog">
          ${b.log.slice(-20).map(l => `<div class="log-entry">${l}</div>`).join('')}
        </div>
      </div>
      
      <div style="display:flex;gap:10px;margin-top:14px;justify-content:center;">
        <button class="btn-primary" id="nextTurnBtn" ${b.finished ? 'disabled' : ''}>
          ${b.finished ? 'Trận đấu kết thúc' : 'Tiếp Tục ▶'}
        </button>
        <button class="btn-secondary" id="autoBattleBtn" ${b.finished ? 'disabled' : ''}>
          ${battleInterval ? 'Tạm dừng Auto' : 'Auto ▶▶'}
        </button>
      </div>
    </div>
  `;
}

function renderBattleUnit(u) {
  const hpPct = (u.hp / u.maxHp * 100);
  const energyPct = (u.energy / u.maxEnergy * 100);
  const isActing = battleState.currentActor && battleState.currentActor.id === u.id;
  
  const effectsHtml = u.effects.map(e => {
    const names = { stun: 'CHOÁNG', weaken: 'SUY GIẢM', dmgup: 'TĂNG ST', healup: 'TĂNG HỒI', double: 'SONG BÍCH' };
    const classes = { stun: 'effect-stun', weaken: 'effect-weaken', dmgup: 'effect-dmgup', healup: 'effect-healup', double: 'effect-double' };
    return `<span class="status-effect ${classes[e.type] || ''}">${names[e.type] || e.type}</span>`;
  }).join('');
  
  const hpMarksHtml = u.hpMarks > 0 ? `<span style="font-size:10px;color:#16a34a;margin-left:4px;">♥×${u.hpMarks}</span>` : '';
  
  return `
    <div class="char-card ${u.isEnemy ? 'enemy' : 'ally'} ${isActing ? 'acting' : ''} ${!u.alive ? 'dead' : ''}" 
         id="unit-${u.id}" style="position:relative;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="avatar-icon ${u.isEnemy ? 'avatar-bot' : 'avatar-' + u.charId}" style="width:42px;height:42px;font-size:18px;">
          ${u.name[0]}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <span style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${u.name} <span style="color:var(--muted);font-weight:500;">Lv.${u.level}</span>
            </span>
            <span style="font-size:11px;color:var(--muted);white-space:nowrap;">${formatNumber(u.hp)}/${formatNumber(u.maxHp)}</span>
          </div>
          <div class="hp-bar" style="margin-top:3px;">
            <div class="hp-fill" style="width:${hpPct}%;"></div>
          </div>
          <div style="display:flex;align-items:center;margin-top:3px;">
            <div class="energy-bar" style="flex:1;">
              <div class="energy-fill" style="width:${energyPct}%;"></div>
            </div>
            <span style="font-size:10px;color:var(--energy);margin-left:4px;">${u.energy.toFixed(1)}/${u.maxEnergy}</span>
            ${hpMarksHtml}
          </div>
          <div style="margin-top:3px;">${effectsHtml}</div>
        </div>
      </div>
    </div>
  `;
}

function renderBattle() {
  const logContainer = document.getElementById('battleLog');
  if (logContainer && battleState) {
    logContainer.innerHTML = battleState.log.slice(-20).map(l => `<div class="log-entry">${l}</div>`).join('');
    logContainer.scrollTop = logContainer.scrollHeight;
  }
  
  // Update all units
  battleState.allUnits.forEach(u => {
    const el = document.getElementById('unit-' + u.id);
    if (el) {
      // Update acting class
      el.classList.toggle('acting', battleState.currentActor && battleState.currentActor.id === u.id);
      el.classList.toggle('dead', !u.alive);
      
      // Update HP bar
      const hpFill = el.querySelector('.hp-fill');
      if (hpFill) hpFill.style.width = (u.hp / u.maxHp * 100) + '%';
      
      // Update energy
      const energyFill = el.querySelector('.energy-fill');
      if (energyFill) energyFill.style.width = (u.energy / u.maxEnergy * 100) + '%';
      
      // Update HP text
      const hpText = el.querySelector('span:last-child');
      // Update effects
      // (Simplified: full re-render on major changes)
    }
  });
}

// ==================== MODALS ====================
let modalContent = null;

function showModal(html) {
  modalContent = html;
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.innerHTML = `<div class="modal-content">${html}</div>`;
    overlay.style.display = 'flex';
  }
}

function hideModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.style.display = 'none';
  modalContent = null;
}

function renderModal() {
  return `
    <div id="modalOverlay" class="modal-overlay" style="display:none;" onclick="if(event.target===this)hideModal();render();">
      ${modalContent ? `<div class="modal-content">${modalContent}</div>` : ''}
    </div>
  `;
}

function showVictoryModal(rewards, leveledUp) {
  const html = `
    <div style="text-align:center;">
      <div style="font-size:60px;margin-bottom:12px;color:var(--hp);">★</div>
      <h2 style="margin:0 0 8px;font-size:28px;font-weight:800;color:var(--hp);">CHIẾN THẮNG!</h2>
      <p style="color:var(--muted);margin:0 0 24px;">Bạn đã vượt qua ải thành công</p>
      
      <div style="background:rgba(128,128,128,.05);border-radius:12px;padding:16px;margin-bottom:20px;text-align:left;">
        <div style="font-weight:700;margin-bottom:10px;font-size:14px;">Phần thưởng nhận được:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:14px;">
          <div>◆ EXP: <strong>${rewards.exp}</strong></div>
          <div>● Xu: <strong>${rewards.gold.toLocaleString()}</strong></div>
          <div>▲ VPNC: <strong>${rewards.vpnc}</strong></div>
          ${rewards.diamond ? `<div style="color:#2563eb;">◆ Kim Cương: <strong>${rewards.diamond}</strong></div>` : ''}
        </div>
        ${leveledUp ? `<div style="margin-top:12px;padding:10px;background:var(--accent-soft);border-radius:8px;text-align:center;color:var(--accent);font-weight:700;">
          🎉 CHÚC MỪNG LÊN CẤP! Cấp độ hiện tại: ${gameState.playerLevel}
        </div>` : ''}
      </div>
      
      <button class="btn-primary" style="width:100%;padding:14px;font-size:16px;" onclick="hideModal();battleMode=false;render();">
        Tiếp Tục
      </button>
    </div>
  `;
  showModal(html);
}

function showDefeatModal() {
  const html = `
    <div style="text-align:center;">
      <div style="font-size:60px;margin-bottom:12px;color:var(--enemy);">✗</div>
      <h2 style="margin:0 0 8px;font-size:28px;font-weight:800;color:var(--enemy);">THUA BÀI</h2>
      <p style="color:var(--muted);margin:0 0 24px;">Đội hình của bạn chưa đủ mạnh</p>
      
      <div style="background:rgba(128,128,128,.05);border-radius:12px;padding:16px;margin-bottom:20px;text-align:left;font-size:13px;line-height:1.7;">
        <strong>Gợi ý:</strong><br>
        • Nâng cấp nhân vật để tăng chỉ số<br>
        • Sắp xếp lại đội hình hợp lý<br>
        • Chọn ải dễ hơn để farm vật phẩm
      </div>
      
      <button class="btn-primary" style="width:100%;padding:14px;font-size:16px;" onclick="hideModal();battleMode=false;render();">
        Quay Lại
      </button>
    </div>
  `;
  showModal(html);
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      currentTab = btn.dataset.tab;
      selectedStage = null;
      render();
    };
  });
  
  // Chapter switching
  document.querySelectorAll('[data-chapter]').forEach(btn => {
    btn.onclick = () => {
      currentChapter = parseInt(btn.dataset.chapter);
      selectedStage = null;
      render();
    };
  });
  
  // Stage selection
  document.querySelectorAll('[data-stage]').forEach(el => {
    el.onclick = () => {
      selectedStage = el.dataset.stage;
      render();
    };
  });
  
  // Back to stages
  const backBtn = document.getElementById('backToStages');
  if (backBtn) backBtn.onclick = () => { selectedStage = null; render(); };
  
  // Start battle
  const startBtn = document.getElementById('startBattleBtn');
  if (startBtn && selectedStage) {
    startBtn.onclick = () => {
      const [chapIdx, stgIdx] = selectedStage.split('-').map(Number);
      const stage = CHAPTERS[chapIdx].stages[stgIdx];
      startBattle(stage);
      battleMode = true;
      render();
    };
  }
  
  // Upgrade buttons
  document.querySelectorAll('.upgrade-btn').forEach(btn => {
    btn.onclick = () => {
      const result = upgradeCharacter(btn.dataset.char);
      if (result.success) {
        render();
      } else {
        alert(result.msg);
      }
    };
  });
  
  // Daily claim
  document.querySelectorAll('[data-daily]').forEach(el => {
    el.onclick = () => {
      const day = parseInt(el.dataset.daily);
      const result = claimDaily(day);
      if (result.success) {
        render();
      } else if (currentTab === 'home' || currentTab === 'summon') {
        alert(result.msg);
      }
    };
  });
  
  // Summon
  const summonBtn = document.getElementById('summonBtn');
  if (summonBtn) {
    summonBtn.onclick = () => {
      const result = summonCharacter();
      const resultDiv = document.getElementById('summonResult');
      if (result.success) {
        const c = CHARACTERS[result.charId];
        resultDiv.innerHTML = `
          <div class="card p-6 summon-result text-center" style="background:linear-gradient(135deg,var(--accent-soft),var(--accent2-soft));">
            <div style="font-size:14px;color:var(--muted);margin-bottom:8px;">Bạn đã triệu hồi được:</div>
            <div style="display:flex;align-items:center;justify-content:center;gap:14px;">
              <div class="avatar-icon avatar-${result.charId}" style="width:70px;height:70px;font-size:30px;">${c.name[0]}</div>
              <div style="text-align:left;">
                <div style="font-size:24px;font-weight:800;">${result.name}</div>
                <div><span class="type-badge type-${c.type.toLowerCase()}">${c.type}</span></div>
              </div>
            </div>
          </div>
        `;
        setTimeout(() => render(), 2000);
      } else {
        alert(result.msg);
      }
    };
  }
  
  // Giftcode
  const redeemBtn = document.getElementById('redeemBtn');
  if (redeemBtn) {
    redeemBtn.onclick = () => {
      const input = document.getElementById('giftcodeInput');
      const msg = document.getElementById('giftcodeMsg');
      const result = redeemGiftcode(input.value);
      msg.style.color = result.success ? 'var(--hp)' : 'var(--enemy)';
      msg.textContent = result.msg;
      if (result.success) {
        input.value = '';
        setTimeout(() => render(), 1500);
      }
    };
    const input = document.getElementById('giftcodeInput');
    if (input) input.onkeypress = (e) => { if (e.key === 'Enter') redeemBtn.click(); };
  }
  
  // Battle controls
  const nextTurnBtn = document.getElementById('nextTurnBtn');
  if (nextTurnBtn) nextTurnBtn.onclick = () => runBattleTurn();
  
  const autoBtn = document.getElementById('autoBattleBtn');
  if (autoBtn) autoBtn.onclick = () => {
    if (battleInterval) {
      clearInterval(battleInterval);
      battleInterval = null;
      autoBtn.textContent = 'Auto ▶▶';
    } else {
      battleInterval = setInterval(runBattleTurn, 700);
      autoBtn.textContent = 'Tạm dừng Auto';
    }
  };
  
  const exitBtn = document.getElementById('exitBattleBtn');
  if (exitBtn) exitBtn.onclick = () => {
    if (battleInterval) { clearInterval(battleInterval); battleInterval = null; }
    battleState = null;
    battleMode = false;
    render();
  };
}

// ==================== INIT ====================
loadGame();
render();
</script>
</body>
</html>
