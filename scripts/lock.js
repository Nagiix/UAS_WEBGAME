let isLocked = false;
let inFight = false;

export function lockPlayer() {
  isLocked = true;
  inFight = true;
}

export function unlockPlayer() {
  isLocked = false;
  inFight = false;
}

export function isPlayerLocked() {
  return isLocked || inFight;
}

export function setInFight(status) {
  inFight = status;
}

export function isInFight() {
  return inFight;
}
