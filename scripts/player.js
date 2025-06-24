import { relics } from './relics.js';

export const player = {
  hp: 100,
  def: 10,
  atk: 15,
  gold: 1050,
  level: 1,
  exp: 0,
  floor_count: 1,
  difficulty: 1,
  relics: [], // array of relic ids
  skills: [],
  inventory: []
};
// ✅ Leveling configuration
const levelXpRequirements = level => 50 + level * 25; // Example: Level 1 → 75 XP, Level 2 → 100 XP...

export function gainExperience(amount) {
  player.exp += amount;
  console.log(`Gained ${amount} EXP!`);

  // Check for level-up
  while (player.exp >= levelXpRequirements(player.level)) {
    player.exp -= levelXpRequirements(player.level);
    player.level++;
    player.atk += 2;   // Example stat bonuses
    player.def += 1;
    player.hp += 10;
    console.log(`🎉 Leveled up to ${player.level}!`);
  }

  updatePlayerStatsUI();
}

export function updatePlayerStatsUI() {
  document.getElementById('player-hp').textContent = player.hp;
  document.getElementById('player-def').textContent = player.def;
  document.getElementById('player-atk').textContent = player.atk;
  document.getElementById('player-gold').textContent = player.gold;
  document.getElementById('player-lvl').textContent = player.level;
  document.getElementById('player-exp').textContent = `${player.exp} / ${levelXpRequirements(player.level)}`;
}


// ✅ Merged addRelic function
export function addRelic(relic) {
  if (!player.relics.includes(relic.id)) {
    player.relics.push(relic.id);
    console.log(`Relic obtained: ${relic.name}`);
    updateRelicUI(); // 🆕 Update UI when a relic is added
  }
}

export function getPlayerRelics() {
  return player.relics.map(id => relics.find(r => r.id === id));
}

// ✅ Trigger relic effects by event name
export function triggerRelicEffect(eventName, context = {}) {
  getPlayerRelics().forEach(relic => {
    const effectFn = relic[eventName];
    if (typeof effectFn === 'function') {
      effectFn(player, context);
    }
  });
}

// ✅ Update relic display UI
export function updateRelicUI() {
  const relicContainer = document.getElementById('player-relics');
  relicContainer.innerHTML = ''; // Clear existing

  player.relics.forEach(relicId => {
  const relic = relics.find(r => r.id === relicId);
  if (relic) {
    const wrapper = document.createElement('div');
    wrapper.className = 'relic-wrapper';

    const img = document.createElement('img');
    img.src = relic.icon;
    img.alt = relic.name;
    img.className = 'relic-icon';

    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = `${relic.name}: ${relic.description}`;

    wrapper.appendChild(img);
    wrapper.appendChild(tooltip);
    relicContainer.appendChild(wrapper);
  }
});

}

import { potions } from './potions.js';

// ✅ Add item to inventory
export function addItemToInventory(potionId) {
  const potion = potions.find(p => p.id === potionId);
  if (!potion) return;
  if (player.inventory.length >= 12) {
    console.log("Inventory full!");
    return;
  }
  player.inventory.push(potion);
  updateInventoryUI(); // Update the sidebar inventory UI
}

export function updateInventoryUI() {
  const grid = document.getElementById('inventoryGrid');
  grid.innerHTML = ''; // Clear current

  player.inventory.forEach((item, index) => {
    const slot = document.createElement('div');
    slot.className = 'grid-square';
    slot.style.backgroundImage = `url(${item.icon})`;
    slot.style.backgroundSize = 'cover';
    slot.style.cursor = 'pointer';
    slot.title = `${item.name}: ${item.description}`;

    slot.onclick = () => {
      if (confirm(`Use ${item.name}?`)) {
        item.use(player); // Call use effect
        player.inventory.splice(index, 1); // Remove used item
        updateInventoryUI();
        updatePlayerStatsUI();
      }
    };

    grid.appendChild(slot);
  });

  // Add empty squares if under 12
  for (let i = player.inventory.length; i < 12; i++) {
    const empty = document.createElement('div');
    empty.className = 'grid-square';
    grid.appendChild(empty);
  }
}
window.player = player;
