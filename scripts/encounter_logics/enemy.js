import { startBasicFight } from '../fight.js';
import { showDialogue } from './show_dialogue.js'; // optional
import { player } from '../player.js';

export async function handleNodeAction(node) {
  console.log("Enemy node clicked:", node.id());
  console.log("test");
  try {
    const res = await fetch('api/enemy.php?difficulty=easy');
    const enemy = await res.json();
    enemy.hp = parseInt(enemy.hp) / (10/player.floor_count);
    enemy.atk = parseInt(enemy.atk) / (10/player.floor_count);
    enemy.def = parseInt(enemy.def) / (10/player.floor_count);
    showDialogue(enemy.dialogue, 'intro');
    startBasicFight(enemy);
  } catch (err) {
    console.error('Failed to fetch enemy:', err);
  }
}
