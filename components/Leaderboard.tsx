
import React from 'react';

const mockPlayers = [
  { rank: 1, name: 'ZeroCool', score: 99850, level: 25 },
  { rank: 2, name: 'AcidBurn', score: 98200, level: 24 },
  { rank: 3, name: 'TheGuardian', score: 95000, level: 99 },
  { rank: 4, name: 'Trinity', score: 89500, level: 22 },
  { rank: 5, name: 'Neo', score: 85100, level: 21 },
  { rank: 6, name: 'Ghost', score: 78300, level: 19 },
  { rank: 7, name: 'David (You)', score: 7500, level: 4 },
  { rank: 8, name: 'Cypher', score: 65400, level: 18 },
  { rank: 9, name: 'Morpheus', score: 62000, level: 17 },
];

export const Leaderboard: React.FC = () => {
  return (
     <div className="w-full max-w-4xl mx-auto p-6 bg-black/50 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
      <h2 className="text-3xl font-orbitron text-glow-cyan mb-6 text-center">GLOBAL HACKER LEADERBOARD</h2>
      <table className="w-full text-left">
        <thead className="border-b-2 border-cyan-700 text-lg font-orbitron">
          <tr>
            <th className="p-2">RANK</th>
            <th className="p-2">AGENT</th>
            <th className="p-2">SCORE</th>
            <th className="p-2">LEVEL</th>
          </tr>
        </thead>
        <tbody>
          {mockPlayers.sort((a,b) => a.rank - b.rank).map((player) => (
            <tr key={player.rank} className={`border-b border-cyan-900/50 ${player.name.includes('You') ? 'bg-cyan-500/20 text-white' : ''}`}>
              <td className="p-3 font-bold text-xl">{player.rank}</td>
              <td className="p-3">{player.name}</td>
              <td className="p-3 text-green-400">{player.score.toLocaleString()}</td>
              <td className="p-3 text-yellow-400">{player.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
