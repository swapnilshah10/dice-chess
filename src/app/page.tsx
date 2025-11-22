'use client';

import React from 'react';
import { Board } from '@/components/Board';
import { Dice } from '@/components/Dice';
import { useGameStore } from '@/store/useGameStore';
import { RotateCcw } from 'lucide-react';

export default function Home() {
    const { resetGame } = useGameStore();

    return (
        <main className="min-h-screen bg-[#312e2b] flex flex-col items-center justify-center p-4 font-sans text-[#c3c0bb]">

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

                {/* Left Column: Board */}
                <div className="flex flex-col items-center justify-center min-h-[600px]">
                    <Board />
                </div>

                {/* Right Column: Sidebar/Controls */}
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0 bg-[#262421] rounded-lg min-h-[600px]">

                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-[#3d3b39] flex items-center justify-center">
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            <span className="text-[#81b64c]">Dice</span>Chess
                        </h1>
                    </div>

                    {/* Game Controls */}
                    <div className="flex-1 p-6 flex flex-col gap-6">
                        <Dice />

                        <div className="bg-[#312e2b] p-4 rounded-lg border border-[#403d39]">
                            <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Rules</h3>
                            <ul className="space-y-2 text-sm text-[#989693]">
                                <li>• Roll 3 dice to unlock pieces.</li>
                                <li>• Move matching pieces only.</li>
                                <li>• Capture the King to win immediately.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-[#3d3b39]">
                        <button
                            onClick={resetGame}
                            className="w-full flex items-center justify-center gap-2 text-[#989693] hover:text-white hover:bg-[#3d3b39] py-3 rounded transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="font-medium">Reset Board</span>
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}
