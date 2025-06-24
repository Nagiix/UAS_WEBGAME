export const relics = [
  {
    id: 1,
    name: "Flesh-Twisting Heart",
    description: "Heal 5 HP after every combat encounter.",
    onVictory: (player) => {
      const healed = Math.min(player.hp + 5, 1000) - player.hp;
      player.hp = Math.min(player.hp + 5, 1000);
      console.log(`[Flesh-Twisting Heart] Healed ${healed} HP. Current HP: ${player.hp}`);
    },
    rarity: "Common",
    category: "Healing",
    icon : "res/tile000.png",
  },
  {//THIS
    id: 2,
    name: "Whispering Skull",
    description: "Gain +3 ATK if HP is below 50%.",
    effect: (player) => {
      if (player.hp < player.maxHp / 2) {
        player.atk += 3;
        console.log(`[Whispering Skull] Bonus ATK activated. ATK is now ${player.atk}`);
      }
    },
    rarity: "Uncommon",
    category: "Offensive",
    icon : "res/tile001.png",
  },
  {
    id: 3,
    name: "Ashen Spine",
    description: "+1 DEF after each victory.",
    onVictory: (player) => {
      player.def += 1;
      console.log(`[Ashen Spine] DEF increased. Current DEF: ${player.def}`);
    },
    rarity: "Common",
    category: "Defensive",
    icon : "res/tile002.png",
  },
  {
    id: 4,
    name: "Bloody Coin",
    description: "Earn 10% more gold from enemies.",
    modifyGold: (baseGold) => {
      const modified = Math.floor(baseGold * 1.1);
      console.log(`[Bloody Coin] Gold increased from ${baseGold} to ${modified}`);
      return modified;
    },
    rarity: "Uncommon",
    category: "Economy",
    icon : "res/tile003.png",
  },
  {
    id: 5,
    name: "One-Eyed Mask",
    description: "Reveal mystery node outcomes before entering.",
    passiveTag: "revealMystery",
    rarity: "Rare",
    category: "Utility",
    icon : "res/tile004.png",
  },
  {
    id: 6,
    name: "Pot of Teeth",
    description: "+1 random stat at start of each level.",
    onFloorStart: (player) => {
      const stats = ["hp", "atk", "def"];
      const random = stats[Math.floor(Math.random() * stats.length)];
      player[random] += 1;
      console.log(`[Pot of Teeth] ${random.toUpperCase()} increased by 1. New value: ${player[random]}`);
    },
    rarity: "Uncommon",
    category: "Growth",
    icon : "res/tile005.png",
  },
  {
    id: 7,
    name: "Throbbing Branch",
    description: "When damaged, reflect 1 damage.",
    onDamageTaken: (player, enemy) => {
      enemy.hp -= 1;
      console.log(`[Throbbing Branch] Reflected 1 damage to ${enemy.name}. Enemy HP: ${enemy.hp}`);
    },
    rarity: "Uncommon",
    category: "Defensive",
    icon : "res/tile006.png",
  },
  {
    id: 8,
    name: "Cracked Hourglass",
    description: "+1 free turn at the start of battle.",
    onBattleStart: (player) => {
      player.extraTurn = true;
      console.log(`[Cracked Hourglass] Extra turn granted.`);
    },
    rarity: "Rare",
    category: "Utility",
    icon : "res/tile007.png",
  },
  {
    id: 9,
    name: "Burning Lantern",
    description: "All enemies start with -2 DEF.",
    onBattleStart: (_, enemies) => {
      enemies.forEach(e => {
        e.def = Math.max(0, e.def - 2);
        console.log(`[Burning Lantern] ${e.name}'s DEF reduced to ${e.def}`);
      });
    },
    rarity: "Rare",
    category: "Offensive",
    icon : "res/tile008.png",
  },
  {
    id: 10,
    name: "Spider Lily Pendant",
    description: "Gain +1 ATK for every relic held.",
    effect: (player) => {
      const bonus = player.relics.length;
      player.atk += bonus;
      console.log(`[Spider Lily Pendant] Bonus +${bonus} ATK applied. ATK is now ${player.atk}`);
    },
    rarity: "Rare",
    category: "Offensive",
    icon : "res/tile009.png",
  },
  {
    id: 11,
    name: "Training Dummy",
    description: "Chance to avoid a fatal hit (once per fight).",
    onFatalHit: (player) => {
      if (!player.usedLantern && Math.random() < 0.5) {
        player.hp = 1;
        player.usedLantern = true;
        console.log(`[Training Dummy] Fatal hit avoided! HP restored to 1.`);
        return true;
      }
      return false;
    },
    rarity: "Epic",
    category: "Defensive",
    icon : "res/tile010.png",
  },
  {
    id: 12,
    name: "Wriggling Chain",
    description: "Enemies cannot escape or flee.",
    passiveTag: "blockFlee",
    rarity: "Uncommon",
    category: "Utility",
    icon : "res/tile011.png",
  },
  {
    id: 13,
    name: "Molten Gaze",
    description: "+20% chance to inflict burn.",
    passiveTag: "burnBoost",
    rarity: "Rare",
    category: "Offensive",
    icon : "res/tile012.png",
  },
  {
    id: 14,
    name: "Dawn's Bleeding Edge",
    description: "+5 ATK during boss fights.",
    onBossFight: (player) => {
      player.atk += 5;
      console.log(`[Dawn's Bleeding Edge] +5 ATK applied for boss fight. Current ATK: ${player.atk}`);
    },
    rarity: "Epic",
    category: "Offensive",
    icon : "res/tile013.png",
  },
  {
    id: 15,
    name: "Old Choir Bell",
    description: "Gain 5 EXP after each fight.",
    onVictory: (player) => {
      player.exp += 5;
      console.log(`[Old Choir Bell] +5 EXP awarded. Total EXP: ${player.exp}`);
    },
    rarity: "Uncommon",
    category: "Economy",
    icon : "res/tile014.png",
  },
  {
    id: 16,
    name: "Fractal Brain",
    description: "+1 skill slot.",
    passiveTag: "extraSkillSlot",
    rarity: "Rare",
    category: "Utility",
    icon : "res/tile015.png",
  },
  {
    id: 17,
    name: "Librarian's Tongue",
    description: "Identify unknown potions.",
    passiveTag: "identifyItems",
    rarity: "Uncommon",
    category: "Utility",
    icon : "res/tile016.png",
  },
  {
    id: 18,
    name: "Frozen Cocoon",
    description: "Negate the first debuff received per floor.",
    onDebuff: (player) => {
      if (!player.negatedDebuff) {
        player.negatedDebuff = true;
        console.log(`[Frozen Cocoon] Debuff negated.`);
        return true;
      }
      return false;
    },
    rarity: "Epic",
    category: "Defensive",
    icon : "res/tile017.png",
  },
  {
    id: 19,
    name: "Clawed Bell",
    description: "Deal 3 bonus damage to elite enemies.",
    onEliteFight: (player, enemy) => {
      enemy.hp -= 3;
      console.log(`[Clawed Bell] -3 HP dealt to elite enemy ${enemy.name}. HP now: ${enemy.hp}`);
    },
    rarity: "Rare",
    category: "Offensive",
    icon : "res/tile018.png",
  },
  {
    id: 20,
    name: "Hollow Halo",
    description: "Revive with 20% HP once per run.",
    onDeath: (player) => {
      if (!player.reviveUsed) {
        player.hp = Math.floor(player.maxHp * 0.2);
        player.reviveUsed = true;
        console.log(`[Hollow Halo] Player revived! HP restored to ${player.hp}`);
        return true;
      }
      return false;
    },
    rarity: "Legendary",
    category: "Healing",
    icon : "res/tile019.png",
  }
];

const rarityColor = {
  Common: '#ccc',
  Uncommon: '#7cd',
  Rare: '#47f',
  Epic: '#c3f',
  Legendary: '#ff0'
};

const epicRelics = relics.filter(r => r.rarity === 'Epic');
const defensiveRelics = relics.filter(r => r.category === 'Defensive');

export function getRandomRelicByRarity(rarity) {
  const filtered = relics
    .filter(r => r.rarity === rarity)
    .filter(r => !player.relics.includes(r.id)); // exclude already owned relics

  if (filtered.length === 0) return null; // no new relics left in this rarity
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRelicDropChance(difficulty, enemyType) {
  const table = {
    Easy:   { boss: 1.00, hard: 1.0, medium: 1.0, easy: 1.0 },
    Medium: { boss: 1.00, hard: 0.5,  medium: 0.25, easy: 0.1  },
    Hard:   { boss: 1.00, hard: 0.3,  medium: 0.15, easy: 0.05 },
    Impossible: { boss: 1.00, hard: 0.15, medium: 0.05, easy: 0.00 },
  };

  const diffName = ["", "Easy", "Medium", "Hard", "Impossible"][difficulty];
  const type = enemyType.toLowerCase();
  return table[diffName]?.[type] || 0;
}
