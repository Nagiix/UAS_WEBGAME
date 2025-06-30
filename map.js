// === emoji weight and type ===
import { handleNodeAction as handleEnemy } from './scripts/encounter_logics/enemy.js';
import { handleNodeAction as handleEncounter } from './scripts/encounter_logics/encounter.js';
import { handleNodeAction as handleRest } from './scripts/encounter_logics/rest.js';
import { handleNodeAction as handleLongFight } from './scripts/encounter_logics/longFight.js';
import { handleNodeAction as handleElite } from './scripts/encounter_logics/elite.js';
import { handleNodeAction as handleMystery } from './scripts/encounter_logics/mystery.js';
import { handleNodeAction as handleShop } from './scripts/encounter_logics/shop.js';
import { handleNodeAction as handleBoss } from './scripts/encounter_logics/boss.js';
import { handleNodeAction as handleStart } from './scripts/encounter_logics/start.js';
import { player, updatePlayerStatsUI, triggerRelicEffect } from './scripts/player.js';
import { isPlayerLocked } from './scripts/lock.js';
import { applyOnFloorStartRelics } from './scripts/relic_trigger.js';
import { addItemToInventory } from './scripts/player.js';
import { showWinScreen } from './scripts/win_screen.js';

const emojiHandlers = {
  '💀': handleEnemy,
  '?': handleEncounter,
  '🏕️': handleRest,
  '🐉': handleLongFight,
  '⚔️': handleElite,
  '🧙‍♂️': handleMystery,
  '🎁': handleShop,
  '👑': handleBoss,
  '🐲': handleBoss,
  '🏠': handleStart
};

const backgrounds = [
  "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  "linear-gradient(to right, #ff512f, #dd2476)",
  "linear-gradient(to right, #8360c3, #2ebf91)",
  "linear-gradient(to right, #f7971e, #ffd200)",
  "linear-gradient(to right, #00c3ff, #ffff1c)"
];

const weightedIconsByDifficulty = {
  1: [ // Easy
    { icon: '💀', weight: 25 },
    { icon: '?', weight: 30 },
    { icon: '🏕️', weight: 10 },
    { icon: '🐉', weight: 10 },
    { icon: '⚔️', weight: 15 },
    { icon: '🧙‍♂️', weight: 10 }
  ],
  2: [ // Medium
    { icon: '💀', weight: 15 },
    { icon: '?', weight: 20 },
    { icon: '🏕️', weight: 10 },
    { icon: '🐉', weight: 25 },
    { icon: '⚔️', weight: 25 },
    { icon: '🧙‍♂️', weight: 5 }
  ],
  3: [ // Hard
    { icon: '💀', weight: 15 },
    { icon: '?', weight: 15 },
    { icon: '🏕️', weight: 5 },
    { icon: '🐉', weight: 32 },
    { icon: '⚔️', weight: 32 },
    { icon: '🧙‍♂️', weight: 1 }
  ],
  5: [ // Impossible
    { icon: '💀', weight: 10 },
    { icon: '?', weight: 10 },
    { icon: '🏕️', weight: 5 },
    { icon: '🐉', weight: 37 },
    { icon: '⚔️', weight: 37 },
    { icon: '🧙‍♂️', weight: 1 }
  ]
};

let difficulty = player.difficulty;

const emojiTypes = {
  '💀': 'Enemy',
  '?': 'Encounter',
  '🏕️': 'Rest',
  '🐉': 'Long-Fight',
  '⚔️': 'Elite',
  '🧙‍♂️': 'Mystery',
  '🎁': 'Shop',
  '👑': 'Boss',
  '🐲': 'Boss',
  '🏠': 'Start'
};

const bossIcons = ['👑', '🐲'];
function getBossIcon() {
  return bossIcons[Math.floor(Math.random() * bossIcons.length)];
}

let lastClickedNode = null;
let playerPosition = null;
let cyInstance = null;
window.notificationsEnabled = true;

// Add toggle button
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('notifToggle');
  if (toggleButton) {
    toggleButton.onclick = () => {
      notificationsEnabled = !notificationsEnabled;
      toggleButton.textContent = 'Toggle';
      document.getElementById('notifStatus').textContent = notificationsEnabled ? '🔔 On' : '🔕 Off';
    };
  }
});

function getWeightedIcon() {
  const weightedIcons = weightedIconsByDifficulty[difficulty] || weightedIconsByDifficulty[1];
  const totalWeight = weightedIcons.reduce((sum, entry) => sum + entry.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const entry of weightedIcons) {
    rand -= entry.weight;
    if (rand <= 0) return entry.icon;
  }
  return weightedIcons[weightedIcons.length - 1].icon; // fallback
}


function showConfirmModal(callback) {
  const confirmModal = new bootstrap.Modal(document.getElementById('confirmMoveModal'));
  document.getElementById('confirmMoveYes').onclick = () => {
    confirmModal.hide();
    callback();
  };
  document.getElementById('confirmMoveNo').onclick = () => confirmModal.hide();
  confirmModal.show();
}

