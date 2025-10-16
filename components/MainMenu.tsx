import React from 'react';
import { LogoIcon } from './icons';
import { TypingEffect } from './TypingEffect';
import { LineType } from '../types';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <LogoIcon className="h-48 w-48 text-cyan-400 text-glow-cyan animate-pulse" />
      <h1 className="text-7xl font-orbitron font-black text-glow-cyan my-6">
        INFILTRATOR X
      </h1>
      <div className="h-8">
        {/* FIX: Added missing 'lineType' prop to TypingEffect component. The text styling matches LineType.Output. */}
        <TypingEffect text="A hacking simulation experience." className="text-2xl text-green-400" lineType={LineType.Output} />
      </div>
      <button 
        onClick={onStartGame} 
        className="mt-12 px-12 py-4 text-2xl font-orbitron bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_15px_#06b6d4] hover:shadow-[0_0_25px_#06b6d4]"
      >
        BECOME THE GHOST
      </button>
    </div>
  );
};
