export const potions = [
  {
    id: "potion_heal",
    name: "Healing Potion",
    description: "Restore 30 HP.",
    icon: "res/potions004.png",
    use: (player) => {
      const healed = 30;
      player.hp = player.hp + 30;
      console.log(`[Healing Potion] Restored ${healed} HP.`);
    }
  },
  {
    id: "potion_damage",
    name: "Firebomb",
    description: "Deal 20 damage to all enemies.",
    icon: "res/potions006.png",
    use: (player, enemies) => {
      enemies.forEach(e => e.hp -= 20);
      console.log(`[Firebomb] -20 HP to all enemies`);
    }
  },
  {
    id: "potion_buff",
    name: "Attack Buff",
    description: "+5 ATK for this floor.",
    icon: "res/potions003.png",
    use: (player) => {
      player.atk += 5;
      player.tempBuffs = player.tempBuffs || {};
      player.tempBuffs["atk"] = (player.tempBuffs["atk"] || 0) + 5;
      console.log(`[Attack Buff] +5 ATK`);
    }
  },
  {
    id: "potion_gold",
    name: "Golden Sip",
    description: "+100 gold.",
    icon: "res/potions008.png",
    use: (player) => {
      player.gold += 100;
      console.log(`[Golden Sip] +100 gold`);
    }
  },
];
