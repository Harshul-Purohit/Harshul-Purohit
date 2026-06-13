const fs = require('fs');
const path = require('path');

const EMOJIS = ['🔥','⚡','🎯','💎','🚀','🎮','🧠','💻'];
// 8 pairs = 16 cards
const deck = [...EMOJIS, ...EMOJIS];

// Shuffle
for (let i = deck.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [deck[i], deck[j]] = [deck[j], deck[i]];
}

const state = {
  cards: deck,
  flipped: [],
  matched: [],
  moves: 0,
  gameOver: false,
  firstFlip: null
};

fs.writeFileSync(path.join(__dirname, 'state.json'), JSON.stringify(state, null, 2));
console.log('Game initialized!');
