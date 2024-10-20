function GameBoard() {
    const row = 3;
    const column = 3;
    const board = [];

    function resetBoard() {
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < column; j++) {
                board[i][j] = null;
            }
        }
    }

    function printBoard() {
        const boardWithValues = board.map((row) => row.map((value) => value));
        console.log(boardWithValues);
    }

    function getBoard() {
        return board;
    }

    function placeMarker(row, column, player) {
        if (
            (row < 0 || row >= board.length) ||
            (column < 0 || column >= board.length)
        ) {
            console.log('ERROR! Index out of range');
        } else if (!board[row][column]) {
            board[row][column] = player;
        } else {
            console.log('ERROR! The square is already filled in');
        }
    }

    resetBoard();

    return {resetBoard, printBoard, getBoard, placeMarker};
}

function Player(
    playerOneName = 'player1',
    playerTwoName = 'player2'
    ) {
    const playerOne = {
        name: playerOneName,
        marker: 'X',
        points: 0
    };

    const playerTwo = {
        name: playerTwoName,
        marker: 'O',
        points: 0
    };

    return {playerOne, playerTwo};
}

function GameController() {
    const board = GameBoard();
    const players = Player();
    const playerOne = players.playerOne;
    const playerTwo = players.playerTwo;

    let activePlayer = playerOne;
    let ties = 0;
    let roundNumber = 1;

    function switchTurn() {
        activePlayer = (activePlayer === playerOne) ?
            playerTwo : playerOne;
    }

    function printNewRound() {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn!`);
    }

    function displayPoints() {
        console.log(
            {
                [playerOne.name]: playerOne.points, 
                [playerTwo.name]: playerTwo.points,
                ties: ties
            }
        );
    }

    function resetGame() {
        displayPoints();
        console.log("Restarting game...");
        board.resetBoard();
        roundNumber = 1;
    }

    function setWinner() {
        console.log(`${activePlayer.name} wins!`);
        activePlayer.points += 1;
        roundNumber = 1; // REMOVE. SHOULD BE IN RESET GAME
    }

    function setTie() {
        console.log('Tie game!');
        ties += 1;
        roundNumber = 1; // REMOVE. SHOULD BE IN RESET GAME
    }

    function allEqual(item1, item2, item3) {
        if (
            item1 === activePlayer.marker &&
            item2 === activePlayer.marker &&
            item3 === activePlayer.marker
        ) return true;
    }

    function checkWinner() {
        const boardArray = board.getBoard();
        for (let i = 0; i < boardArray.length; i++) {
            if (
                allEqual(boardArray[i][0], boardArray[i][1], boardArray[i][2]) ||
                allEqual(boardArray[0][i], boardArray[1][i], boardArray[2][i]) ||
                allEqual(boardArray[0][0], boardArray[1][1], boardArray[2][2]) ||
                allEqual(boardArray[0][2], boardArray[1][1], boardArray[2][0])
            ) {
                return true;
            }
        }
        return false;
    }

    function checkTie() {
        const boardArray = board.getBoard();
        for(let i = 0; i < boardArray.length; i++) {
            for(let j = 0; j < boardArray.length; j++) {
                if (boardArray[i][j] === null) return false;
            }
        }
        return true;
    }

    function playRound(row, column) {
        board.placeMarker(row, column, activePlayer.marker);
        console.log(`Placing '${activePlayer.marker}' onto [${row}][${column}]`);

        if (checkWinner()) {
            board.printBoard();
            setWinner();
            return;
        }

        roundNumber += 1;
        if (checkTie()) {
            board.printBoard();
            setTie();
            return;
        }

        switchTurn();
        printNewRound();
    }

    function getActivePlayer() {
        return activePlayer;
    }

    printNewRound();

    return {
        playRound, 
        getBoard: board.getBoard, 
        getActivePlayer, 
        resetGame,
        checkWinner,
        checkTie
    };
}

function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');
    const restartButton = document.querySelector('.restart');

    function updateScreen() {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer().name;

        boardDiv.textContent = "";
        turnDiv.textContent = `${activePlayer}'s turn...`;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                const cellButton = document.createElement('button');
                cellButton.textContent = board[row][col];
                cellButton.classList.add('cell');
                cellButton.dataset.row = row;
                cellButton.dataset.column = col;
                boardDiv.appendChild(cellButton);
            }
        }
    }

    boardDiv.addEventListener('click', (event) => {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;
        const currentValue = event.target.textContent;
        
        if (!selectedRow || !selectedColumn || currentValue) return;

        game.playRound(selectedRow, selectedColumn);

        if (game.checkWinner()) {
            updateScreen();
            turnDiv.textContent = `${game.getActivePlayer().name} wins!`;
            boardDiv.classList.add('disable');
            return;
        }

        if (game.checkTie()) {
            updateScreen();
            turnDiv.textContent = `It's a tie!`;
            return;
        }

        updateScreen();
    });

    restartButton.addEventListener('click', () => {
        game.resetGame();
        boardDiv.classList.remove('disable');
        updateScreen();
    });

    updateScreen();
}

ScreenController();
