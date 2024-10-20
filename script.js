const board = (function() {
    const board = [];

    const getBoard = () => board;

    const resetBoard = () => { 
        for (let row = 0; row < 3; row++) {
            board[row] = [];
            for (let col = 0; col < 3; col++) {
                board[row][col] = null;
            }
        }
    }

    const placeMarker = (row, column, player) => {
        if (!board[row][column]) {
            board[row][column] = player;
        }
    }

    resetBoard();

    return {
        getBoard, 
        resetBoard,
        placeMarker
    };
})();

const player = (function() {
    const playerOne = {
        name: 'player X',
        marker: 'X'
    };

    const playerTwo = {
        name: 'player O',
        marker: 'O'
    };

    return {playerOne, playerTwo};
})();

const game = (function() {
    const playerOne = player.playerOne;
    const playerTwo = player.playerTwo;
    const boardArray = board.getBoard();
    let activePlayer = playerOne;

    const getActivePlayer = () => activePlayer;

    const switchTurn = () => {
        activePlayer = (activePlayer === playerOne) ?
            playerTwo : playerOne;
    }

    const allEqual = (value1, value2, value3) => {
        const arr = [value1, value2, value3];
        
        if (arr.every(currentValue => currentValue === activePlayer.marker)) {
            return true;
        }
    }

    const checkWinner = () => {
        for (let i = 0; i < boardArray.length; i++) {
            if (
                allEqual(boardArray[i][0], boardArray[i][1], boardArray[i][2]) ||
                allEqual(boardArray[0][i], boardArray[1][i], boardArray[2][i]) ||
                allEqual(boardArray[0][0], boardArray[1][1], boardArray[2][2]) ||
                allEqual(boardArray[0][2], boardArray[1][1], boardArray[2][0])
            ) return true;
        }
    }

    const checkTie = () => {
        for (const row of boardArray) {
            for (const column of row) {
                if (!column) return false;
            }
        }
        return true;
    }

    const playRound = (row, column) => {
        board.placeMarker(row, column, activePlayer.marker);

        if (checkWinner() || checkTie()) return;

        switchTurn();
    }

    return {        
        getBoard: board.getBoard, 
        resetGame: board.resetBoard,
        getActivePlayer, 
        switchTurn,
        checkWinner,
        checkTie,
        playRound 
    };
})();

const screenController = (function() {
    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');
    const restartButton = document.querySelector('.restart');

    const updateScreen = () => {
        const boardArray = game.getBoard();
        const activePlayer = game.getActivePlayer().name;

        boardDiv.textContent = '';
        turnDiv.textContent = `${activePlayer}'s turn...`;

        for (let row = 0; row < boardArray.length; row++) {
            for (let col = 0; col < boardArray.length; col++) {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.row = row;
                cellButton.dataset.column = col;
                cellButton.textContent = boardArray[row][col];
                boardDiv.appendChild(cellButton);
            }
        }
    }

    boardDiv.addEventListener('click', (event) => {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;
        const currentMarker = event.target.textContent;
        
        if (!selectedRow || !selectedColumn || currentMarker) return;

        game.playRound(selectedRow, selectedColumn);

        if (game.checkWinner()) {
            updateScreen();
            boardDiv.classList.add('disable');
            turnDiv.textContent = `${game.getActivePlayer().name} wins!`;
            return;
        }

        if (game.checkTie()) {
            updateScreen();
            boardDiv.classList.add('disable');
            turnDiv.textContent = `It's a tie!`;
            return;
        }

        updateScreen();
    });

    restartButton.addEventListener('click', () => {
        game.resetGame();
        game.switchTurn();
        boardDiv.classList.remove('disable');
        updateScreen();
    });

    updateScreen();
})();

screenController();
