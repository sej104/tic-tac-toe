function GameBoard() {
    const row = 3;
    const column = 3;
    const board = [];

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < column; j++) {
            board[i][j] = null;
        }
    }

    function getBoard() {
        return board;
    }
    
    function printBoard() {
        console.log(board);
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

    return {getBoard, printBoard, placeMarker};
}

function Player(
    playerOneName = 'player1',
    playerTwoName = 'player2'
    ) {
    const playersArray = [
        {
            name: playerOneName,
            marker: 'x',
            points: 0
        },
        {
            name: playerTwoName,
            marker: 'o',
            points: 0
        }
    ];

    return {playersArray};
}

function GameController() {
    const board = GameBoard();
    const players = Player();

    let activePlayer = players.playersArray[0];

    function switchTurn() {
        activePlayer = (activePlayer === players.playersArray[0]) ?
            players.playersArray[1] : players.playersArray[0];
    }

    function printNewRound() {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn!`);
    }

    function isX(currentValue) {
        return currentValue === 'x';
    }

    function isO(currentValue) {
        return currentValue === 'o';
    }

    function playRound(row, column) {
        board.placeMarker(row, column, activePlayer.marker);
        console.log(`Placing '${activePlayer.marker}' onto [${row}, ${column}]`);

        const boardArray = board.getBoard();

        for (let i = 0; i < boardArray.length; i++) {
            if (boardArray[i].every(isX) || boardArray[i].every(isO)) {
                console.log(`${activePlayer.name} wins!`);
            } 
        }

        for (let i = 0; i < boardArray.length; i++) {
            const tempArr = [];
            for (let j = 0; j < boardArray.length; j++) {
                tempArr.push(boardArray[j][i]);
            }
            if (tempArr.every(isX) || tempArr.every(isO)) {
                console.log(`${activePlayer.name} wins!`);
            }
        }

        const tempArr = [];
        tempArr.push(boardArray[0][0], boardArray[1][1], boardArray[2][2]);
        if (tempArr.every(isX) || tempArr.every(isO)) {
            console.log(`${activePlayer.name} wins!`);
        }

        const tempArr2 = [];
        tempArr2.push(boardArray[2][0], boardArray[1][1], boardArray[0][2]);
        if (tempArr2.every(isX) || tempArr2.every(isO)) {
            console.log(`${activePlayer.name} wins!`);
        }

        switchTurn();
        printNewRound();
    }

    printNewRound();

    return {playRound};
}

const game = GameController();