import { player, getPlayerRelics } from './player.js';

export function showLoseScreen() {
  console.log('LOSING');

  // Mapping difficulty number to string
  const difficultyMap = {
    1: 'easy',
    2: 'normal',
    3: 'hard',
    5: 'impossible'
  };
  const difficulty = difficultyMap[player.difficulty] ?? 'normal';

  // Clear previous content
  ['lose-stats', 'lose-inventory', 'lose-skills', 'lose-relics'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

  // Stats
  const statsList = document.getElementById('lose-stats');
  ['hp', 'def', 'atk', 'gold', 'level'].forEach(stat => {
    statsList.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item bg-dark text-white">
         ${stat.toUpperCase()}: ${player[stat]}
       </li>`
    );
  });
  const xpToNext = 50 + player.level * 25;
  statsList.insertAdjacentHTML(
    'beforeend',
    `<li class="list-group-item bg-dark text-white">
       EXP: ${player.exp} / ${xpToNext}
     </li>`
  );

  // Inventory
  const inventoryList = document.getElementById('lose-inventory');
  player.inventory.forEach(item => {
    inventoryList.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item bg-dark text-white d-flex align-items-center gap-2">
         <img src="${item.icon}" alt="${item.name}" width="32" height="32">
         ${item.name}
       </li>`
    );
  });

  // Skills
  const skillsList = document.getElementById('lose-skills');
  player.skills.forEach(skill => {
    skillsList.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item bg-dark text-white">${skill}</li>`
    );
  });

  // Relics
  const relicsList = document.getElementById('lose-relics');
  getPlayerRelics().forEach(relic => {
    relicsList.insertAdjacentHTML(
      'beforeend',
      `<li class="list-group-item bg-dark text-white d-flex align-items-center gap-2">
         <img src="${relic.icon}" alt="${relic.name}" width="64" height="64">
         ${relic.name}
       </li>`
    );
  });

  // Submit score
  const score = player.gold + player.level * 100 + player.hp;
  fetch('API/submitscore.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      uid: player.id ?? 1,
      score,
      difficulty
    })
  })
    .then(r => r.text())
    .then(txt => console.log('PHP reply (lose):', txt))
    .catch(err => console.error('❌ Score submit failed (lose):', err));

  // Show lose modal
  const loseModalEl = document.getElementById('loseModal');
  const loseModal = new window.bootstrap.Modal(loseModalEl, { backdrop: 'static' });
  loseModal.show();
}
