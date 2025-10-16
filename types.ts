export interface Player {
  level: number;
  xp: number;
  xpToNextLevel: number;
  skills: Skill[];
  skillPoints: number;
  tools: Tool[];
  debuffs: Skill[];
  isStealthActive: boolean;
}

export enum GameState {
  NotStarted,
  MainMenu,
  MissionStart,
  Loading,
  LevelComplete,
  GameEnd,
}

export enum LineType {
  Input,
  Output,
  Error,
  Info,
  Guardian,
}

export interface TerminalLine {
  id: number;
  text: string;
  type: LineType;
  isTyping?: boolean;
}

export enum View {
  MainMenu,
  Game,
  Skills,
  Leaderboard,
  MissionBriefing,
  LevelComplete,
}

export interface Level {
  id: number;
  title: string;
  briefing: string;
  objective: string;
  completionMessage: string;
  currentDetection: number;
  rewards: {
    xp: number;
    skillPoints: number;
    skills: Skill[];
    tools: Tool[];
  };
}

export enum Skill {
    EncryptedComms = 'encrypted-comms',
    AdvancedFirewalls = 'advanced-firewalls',
    AIManipulation = 'ai-manipulation',
    RootkitMastery = 'rootkit-mastery',
    SocialEngineering = 'social-engineering',
    HardwareTampering = 'hardware-tampering',
}

export interface SkillDetails {
    id: Skill;
    name: string;
    description: string;
    requiredLevel: number;
}

export enum Tool {
    PhishingKit = 'phishing-kit',
    Spyware = 'spyware',
    Drone = 'drone',
}

export interface ToolDetails {
    id: Tool;
    name: string;
    description: string;
}

export enum CounterAttackType {
    SkillDebuff = 'skill-debuff',
    DetectionSpike = 'detection-spike',
    TraceAttempt = 'trace-attempt',
}

export interface CounterAttack {
    type: CounterAttackType;
    description: string;
    skillToDebuff?: Skill;
}