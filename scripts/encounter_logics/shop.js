import { player, updatePlayerStatsUI, addRelic } from "../player.js";
import { relics } from "../relics.js";
import { potions } from "../potions.js";

export function handleNodeAction(node) {
  showShopModal();
}
function showShopModal() {
  let modal = document.getElementById("shopModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "shopModal";
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 class="modal-title">🛒 Mysterious Shop</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body d-grid gap-3">
            <button class="btn btn-outline-success" id="healBtn">❤️ Heal (100 Gold)</button>
            <button class="btn btn-outline-warning" id="relicBtn">🔮 Random Relic (150 Gold)</button>
            <button class="btn btn-outline-info" id="potionBtn">🧪 Random Potion (50 Gold)</button>
            <button class="btn btn-outline-danger" id="atkBtn">⚔️ +5 ATK (100 Gold)</button>
            <button class="btn btn-outline-primary" id="defBtn">🛡️ +5 DEF (100 Gold)</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const bsModal = new bootstrap.Modal(modal);

    modal.addEventListener("shown.bs.modal", () => {
      document.getElementById("healBtn").onclick = () => purchase("heal");
      document.getElementById("relicBtn").onclick = () => purchase("relic");
      document.getElementById("potionBtn").onclick = () => purchase("potion");
      document.getElementById("atkBtn").onclick = () => purchase("atk");
      document.getElementById("defBtn").onclick = () => purchase("def");
    });

    bsModal.show();
  } else {
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}
function purchase(type) {
  const costs = {
    heal: 100,
    relic: 150,
    potion: 50,
    atk: 100,
    def: 100
  };

  if (player.gold < costs[type]) {
    showToast("❌ Not enough gold!");
    return;
  }

  player.gold -= costs[type];

  let msg = "";
  switch (type) {
    case "heal":
      player.hp += 100;
      msg = "❤️ You feel much better!";
      break;
    case "relic":
      const relic = getRandomRelic();
      addRelic(relic);
      msg = `🔮 You obtained <strong>${relic.name}</strong>!`;
      break;
    case "potion":
      const potion = getRandomPotion();
      addItemToInventory(potion.id); // ✅ Adds it correctly and updates UI
      msg = `🧪 You bought <strong>${potion.name}</strong>!`;
      break;
    case "atk":
      player.atk += 5;
      msg = "⚔️ You feel stronger!";
      break;
    case "def":
      player.def += 5;
      msg = "🛡️ You feel tougher!";
      break;
  }

  updatePlayerStatsUI();
  showToast(msg);
}

function getRandomRelic() {
  const owned = new Set(player.relics);
  const available = relics.filter(r => !owned.has(r.id));
  return available[Math.floor(Math.random() * available.length)];
}

function getRandomPotion() {
  return potions[Math.floor(Math.random() * potions.length)];
}
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
  toast.className = 'toast align-items-center text-bg-success border-0 show';
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
  setTimeout(() => toast.remove(), 4000);
}
