import { Board, PieceType, Player } from '../types';

export const INITIAL_BOARD: Board = [
    [
        { type: 'rook', player: 'black' },
        { type: 'knight', player: 'black' },
        { type: 'bishop', player: 'black' },
        { type: 'queen', player: 'black' },
        { type: 'king', player: 'black' },
        { type: 'bishop', player: 'black' },
        { type: 'knight', player: 'black' },
        { type: 'rook', player: 'black' },
    ],
    Array(8).fill({ type: 'pawn', player: 'black' }),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill({ type: 'pawn', player: 'white' }),
    [
        { type: 'rook', player: 'white' },
        { type: 'knight', player: 'white' },
        { type: 'bishop', player: 'white' },
        { type: 'queen', player: 'white' },
        { type: 'king', player: 'white' },
        { type: 'bishop', player: 'white' },
        { type: 'knight', player: 'white' },
        { type: 'rook', player: 'white' },
    ],
];

export const DICE_FACES: PieceType[] = ['pawn', 'pawn', 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
// Weighted dice? Or standard 6-sided? 
// User said "containing all the pieces". 
// Standard chess pieces: P, R, N, B, Q, K (6 types).
// A 6-sided die fits perfectly.
export const SIX_SIDED_DICE: PieceType[] = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