export let limit = 1;

export function startGame(limit, currentDifficulty) {
    addItemToInventory("potion_heal");
    addItemToInventory("potion_buff");
    difficulty = currentDifficulty ;
    updatePlayerStatsUI();
    if(player.floor_count<=difficulty){
        applyRandomBackgroundToCy();
        applyRandomBackground(); // Add this line
        document.getElementById('difficultyModal').style.display = 'none';
        generateGraph(limit);
        player.floor_count += 1
    }else{
        showWinScreen()
    }
}

function applyRandomBackground() {
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.background = bg;
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.backgroundSize = "cover";
}
function applyRandomBackgroundToCy() {
  const cyEl = document.getElementById('cy'); // your Cytoscape container
  cyEl.style.backgroundImage = 'url("res/background.jpg")';
  cyEl.style.backgroundRepeat = 'repeat';
  cyEl.style.backgroundSize = '256px 256px'; // or '100px 100px' etc.
  cyEl.style.backgroundPosition = '0px 0px';
}
function generateGraph(limit) {
  applyOnFloorStartRelics(player);
  const elements = [];
  let nodeId = 0, count = 0;
  const spacingX = 180;
  const spacingY = 160;
  const levels = [];
  const maxDepth = Math.floor(limit / 5);

  for (let i = 0; i < maxDepth; i++) {
    const row = [];
    const width = i === 0 || i === maxDepth - 1 ? 1 : Math.min(3, limit - count);
    for (let j = 0; j < width && count < limit; j++) {
      row.push((i === maxDepth - 1) ? 'boss' : 'normal');
      count++;
    }
    levels.push(row);
    if (count >= limit) break;
  }

  const nodeRefs = [];
  let bossNodeId = null;

  levels.forEach((row, yIndex) => {
    const rowNodes = [];
    const xOffset = -(row.length - 1) * spacingX / 2;
    row.forEach((type, xIndex) => {
      const id = `node-${nodeId++}`;
      const pos = {
        x: xOffset + xIndex * spacingX,
        y: yIndex * spacingY
      };
      const isStartNode = (yIndex === 0 && xIndex === 0);
      const label = isStartNode ? '🏠' : (type === 'boss' ? getBossIcon() : getWeightedIcon());

      elements.push({
        data: { id, label, type, depth: yIndex },
        position: pos
      });

      if (isStartNode) {
        playerPosition = id;
      }

      rowNodes.push({ id, type });
      if (type === 'boss') bossNodeId = id;

      if (yIndex > 0) {
        const prevRow = nodeRefs[yIndex - 1];
        let closestIdx = xIndex;
        if (closestIdx >= prevRow.length) closestIdx = prevRow.length - 1;

        elements.push({ data: { source: prevRow[closestIdx].id, target: id } });

        if (prevRow.length > 1 && Math.random() < 0.5) {
          const altIdx = (closestIdx + 1 < prevRow.length) ? closestIdx + 1 : closestIdx - 1;
          if (altIdx >= 0 && altIdx < prevRow.length) {
            elements.push({ data: { source: prevRow[altIdx].id, target: id } });
          }
        }
      }
    });
    nodeRefs.push(rowNodes);
  });

  if (bossNodeId && nodeRefs.length > 1) {
    const secondLastRow = nodeRefs[nodeRefs.length - 2];
    const existingEdges = new Set(elements.filter(e => e.data?.target === bossNodeId).map(e => `${e.data.source}->${e.data.target}`));
    secondLastRow.forEach(n => {
      const edgeKey = `${n.id}->${bossNodeId}`;
      if (!existingEdges.has(edgeKey)) {
        elements.push({ data: { source: n.id, target: bossNodeId } });
      }
    });
  }

  const fightIcons = ['💀', '🐉', '⚔️'];
  const bossNodes = nodeRefs[nodeRefs.length - 1];
  bossNodes.forEach((boss) => {
    let fightCount = 0;
    function traverse(currentId, visited = new Set()) {
      if (visited.has(currentId)) return;
      visited.add(currentId);
      const node = elements.find(el => el.data?.id === currentId);
      if (!node) return;
      if (fightIcons.includes(node.data.label)) fightCount++;
      const incoming = elements.filter(el => el.data?.target === currentId);
      incoming.forEach(edge => traverse(edge.data.source, visited));
    }
    traverse(boss.id);

    if (fightCount >= 3) {
      const chestId = `chest-${boss.id}`;
      const pos = {
        x: elements.find(e => e.data?.id === boss.id).position.x,
        y: elements.find(e => e.data?.id === boss.id).position.y - spacingY * 0.5
      };

      elements.push({ data: { id: chestId, label: '🎁', type: 'reward' }, position: pos });
      elements.filter(e => e.data?.target === boss.id).forEach(edge => edge.data.target = chestId);
      elements.push({ data: { source: chestId, target: boss.id } });
    }
  });

  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements,
    layout: { name: 'preset' },
    minZoom: 0.75,
    maxZoom: 1.5,
    wheelSensitivity: 0.2,
    style: [
      {
        selector: 'node[label = "🎁"]',
        style: { 'border-color': '#ffd700', 'border-width': 3 }
      },
      {
        selector: 'node',
        style: {
          'background-color': '#111',
          'shape': 'hexagon',
          'width': 70,
          'height': 70,
          'border-width': 2,
          'label': 'data(label)',
          'color': '#fff',
          'font-size': 28,
          'text-valign': 'center',
          'text-halign': 'center'
        }
      },
      { selector: 'node[type="normal"]', style: { 'border-color': '#ffa500' } },
      { selector: 'node[type="boss"]', style: { 'border-color': '#f44336' } },
      { selector: 'node.selected', style: { 'border-color': '#00e5ff', 'border-width': 2, 'border-style': 'dashed' } },
      { selector: 'node.active', style: { 'border-color': '#00e5ff', 'border-width': 4, 'border-style': 'solid', 'shadow-color': '#00e5ff', 'shadow-blur': 10 } },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ffa726',
          'curve-style': 'bezier',
          'events': 'no'
        }
      }
    ]
  });
  cyInstance = cy;
  cy.nodes().ungrabify();
  cy.getElementById(playerPosition).addClass('active');

