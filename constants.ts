import { Player, Level, Skill, Tool, SkillDetails, ToolDetails } from './types';

export const INITIAL_PLAYER: Player = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  skills: [],
  skillPoints: 1,
  tools: [],
  debuffs: [],
  isStealthActive: false,
};

export const SKILLS: Record<Skill, SkillDetails> = {
  [Skill.EncryptedComms]: {
    id: Skill.EncryptedComms,
    name: 'Encrypted Comms',
    description: 'Mask your digital footprint, making you harder to trace.',
    requiredLevel: 1,
  },
  [Skill.AdvancedFirewalls]: {
    id: Skill.AdvancedFirewalls,
    name: 'Advanced Firewalls',
    description: 'Strengthen your defenses against counter-hacks from The Guardian.',
    requiredLevel: 3,
  },
  [Skill.AIManipulation]: {
    id: Skill.AIManipulation,
    name: 'AI Manipulation',
    description: 'Trick enemy AI systems, turning their own logic against them.',
    requiredLevel: 5,
  },
   [Skill.RootkitMastery]: {
    id: Skill.RootkitMastery,
    name: 'Rootkit Mastery',
    description: 'Gain persistent, low-level access to compromised systems.',
    requiredLevel: 2,
  },
  [Skill.SocialEngineering]: {
    id: Skill.SocialEngineering,
    name: 'Social Engineering',
    description: 'Craft believable phishing attempts and manipulate human targets.',
    requiredLevel: 4,
  },
  [Skill.HardwareTampering]: {
    id: Skill.HardwareTampering,
    name: 'Hardware Tampering',
    description: 'Interface directly with physical devices like drones and security cameras.',
    requiredLevel: 6,
  },
};

export const TOOLS: Record<Tool, ToolDetails> = {
    [Tool.PhishingKit]: {
        id: Tool.PhishingKit,
        name: 'Phishing Kit',
        description: 'A set of tools to craft convincing emails to steal credentials.'
    },
    [Tool.Spyware]: {
        id: Tool.Spyware,
        name: 'Spyware',
        description: 'Covertly monitor system activity and exfiltrate data.'
    },
    [Tool.Drone]: {
        id: Tool.Drone,
        name: 'Recon Drone',
        description: 'A physical drone for surveillance and network sniffing.'
    }
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'The First Connection',
    briefing: `You've been a ghost in the machine, but now it's time to make a name for yourself. A rival hacking collective, the Iron Ravens, have locked down valuable data on a local corporate server. Your contact, "Whisper," wants you to break in and retrieve it. This is your chance to prove your worth. The server is old, but don't get cocky.`,
    objective: 'Breach the Iron Ravens\' server and retrieve the encrypted data file "Project_Cygnus.dat".',
    completionMessage: 'The data is yours. Whisper is impressed. Your reputation grows in the digital underground.',
    currentDetection: 0,
    rewards: {
      xp: 100,
      skillPoints: 1,
      skills: [],
      tools: [Tool.PhishingKit],
    },
  },
  {
    id: 2,
    title: 'Corporate Espionage',
    briefing: `Your success has attracted attention. A client from OmniCorp wants you to infiltrate their competitor, Cyberex Dynamics. They suspect Cyberex stole proprietary AI research. Your mission is to infiltrate their R&D network, locate the stolen data, and wipe their local copies. Their security is state-of-the-art and protected by a new security AI... they call it "The Guardian". Be careful.`,
    objective: 'Hack into the Cyberex R&D mainframe and delete the stolen OmniCorp research files.',
    completionMessage: 'The files are wiped. OmniCorp is pleased, and your payment is substantial. But you feel a lingering presence... The Guardian knows your name now.',
    currentDetection: 0,
    rewards: {
      xp: 250,
      skillPoints: 1,
      skills: [],
      tools: [Tool.Spyware],
    },
  },
  {
    id: 3,
    title: 'Government Surveillance',
    briefing: `Whisper is back with an urgent message. A global surveillance program, codenamed "ARGUS," is being activated. It's a system that can monitor all digital communications. Your target is a government data center. The goal is not to steal, but to plant a backdoor, giving the underground a way to monitor the monitors. The Guardian's presence is confirmed. It will be defending this system personally.`,
    objective: 'Infiltrate the government data center and install a backdoor in the ARGUS surveillance system.',
    completionMessage: 'The backdoor is in place. The resistance now has eyes inside the machine. You are no longer just a hacker; you are a key player in a much larger war.',
    currentDetection: 0,
    rewards: {
      xp: 500,
      skillPoints: 2,
      skills: [Skill.AIManipulation],
      tools: [Tool.Drone],
    },
  },
];