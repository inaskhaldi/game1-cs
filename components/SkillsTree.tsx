
import React from 'react';
import { Player, Skill } from '../types';
import { SKILLS } from '../constants';
import { LockClosedIcon, CheckCircleIcon } from './icons';

interface SkillsTreeProps {
  player: Player;
  onLevelUp: (skillId: Skill) => void;
}

export const SkillsTree: React.FC<SkillsTreeProps> = ({ player, onLevelUp }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black/50 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
      <h2 className="text-3xl font-orbitron text-glow-cyan mb-2 text-center">SKILL MATRIX</h2>
      <p className="text-center text-yellow-400 mb-6 font-orbitron">
        Available Skill Points: <span className="text-2xl font-bold">{player.skillPoints}</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(SKILLS).map((skill) => {
          const isUnlocked = player.skills.includes(skill.id);
          const canUnlock = player.skillPoints > 0 && player.level >= skill.requiredLevel;
          const isDebuffed = player.debuffs.includes(skill.id);

          return (
            <div
              key={skill.id}
              className={`p-4 border-2 rounded-lg transition-all duration-300
                ${isUnlocked ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-700 bg-black/40'}
                ${isDebuffed ? 'border-red-500 bg-red-900/30 opacity-70' : ''}
              `}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-orbitron font-bold">{skill.name}</h3>
                {isUnlocked ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                ) : (
                  <LockClosedIcon className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <p className="text-gray-400 mb-3 text-sm">{skill.description}</p>
              
              {isDebuffed && (
                 <p className="text-red-400 text-glow-red font-bold text-center mb-2">SYSTEM OFFLINE</p>
              )}

              <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-2 mt-2">
                <span className="text-gray-400">Req. Level: {skill.requiredLevel}</span>
                {!isUnlocked && (
                  <button
                    onClick={() => onLevelUp(skill.id)}
                    disabled={!canUnlock}
                    className={`px-3 py-1 font-orbitron text-sm rounded
                      ${canUnlock
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    Unlock (1 SP)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
