let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = '';
let isGameOver = false;

function startGame(mode) {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameMode = mode;
  isGameOver = false;
  document.getElementById('board').classList.remove('hidden');
  document.getElementById('restart').classList.remove('hidden');
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('message').textContent = '';
  renderBoard();
  if (gameMode.includes('IA') && currentPlayer === 'O') playAIMove();
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.textContent = cell;
    div.onclick = () => handleMove(i);
    boardEl.appendChild(div);
  });
}

function handleMove(index) {
  if (board[index] !== '' || isGameOver) return;
  board[index] = currentPlayer;
  document.getElementById('sound-move').play();
  renderBoard();
  if (checkWin()) {
    document.getElementById('sound-win').play();
    document.getElementById('message').textContent = ${currentPlayer} a gagné !;
    isGameOver = true;
    return;
  } else if (!board.includes('')) {
    document.getElementById('message').textContent = "Match nul !";
    isGameOver = true;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if (gameMode.includes('IA') && currentPlayer === 'O') playAIMove();
}

function restartGame() {
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('board').classList.add('hidden');
  document.getElementById('restart').classList.add('hidden');
}

function checkWin() {
  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winConditions.some(c => {
    return c.every(i => board[i] === currentPlayer);
  });
}

function playAIMove() {
  let move;
  if (gameMode === 'easy') {
    const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } else if (gameMode === 'hard') {
    move = findBestMove(board, currentPlayer, 1);
  } else {
    move = findBestMove(board, currentPlayer);
  }
  if (move !== undefined) handleMove(move);
}

function findBestMove(b, player, depthLimit = Infinity) {
  const opponent = player === 'X' ? 'O' : 'X';

  function minimax(newBoard, currentPlayer, depth) {
    const winner = getWinner(newBoard);
    if (winner === player) return { score: 10 - depth };
    if (winner === opponent) return { score: depth - 10 };
    if (!newBoard.includes('') || depth >= depthLimit) return { score: 0 };

    const moves = [];
    newBoard.forEach((cell, i) => {
      if (cell === '') {
        const boardCopy = [...newBoard];
        boardCopy[i] = currentPlayer;
        const result = minimax(boardCopy, currentPlayer === 'X' ? 'O' : 'X', depth + 1);
        moves.push({ index: i, score: result.score });
      }
    });

    if (currentPlayer === player) {
      return moves.reduce((a, b) => a.score > b.score ? a : b);
    } else {
      return moves.reduce((a, b) => a.score < b.score ? a : b);
    }
  }

  return minimax(b, player, 0).index;
}

function getWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of wins) {
    const [a, b1, c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
}
