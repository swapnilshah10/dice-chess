import { create } from 'zustand';
import { GameState, Position, PieceType } from '../types';
import { INITIAL_BOARD, SIX_SIDED_DICE } from '../lib/constants';
import { getLegalMoves, isKingMissing, hasAnyLegalMoves } from '../lib/gameLogic';

export const useGameStore = create<GameState>((set, get) => ({
    board: INITIAL_BOARD,
    turn: 'white',
    dice: [],
    status: 'rolling',
    winner: null,
    selectedPosition: null,
    legalMoves: [],
    canMove: true,

    rollDice: () => {
        const { status, board, turn } = get();
        if (status !== 'rolling') return;

        // Smart Dice: Only roll pieces that exist on the board for the current player
        const availableTypes = new Set<PieceType>();
        board.forEach(row => {
            row.forEach(piece => {
                if (piece && piece.player === turn) {
                    availableTypes.add(piece.type);
                }
            });
        });

        const availableTypesArray = Array.from(availableTypes);
        // If for some reason no pieces (game should be over), fallback
        const pool = availableTypesArray.length > 0 ? availableTypesArray : SIX_SIDED_DICE;

        const newDice = [
            pool[Math.floor(Math.random() * pool.length)],
            pool[Math.floor(Math.random() * pool.length)],
            pool[Math.floor(Math.random() * pool.length)],
        ];

        const canMove = hasAnyLegalMoves(board, turn, newDice);

        set({ dice: newDice, status: 'moving', canMove });
    },

    selectPiece: (pos: Position) => {
        const { board, turn, dice, status, selectedPosition } = get();
        if (status !== 'moving') return;

        // If clicking same piece, deselect
        if (selectedPosition && selectedPosition.row === pos.row && selectedPosition.col === pos.col) {
            set({ selectedPosition: null, legalMoves: [] });
            return;
        }

        const piece = board[pos.row][pos.col];

        // If clicking empty square or enemy piece (while not selecting), ignore
        if (!selectedPosition) {
            if (!piece || piece.player !== turn) return;
            if (!dice.includes(piece.type)) return; // Must match dice

            const moves = getLegalMoves(board, pos, turn, dice);
            set({ selectedPosition: pos, legalMoves: moves });
        } else {
            // Attempting to move
            const isLegal = get().legalMoves.some(m => m.row === pos.row && m.col === pos.col);
            if (isLegal) {
                get().movePiece(pos);
            } else {
                // If clicked another own piece, select it instead
                if (piece && piece.player === turn && dice.includes(piece.type)) {
                    const moves = getLegalMoves(board, pos, turn, dice);
                    set({ selectedPosition: pos, legalMoves: moves });
                } else {
                    set({ selectedPosition: null, legalMoves: [] });
                }
            }
        }
    },

    movePiece: (to: Position) => {
        const { board, selectedPosition, turn } = get();
        if (!selectedPosition) return;

        const newBoard = board.map(row => [...row]);
        const piece = newBoard[selectedPosition.row][selectedPosition.col];
        newBoard[to.row][to.col] = piece;
        newBoard[selectedPosition.row][selectedPosition.col] = null;

        // Check win condition
        const winner = isKingMissing(newBoard);
        if (winner) {
            set({ board: newBoard, winner, status: 'gameover', selectedPosition: null, legalMoves: [] });
            return;
        }

        // Switch turn
        set({
            board: newBoard,
            turn: turn === 'white' ? 'black' : 'white',
            status: 'rolling',
            dice: [],
            selectedPosition: null,
            legalMoves: [],
            canMove: true,
        });
    },

    skipTurn: () => {
        const { turn } = get();
        set({
            turn: turn === 'white' ? 'black' : 'white',
            status: 'rolling',
            dice: [],
            selectedPosition: null,
            legalMoves: [],
            canMove: true,
        });
    },

    resetGame: () => {
        set({
            board: INITIAL_BOARD,
            turn: 'white',
            dice: [],
            status: 'rolling',
            winner: null,
            selectedPosition: null,
            legalMoves: [],
            canMove: true,
        });
    },
}));
