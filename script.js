const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const wordDisplay = document.getElementById('word-display');
const hangmanSVG = document.getElementById('hangman-svg');
const startHangmanSVG = document.getElementById('start-hangman-svg');
const guessesLeft = document.getElementById('guesses-left');

let word = '';
let guessedLetters = [];
let incorrectGuesses = 0;
const maxGuesses = 10;

const hangmanParts = [
  // Gallows (first 4 parts)
  '<line x1="20" y1="180" x2="180" y2="180" stroke="#888" stroke-width="4"/>',
  '<line x1="50" y1="180" x2="50" y2="20" stroke="#888" stroke-width="4"/>',
  '<line x1="50" y1="20" x2="130" y2="20" stroke="#888" stroke-width="4"/>',
  '<line x1="130" y1="20" x2="130" y2="40" stroke="#888" stroke-width="4"/>',
  // Body (next 6 parts)
  '<circle cx="130" cy="55" r="15" stroke="#000" stroke-width="3" fill="none"/>',
  '<line x1="130" y1="70" x2="130" y2="110" stroke="#000" stroke-width="3"/>',
  '<line x1="130" y1="80" x2="110" y2="100" stroke="#000" stroke-width="3"/>',
  '<line x1="130" y1="80" x2="150" y2="100" stroke="#000" stroke-width="3"/>',
  '<line x1="130" y1="110" x2="115" y2="140" stroke="#000" stroke-width="3"/>',
  '<line x1="130" y1="110" x2="145" y2="140" stroke="#000" stroke-width="3"/>'
];

function drawHangman(step) {
  hangmanSVG.innerHTML = hangmanParts.slice(0, step).join('');
}

function drawFullHangmanOnStart() {
  startHangmanSVG.innerHTML = hangmanParts.join('');
}

function displayWord() {
  const length = word.length;
  const baseFontSize = 40;
  const adjustedFontSize = length > 10 ? Math.max(20, baseFontSize - (length - 10) * 2) : baseFontSize;
  wordDisplay.style.fontSize = `${adjustedFontSize}px`;

  wordDisplay.textContent = word
    .split('')
    .map(letter => guessedLetters.includes(letter) ? letter : '_')
    .join(' ');
}

async function fetchWord() {
  try {
    const response = await fetch("https://random-word-api.vercel.app/api?words=1");
    const data = await response.json();
    return data[0].toUpperCase();
  } catch (e) {
    return "PUZZLE";
  }
}

async function startGame() {
  word = await fetchWord();
  guessedLetters = [];
  incorrectGuesses = 0;
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  guessesLeft.textContent = maxGuesses - incorrectGuesses;
  drawHangman(0);
  displayWord();
  generateLetterButtons();
}

function generateLetterButtons() {
  const container = document.getElementById('letter-buttons');
  container.innerHTML = '';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let letter of alphabet) {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.onclick = () => handleGuess(letter, btn);
    btn.className = 'letter-btn';
    container.appendChild(btn);
  }
}

function handleGuess(letter, button) {
  button.disabled = true;
  guessedLetters.push(letter);

  if (word.includes(letter)) {
    displayWord();
    if (word.split('').every(l => guessedLetters.includes(l))) {
      showResult(true);
    }
  } else {
    incorrectGuesses++;
    drawHangman(incorrectGuesses);
    guessesLeft.textContent = maxGuesses - incorrectGuesses;
    if (incorrectGuesses === maxGuesses) {
      showResult(false);
    }
  }
}

function showResult(won) {
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  document.getElementById('result-message').textContent = won ? "🎉 You Win!" : "💀 You Lost!";
  document.getElementById('correct-word').textContent = word;
}

document.getElementById('start-button').onclick = startGame;
document.getElementById('play-again').onclick = () => location.reload();

drawFullHangmanOnStart();
