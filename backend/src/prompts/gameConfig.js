export const RUNNER_GAME_PROMPT = (userDescription) => `
You are a Phaser 3 game config generator. 
Generate a complete Phaser 3 game configuration for an endless runner game.

User description: "${userDescription}"

Return ONLY valid JSON (no markdown, no explanation) with this exact schema:
{
  "gameType": "runner",
  "title": "string describing the game",
  "playerSprite": "string (name of player character/object)",
  "obstacles": ["string", "string"],
  "collectibles": ["string"],
  "backgroundColor": "#hex color",
  "physics": {
    "gravity": number (200-600),
    "playerSpeed": number (200-400),
    "obstacleSpeed": number (300-500)
  },
  "difficulty": {
    "initialLevel": 1,
    "speedIncrement": 0.02,
    "spawnRate": 3000
  },
  "scoring": {
    "distancePoints": 10,
    "collectiblePoints": 50,
    "difficultyMultiplier": 1.5
  }
}

Generate now:
`;

export const RUNNER_GAME_SYSTEM_PROMPT = `You are an expert game designer and Phaser 3 developer. 
You generate precise, JSON-based game configurations for endless runners.
Always output ONLY valid JSON. Never add markdown, explanations, or code blocks.`;
