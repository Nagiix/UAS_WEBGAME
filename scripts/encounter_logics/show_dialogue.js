// script/dialogue.js
export function showDialogue(dialogues, trigger) {
  const line = dialogues.find(d => d.trigger === trigger);
  if (!line) return;

  let dialogueBox = document.getElementById('dialogue-box');
  if (!dialogueBox) {
    dialogueBox = document.createElement('div');
    dialogueBox.id = 'dialogue-box';
    dialogueBox.className = 'position-fixed bottom-0 start-50 translate-middle-x bg-dark text-white p-3 rounded shadow';
    dialogueBox.style.zIndex = '2000';
    dialogueBox.style.maxWidth = '500px';
    document.body.appendChild(dialogueBox);
  }

  dialogueBox.innerHTML = `
    <p class="mb-0">${line.dialogue}</p>
  `;

  dialogueBox.style.display = 'block';

  setTimeout(() => {
    dialogueBox.style.display = 'none';
  }, 3000); // auto-hide after 3 seconds
}
