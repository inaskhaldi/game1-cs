import React from 'react';
import { Player, Skill } from '../types';
import { ShieldCheckIcon, CpuChipIcon, BoltIcon, ExclamationTriangleIcon, EyeSlashIcon } from './icons';
import { SKILLS } from '../constants';

interface StatusBarProps {
  player: Player;
  detection: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ player, detection }) => {
  const detectionColor = detection < 50 ? 'cyan' : detection < 80 ? 'yellow' : 'red';
  
  const activeSkills = player.skills
    .filter(s => !player.debuffs.includes(s))
    .map(s => SKILLS[s]?.name || s);
    
  const debuffedSkills = player.debuffs.map(s => SKILLS[s]?.name || s);

  return (
    <div className="w-full bg-black/30 p-2 mt-2 border-t-2 border-cyan-500/30 flex justify-between items-center text-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <BoltIcon className="h-5 w-5 text-yellow-400" />
          <span className="font-orbitron">LEVEL: {player.level}</span>
          <span>(XP: {player.xp} / {player.xpToNextLevel})</span>
        </div>
        <div className="flex items-center space-x-2">
          <CpuChipIcon className="h-5 w-5 text-cyan-400" />
          <span className="font-orbitron">SKILLS:</span>
          <span>{activeSkills.join(', ') || 'None'}</span>
          {debuffedSkills.length > 0 && (
            <span className="text-red-500 ml-2 text-glow-red">(OFFLINE: {debuffedSkills.join(', ')})</span>
          )}
        </div>
         <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-5 w-5 text-green-400" />
          <span className="font-orbitron">TOOLS:</span>
          <span>{player.tools.join(', ') || 'None'}</span>
        </div>
        {player.isStealthActive && (
          <div className="flex items-center space-x-2 text-blue-400 animate-pulse">
            <EyeSlashIcon className="h-5 w-5" />
            <span className="font-orbitron">STEALTH ACTIVE</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 w-1/4">
        <ExclamationTriangleIcon className={`h-5 w-5 text-${detectionColor}-500`} />
        <span className="font-orbitron">DETECTION:</span>
        <div className="w-full bg-gray-700 h-4 border border-gray-500">
           <div 
             className={`h-full bg-${detectionColor}-500 transition-all duration-300`} 
             style={{ width: `${detection}%` }}
           ></div>
        </div>
         <span className={`font-bold text-${detectionColor}-500`}>{detection}%</span>
      </div>
    </div>
  );
};