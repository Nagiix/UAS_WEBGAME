import { player, updatePlayerStatsUI, triggerRelicEffect, addRelic, gainExperience } from "./player.js";
import { showDialogue } from "./encounter_logics/show_dialogue.js";
import { lockPlayer, unlockPlayer, setInFight } from './lock.js';
import { startGame } from "../map.js";
import { relics, getRandomRelicByRarity, getRelicDropChance } from "./relics.js";
import { showWinScreen } from "./win_screen.js";
import { showLoseScreen } from "./lose_screen.js";
import { applyBattleStartRelics, applyBossFightBuffs, applyEliteFightEffects, handleVictoryRelics, HandleonDamageTaken, tryPreventDeath } from "./relic_trigger.js";

function createFightLogUI() {
  const existing = document.getElementById('fight-ui');
  if (existing) return document.getElementById('fight-log');

  const container = document.createElement('div');
  container.id = 'fight-ui';
  container.className = 'container my-3 p-3 bg-dark text-white border rounded';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.left = '20px';
  container.style.zIndex = '9999';
  container.style.width = '340px';
  container.style.maxHeight = '300px';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    <div id="fight-status" class="mb-2 fw-bold">🗡️ Combat Started</div>
    <div class="d-flex gap-2 mb-3">
      <button id="move-0" class="btn btn-danger btn-sm">Slash</button>
      <button id="move-1" class="btn btn-primary btn-sm">K I L L .</button>
      <button id="move-2" class="btn btn-warning btn-sm">Bash</button>
    </div>
    <div id="fight-log" style="max-height: 150px; overflow-y: auto; font-size: 0.9rem;"></div>
  `;

  document.body.appendChild(container);
  return document.getElementById('fight-log');
}

export function startBasicFight(enemy) {
  console.log("Player relics:", player.relics);
  applyBattleStartRelics(player,enemy);
  if(enemy.difficulty=="boss"){
    applyBossFightBuffs(player)
  }else if(enemy.difficulty=="hard"){
    applyEliteFightEffects(player)
  }
  lockPlayer();
  setInFight(true);
  const fightLog = createFightLogUI();
  fightLog.innerHTML = '';
  fightLog.innerHTML += `<div>🧱 You encountered <strong>${enemy.name}</strong> (Lv.${enemy.level})!</div>`;

  document.querySelectorAll('#move-0, #move-1, #move-2').forEach(btn => {
    btn.disabled = false;
  });

  let enemyHP = enemy.hp;
  const playerMoves = [
    { name: "Slash", min: player.atk*0.1, max: player.atk*0.5 },
    { name: "k i l l .", min: player.atk*10000, max: player.atk*10000 },
    { name: "Bash", min: player.atk*0.3, max: player.atk*0.5 }
  ];

  function log(text) {
    fightLog.innerHTML += `<div>${text}</div>`;
    fightLog.scrollTop = fightLog.scrollHeight;
  }

  function tryRelicDrop(enemyType) {
    log("trying relic drop")
    const chance = getRelicDropChance(player.difficulty, enemyType);
    if (Math.random() < chance) {
      const rarityRoll = Math.random() * 100;
      let rarity = 'Common';
      if (rarityRoll < 1) rarity = 'Legendary';
      else if (rarityRoll < 5) rarity = 'Epic';
      else if (rarityRoll < 15) rarity = 'Rare';
      else if (rarityRoll < 30) rarity = 'Uncommon';

      const relic = getRandomRelicByRarity(rarity);
      if (relic) {
        addRelic(relic);
        log(`🎁 You found a relic: <strong>${relic.name}</strong> (${relic.rarity})!`);
      }
    }
  }

  function endFight(victory) {
    unlockPlayer();
    setInFight(false);
    document.querySelectorAll('#move-0, #move-1, #move-2').forEach(btn => btn.disabled = true);

    if (!victory) {
      showDialogue(enemy.dialogue, 'death');
      showLoseScreen();
    }

    if (victory) {
      player.gold += enemy.goldReward;
      gainExperience(enemy.expReward);

      log(`💰 +${enemy.goldReward} gold | ⭐ +${enemy.expReward} EXP`);

      // triggerRelicEffect('onVictory', { enemyType: enemy.difficulty || "normal" }); // for passive effects like tags (if any)
      tryRelicDrop(enemy.difficulty || "normal");

      handleVictoryRelics(player); // this is what actually heals, buffs, etc.

      if (enemy.difficulty === "boss") {
        setTimeout(() => {
          const ui = document.getElementById('fight-ui');
          if (ui) ui.remove();
          startGame(Math.floor(Math.random() * 20) + 30, player.difficulty);
        }, 1000);
      }
    }

    updatePlayerStatsUI();

  }

  function handlePlayerMove(index) {
   if (player.hp <= 0 || enemyHP <= 0) return;
   if (player.hp <=0){
  tryPreventDeath(player);
   }
    const move = playerMoves[index];
    const base = Math.floor(Math.random() * (move.max - move.min + 1)) + move.min;
    const dmg = Math.max(0, base + player.atk - enemy.def / 10);

    enemyHP -= dmg;
    log(`⚔️ You used <strong>${move.name}</strong> and dealt <strong>${dmg}</strong> damage!`);
    triggerRelicEffect('onAttack', { target: 'enemy', damage: dmg });

    if (enemyHP <= 0) {
      log(`<strong>✅ You defeated ${enemy.name}!</strong>`);
      endFight(true);
      return;
    }

    setTimeout(() => {
      if (enemyHP < enemy.max_hp / 2 && !enemy.midphaseTriggered) {
        showDialogue(enemy.dialogue, 'midphase');
        enemy.midphaseTriggered = true;
      }

      const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
      const min = Math.round(parseFloat(enemy.atk) * parseFloat(enemyMove.min_dmg / 20));
      const max = Math.round(parseFloat(enemy.atk) * parseFloat(enemyMove.max_dmg / 20));
      const base = Math.floor(Math.random() * (max - min + 1)) + min;
      const dmg = Math.max(0, base + enemy.atk - player.def);

      player.hp = Math.max(0, player.hp - dmg);
      HandleonDamageTaken(player, enemy);
      log(`💢 ${enemy.name} used <strong>${enemyMove.move_name}</strong> and dealt <strong>${dmg}</strong> damage!`);
      triggerRelicEffect('onDamaged', { damage: dmg });

      if (player.hp <= 0) {
        log(`<strong>💀 You were defeated!</strong>`);
        endFight(false);
      }

      updatePlayerStatsUI();
    }, 500);
  }

  for (let i = 0; i < playerMoves.length; i++) {
    const btn = document.getElementById(`move-${i}`);
    if (btn) btn.onclick = () => handlePlayerMove(i);
  }

  triggerRelicEffect('onTurnStart');
  updatePlayerStatsUI();
}
