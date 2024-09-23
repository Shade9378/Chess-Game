class Bishop {
    row = [a, b , c , d, e ,f g]
    column = [1, 2, 3, 4, 5, 6, 7]

    /*

    ///PIECES LOGICS/MOVE PATTERN
    ** i: Number of moves you want to make 
    *** Can make a separate method for diagnal move, vertical move, horizontal move, one method that contain all of these or different method for each class of the pieces

    Bishop
    Legal Move:  
    Row: Cuurr row +/- 1 * i 
    Column: Curr col +/- 1 *i

    Pawn
    Column: Curr col + 1

    Rook 
    Row = Curr row
    Column = Curr col +/- 1 * i
    or 
    Row = Curr row +/- 1 * i
    Column = Curr col

    Queen
    Row: Cuurr row +/- 1 * i 
    Column: Curr col +/- 1 *i

    Row = Curr row
    Column = Curr col +/- 1 * i
    or 
    Row = Curr row +/- 1 * i
    Column = Curr col
    
    King
    Row: Cuurr row +/- 1
    Column: Curr col +/- 1

    Row = Curr row
    Column = Curr col +/- 1
    or 
    Row = Curr row +/- 1
    Column = Curr col

    Knight
    Row: Curr row +/- 1
    Column: Curr column + 2 or Current column - 2
    or 
    Row: Curr row + 2 or Current row - 2
    Column: Curr column +/- 1



    ///LEGAL MOVES
    - King cannot cross another opponent piece legal move   
    - IF A PIECE IS BLOCK, IT CAN NOT MOVE THROUGH THE BLOCKAGE

    

   ///PROPERTIES OF THE GAME
    May need sth to keep track of all the pieves available on the board (Maybe a matrix)

    - Number of material won/lost
    - Evaluation of the position (based on what?)
    - If king is checked, you the only legal moves are block the check or move the king
    - En Passant (Move count for rook/king)
    - Long/Short Castling
    - If king doesn't have any legal move, and no pieces can block the attack, game over

    Properties of chess board
    Need sth to to  convert (a,b,c) to (1,2,3), maybe a dictionary
    - Num of row/column
    - Black/white spots

    Properties of pieces
    - Current position:
        + Row
        + Column
        + Color of position
    - Move pattern
    - Legal moves (Method to check)
    - Move/Capture (method) 
        + Capture: If the piece's position is align with another piece legal move, it can be captured
    - Point of each piece
    */
}