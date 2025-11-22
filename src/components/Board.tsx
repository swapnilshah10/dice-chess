'use client';

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Position, PieceType, Player } from '../types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// Use filled variants for BOTH sides to achieve "fully filled" look, colored via CSS
// Use filled variants for BOTH sides to achieve "fully filled" look, colored via CSS

const PIECE_IMAGES: Record<string, string> = {
    'white-king': '/pieces/w-king.svg',
    'white-queen': '/pieces/w-queen.svg',
    'white-rook': '/pieces/w-rook.svg',
    'white-bishop': '/pieces/w-bishop.svg',
    'white-knight': '/pieces/w-knight.svg',
    'white-pawn': '/pieces/w-pawn.svg',
    'black-king': '/pieces/b-king.svg',
    'black-queen': '/pieces/b-queen.svg',
    'black-rook': '/pieces/b-rook.svg',
    'black-bishop': '/pieces/b-bishop.svg',
    'black-knight': '/pieces/b-knight.svg',
    'black-pawn': '/pieces/b-pawn.svg',
};

export const Board: React.FC = () => {
    const { board, turn, dice, status, selectedPosition, legalMoves, selectPiece } = useGameStore();

    const isSquareDark = (r: number, c: number) => (r + c) % 2 === 1;

    const getSquareColor = (r: number, c: number, isSelected: boolean, isLegal: boolean, isLastMove: boolean) => {
        // Chess.com style colors
        const lightSquare = 'bg-[#eeeed2]';
        const darkSquare = 'bg-[#769656]';
        const highlight = 'bg-[#bbc05c]'; // Selected or Move

        if (isSelected) return 'bg-[#bbc05c]'; // Selected piece

        // For legal moves, we usually show a dot, but if we want to highlight the square:
        // if (isLegal) return 'ring-4 ring-black/10 inset'; 

        return isSquareDark(r, c) ? darkSquare : lightSquare;
    };

    return (
        <div className="select-none">
            <div className="grid grid-cols-8 border-4 border-[#312e2b] rounded-sm shadow-2xl overflow-hidden">
                {board.map((row, r) =>
                    row.map((piece, c) => {
                        const isSelected = selectedPosition?.row === r && selectedPosition?.col === c;
                        const isLegal = legalMoves.some((m) => m.row === r && m.col === c);
                        const isCapture = isLegal && piece; // Legal move onto a piece = capture

                        const canSelect =
                            status === 'moving' &&
                            piece?.player === turn &&
                            dice.includes(piece.type);

                        return (
                            <div
                                key={`${r}-${c}`}
                                onClick={() => selectPiece({ row: r, col: c })}
                                className={clsx(
                                    'w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center text-5xl sm:text-6xl cursor-pointer relative',
                                    getSquareColor(r, c, isSelected, isLegal, false),
                                    // Hover effect for valid pieces
                                    canSelect && !isSelected && 'hover:ring-[6px] hover:ring-black/10 hover:ring-inset'
                                )}
                            >
                                {/* Rank/File Coordinates (Chess.com style) */}
                                {c === 0 && (
                                    <span className={clsx(
                                        "absolute top-0.5 left-1 text-[10px] font-bold",
                                        isSquareDark(r, c) ? "text-[#eeeed2]" : "text-[#769656]"
                                    )}>
                                        {8 - r}
                                    </span>
                                )}
                                {r === 7 && (
                                    <span className={clsx(
                                        "absolute bottom-0.5 right-1 text-[10px] font-bold",
                                        isSquareDark(r, c) ? "text-[#eeeed2]" : "text-[#769656]"
                                    )}>
                                        {String.fromCharCode(97 + c)}
                                    </span>
                                )}

                                {piece && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        <img
                                            src={PIECE_IMAGES[`${piece.player}-${piece.type}`]}
                                            alt={`${piece.player} ${piece.type}`}
                                            className="w-[85%] h-[85%] object-contain drop-shadow-sm"
                                        />
                                    </motion.div>
                                )}

                                {/* Legal Move Indicator (Dot) */}
                                {isLegal && !piece && (
                                    <div className="absolute w-[30%] h-[30%] bg-black/15 rounded-full" />
                                )}

                                {/* Capture Indicator (Ring) */}
                                {isCapture && (
                                    <div className="absolute inset-0 border-[6px] border-black/10 rounded-none" />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
