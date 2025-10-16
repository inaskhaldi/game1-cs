
import React from 'react';
import { Level, Player } from '../types';

interface MissionModalProps {
  level: Level;
  player?: Player;
  onStart: () => void;
  type: 'start' | 'complete';
}

export const MissionModal: React.FC<MissionModalProps> = ({ level, player, onStart, type }) => {
  const isStart = type === 'start';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl p-8 bg-black border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-fade-in">
        <h2 className="text-4xl font-orbitron text-glow-cyan mb-4 text-center">
          {isStart ? `MISSION BRIEFING` : `MISSION COMPLETE`}
        </h2>
        <p className="text-xl text-cyan-200 mb-6 font-bold text-center border-y-2 border-cyan-800 py-2">{level.title}</p>
        
        {isStart ? (
          <p className="text-lg text-gray-300 whitespace-pre-wrap leading-relaxed">
            {level.briefing}
          </p>
        ) : (
          <div className="text-lg text-center space-y-4">
            <p className="text-green-400 text-glow-green">{level.completionMessage}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 text-left border-t border-cyan-800">
              <div>
                <h4 className="font-orbitron text-cyan-400">XP GAINED:</h4>
                <p className="text-white text-2xl">{level.rewards.xp}</p>
              </div>
               <div>
                <h4 className="font-orbitron text-cyan-400">SKILL POINTS:</h4>
                <p className="text-white text-2xl">+{level.rewards.skillPoints}</p>
              </div>
              <div>
                <h4 className="font-orbitron text-cyan-400">NEW TOOLS:</h4>
                <p className="text-white text-2xl">{level.rewards.tools.join(', ') || 'None'}</p>
              </div>
               <div>
                <h4 className="font-orbitron text-cyan-400">NEW SKILLS:</h4>
                <p className="text-white text-2xl">{level.rewards.skills.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={onStart} 
          className="w-full mt-8 py-3 text-xl text-black font-bold font-orbitron bg-cyan-400 hover:bg-white shadow-[0_0_15px_#06b6d4] transition-all duration-300"
        >
          {isStart ? 'INITIATE HACK' : 'PROCEED TO NEXT MISSION'}
        </button>
      </div>
    </div>
  );
};
