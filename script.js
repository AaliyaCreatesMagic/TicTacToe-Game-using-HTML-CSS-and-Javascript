const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

let currentPlayer = "X";
let board = [];
let gameActive = false;
let player1Name = "Player 1";
let player2Name = "Player 2";

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startGame() {
  player1Name = document.getElementById("player1").value || "Player 1";
  player2Name = document.getElementById("player2").value || "Player 2";
  gameActive = true;
  currentPlayer = "X";
  board = Array(9).fill("");
  renderBoard();
  updateStatus();
}

function restartGame() {
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  renderBoard();
  updateStatus();
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, index) => {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    if (cell === "X") {
      cellEl.textContent = "X";
      cellEl.style.color = "blue";
      cellEl.classList.add("taken");
    } else if (cell === "O") {
      cellEl.textContent = "O";
      cellEl.style.color = "red";
      cellEl.classList.add("taken");
    }

    cellEl.addEventListener("click", () => makeMove(index));
    boardEl.appendChild(cellEl);
  });
}

function makeMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner(currentPlayer)) {
    gameActive = false;
    const winnerName = currentPlayer === "X" ? player1Name : player2Name;
    statusEl.textContent = `${winnerName} won 🎉`;
    startConfetti();
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameActive = false;
    statusEl.textContent = "It's a Tie! 🤝 Restart to play again.";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function checkWinner(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function updateStatus() {
  if (!gameActive) return;
  const playerName = currentPlayer === "X" ? player1Name : player2Name;
  statusEl.textContent = `${playerName}'s turn (${currentPlayer})`;
}

/* --- Confetti effect --- */
let confettiPieces = [];

function startConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 3 + 2
    });
  }
  requestAnimationFrame(updateConfetti);
  setTimeout(() => confettiPieces = [], 4000);
}

function updateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.y += p.speed;
    if (p.y > confettiCanvas.height) p.y = -p.size;
  });
  if (confettiPieces.length > 0) requestAnimationFrame(updateConfetti);
}
