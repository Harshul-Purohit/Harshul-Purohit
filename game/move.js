const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, 'state.json');

function processMove(index) {
  const i = parseInt(index);
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

  if (state.gameOver) return state;
  if (isNaN(i) || i < 0 || i >= 16) return state;
  if (state.matched.includes(i)) return state;
  if (state.flipped.includes(i)) return state;

  if (state.firstFlip === null) {
    // First card of a pair
    state.firstFlip = i;
    state.flipped = [i];
  } else {
    const first = state.firstFlip;
    state.moves++;
    state.flipped = [first, i];

    if (state.cards[first] === state.cards[i]) {
      // Match!
      state.matched = [...state.matched, first, i];
      state.flipped = [];
      state.firstFlip = null;
      if (state.matched.length === 16) state.gameOver = true;
    } else {
      // No match — will show briefly, then hide (flipped resets next move)
      state.firstFlip = null;
      // Keep flipped for display, clear on next move
      state._clearNext = true;
    }
  }

  if (state._clearNext && state.firstFlip === null && !state.flipped.includes(i)) {
    // Clear previous mismatch
  }

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  return state;
}

// Handle clear-on-next logic properly
function processMoveClean(index) {
  const i = parseInt(index);
  let state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

  if (state.gameOver) { console.log('Game over'); return; }
  if (isNaN(i) || i < 0 || i >= 16) { console.log('Invalid'); return; }
  if (state.matched.includes(i)) { console.log('Already matched'); return; }

  // If there was a pending mismatch, clear it first
  if (state._clearNext) {
    state.flipped = [];
    state._clearNext = false;
    state.firstFlip = null;
  }

  if (state.flipped.includes(i)) { console.log('Already flipped'); return; }

  if (state.firstFlip === null) {
    state.firstFlip = i;
    state.flipped = [i];
  } else {
    const first = state.firstFlip;
    state.moves++;
    state.flipped = [first, i];

    if (state.cards[first] === state.cards[i]) {
      state.matched = [...state.matched, first, i];
      state.flipped = [];
      state.firstFlip = null;
      if (state.matched.length === 16) state.gameOver = true;
    } else {
      state.firstFlip = null;
      state._clearNext = true;
    }
  }

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log('Move processed:', i);
}

const arg = process.argv[2];
if (arg !== undefined) processMoveClean(arg);

module.exports = { processMoveClean };
