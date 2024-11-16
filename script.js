const GAME_BOARD = document.querySelector("#gameboard");
const PLAYER_DISPLAY = document.querySelector("#player");
const INFO_DISPLAY = document.querySelector("#info-display");
const WIDTH = 8;
let playerGo = 'black';
PLAYER_DISPLAY.textContent = 'black';

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
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id', i);

        let row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 == 0) {
            square.classList.add(i % 2 == 0 ? 'whiteSpot' : 'blackSpot');
        }
        else {
            square.classList.add(i % 2 == 0 ? 'blackSpot' : 'whiteSpot');
        }

        if (i <= 15) { ///Logic need rework
            square.firstChild.firstChild.classList.add('black');
        }  

        if (i >= 48) { ///Logic need rework
            square.firstChild.firstChild.classList.add('white');
        }  

        GAME_BOARD.append(square);
    })
}

createBoard();

const ALL_SQUARES = document.querySelectorAll(".square")

ALL_SQUARES.forEach(square => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

let startPositionId;
let draggedElement;

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(e) {
    e.stopPropagation();
    let correctGo = draggedElement.firstChild.classList.contains(playerGo);
    let taken = e.target.classList.contains('piece');
    let opponentGo = playerGo == 'white' ? 'black' : 'white';
    let takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            return;
        }

        if (taken && !takenByOpponent) {
            INFO_DISPLAY.textContent = "You can't go here";
            setTimeout(() => INFO_DISPLAY.textContent = "", 2000);
            return;
        }

        if (valid) {
            e.target.append(draggedElement) 
            changePlayer();
            return;
        }
    }
}

function changePlayer() {
    if (playerGo == 'black') {
        reverseIds();
        playerGo = 'white';
        PLAYER_DISPLAY.textContent = 'white';
    }
    else {
        revertIds();
        playerGo = 'black';
        PLAYER_DISPLAY.textContent = 'black';
    }
}

function reverseIds() {
    const ALL_SQUARES = document.querySelectorAll('.square');
    ALL_SQUARES.forEach((square, i) => 
        square.setAttribute('square-id', (WIDTH * WIDTH - 1) - i));
}

function revertIds() {
    const ALL_SQUARES = document.querySelectorAll('.square');
    ALL_SQUARES.forEach((square, i) => 
        square.setAttribute('square-id', i));
}



