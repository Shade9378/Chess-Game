class ChessBoard {
    constructor(){
        let row = 8;
        let column = 8;
        board = []
    }

    newBoard() {
        const gridSize = 8;

        for (let y = 0; y<gridSize; y++) {
            let line = '';
            for (let x=0; x<gridSize; x++) {
                line += ((x+y)%2) ? ' ' : '#';
            }
        console.log(line);
        }
    }
}