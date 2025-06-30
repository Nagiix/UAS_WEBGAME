import { player, getPlayerRelics } from './player.js';

export function showWinScreen() {
  console.log("SHOWING")
  const statsList = document.getElementById('win-stats');
  const inventoryList = document.getElementById('win-inventory');
  const skillsList = document.getElementById('win-skills');
  const relicsList = document.getElementById('win-relics');

  // Clear previous content
  statsList.innerHTML = '';
  inventoryList.innerHTML = '';
  skillsList.innerHTML = '';
  relicsList.innerHTML = '';

  // Stats
  const stats = ['hp', 'def', 'atk', 'gold', 'level'];
  stats.forEach(stat => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white';
    li.textContent = `${stat.toUpperCase()}: ${player[stat]}`;
    statsList.appendChild(li);
  });

  // EXP as current / needed
  const expLi = document.createElement('li');
  expLi.className = 'list-group-item bg-dark text-white';
  const xpToNext = 50 + player.level * 25;
  expLi.textContent = `EXP: ${player.exp} / ${xpToNext}`;
  statsList.appendChild(expLi);

  // Inventory (potions with icons)
  player.inventory.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white d-flex align-items-center gap-2';

    const img = document.createElement('img');
    img.src = item.icon;
    img.alt = item.name;
    img.style.width = '32px';
    img.style.height = '32px';

    li.appendChild(img);
    li.appendChild(document.createTextNode(item.name));
    inventoryList.appendChild(li);
  });

  // Skills
  player.skills.forEach(skill => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white';
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  // Relics (with icons)
  getPlayerRelics().forEach(relic => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-white d-flex align-items-center gap-2';

    const img = document.createElement('img');
    img.src = relic.icon;
    img.alt = relic.name;
    img.style.width = '64px';
    img.style.height = '64px';

    li.appendChild(img);
    li.appendChild(document.createTextNode(relic.name));
    relicsList.appendChild(li);
  });
// Example: total score = gold + level * 100 + hp
const score = player.gold + player.level * 100 + player.hp;
submitScore(player.name || "Unknown", score, getDifficultyName(player.difficulty));

  const winModal = new bootstrap.Modal(document.getElementById('winModal'));
  winModal.show();
}
