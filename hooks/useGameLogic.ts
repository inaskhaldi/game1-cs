import { useState, useCallback } from 'react';
import { Player, GameState, TerminalLine, LineType, View, Level, Skill, CounterAttackType } from '../types';
import { INITIAL_PLAYER, LEVELS, SKILLS } from '../constants';
import * as geminiService from '../services/geminiService';

export const useGameLogic = () => {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);

  const addHistory = useCallback((line: Omit<TerminalLine, 'id'>) => {
    setTerminalHistory(prev => [...prev, { ...line, id: Date.now() + Math.random() }]);
  }, []);

  const startGame = useCallback(() => {
    setPlayer(INITIAL_PLAYER);
    setCurrentLevel(LEVELS[0]);
    setGameState(GameState.MissionStart);
    setTerminalHistory([]);
  }, []);

  const startNextLevel = useCallback(() => {
    // Clear debuffs for the new level
    setPlayer(prev => ({ ...prev, debuffs: [] }));

    const nextLevelIndex = player.level; // level is 1-based, index is 0-based, so level 1 is index 0. after level 1, player is level 2.
    if (nextLevelIndex < LEVELS.length) {
        setCurrentLevel(LEVELS[nextLevelIndex]);
        setGameState(GameState.MissionStart);
    } else {
        addHistory({ type: LineType.Info, text: "You have completed all available missions. The conspiracy is shattered... for now." });
        setGameState(GameState.GameEnd);
    }
  }, [player.level, addHistory]);


  const handleLevelCompletion = useCallback(() => {
    if (!currentLevel) return;

    setGameState(GameState.Loading);
    addHistory({ type: LineType.Info, text: "Mainframe breached. Mission successful. Extracting data..." });
    
    setPlayer(prev => {
        const newXp = prev.xp + currentLevel.rewards.xp;
        let newLevel = prev.level;
        let newSkillPoints = prev.skillPoints + currentLevel.rewards.skillPoints;
        let xpToNextLevel = prev.xpToNextLevel;

        if (newXp >= xpToNextLevel) {
            newLevel++;
            newSkillPoints++;
            xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
            addHistory({ type: LineType.Output, text: `LEVEL UP! You are now level ${newLevel}. You gained 1 skill point.` });
        }

        return {
            ...prev,
            level: newLevel,
            xp: newXp,
            xpToNextLevel: xpToNextLevel,
            skillPoints: newSkillPoints,
            skills: [...new Set([...prev.skills, ...currentLevel.rewards.skills])],
            tools: [...new Set([...prev.tools, ...currentLevel.rewards.tools])],
        }
    });

    setGameState(GameState.LevelComplete);
  }, [currentLevel, addHistory]);

  const processCommand = useCallback(async (command: string) => {
    addHistory({ type: LineType.Input, text: command });
    setGameState(GameState.Loading);

    const [action, ...args] = command.toLowerCase().split(' ');
    
    if(!currentLevel) {
        addHistory({ type: LineType.Error, text: "No active mission. System idle." });
        setGameState(GameState.MissionStart);
        return;
    }

    try {
        switch (action) {
            case 'help':
                const helpText = `Available commands:\n` +
                                 `  scan              - Scan the system for vulnerabilities.\n` +
                                 `  hack [target]     - Attempt to breach a target system or firewall.\n` +
                                 `  decrypt [file]    - Decrypt an encrypted file.\n` +
                                 `  stealth [on/off]  - Toggle stealth mode to reduce detection.\n` +
                                 `  use [tool]        - Use an item from your toolkit.\n` +
                                 `  status            - Display current mission status and objectives.\n` +
                                 `  clear             - Clear the terminal screen.`;
                addHistory({ type: LineType.Output, text: helpText });
                break;
            case 'clear':
                setTerminalHistory([]);
                break;
            case 'status':
                 addHistory({ type: LineType.Info, text: `Mission: ${currentLevel.title}\nObjective: ${currentLevel.objective}` });
                break;
            case 'stealth':
                const toggle = args[0];
                if (toggle === 'on') {
                    setPlayer(p => ({ ...p, isStealthActive: true }));
                    addHistory({ type: LineType.Info, text: 'Stealth mode engaged. Detection footprint reduced.' });
                } else if (toggle === 'off') {
                    setPlayer(p => ({ ...p, isStealthActive: false }));
                    addHistory({ type: LineType.Info, text: 'Stealth mode disengaged. Operating at normal signature.' });
                } else {
                    addHistory({ type: LineType.Error, text: "Usage: stealth [on/off]" });
                }
                break;
            case 'scan':
            case 'hack':
            case 'decrypt':
                const response = await geminiService.getGameResponse(command, player, currentLevel);
                addHistory({ type: LineType.Output, text: response.narrative, isTyping: true });
                
                if (response.guardianResponse) {
                     addHistory({ type: LineType.Guardian, text: `[THE GUARDIAN]: ${response.guardianResponse}`, isTyping: true });
                }

                if (response.counterAttack) {
                    addHistory({ type: LineType.Error, text: `>> GUARDIAN COUNTER-ATTACK: ${response.counterAttack.description}`, isTyping: true });
                    
                    switch (response.counterAttack.type) {
                        case CounterAttackType.SkillDebuff:
                            if (response.counterAttack.skillToDebuff) {
                                const skillId = response.counterAttack.skillToDebuff;
                                if (player.skills.includes(skillId) && !player.debuffs.includes(skillId)) {
                                    setPlayer(prev => ({
                                        ...prev,
                                        debuffs: [...prev.debuffs, skillId]
                                    }));
                                    addHistory({ type: LineType.Info, text: `Your '${SKILLS[skillId].name}' skill has been disabled!` });
                                }
                            }
                            break;
                        case CounterAttackType.DetectionSpike:
                        case CounterAttackType.TraceAttempt:
                            // These are handled by narrative and detectionIncrease value from the API
                            break;
                    }
                }

                setCurrentLevel(prev => prev ? ({...prev, currentDetection: Math.min(100, prev.currentDetection + response.detectionIncrease) }) : null);

                if (response.isObjectiveComplete) {
                    handleLevelCompletion();
                }

                break;
            default:
                addHistory({ type: LineType.Error, text: `Command not recognized: ${action}` });
        }
    } catch (error) {
        console.error(error);
        addHistory({ type: LineType.Error, text: "Error connecting to the global network. Check your connection." });
    } finally {
       if (gameState !== GameState.LevelComplete) {
         setGameState(GameState.MissionStart);
       }
    }
  }, [addHistory, currentLevel, player, handleLevelCompletion, gameState]);

  const levelUpSkill = useCallback((skillId: Skill) => {
    if (player.skillPoints > 0 && !player.skills.includes(skillId)) {
        const skill = SKILLS[skillId];
        if (player.level >= skill.requiredLevel) {
            setPlayer(prev => ({
                ...prev,
                skillPoints: prev.skillPoints - 1,
                skills: [...prev.skills, skillId]
            }));
            addHistory({ type: LineType.Output, text: `Skill Unlocked: ${skill.name}` });
        } else {
             addHistory({ type: LineType.Error, text: `Level ${skill.requiredLevel} required to unlock ${skill.name}.` });
        }
    }
  }, [player, addHistory]);

  return { player, gameState, terminalHistory, currentLevel, processCommand, startGame, levelUpSkill, startNextLevel };
};