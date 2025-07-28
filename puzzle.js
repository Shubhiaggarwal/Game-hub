const rows = 3;
const columns = 3;
let turns = 0;
let board = [];
let blankPos = [2, 2]; // Default: blank at bottom-right
let gameWon = false;
let timerInterval;
let seconds = 0;
let bestScore = localStorage.getItem("bestScore") || "--";
document.getElementById("bestMoves").innerText = `🏆 Best: ${bestScore} moves`;


const correctOrder =  ["1", "2", "3", "4", "5", "6", "7", "8", "blank"]; // solved


window.onload = () => {
  document.getElementById("restartBtn").addEventListener("click", initGame);
  initGame();
};

function initGame() {
  clearInterval(timerInterval);
seconds = 0;
document.getElementById("timer").innerText = "⏱️ Time: 0s";
timerInterval = setInterval(() => {
  seconds++;
  document.getElementById("timer").innerText = `⏱️ Time: ${seconds}s`;
}, 1000);

  gameWon = false;

  turns = 0;
  document.getElementById("turns").innerText = turns;
  document.getElementById("status").innerText = "";

  const container = document.getElementById("board");
  container.innerHTML = "";
  board = [];

  // Create shuffled tile list
  let tiles = [...correctOrder];
  shuffle(tiles);

  // Build the grid
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      const value = tiles.shift();
      board[r][c] = value;

      const tile = document.createElement("img");
      tile.src = `images/${value}.jpg`;
      tile.classList.add("tile");
      tile.dataset.row = r;
      tile.dataset.col = c;

      if (value === "blank") {
        blankPos = [r, c];
      }

      tile.addEventListener("click", handleTileClick);
      container.appendChild(tile);
    }
  }
}

function handleTileClick(e) {
  if (gameWon) return; // Disable after win

  const tile = e.target;
  const r = parseInt(tile.dataset.row);
  const c = parseInt(tile.dataset.col);
  const [br, bc] = blankPos;

  const isAdjacent =
    (r === br && Math.abs(c - bc) === 1) ||
    (c === bc && Math.abs(r - br) === 1);

  if (isAdjacent) {
    
    // Swap values in board data
    [board[r][c], board[br][bc]] = [board[br][bc], board[r][c]];

    // Swap image sources in DOM
    const clickedTile = document.querySelector(`img[data-row="${r}"][data-col="${c}"]`);
    const blankTile = document.querySelector(`img[data-row="${br}"][data-col="${bc}"]`);

    const tempSrc = clickedTile.src;
    clickedTile.src = blankTile.src;
    blankTile.src = tempSrc;

    // Update blank tile position
    blankPos = [r, c];

    // Increment turns
    turns++;
    document.getElementById("turns").innerText = turns;
    const sound = document.getElementById("slideSound");
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }

    // Check win
    checkWin();
  }
}


function checkWin() {
  const flatBoard = board.flat();
  const correct = ["blank","1", "2", "3", "4", "5", "6", "7", "8"];

  for (let i = 0; i < correct.length; i++) {
    if (flatBoard[i] !== correct[i]) return;
  }

  document.getElementById("status").innerText = "🎉 You solved it!";
  gameWon = true;
  clearInterval(timerInterval);
  //play win sound
  const winsound = document.getElementById("winsound");
  if(winsound){
    winsound.currentTime =0;
    winsound.play();
  }

// Save best move count
if (bestScore === "--" || turns < bestScore) {
  bestScore = turns;
  localStorage.setItem("bestScore", bestScore);
  document.getElementById("bestMoves").innerText = `🏆 Best: ${bestScore} moves`;
}


  // Confetti explosion
  confetti({
    particleCount: 550,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Repeat small confetti for more fun!
  setTimeout(() => confetti({ particleCount: 100, spread: 100 }), 300);
  setTimeout(() => confetti({ particleCount: 100, spread: 100 }), 600);
}




function shuffle(array) {
  do {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  } while (!isSolvable(array) || array.join(",") === correctOrder.join(","));
}

function isSolvable(tiles) {
  const nums = tiles
    .filter(tile => tile !== "blank")
    .map(Number);

  let invCount = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) {
        invCount++;
      }
    }
  }

  // For 3x3 (odd width), solvable if inversion count is even
  return invCount % 2 === 0;
}



