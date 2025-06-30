import { player, updatePlayerStatsUI } from "../player.js";

export function handleNodeAction(node) {
  // Heal logic
  const healAmount = 50;
  player.hp += healAmount;
  updatePlayerStatsUI();

  // Create toast if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = 1055;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-success border-0 show';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        🏕️ Rest Site: You recovered <strong>+${healAmount} HP</strong>!
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Auto-remove toast after 4s
  setTimeout(() => toast.remove(), 4000);
}
