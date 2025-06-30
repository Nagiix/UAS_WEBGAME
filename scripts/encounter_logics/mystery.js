import { startBasicFight } from '../fight.js';
import { showDialogue } from './show_dialogue.js'; // optional
import { addRelic, player } from '../player.js';
import { relics } from "../relics.js";
export async function handleNodeAction(node) {
  const rand = Math.random();
  let message = "";

  if (rand < 0.5) {
    // 50% Fight boss
    message = `🧙‍♂️ The Mysterious Stranger summons a powerful foe!`;
    showToast(message);

    try {
      const res = await fetch('api/enemy.php?difficulty=special');
      const enemy = await res.json();
      enemy.hp = parseInt(enemy.hp) / (10 / player.floor_count);
      enemy.atk = parseInt(enemy.atk) / (10 / player.floor_count);
      enemy.def = parseInt(enemy.def) / (10 / player.floor_count);
      showDialogue(enemy.dialogue, 'intro');
      startBasicFight(enemy);
    } catch (err) {
      console.error('Failed to fetch enemy:', err);
    }

  } else {
    // 50% Gain 3 relics
    const gained = [];
    for (let i = 0; i < 3; i++) {
      const relic = getRandomRelic();
      if (relic) {
        addRelic(relic);
        gained.push(relic.name);
      }
    }
    message = `🧙‍♂️ The Mysterious Stranger grants you 3 relics: <strong>${gained.join(", ")}</strong>!`;
    showToast(message);
  }
}


// Helper: Get random unowned relic
function getRandomRelic() {
  const owned = new Set(player.relics);
  const candidates = relics.filter(r => !owned.has(r.id));
  return candidates[Math.floor(Math.random() * candidates.length)] || relics[Math.floor(Math.random() * relics.length)];
}

// Toast utility
function showToast(html) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = 1055;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-warning border-0 show';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${html}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
