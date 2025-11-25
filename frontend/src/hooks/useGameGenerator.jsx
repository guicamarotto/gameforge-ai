import { useState } from 'react';
import { generateGame } from '../services/gameApi';

export const useGameGenerator = () => {
  const [gameConfig, setGameConfig] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (description) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateGame(description);
      setGameId(result.gameId);
      setGameConfig(result.config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate game');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { gameConfig, gameId, loading, error, generate };
};
