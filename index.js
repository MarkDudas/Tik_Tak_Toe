const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', '']; 
  
  const getBoard = () => board;
  
  const setMark = (index, mark) => {
      if (board[index] === '') {
          board[index] = mark;
      }
  };

  const resetBoard = () => {
      board = ['', '', '', '', '', '', '', '', ''];
  };

  const checkWin = (mark) => {
      const winningCombos = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
          [0, 4, 8], [2, 4, 6]             // Diagonals
      ];
      return winningCombos.some(combo => 
          combo.every(index => board[index] === mark)
      );
  };

  const checkTie = () => {
      return board.every(cell => cell !== '');
  };

  return { getBoard, setMark, resetBoard, checkWin, checkTie };
})();

const Player = (name, mark) => {
  return { name, mark };
};

const GameController = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;

  const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const playRound = (index) => {
      if (Gameboard.getBoard()[index] !== '') return; // Prevent overriding
      Gameboard.setMark(index, currentPlayer.mark);

      if (Gameboard.checkWin(currentPlayer.mark)) {
          DisplayController.showMessage(`${currentPlayer.name} wins!`);
      } else if (Gameboard.checkTie()) {
          DisplayController.showMessage("It's a tie!");
      } else {
          switchPlayer();
      }

      DisplayController.updateGameboard();
  };

  const restartGame = () => {
      Gameboard.resetBoard();
      currentPlayer = player1;
      DisplayController.updateGameboard();
      DisplayController.showMessage("");
  };

  return { getCurrentPlayer, playRound, restartGame };
})();


const DisplayController = (() => {
  const gameboardElement = document.getElementById('gameboard');
  const messageElement = document.getElementById('message');
  const restartButton = document.getElementById('restartBtn');

  const renderGameboard = () => {
      gameboardElement.innerHTML = ''; // Clear existing board
      Gameboard.getBoard().forEach((mark, index) => {
          const cell = document.createElement('div');
          cell.textContent = mark;
          cell.addEventListener('click', () => GameController.playRound(index));
          gameboardElement.appendChild(cell);
      });
  };

  const updateGameboard = () => {
      Gameboard.getBoard().forEach((mark, index) => {
          gameboardElement.children[index].textContent = mark;
      });
  };

  const showMessage = (message) => {
      messageElement.textContent = message;
  };

  restartButton.addEventListener('click', () => GameController.restartGame());

  return { renderGameboard, updateGameboard, showMessage };
})();

DisplayController.renderGameboard();
