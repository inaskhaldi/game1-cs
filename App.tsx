import React, { useState, useCallback, useEffect } from 'react';
import { GameView } from './components/GameView';
import { SkillsTree } from './components/SkillsTree';
import { Leaderboard } from './components/Leaderboard';
import { useGameLogic } from './hooks/useGameLogic';
import { GameState, View } from './types';
import { StatusBar } from './components/StatusBar';
import { MissionModal } from './components/MissionModal';
import { MainMenu } from './components/MainMenu';
import { LogoIcon } from './components/icons';


const App: React.FC = () => {
  const {
    player,
    gameState,
    terminalHistory,
    currentLevel,
    processCommand,
    startGame,
    levelUpSkill,
    startNextLevel,
  } = useGameLogic();
  
  const [view, setView] = useState<View>(View.MainMenu);

  const handleStartGame = () => {
    startGame();
    setView(View.MissionBriefing);
  };

  const handleStartMission = () => {
    setView(View.Game);
  };
  
  const handleNextLevel = () => {
    startNextLevel();
    setView(View.MissionBriefing);
  };

  const renderView = () => {
    switch (view) {
      case View.MainMenu:
        return <MainMenu onStartGame={handleStartGame} />;
      case View.MissionBriefing:
        return currentLevel ? (
          <MissionModal
            level={currentLevel}
            onStart={handleStartMission}
            type="start"
          />
        ) : null;
      case View.LevelComplete:
        return currentLevel ? (
          <MissionModal
            level={currentLevel}
            player={player}
            onStart={handleNextLevel}
            type="complete"
          />
        ) : null;
      case View.Game:
        return (
          <GameView
            terminalHistory={terminalHistory}
            processCommand={processCommand}
            isLoading={gameState === GameState.Loading}
          />
        );
      case View.Skills:
        return <SkillsTree player={player} onLevelUp={levelUpSkill} />;
      case View.Leaderboard:
        return <Leaderboard />;
      default:
        return <MainMenu onStartGame={handleStartGame} />;
    }
  };
  
  useEffect(() => {
    if (gameState === GameState.LevelComplete) {
      setView(View.LevelComplete);
    }
  }, [gameState]);


  return (
    <div className="bg-[#0a0a0a] text-cyan-400 min-h-screen flex flex-col p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
      
      {view !== View.MainMenu && (
        <header className="w-full mb-4 z-10">
           <div className="flex justify-between items-center border-b-2 border-cyan-500/30 pb-2">
            <div className="flex items-center space-x-3">
               <LogoIcon className="h-10 w-10 text-cyan-400 text-glow-cyan" />
               <h1 className="text-3xl font-orbitron font-bold text-glow-cyan">INFILTRATOR X</h1>
            </div>
            <nav className="flex space-x-4 text-lg">
                <button onClick={() => setView(View.Game)} className={`px-3 py-1 font-orbitron ${view === View.Game ? 'bg-cyan-400 text-black' : 'hover:text-white hover:bg-cyan-900/50'}`}>TERMINAL</button>
                <button onClick={() => setView(View.Skills)} className={`px-3 py-1 font-orbitron ${view === View.Skills ? 'bg-cyan-400 text-black' : 'hover:text-white hover:bg-cyan-900/50'}`}>SKILLS</button>
                <button onClick={() => setView(View.Leaderboard)} className={`px-3 py-1 font-orbitron ${view === View.Leaderboard ? 'bg-cyan-400 text-black' : 'hover:text-white hover:bg-cyan-900/50'}`}>LEADERBOARD</button>
            </nav>
           </div>
           <StatusBar player={player} detection={currentLevel?.currentDetection ?? 0} />
        </header>
      )}

      <main className="flex-grow flex items-center justify-center z-10">
        {renderView()}
      </main>
    </div>
  );
};

export default App;