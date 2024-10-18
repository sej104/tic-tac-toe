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

    return {printBoard, placeMarker};
}

function Player(
    playerOneName = 'player1',
    playerTwoName = 'player2'
) {
    const playersArray = [
        {
            name: playerOneName,
            marker: 'x'
        },
        {
            name: playerTwoName,
            marker: 'o'
        }
    ];

    return {playersArray};
}