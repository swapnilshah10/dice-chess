export type Player = 'white' | 'black';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface Piece {
    type: PieceType;
    player: Player;
}

export type Board = (Piece | null)[][];

export interface Position {
    row: number;
    col: number;
}

export type GameStatus = 'rolling' | 'moving' | 'gameover';

export interface GameState {
    board: Board;
    turn: Player;
    dice: PieceType[];
    status: GameStatus;
    winner: Player | null;
    selectedPosition: Position | null;
    legalMoves: Position[];
    canMove: boolean;
    rollDice: () => void;
    selectPiece: (pos: Position) => void;
    movePiece: (to: Position) => void;
    skipTurn: () => void;
    resetGame: () => void;
}
