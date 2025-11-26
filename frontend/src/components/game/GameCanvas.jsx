import React, { useEffect, useRef } from 'react';
import { startGame } from '../../services/phaser/gameEngine';

export function GameCanvas({ gameConfig, gameId }) {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameConfig && gameRef.current) {
      if (gameRef.current.game) {
        gameRef.current.game.destroy(true);
      }

      const game = startGame(gameConfig, 'game-container');
      gameRef.current.game = game;

      setTimeout(() => {
        const el = document.getElementById('game-container');
        if (el) el.focus();
      }, 200);
    }

    return () => {
      if (gameRef.current?.game) {
        gameRef.current.game.destroy(true);
      }
    };
  }, [gameConfig]);

  return (
    <div className="game-canvas-container">
      <div
        id="game-container"
        ref={gameRef}
        tabIndex={0}   // ADICIONAR ESTA LINHA
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          border: '2px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Use as SETAS ou ESPAÇO para pular
        </p>
        <p style={{ color: '#999', fontSize: '12px' }}>
          Game ID: {gameId}
        </p>
      </div>
    </div>
  );
}
