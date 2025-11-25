import { Groq } from "groq-sdk";
import { RUNNER_GAME_PROMPT, RUNNER_GAME_SYSTEM_PROMPT } from "../prompts/gameConfig.js";
import logger from "../utils/logger.js";

const initGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("GROQ_API_KEY is not set or empty in environment variables");
  }
  
  logger.info(`Initializing Groq with API key: ${apiKey.substring(0, 10)}...`);
  
  return new Groq({
    apiKey: apiKey,
  });
};

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    groqClient = initGroq();
  }
  return groqClient;
};

export const generateRunnerGameConfig = async (userDescription) => {
  try {
    logger.info(`Generating game config for: ${userDescription}`);
    
    const client = getGroqClient();
    logger.info("Groq client initialized successfully");
    
    // ✅ Usar modelo que SEMPRE funciona
    const model = "llama-3.1-8b-instant";
    logger.info(`Using model: ${model}`);
    
    const message = await client.chat.completions.create({
      model: model,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: RUNNER_GAME_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: RUNNER_GAME_PROMPT(userDescription),
        },
      ],
    });

    logger.info("Message created successfully");
    
    const responseText = message.choices[0].message.content;
    logger.info(`Raw response: ${responseText.substring(0, 200)}...`);
    
    const config = JSON.parse(responseText);
    
    logger.info(`Successfully generated config for: ${config.title}`);
    return config;
  } catch (error) {
    logger.error("Error generating game config:", error);
    throw new Error(`Failed to generate game config: ${error.message}`);
  }
};
