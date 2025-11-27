import React, { useState } from 'react';
import { generateGame } from '../services/gameApi';
import { GameCanvas } from '../components/game/GameCanvas';
import '../styles/home.css';

export function Home() {
  const [description, setDescription] = useState('');
  const [gameConfig, setGameConfig] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Digite uma descrição!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateGame(description);
      setGameConfig(response.config);
      setGameId(response.gameId);
    } catch (err) {
      setError(err.message || 'Erro ao gerar jogo');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setDescription(example);
  };

  return (
    <div className="home">
      <header className="header">
        <h1>GameForge AI</h1>
        <p>Crie jogos com IA em tempo real</p>
      </header>

      <div className="container">
        {!gameConfig ? (
          <div className="generator-section">
            <div className="input-group">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Descreva seu jogo..."
                className="input" 
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ Gerando...' : '✨ Gerar Jogo'}
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="examples">
              <h3>Exemplos Rápidos:</h3>
              <div className="examples-grid">
                {[
                  'Gato voador pulando nuvens',
                  'Dinossauro em planeta alienígena',
                  'Ninja em floresta noturna',
                  'Astronauta coletando asteroides',
                ].map((example) => (
                  <button
                    key={example}
                    className="btn btn-secondary"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="game-section">
            <div className="game-info">
              <h2>{gameConfig.title}</h2>
              <p>
                Personagem: <strong>{gameConfig.playerSprite}</strong>
              </p>
              <p>
                Obstáculos: <strong>{gameConfig.obstacles.join(', ')}</strong>
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setGameConfig(null);
                  setGameId(null);
                  setDescription('');
                }}
              >
                ← Voltar
              </button>
            </div>

            <GameCanvas gameConfig={gameConfig} gameId={gameId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
