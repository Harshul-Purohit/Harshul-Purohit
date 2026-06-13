const fs = require('fs');
const path = require('path');

const REPO = process.env.GITHUB_REPOSITORY || 'Harshul-Purohit/Harshul-Purohit';
const statePath = path.join(__dirname, 'state.json');
const readmePath = path.join(__dirname, '..', 'README.md');

function renderGame() {
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const { cards, flipped, matched, moves, gameOver } = state;

  let rows = '';
  for (let row = 0; row < 4; row++) {
    let cells = '';
    for (let col = 0; col < 4; col++) {
      const i = row * 4 + col;
      const isMatched = matched.includes(i);
      const isFlipped = flipped.includes(i);

      if (isMatched) {
        cells += `| ✅ ${cards[i]} `;
      } else if (isFlipped) {
        cells += `| 👁️ ${cards[i]} `;
      } else if (gameOver) {
        cells += `| ${cards[i]} `;
      } else {
        const url = `https://github.com/${REPO}/issues/new?title=mem-flip-${i}&labels=mem-flip-${i}&body=Flipping+card+${i}`;
        cells += `| [❓](${url}) `;
      }
    }
    rows += cells + '|\n';
  }

  const header = `| 🃏 | 🃏 | 🃏 | 🃏 |\n|:---:|:---:|:---:|:---:|\n`;
  const board = header + rows;

  let status = '';
  if (gameOver) {
    status = `🎉 **YOU WON in ${moves} moves!** — [Play Again](https://github.com/${REPO}/issues/new?title=mem-reset&labels=mem-reset&body=reset)`;
  } else if (state._clearNext) {
    status = `❌ **No match! Those two cards will hide on your next flip.** Moves: \`${moves}\``;
  } else if (flipped.length === 1) {
    status = `👆 **Card flipped! Now click another card to find its pair.** Moves: \`${moves}\``;
  } else {
    status = `🧩 **Click any ❓ card to flip it!** Moves: \`${moves}\` · Matched: \`${matched.length / 2}/8\` pairs`;
  }

  const resetLink = `[🔄 Reset Game](https://github.com/${REPO}/issues/new?title=mem-reset&labels=mem-reset&body=reset)`;

  const section = `<!-- MEMORY-GAME-START -->
## 🧩 Memory Card Game

> Match all 8 pairs to win! Click a **❓** card to flip it. Find its matching emoji to score a pair!
>
> ✅ = Matched pair · 👁️ = Currently flipped · ❓ = Hidden card

${status}

${board}
**Pairs matched:** \`${matched.length / 2}/8\` · **Moves:** \`${moves}\` · ${resetLink}

> ⚡ Powered by GitHub Actions — each flip triggers a workflow that updates the board in real time!
<!-- MEMORY-GAME-END -->`;

  let readme = fs.readFileSync(readmePath, 'utf8');
  if (readme.includes('<!-- MEMORY-GAME-START -->')) {
    readme = readme.replace(/<!-- MEMORY-GAME-START -->[\s\S]*?<!-- MEMORY-GAME-END -->/, section);
  } else {
    readme += '\n\n' + section + '\n';
  }
  fs.writeFileSync(readmePath, readme);
  console.log('README updated!');
}

renderGame();
