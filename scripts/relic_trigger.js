import { relics } from "./relics.js";
export function applyOnFloorStartRelics(player) {
  player.relics.forEach(relicId => {
    const relic = relics.find(r => r.id === relicId);
    if (relic?.onFloorStart) relic.onFloorStart(player);
  });
}
export function handleVictoryRelics(player) {
  player.relics.forEach(relicId => {
    const relic = relics.find(r => r.id === relicId);
    if (relic?.onVictory) relic.onVictory(player);
  });
}
export function applyBossFightBuffs(player) {
  player.relics.forEach(relicId => {
    const relic = relics.find(r => r.id === relicId);
    if (relic?.onBossFight) relic.onBossFight(player);
  });
}
export function applyEliteFightEffects(player, enemy) {
  player.relics.forEach(relicId => {
    const relic = relics.find(r => r.id === relicId);
    if (relic?.onEliteFight) relic.onEliteFight(player, enemy);
  });
}
export function applyBattleStartRelics(player, enemies) {
  player.relics.forEach(relicId => {
    const relic = relics.find(r => r.id === relicId);
    if (relic?.onBattleStart) relic.onBattleStart(player, enemies);
  });
}
export function HandleonDamageTaken(player, enemies) {
  player.relics.forEach(relicId => {
    const relic = relics.find(r => r.id === relicId);
    if (relic?.onDamageTaken) relic.onDamageTaken(player, enemies);
  });
}
export function tryPreventDeath(player) {
  for (let id of player.relics) {
    const relic = relics.find(r => r.id === id);
    if (relic?.onDeath && relic.onDeath(player)) {
      return true; // prevented death
    }
  }
  return false;
}