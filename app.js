const socket = io('ws://localhost:8080');

socket.on('message', text => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)
});

document.querySelector('.send-message').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
}

const GAME_BOARD = document.querySelector("#gameboard");
const PLAYER_DISPLAY = document.querySelector("#player");
const INFO_DISPLAY = document.querySelector("#info-display");
const WIDTH = 8;
let playerGo = 'white';
let gameMode = 'offline 1v1';
PLAYER_DISPLAY.textContent = 'white';

const START_PIECES = [ ///Initialization need rework
    ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK,
    PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN,
    ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK
]

///Initialized chessboard
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

///Function allows the movement of the chess pieces
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
    let opponentGo = playerGo == 'black' ? 'white' : 'black';
    let takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            checkForWin()
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

/// Function check if the move is valid
function checkIfValid(target) {
    let targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    let startId = Number(startPositionId);
    let piece = draggedElement.id;

    switch(piece) {
        case 'pawn':
            let starterRow = [48,49,50,51,52,53,54,55];
            if (
                starterRow.includes(startId) && startId - WIDTH * 2 == targetId ||
                startId - WIDTH == targetId || 
                startId - WIDTH - 1 == targetId && document.querySelector(`[square-id="${startId + WIDTH - 1}"]`).firstChild ||
                startId - WIDTH + 1 == targetId && document.querySelector(`[square-id="${startId + WIDTH + 1}"]`).firstChild
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
            break;
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
            break;
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

/// Function changes the player's turn
function changePlayer() {
    if (playerGo == 'white') {
        reverseIds();
        playerGo = 'black';
        PLAYER_DISPLAY.textContent = 'black';
    }
    else {
        revertIds();
        playerGo = 'white';
        PLAYER_DISPLAY.textContent = 'white';
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


/// Function checks if either of the player won
function checkForWin() {
    let kings = Array.from(document.querySelectorAll('#king'));
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        INFO_DISPLAY.innerHTML = "Black player wins!";
        let ALL_SQUARES = document.querySelectorAll('.square')
        ALL_SQUARES.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        INFO_DISPLAY.innerHTML = "White player wins!";
        let ALL_SQUARES = document.querySelectorAll('.square');
        ALL_SQUARES.forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
}

function changeGameMode(mode) {
    gameMode = mode;
}

if (gameMode == 'online 1v1') {
    let player1 = "white";
    let player2 = "black";

}





