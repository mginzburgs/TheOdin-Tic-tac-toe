function ticTacToe() {
  let log = "";
  let rows = "";
  let columns = "";
  const board = [];
  let player1 = "";
  let player2 = "";
  let currentPlayer = "";
  let winCount = "";

  const getBoardConsole = () => console.table(board);
  const getBoard = () => board;

  const setNames = (name1, name2) => {
    player1 = name1;
    player2 = name2;
    currentPlayer = player1;
  };

  const getPlayerNames = () => {
    return [player1, player2];
  };

  const createBoard = (size) => {
    rows = size;
    columns = size;
    board.length = 0;
    let a = 0;
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = null;
      }
    }
  };

  const setWinCount = (amount) => {
    winCount = parseInt(amount, 10);
  };

  const fillCell = (row, column) => {
    if (board[row][column] !== null) {
      log = "pick a valid cell";
      return "Pick a valid cell";
    }
    board[row][column] = currentPlayer ? currentPlayer : "1";
  };

  const switchPlayer = () => {
    currentPlayer === player1
      ? (currentPlayer = player2)
      : (currentPlayer = player1);
  };

  const getLog = () => {
    return log;
  };

  const getWinner = () => {
    // Horizontal check
    for (let i = 0; i < rows; i++) {
      let horizontalCount = 0;
      for (let j = 0; j < columns; j++) {
        if (board[i][j] === currentPlayer) {
          horizontalCount++;
          if (horizontalCount === winCount) {
            log = currentPlayer + " wins";
            return currentPlayer; // Winner found
          }
        } else {
          horizontalCount = 0; // Reset count
        }
      }
    }

    // Vertical check
    for (let i = 0; i < columns; i++) {
      let verticalCount = 0;
      for (let j = 0; j < rows; j++) {
        if (board[j][i] === currentPlayer) {
          verticalCount++;
          if (verticalCount === winCount) {
            log = currentPlayer + " wins";
            return currentPlayer;
          }
        } else {
          verticalCount = 0; // Reset count
        }
      }
    }

    // Main diagonal check (\ direction)
    for (let i = 0; i <= rows - winCount; i++) {
      for (let j = 0; j <= columns - winCount; j++) {
        let diagonalCount1 = 0;
        for (let k = 0; k < winCount; k++) {
          if (board[i + k][j + k] === currentPlayer) {
            diagonalCount1++;
            if (diagonalCount1 === winCount) {
              log = currentPlayer + " wins";
              return currentPlayer; // Winner found
            }
          } else {
            diagonalCount1 = 0; // Reset count
          }
        }
      }
    }

    // Anti-diagonal check (/ direction)
    for (let i = 0; i <= rows - winCount; i++) {
      for (let j = winCount - 1; j < columns; j++) {
        let diagonalCount2 = 0;
        for (let k = 0; k < winCount; k++) {
          if (board[i + k][j - k] === currentPlayer) {
            diagonalCount2++;
            if (diagonalCount2 === winCount) {
              log = currentPlayer + " wins";
              return currentPlayer; // Winner found
            }
          } else {
            diagonalCount2 = 0; // Reset count
          }
        }
      }
    }
    log = "next move, no winner found";
    return "next move, no winner found";
  };

  const makeMove = (row, column) => {
    fillCell(row, column);
    getWinner();
    isBoardFull();
    switchPlayer();
  };

  const isBoardFull = () => {
    let boardUpdate = getBoard();
    let isEmptyRow = [];
    const isNotNull = (value) => {
      return value != null;
    };
    boardUpdate.map((e) => {
      isEmptyRow.push(e.every(isNotNull));
    });
    const isTrue = (value) => {
      return value == true;
    };
    if (isEmptyRow.every(isTrue)) {
      return (log = "board is full");
    } else {
      return;
    }
  };

  return {
    createBoard,
    getBoard,
    getBoardConsole,
    fillCell,
    getWinner,
    makeMove,
    setWinCount,
    setNames,
    getPlayerNames,
    isBoardFull,
    getLog,
  };
}

function gameUI() {
  let app = document.querySelector(".app-container");

  const setDisplayText = (value) => {
    let displayText = document.querySelector(".display__text").innerText;
    displayText = value;
  };

  const showPlayerNames = () => {
    let players = document.querySelectorAll(".players__player");
    let playerNames = game.getPlayerNames();
    players[0].querySelector("p").innerText = playerNames[0];
    players[1].querySelector("p").innerText = playerNames[1];
  };

  const setPlayerNames = () => {
    let nameForm = document.querySelector(".name-dialog");
    nameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let player1 = document.getElementById("player1-name").value;
      let player2 = document.getElementById("player2-name").value;
      let boardSize = document.getElementById("board-size").value;
      let winAmount = document.getElementById("win-count").value;

      game.setNames(player1, player2);
      showPlayerNames();
      game.setWinCount(winAmount);
      game.createBoard(boardSize);
      drawBoard();

      document.querySelector(".name-form-container").style.display = "none";
    });
  };

  const drawBoard = () => {
    let displayText = document.querySelector(".display__text");
    let board = document.querySelector(".board__container");
    let boardArray = game.getBoard();
    board.innerHTML = "";
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    boardArray.forEach((row, rowIndex) => {
      const tablerow = document.createElement("tr");

      row.forEach((cell, collIndex) => {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell || "";
        tableCell.onclick = () => {
          if (cell === null) {
            game.makeMove(rowIndex, collIndex);
            drawBoard();
            let logtext = game.getLog();
            if (logtext.includes("wins") || logtext.includes("full")) {
              alert("     " + logtext + " !");
              location.reload();
            }
            displayText.innerText = logtext;
          }
        };
        tablerow.appendChild(tableCell);
      });
      tbody.appendChild(tablerow);
    });
    table.appendChild(tbody);
    board.appendChild(table);
  };

  return { showPlayerNames, setPlayerNames, drawBoard };
}

const game = ticTacToe();
const UI = gameUI();

UI.showPlayerNames();
UI.setPlayerNames();
