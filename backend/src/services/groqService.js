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
let cachedModel = null;

const getGroqClient = () => {
  if (!groqClient) {
    groqClient = initGroq();
  }
  return groqClient;
};

// ✅ Função para listar modelos disponíveis
const getAvailableModel = async () => {
  if (cachedModel) {
    return cachedModel;
  }

  try {
    const client = getGroqClient();
    const models = await client.models.list();
    
    logger.info(`Available models: ${models.data.map(m => m.id).join(", ")}`);
    
    // ✅ Usar o primeiro modelo disponível
    if (models.data && models.data.length > 0) {
      cachedModel = models.data[0].id;
      logger.info(`Selected model: ${cachedModel}`);
      return cachedModel;
    }
    
    throw new Error("No models available");
  } catch (error) {
    logger.error("Error listing models:", error);
    // ✅ Fallback: usar modelo padrão
    logger.warn("Falling back to default model: mixtral-8x7b-32768");
    return "mixtral-8x7b-32768";
  }
};

export const generateRunnerGameConfig = async (userDescription) => {
  try {
    logger.info(`Generating game config for: ${userDescription}`);
    
    const client = getGroqClient();
    logger.info("Groq client initialized successfully");
    
    // ✅ Obter modelo dinamicamente
    const model = await getAvailableModel();
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
