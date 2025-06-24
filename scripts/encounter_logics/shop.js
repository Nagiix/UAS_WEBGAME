import { player, updatePlayerStatsUI, addRelic, addItemToInventory } from "../player.js";
import { relics } from "../relics.js";
import { potions } from "../potions.js";
const $ = window.$;

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
          <div class="modal-body text-white">
            <table id="shopTable" class="table table-dark table-bordered table-hover">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>❤️ Heal</td><td>100</td><td><button class="btn btn-sm btn-success buy" data-type="heal">Buy</button></td></tr>
                <tr><td>🔮 Random Relic</td><td>150</td><td><button class="btn btn-sm btn-warning buy" data-type="relic">Buy</button></td></tr>
                <tr><td>🔮 Random Relic</td><td>150</td><td><button class="btn btn-sm btn-warning buy" data-type="relic_2">Buy</button></td></tr>
                <tr><td>🧪 Random Potion</td><td>50</td><td><button class="btn btn-sm btn-info buy" data-type="potion">Buy</button></td></tr>
                <tr><td>🧪 Random Potion</td><td>50</td><td><button class="btn btn-sm btn-info buy" data-type="potion_2">Buy</button></td></tr>
                <tr><td>⚔️ +5 ATK</td><td>100</td><td><button class="btn btn-sm btn-danger buy" data-type="atk">Buy</button></td></tr>
                <tr><td>🛡️ +5 DEF</td><td>100</td><td><button class="btn btn-sm btn-primary buy" data-type="def">Buy</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const bsModal = new bootstrap.Modal(modal);

  modal.addEventListener("shown.bs.modal", () => {
    // Initialize DataTable once
    if (!$.fn.DataTable.isDataTable('#shopTable')) {
      $('#shopTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        pageLength: 5,
        lengthChange: false,
        language: {
          search: "🔍 Search items:",
          zeroRecords: "Nothing found.",
          paginate: {
            next: "Next →",
            previous: "← Prev"
          }
        }
      });
    }

    // Handle Buy Button Clicks
    $('#shopTable').off('click').on('click', '.buy', function () {
      const type = $(this).data('type');
      purchase(type);
    });
  });

  bsModal.show();
}

function purchase(type) {
  const costs = {
    heal: 100,
    relic: 150,
    potion: 50,
    atk: 100,
    def: 100,
    relic_2: 250,
    potion_2: 75,
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
      addItemToInventory(potion.id);
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
    case "relic_2":
      for (let i = 0; i <1; i++){
        const relic = getRandomRelic();
        addRelic(relic);
        msg = `🔮 You obtained <strong>${relic.name}</strong>!`;
      }
      break;
    case "potion_2":
      for (let i = 0; i <1; i++){
        const potion = getRandomPotion();
        addItemToInventory(potion.id);
        msg = `🧪 You bought <strong>${potion.name}</strong>!`;
      }
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
