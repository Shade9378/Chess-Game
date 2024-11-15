const GAME_BOARD = document.querySelector("#gameboard");
const PLAYER_DISPLAY = document.querySelector("#player");
const INFO_DISPLAY = document.querySelector("#info-display");
const WIDTH = 8;

const START_PIECES = [ ///Initialization need rework
    ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK,
    PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN,
    ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK
]

function createBoard() {
    START_PIECES.forEach((startPiece, i) => {
        let square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        
        square.setAttribute('square-id', i);

        let row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 == 0) {
            square.classList.add(i % 2 == 0 ? 'white' : 'black');
        }
        else {
            square.classList.add(i % 2 == 0 ? 'black' : 'white');
        }

        if (i <= 15) { ///Logic need rework
            square.firstChild.firstChild.classList.add('blackPiece');
        }  

        if (i >= 48) { ///Logic need rework
            square.firstChild.firstChild.classList.add('whitePiece');
        }  

        GAME_BOARD.append(square);
    })
}

createBoard();