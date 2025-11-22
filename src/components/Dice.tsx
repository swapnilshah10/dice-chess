'use client';

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, SkipForward } from 'lucide-react';
import clsx from 'clsx';
import { PieceType } from '../types';

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

export const Dice: React.FC = () => {
    const { dice, status, rollDice, turn, winner, canMove, skipTurn } = useGameStore();

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md bg-[#262421] p-6 rounded-lg shadow-lg border border-[#3d3b39]">

            {/* Header / Turn Info */}
            <div className="w-full flex items-center justify-between border-b border-[#3d3b39] pb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "w-8 h-8 rounded-md flex items-center justify-center text-lg font-bold border-2",
                        turn === 'white' ? "bg-white text-black border-white" : "bg-black text-white border-gray-600"
                    )}>
                        {turn === 'white' ? 'W' : 'B'}
                    </div>
                    <span className="text-gray-200 font-bold text-lg">
                        {turn === 'white' ? "White's Turn" : "Black's Turn"}
                    </span>
                </div>
                {status === 'rolling' && !winner && (
                    <span className="text-[#81b64c] text-sm font-bold animate-pulse">Ready to Roll</span>
                )}
            </div>

            {/* Dice Container */}
            <div className="flex gap-3 justify-center py-2 min-h-[90px]">
                <AnimatePresence mode='wait'>
                    {dice.length > 0 ? (
                        dice.map((face, i) => (
                            <motion.div
                                key={`${status}-${i}`}
                                initial={{ rotateX: 180, opacity: 0, y: -10 }}
                                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 250, damping: 20, delay: i * 0.1 }}
                                className="w-20 h-20 bg-[#312e2b] rounded-lg flex items-center justify-center shadow-md border border-[#403d39]"
                            >
                                <img
                                    src={PIECE_IMAGES[`${turn}-${face}`]}
                                    alt={face}
                                    className="w-[80%] h-[80%] object-contain drop-shadow-sm"
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex items-center text-gray-500 gap-2">
                            <Dices className="w-6 h-6" />
                            <span className="font-medium">Roll to see available pieces</span>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Button */}
            <div className="w-full">
                {status === 'moving' && !canMove ? (
                    <div className="space-y-3">
                        <div className="text-center text-[#fa7369] font-bold text-sm">
                            No legal moves available
                        </div>
                        <button
                            onClick={skipTurn}
                            className="w-full py-4 rounded-lg font-bold text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px] transition-all bg-[#fa7369] text-white hover:bg-[#e65a50]"
                        >
                            Skip Turn
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={rollDice}
                        disabled={status !== 'rolling' || !!winner}
                        className={clsx(
                            'w-full py-4 rounded-lg font-bold text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-3',
                            status === 'rolling' && !winner
                                ? 'bg-[#81b64c] text-white hover:bg-[#75a742]'
                                : 'bg-[#403d39] text-[#75726f] cursor-not-allowed'
                        )}
                    >
                        {winner ? 'Game Over' : status === 'rolling' ? 'Roll Dice' : 'Make a Move'}
                    </button>
                )}
            </div>

            {/* Winner Modal Overlay */}
            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#262421] p-8 rounded-xl border border-[#403d39] text-center max-w-sm w-full shadow-2xl"
                        >
                            <div className="text-6xl mb-4">🏆</div>
                            <h2 className="text-3xl font-black text-white mb-2">{winner.toUpperCase()} WINS!</h2>
                            <p className="text-gray-400 mb-6">The King has been captured.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 rounded-lg font-bold text-lg bg-[#81b64c] text-white hover:bg-[#75a742] shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none transition-all"
                            >
                                New Game
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
