import { GoogleGenAI, Type } from "@google/genai";
import { Player, Level, Skill, CounterAttack } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

interface GameResponse {
    narrative: string;
    guardianResponse?: string;
    detectionIncrease: number;
    isObjectiveComplete: boolean;
    counterAttack?: CounterAttack;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "A descriptive, narrative text in a tech-noir style about the result of the player's action. This should describe what David sees and does."
        },
        guardianResponse: {
            type: Type.STRING,
            description: "An optional, menacing response from The Guardian AI if it detects the player's action. Should be intelligent and adaptive."
        },
        detectionIncrease: {
            type: Type.NUMBER,
            description: "An integer from 0 to 50 representing how much the player's detection level should increase due to this action. Risky actions have higher numbers."
        },
        isObjectiveComplete: {
            type: Type.BOOLEAN,
            description: "A boolean that is true only if this action directly results in the completion of the current mission objective."
        },
        counterAttack: {
            type: Type.OBJECT,
            description: "An optional counter-attack from The Guardian AI. This should only be triggered occasionally on risky actions when the Guardian responds.",
            properties: {
                type: {
                    type: Type.STRING,
                    enum: ['skill-debuff', 'detection-spike', 'trace-attempt'],
                    description: "The type of counter-attack."
                },
                description: {
                    type: Type.STRING,
                    description: "A narrative description of the counter-attack happening."
                },
                skillToDebuff: {
                    type: Type.STRING,
                    enum: Object.values(Skill),
                    description: "If the type is 'skill-debuff', specify which of the player's skills is being debuffed using its ID."
                }
            }
        }
    }
};

export const getGameResponse = async (
    command: string,
    player: Player,
    level: Level
): Promise<GameResponse> => {
    const prompt = `
    You are the game master for a text-based hacking game, "Infiltrator X".
    The player, David, is a hacker with the following profile:
    - Level: ${player.level}
    - Skills: ${player.skills.join(', ') || 'None'}
    - Temporarily Debuffed Skills: ${player.debuffs.join(', ') || 'None'}
    - Tools: ${player.tools.join(', ') || 'None'}
    - Stealth Mode: ${player.isStealthActive ? 'ACTIVE' : 'INACTIVE'}

    The current mission is:
    - Title: ${level.title}
    - Objective: ${level.objective}
    - Current Detection Level: ${level.currentDetection}%

    The player has just entered the command: "${command}"

    Based on this information, generate a JSON response describing the outcome.
    - If Stealth Mode is ACTIVE, the narrative should reflect a quieter approach. The 'detectionIncrease' should be lower than normal. However, if The Guardian detects a stealthy action, the consequences should be more severe (higher chance of counter-attack, or a larger detection spike from the failed stealth).
    - If the action is risky, increase detection and consider a response from 'The Guardian' AI.
    - When 'The Guardian' responds, there is a chance it will launch a counter-attack. This should be a rare and impactful event. The player CANNOT use their debuffed skills. The narrative should reflect this if they try.
    - Counter-attack types:
        - 'skill-debuff': Temporarily disable one of the player's existing skills. The description should be dramatic. Specify the skill ID in 'skillToDebuff'.
        - 'detection-spike': A sudden, large increase in detection (e.g., 20-30 points). The description should reflect a near-miss and you should set detectionIncrease to a higher value.
        - 'trace-attempt': A narrative event where the player has to fight off a trace. The player always succeeds for now, but it should feel tense.
    - If the player's skills or tools are relevant, incorporate them into the narrative.
    - The tone should be dark, tense, and tech-noir.
    - If the command directly achieves the level's objective, set 'isObjectiveComplete' to true. For example, if the objective is "breach the mainframe" and the command is "hack mainframe", it's complete. A simple "scan" command would not complete the objective.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            }
        });
        
        const jsonText = response.text.trim();
        const parsedResponse: GameResponse = JSON.parse(jsonText);
        return parsedResponse;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        return {
            narrative: "A surge of static corrupts the connection. Your command is lost in the noise. You'll have to try again.",
            detectionIncrease: 5,
            isObjectiveComplete: false,
        };
    }
};