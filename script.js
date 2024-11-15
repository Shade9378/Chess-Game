const GAME_BOARD = document.querySelector("#gameboard");
const PLAYER_DISPLAY = document.querySelector("#player");
const INFO_DISPLAY = document.querySelector("#info-display");
const WIDTH = 8;

const START_PIECES = [
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
    START_PIECES.forEach((startPiece) => {
        const SQUARE = document.createElement('div');
        SQUARE.classList.add('square')
    })
}