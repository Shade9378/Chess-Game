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
    let valid = checkIfValid(e.target);
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

function checkIfValid(target) {
    let targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    let startId = Number(startPositionId);
    let piece = draggedElement.id;

    switch(piece) {
        case 'pawn':
            let starterRow = [8,9,10,11,12,13,14,15];
            if (
                starterRow.includes(startId) && startId + WIDTH * 2 == targetId ||
                startId + WIDTH == targetId || 
                startId + WIDTH - 1 == targetId && document.querySelector(`[square-id="${startId + WIDTH - 1}"]`).firstChild ||
                startId + WIDTH + 1 == targetId && document.querySelector(`[square-id="${startId + WIDTH + 1}"]`).firstChild
                ) {
                return true;
            }
            break;
        case 'knight':
            if (
                startId + WIDTH * 2 - 1 == targetId ||
                startId + WIDTH * 2 + 1 == targetId ||
                startId + WIDTH - 2 == targetId ||
                startId + WIDTH + 2 == targetId ||
                startId - WIDTH * 2 + 1 == targetId ||
                startId - WIDTH * 2 - 1 == targetId ||
                startId - WIDTH - 2 == targetId ||
                startId - WIDTH + 2 == targetId 
            ) {
                return true;
            }
            break;
        case 'bishop':
            if (
                startId + WIDTH + 1 == targetId ||
                startId + WIDTH * 2 + 2 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) ||
                startId + WIDTH * 3 + 3 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) ||
                startId + WIDTH * 4 + 4 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) ||
                startId + WIDTH * 5 + 5 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 + 4}"]`.firstChild) ||
                startId + WIDTH * 6 + 6 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 + 5}"]`.firstChild) ||
                startId + WIDTH * 7 + 7 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 + 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6 + 6}"]`.firstChild) ||
                
                startId - WIDTH - 1 == targetId ||
                startId - WIDTH * 2 - 2 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) ||
                startId - WIDTH * 3 - 3 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) ||
                startId - WIDTH * 4 - 4 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) ||
                startId - WIDTH * 5 - 5 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 - 4}"]`.firstChild) ||
                startId - WIDTH * 6 - 6 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 - 5}"]`.firstChild) ||
                startId - WIDTH * 7 - 7 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 - 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 6 - 6}"]`.firstChild) ||

                startId - WIDTH + 1 == targetId == targetId ||
                startId - WIDTH * 2 + 2 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) ||
                startId - WIDTH * 3 + 3 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) ||
                startId - WIDTH * 4 + 4 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) ||
                startId - WIDTH * 5 + 5 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 + 4}"]`.firstChild) ||
                startId - WIDTH * 6 + 6 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 + 5}"]`.firstChild) ||
                startId - WIDTH * 7 + 7 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 + 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 6 + 6}"]`.firstChild) ||

                startId + WIDTH - 1 == targetId ||
                startId + WIDTH * 2 - 2 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) ||
                startId + WIDTH * 3 - 3 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) ||
                startId + WIDTH * 4 - 4 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) ||
                startId + WIDTH * 5 - 5 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 - 4}"]`.firstChild) ||
                startId + WIDTH * 6 - 6 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 - 5}"]`.firstChild) ||
                startId + WIDTH * 7 - 7 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 - 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6 - 6}"]`.firstChild)
            ) {
                return true;
            }
        case 'rook':
            if (
                startId + WIDTH == targetId ||
                startId + WIDTH * 2 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) ||
                startId + WIDTH * 3 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) ||
                startId + WIDTH * 4 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) ||
                startId + WIDTH * 5 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4}"]`.firstChild) ||
                startId + WIDTH * 6 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5}"]`.firstChild) ||
                startId + WIDTH * 7 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6}"]`.firstChild) ||

                startId - WIDTH == targetId ||
                startId - WIDTH * 2 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) ||
                startId - WIDTH * 3 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) ||
                startId - WIDTH * 4 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) ||
                startId - WIDTH * 5 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4}"]`.firstChild) ||
                startId - WIDTH * 6 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5}"]`.firstChild) ||
                startId - WIDTH * 7 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 6}"]`.firstChild) ||
                
                startId + 1 == targetId ||
                startId + 2 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) ||
                startId + 3 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) ||
                startId + 4 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) ||
                startId + 5 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 4}"]`.firstChild) ||
                startId + 6 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 5}"]`.firstChild) ||
                startId + 7 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6}"]`.firstChild) ||

                startId - 1 == targetId ||
                startId - 2 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) ||
                startId - 3 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) ||
                startId - 4 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) ||
                startId - 5 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 4}"]`.firstChild) ||
                startId - 6 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 5}"]`.firstChild) ||
                startId - 7 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 6}"]`.firstChild)
            ) {
                return true;
            }
            break;
        case 'queen':
            if (
                startId + WIDTH == targetId ||
                startId + WIDTH * 2 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) ||
                startId + WIDTH * 3 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) ||
                startId + WIDTH * 4 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) ||
                startId + WIDTH * 5 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4}"]`.firstChild) ||
                startId + WIDTH * 6 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5}"]`.firstChild) ||
                startId + WIDTH * 7 == targetId && !document.querySelector(`[square-id="${startId + WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6}"]`.firstChild) ||

                startId - WIDTH == targetId ||
                startId - WIDTH * 2 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) ||
                startId - WIDTH * 3 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) ||
                startId - WIDTH * 4 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) ||
                startId - WIDTH * 5 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4}"]`.firstChild) ||
                startId - WIDTH * 6 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5}"]`.firstChild) ||
                startId - WIDTH * 7 == targetId && !document.querySelector(`[square-id="${startId - WIDTH}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 6}"]`.firstChild) ||
                
                startId + 1 == targetId ||
                startId + 2 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) ||
                startId + 3 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) ||
                startId + 4 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) ||
                startId + 5 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 4}"]`.firstChild) ||
                startId + 6 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 5}"]`.firstChild) ||
                startId + 7 == targetId && !document.querySelector(`[square-id="${startId + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6}"]`.firstChild) ||

                startId - 1 == targetId ||
                startId - 2 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) ||
                startId - 3 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) ||
                startId - 4 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) ||
                startId - 5 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 4}"]`.firstChild) ||
                startId - 6 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 5}"]`.firstChild) ||
                startId - 7 == targetId && !document.querySelector(`[square-id="${startId - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - 6}"]`.firstChild) ||
            
                startId + WIDTH + 1 == targetId ||
                startId + WIDTH * 2 + 2 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) ||
                startId + WIDTH * 3 + 3 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) ||
                startId + WIDTH * 4 + 4 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) ||
                startId + WIDTH * 5 + 5 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 + 4}"]`.firstChild) ||
                startId + WIDTH * 6 + 6 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 + 5}"]`.firstChild) ||
                startId + WIDTH * 7 + 7 == targetId && !document.querySelector(`[square-id="${startId + WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 + 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6 + 6}"]`.firstChild) ||
                
                startId - WIDTH - 1 == targetId ||
                startId - WIDTH * 2 - 2 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) ||
                startId - WIDTH * 3 - 3 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) ||
                startId - WIDTH * 4 - 4 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) ||
                startId - WIDTH * 5 - 5 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 - 4}"]`.firstChild) ||
                startId - WIDTH * 6 - 6 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 - 5}"]`.firstChild) ||
                startId - WIDTH * 7 - 7 == targetId && !document.querySelector(`[square-id="${startId - WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 - 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 6 - 6}"]`.firstChild) ||

                startId - WIDTH + 1 == targetId ||
                startId - WIDTH * 2 + 2 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) ||
                startId - WIDTH * 3 + 3 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) ||
                startId - WIDTH * 4 + 4 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) ||
                startId - WIDTH * 5 + 5 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 + 4}"]`.firstChild) ||
                startId - WIDTH * 6 + 6 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 + 5}"]`.firstChild) ||
                startId - WIDTH * 7 + 7 == targetId && !document.querySelector(`[square-id="${startId - WIDTH + 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 2 + 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 3 + 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 4 + 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 5 + 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId - WIDTH * 6 + 6}"]`.firstChild) ||

                startId + WIDTH - 1 == targetId ||
                startId + WIDTH * 2 - 2 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) ||
                startId + WIDTH * 3 - 3 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) ||
                startId + WIDTH * 4 - 4 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) ||
                startId + WIDTH * 5 - 5 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 - 4}"]`.firstChild) ||
                startId + WIDTH * 6 - 6 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 - 5}"]`.firstChild) ||
                startId + WIDTH * 7 - 7 == targetId && !document.querySelector(`[square-id="${startId + WIDTH - 1}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 2 - 2}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 3 - 3}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 4 - 4}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 5 - 5}"]`.firstChild) && !document.querySelector(`[square-id="${startId + WIDTH * 6 - 6}"]`.firstChild)
            ) {
                return true;
            }
         case 'king':
                if (
                    startId + 1 == targetId ||
                    startId - 1 == targetId ||
                    startId + WIDTH == targetId ||
                    startId - WIDTH == targetId ||
                    startId + WIDTH - 1 == targetId ||
                    startId - WIDTH - 1 == targetId ||
                    startId + WIDTH + 1== targetId ||
                    startId - WIDTH + 1 == targetId
                ) {
                    return true;
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



