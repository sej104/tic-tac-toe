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
        marker: 'x',
        points: 0
    };

    const playerTwo = {
        name: playerTwoName,
        marker: 'o',
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
    let roundNumber = 0;

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
        roundNumber = 0;
    }

    function setWinner() {
        console.log(`${activePlayer.name} wins!`);
        activePlayer.points += 1;
        resetGame();
    }

    function setTie() {
        console.log('Tie game!');
        ties += 1;
        resetGame();
    }

    function checkWinner(item1, item2, item3) {
        if (
            item1 === activePlayer.marker &&
            item2 === activePlayer.marker &&
            item3 === activePlayer.marker
        ) return true;
    }

    function playRound(row, column) {
        board.placeMarker(row, column, activePlayer.marker);
        console.log(`Placing '${activePlayer.marker}' onto [${row}][${column}]`);

        const boardArray = board.getBoard();

        for (let i = 0; i < boardArray.length; i++) {
            if (
                checkWinner(boardArray[i][0], boardArray[i][1], boardArray[i][2]) ||
                checkWinner(boardArray[0][i], boardArray[1][i], boardArray[2][i]) ||
                checkWinner(boardArray[0][0], boardArray[1][1], boardArray[2][2]) ||
                checkWinner(boardArray[0][2], boardArray[1][1], boardArray[2][0])
            ) {
                board.printBoard();
                setWinner();
                break;
            }
        }

        roundNumber += 1;
        if (roundNumber > 9) {
            setTie();
        }

        switchTurn();
        printNewRound();
    }

    function getActivePlayer() {
        return activePlayer;
    }

    printNewRound();

    return {playRound, getBoard: board.getBoard, getActivePlayer};
}

function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector('.board');
    const turnDiv = document.querySelector('.turn');

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

    updateScreen();
}

ScreenController();
