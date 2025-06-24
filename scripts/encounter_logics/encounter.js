import { player, updatePlayerStatsUI, addRelic, addItemToInventory } from "../player.js";
import { relics } from "../relics.js";
import { potions } from "../potions.js";

export function handleNodeAction(node) {
  const rand = Math.random();
  let message = "";

  if (rand < 0.10) {
    // 10% Gain 1 relic
    const relic = getRandomRelic();
    addRelic(relic);
    message = `🎁 You found a relic: <strong>${relic.name}</strong>!`;
  } else if (rand < 0.15) {
    // 5% Gain 2 relics
    const relic1 = getRandomRelic();
    const relic2 = getRandomRelic();
    addRelic(relic1);
    addRelic(relic2);
    message = `🎁 You found two relics: <strong>${relic1.name}</strong> and <strong>${relic2.name}</strong>!`;
  } else if (rand < 0.40) {
    // 25% Heal 50 HP
    player.hp += 50;
    updatePlayerStatsUI();
    message = `❤️ You healed <strong>50 HP</strong>!`;
  } else if (rand < 0.65) {
    // 25% Gain ATK +10
    player.atk += 10;
    updatePlayerStatsUI();
    message = `⚔️ Your attack increased by <strong>+10</strong>!`;
  } else if (rand < 0.85) {
    // 20% Gain 1 potion
    const potion = getRandomPotion();
    addItemToInventory(potion.id);
    message = `🧪 You received a potion: <strong>${potion.name}</strong>!`;
  } else {
    // 15% Gain 2 potions
    const potion1 = getRandomPotion();
    const potion2 = getRandomPotion();
    addItemToInventory(potion1.id);
    addItemToInventory(potion2.id);
    message = `🧪 You received two potions: <strong>${potion1.name}</strong> and <strong>${potion2.name}</strong>!`;
  }

  showToast(message);
}

// Helper: pick a random relic not yet owned
function getRandomRelic() {
  const owned = new Set(player.relics);
  const candidates = relics.filter(r => !owned.has(r.id));
  return candidates[Math.floor(Math.random() * candidates.length)] || relics[Math.floor(Math.random() * relics.length)];
}

// Helper: pick a random potion
function getRandomPotion() {
  return potions[Math.floor(Math.random() * potions.length)];
}

// Helper: show toast
function showToast(html) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = 1055;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-info border-0 show';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${html}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
