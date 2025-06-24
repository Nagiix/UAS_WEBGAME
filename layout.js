import { player } from './scripts/player.js';
import { relics } from './scripts/relics.js';
import { updateRelicUI } from './scripts/player.js';
// Header/Navbar
function createHeader() {
  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg navbar-dark bg-dark';
  nav.innerHTML = `
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <a class="navbar-brand" href="#">Mirror Dungeon</a>
      <div class="d-flex align-items-center gap-4 text-white small" id="player-stats">
        <div class="text-white">👤 <span id="player-name">--</span></div>
        <span>❤️ HP: <span id="player-hp">--</span></span>
        <span>🛡️ DEF: <span id="player-def">--</span></span>
        <span>⚔️ ATK: <span id="player-atk">--</span></span>
        <span>💰 Gold: <span id="player-gold">--</span></span>
        <span>🔼 Lvl: <span id="player-lvl">--</span></span>
        <span>⭐ EXP: <span id="player-exp">-- / --</span></span>
        <span id="notifStatus">🔔 On</span>
        <button id="notifToggle" class="btn btn-sm btn-outline-light ms-2">Toggle</button>
      </div>
    </div>
  `;
  document.body.prepend(nav);
}

function createGridSquares(count) {
  let squares = '';
  for (let i = 0; i < count; i++) {
    squares += `<div class="grid-square border bg-light" style="width: 40px; height: 40px;"></div>`;
  }
  return squares;
}

// Sidebars
function createSidebars() {
  // Left: Inventory only
  const leftSidebar = document.createElement('div');
  leftSidebar.className = 'sidebar start-0 p-3 bg-dark text-white border-end';
  leftSidebar.style = `
    position: fixed;
    top: 70px;
    bottom: 0;
    width: 200px;
    overflow-y: auto;
    z-index: 999;
  `;
  leftSidebar.style.overflow = 'visible'; // or in CSS
  leftSidebar.innerHTML = `
    <h5>Inventory</h5>
    <div class="d-grid gap-2 mb-4" id="inventoryGrid">
      ${createGridSquares(12)}
    </div>
  `;
  document.body.appendChild(leftSidebar);

  // Right: Relics, Skills, Status Effects
  const rightSidebar = document.createElement('div');
  rightSidebar.className = 'sidebar end-0 p-3 bg-dark text-white border-start';
  rightSidebar.style = `
    position: fixed;
    top: 70px;
    bottom: 0;
    width: 220px;
    overflow-y: auto;
    z-index: 999;
  `;
  rightSidebar.style.overflow = 'visible'; // or in CSS

  rightSidebar.innerHTML = `
    <h5>Relics</h5>
    <div id="player-relics" class="d-flex flex-wrap gap-1 mb-3"></div>
  `;
  document.body.appendChild(rightSidebar);

  updateRelicUI(); // Fill in relic icons
}
    // <h5>Skills</h5>
    // <div class="d-grid gap-2 mb-3" id="skillGrid">
    //   ${createGridSquares(6)}
    // </div>

    // <h5>Status Effects</h5>
    // <div class="d-grid gap-2" id="statusGrid">
    //   ${createGridSquares(6)}
    // </div>
// Styles
function applyLayoutStyles() {
  const style = document.createElement('style');
  style.textContent = `
    body {
      padding-top: 0;
    }
      #player-relics {
  overflow: visible !important;
  position: relative;
}
    .sidebar {
      position: fixed;
      top: 66px;
      bottom: 20px;
      width: 200px;
      background-color: #212529;
      color: white;
      padding: 1rem;
      overflow-y: auto;
      z-index: 1030;
    }
    .sidebar.start-0 {
      left: 0;
    }
    .sidebar.end-0 {
      right: 0;
    }
    .main-content {
      margin-left: 200px;
      margin-right: 220px;
      padding: 1rem;
    }
    .grid-square {
      width: 30px;
      height: 30px;
      display: inline-block;
      background-color: #343a40;
      border-radius: 4px;
    }
    .d-grid {
      grid-template-columns: repeat(3, 1fr);
      display: grid;
      justify-items: center;
    }

    /* Relic icon style */
   .relic-icon {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #666;
  background-color: #333;
  cursor: help;
  position: relative;
  transition: transform 0.2s;
}

.relic-icon:hover {
  transform: scale(1.15);
  background-color: #555;
}

// .relic-icon::after {
//   content: attr(data-desc);
//   position: absolute;
//   bottom: 125%;
//   left: 50%;
//   transform: translateX(-50%);
//   background: #222;
//   color: #fff;
//   padding: 6px 8px;
//   font-size: 0.75rem;
//   white-space: normal;
//   width: max-content;
//   max-width: 180px;
//   border-radius: 6px;
//   opacity: 0;
//   pointer-events: none;
//   transition: opacity 0.2s;
//   z-index: 1000;
// }

// .relic-icon:hover::after {
//   opacity: 1;
// }
.relic-wrapper {
  position: relative;
  display: inline-block;
}

.custom-tooltip {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #212529;
  color: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  max-width: 260px;      /* ✅ increased max width */
  min-width: 180px;      /* ✅ ensure baseline size */
  white-space: normal;   /* ✅ allow wrapping */
  word-wrap: break-word; /* ✅ wrap long text properly */
  text-align: left;
  border: 1px solid #555;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.inventory-item-wrapper {
  position: relative;
  display: inline-block;
}

.inventory-tooltip {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #212529;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  max-width: 220px;
  white-space: normal;
  text-align: left;
  border: 1px solid #555;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.inventory-item-wrapper:hover .inventory-tooltip {
  opacity: 1;
}
#inventoryGrid {
  overflow: visible;
}

.relic-wrapper:hover .custom-tooltip {
  opacity: 1;
}

  `;
  document.head.append(style);
}

// Init

$(document).ready(function () {
  createHeader();
  createSidebars();
  applyLayoutStyles();
  updateRelicUI();

  // Toggle notification
  $('#notifToggle').on('click', function () {
    window.notificationsEnabled = !window.notificationsEnabled;
    $('#notifStatus').text(window.notificationsEnabled ? '🔔 On' : '🔕 Off');
  });

  // Debug tooltip for first relic (optional)
  const relicId = player.relics[0];
  const relic = relics.find(r => r.id === relicId);

  if (relic) {
    const $wrapper = $('<div>').addClass('relic-wrapper');
    const $img = $('<img>')
      .addClass('relic-icon')
      .attr('src', relic.icon)
      .attr('alt', relic.name);

    const $tooltip = $('<div>')
      .addClass('custom-tooltip')
      .text(`${relic.name}: ${relic.description}`);

    $wrapper.append($img).append($tooltip);
    $('#player-relics').append($wrapper);
  } else {
    console.warn('No relic found or player has no relics');
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  loginModal.show();

  loginBtn.onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("./api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.status === "success") {
      player.name = username;
      localStorage.setItem("username", username);
      loginModal.hide();
      showToast("✅ " + data.message);
    } else {
      alert("❌ " + data.message);
    }
  };

  registerBtn.onclick = async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("./api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message);
  };
});
