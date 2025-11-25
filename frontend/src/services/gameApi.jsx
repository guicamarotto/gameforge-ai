import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const generateGame = async (description) => {
  try {
    const response = await axios.post(
      `${API_BASE}/generate`,
      { description }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to generate game:', error);
    throw error;
  }
};

export const getGame = async (gameId) => {
  try {
    const response = await axios.get(`${API_BASE}/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch game ${gameId}:`, error);
    throw error;
  }
};
