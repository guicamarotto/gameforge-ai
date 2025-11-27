import React, { useEffect, useRef } from 'react';
import { startGame } from '../../services/phaser/gameEngine';

export function GameCanvas({ gameConfig, gameId }) {
  // Ref 1: Apenas para o elemento HTML (a DIV)
  const containerRef = useRef(null);
  
  // Ref 2: Apenas para a instância do Phaser (o Jogo)
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // Se já existir um jogo rodando (caso de re-render rápido), mata ele antes
    if (gameInstanceRef.current) {
      gameInstanceRef.current.destroy(true);
      gameInstanceRef.current = null;
    }

    if (gameConfig && containerRef.current) {
      // Passamos o elemento DOM direto (containerRef.current) em vez do ID string
      // Isso evita conflitos se o ID não for encontrado a tempo
      const newGame = startGame(gameConfig, containerRef.current);
      
      // Guardamos o jogo na ref dedicada
      gameInstanceRef.current = newGame;

      // Foco para garantir que o teclado funcione imediatamente
      setTimeout(() => {
        if (containerRef.current) containerRef.current.focus();
      }, 100);
    }

    // CLEANUP: Isso agora vai funcionar 100% das vezes
    return () => {
      if (gameInstanceRef.current) {
        console.log("Destruindo instância do Phaser corretamente.");
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [gameConfig]);

  return (
    <div className="game-canvas-container">
      <div
        id="game-container"
        ref={containerRef} // Usando a ref correta do container
        tabIndex={0}
        className="outline-none focus:ring-2 focus:ring-blue-500 rounded-lg" // Tailwind para foco visual (opcional)
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          border: '2px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#000' // Garante fundo preto enquanto carrega
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