const cyEl = document.getElementById('cy'); // ✅ FIXED: define it before use

cy.on('viewport', () => {
  const pan = cy.pan();
  const zoom = cy.zoom();

  const bgX = pan.x * zoom;
  const bgY = pan.y * zoom;

  cyEl.style.backgroundPosition = `${bgX}px ${bgY}px`;
});
  cy.on('tap', 'node', function(evt) {
    const targetDepth = evt.target.data('depth');
    const currentDepth = cy.getElementById(playerPosition).data('depth');
    if (isPlayerLocked()) return;

    const connectedNodes = cy.getElementById(playerPosition).connectedEdges()
      .filter(edge => edge.data('source') === playerPosition)
      .map(edge => edge.data('target'));
    const targetId = evt.target.id();
    if (connectedNodes.includes(targetId)) {
      const move = () => {
        cy.getElementById(playerPosition).removeClass('active');
        playerPosition = targetId;
        cy.getElementById(playerPosition).addClass('active');
        const nodeLabel = cy.getElementById(playerPosition).data('label');
        triggerRelicEffect('onEnterNode', {
          label: nodeLabel,
          nodeId: playerPosition
        });
        const handler = emojiHandlers[nodeLabel];
        if (handler) {
          const label = cy.getElementById(playerPosition).data('label');
          handler(cy.getElementById(playerPosition));
        }     
      };

  if (targetDepth > currentDepth && notificationsEnabled) {
  showConfirmModal(move);
} else {
  move();
}
    }
  });

  cy.on('tap', 'node', (event) => {
    if (isPlayerLocked()) return;
    const node = event.target;
    lastClickedNode = node.id();
    cy.nodes().removeClass('selected');
    node.addClass('selected');

    const label = node.data('label');
    const type = emojiTypes[label] || 'Unknown';
    const preview = document.getElementById('node-preview');
    const content = document.getElementById('preview-content');

    content.innerHTML = `
      <p><strong>Icon:</strong> ${label}</p>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>ID:</strong> ${node.id()}</p>
    `;
    preview.style.display = 'block';
  });

  cy.on('tap', (event) => {
    if (event.target === cy) {
      document.getElementById('node-preview').style.display = 'none';
      cy.nodes().removeClass('selected');
    }
  });
}

document.addEventListener('wheel', function (e) {
  if (e.deltaY !== 0) {
    window.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    e.preventDefault();
  }
}, { passive: false });
function updateScoreboard(newScore) {
  let scores = JSON.parse(localStorage.getItem('scoreboard')) || [];

  // Add the new score entry
  scores.push(newScore);

  // Sort descending and keep only top 10
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  // Save back to localStorage
  localStorage.setItem('scoreboard', JSON.stringify(scores));
}

window.showScoreboard = function () {
  const scores = JSON.parse(localStorage.getItem('scoreboard')) || [];
  const list = document.getElementById('scoreboard-list');
  list.innerHTML = '';

  scores.forEach((entry, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white d-flex justify-content-between align-items-center';
    li.innerHTML = `<span>${entry.name}</span><span>${entry.score}</span>`;
    list.appendChild(li);
  });

  const modal = new bootstrap.Modal(document.getElementById('scoreboardModal'));
  modal.show();
};
function loadScoreboard() {
  fetch('submitscore.php')
    .then(res => res.json())
    .then(data => {
      const board = document.getElementById('scoreboard');
      board.innerHTML = '';
      data.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name} - ${entry.score} (${entry.difficulty})`;
        board.appendChild(li);
      });
    });
}

document.addEventListener('DOMContentLoaded', loadScoreboard);

// Example: Call this when the player wins
function submitScore(name, score, difficulty) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('score', score);
  formData.append('difficulty', difficulty);

  fetch('submit_score.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(() => loadScoreboard());
}
window.startGame = startGame;
