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

    return {resetBoard, getBoard, placeMarker};
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
        console.log(board.getBoard());
        console.log(`${activePlayer.name}'s turn!`);
    }

    function isActivePlayerMarker(currentValue) {
        return currentValue === activePlayer.marker;
    }

    function setWinner() {
        console.log(`${activePlayer.name} wins!`);
        activePlayer.points += 1;
    }

    function setTie() {
        ties += 1;
        console.log('Tie game!');
        displayPoints();
        board.resetBoard();
        resetRoundNumber();
    }

    function resetRoundNumber() {
        roundNumber = 0;
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

    function playRound(row, column) {
        board.placeMarker(row, column, activePlayer.marker);
        console.log(`Placing '${activePlayer.marker}' onto [${row}, ${column}]`);

        const boardArray = board.getBoard();

        for (let i = 0; i < boardArray.length; i++) {
            if (boardArray[i].every(isActivePlayerMarker)) {
                setWinner();
                displayPoints();
                board.resetBoard();
                resetRoundNumber();
            } 
        }

        for (let i = 0; i < boardArray.length; i++) {
            const tempArr = [];
            for (let j = 0; j < boardArray.length; j++) {
                tempArr.push(boardArray[j][i]);
            }
            if (tempArr.every(isActivePlayerMarker)) {
                setWinner();
                displayPoints();
                board.resetBoard();
                resetRoundNumber();
            }
        }

        const tempArr = [];
        tempArr.push(boardArray[0][0], boardArray[1][1], boardArray[2][2]);
        if (tempArr.every(isActivePlayerMarker)) {
            setWinner();
            displayPoints();
            board.resetBoard();
            resetRoundNumber();
        }

        const tempArr2 = [];
        tempArr2.push(boardArray[2][0], boardArray[1][1], boardArray[0][2]);
        if (tempArr2.every(isActivePlayerMarker)) {
            setWinner();
            displayPoints();
            board.resetBoard();
            resetRoundNumber();
        }

        roundNumber += 1;
        if (roundNumber > 9) {
            setTie();
        }

        switchTurn();
        printNewRound();
    }

    printNewRound();

    return {playRound};
}

const game = GameController();