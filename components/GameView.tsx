
import React from 'react';
import { Terminal } from './Terminal';
import { TerminalLine } from '../types';

interface GameViewProps {
  terminalHistory: TerminalLine[];
  processCommand: (command: string) => void;
  isLoading: boolean;
}

export const GameView: React.FC<GameViewProps> = ({ terminalHistory, processCommand, isLoading }) => {
  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-black/50 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
      <div className="bg-gray-900/80 text-white p-2 font-orbitron border-b-2 border-cyan-500/30">
        > SECURE TERMINAL v3.7 - CORTEX_OS
      </div>
      <Terminal
        history={terminalHistory}
        onCommand={processCommand}
        isLoading={isLoading}
      />
    </div>
  );
};
