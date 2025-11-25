import { Router } from "express";
import { generateRunnerGameConfig } from "../services/groqService.js";
import { nanoid } from "nanoid";
import logger from "../utils/logger.js";

const router = Router();

// Store games em memória (v1 - depois vai DB)
const gameStore = new Map();

router.post("/generate", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: "Description is required" });
    }

    logger.info(`Generating game for: ${description}`);
    const config = await generateRunnerGameConfig(description);

    // Salvar temporariamente
    const gameId = nanoid(8);
    gameStore.set(gameId, {
      id: gameId,
      config,
      description,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      gameId,
      config,
    });
  } catch (error) {
    logger.error("Error in /generate:", error);
    res.status(500).json({
      error: "Failed to generate game",
      message: error.message || "Unknown error",
    });
  }
});

router.get("/games/:id", (req, res) => {
  const game = gameStore.get(req.params.id);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(game);
});

export default router;
