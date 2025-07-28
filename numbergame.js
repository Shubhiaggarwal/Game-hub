let secret;
let attempts = 0;
let timer;
let timeLeft = 300;
let playerName = "";
let highScore = localStorage.getItem("highScore") || null;
let highScoreName = localStorage.getItem("highScoreName") || null;
const timerDisplay = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScore");
const winSound = document.getElementById("winSound");
const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");




function promptName() {
  playerName = prompt("Enter your name:")?.trim() || "Player";
  document.getElementById("playerName").textContent = playerName;
}

function startGame() {
  promptName();
  secret = generateNumber();
  attempts = 0;
  timeLeft = 300;
  document.getElementById("attemptList").innerHTML = "";
  document.getElementById("result").textContent = "";
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("guessInput").value = "";
  clearConfetti();
  timerDisplay.textContent = timeLeft;

  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);

  // Display high score if available
  highScore = localStorage.getItem("highScore");
  highScoreName = localStorage.getItem("highScoreName");
  if (highScore && highScoreName) {
    highScoreDisplay.textContent = `${highScoreName} 👑 - ${highScore} attempts`;
  } else {
    highScoreDisplay.textContent = "--";
  }
}


function generateNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

function checkGuess() {
  const input = document.getElementById("guessInput");
  const guess = parseInt(input.value);
  const result = document.getElementById("result");
  const attemptList = document.getElementById("attemptList");

  if (isNaN(guess) || guess < 1000 || guess > 9999) {
    result.textContent = "❌ Please enter a valid 4-digit number.";
    errorSound.play();
    return;
  }

  clickSound.play();
  attempts++;

  let correct = 0;
  let guessCopy = guess;
  let secretCopy = secret;

  for (let i = 0; i < 4; i++) {
    if (guessCopy % 10 === secretCopy % 10) {
      correct++;
    }
    guessCopy = Math.floor(guessCopy / 10);
    secretCopy = Math.floor(secretCopy / 10);
  }

  const li = document.createElement("li");
  li.textContent = `Attempt ${attempts}: ${guess} → ${correct} correct`;
  attemptList.appendChild(li);

  if (correct === 4) {
    result.textContent = `🎉 ${playerName}, you win in ${attempts} attempts! The number was ${secret}.`;
    winSound.play();
    showPopup(`🎉 Congratulations, ${playerName}!`, `You guessed it in ${attempts} attempts.`);
    launchConfetti();
    clearInterval(timer);

    if (!highScore || attempts < highScore) {
  localStorage.setItem("highScore", attempts);
  localStorage.setItem("highScoreName", playerName);
  highScoreDisplay.textContent = `${playerName} 👑 - ${attempts} attempts`;
}


  } else {
    result.textContent = `Try again! ${correct} digit(s) correct in the right position.`;
  }

  input.value = "";
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    document.getElementById("result").textContent = `⏰ Oops, time's up! The number was ${secret}`;
    showPopup("⏰ Time's Over!", `Better luck next time, ${playerName}.`);
  }
}

function showPopup(title, subtitle) {
  document.getElementById("popupMessage").textContent = title;
  document.getElementById("popupSubText").textContent = subtitle;
  document.getElementById("popup").classList.remove("hidden");
}

function restartGame() {
  startGame();
}

function launchConfetti() {
  const container = document.getElementById("confetti-container");
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.textContent = "🎊";
    confetti.style.position = "absolute";
    confetti.style.fontSize = "20px";
    confetti.style.top = Math.random() * 100 + "%";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear`;
    container.appendChild(confetti);
  }
  setTimeout(clearConfetti, 4000);
}
function resetHighScore() {
  localStorage.removeItem("highScore");
  localStorage.removeItem("highScoreName");
  highScoreDisplay.textContent = "--";
}


function clearConfetti() {
  document.getElementById("confetti-container").innerHTML = "";
}

// Start the game on load
window.onload = startGame;
