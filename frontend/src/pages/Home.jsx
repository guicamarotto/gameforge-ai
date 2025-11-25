import { useState } from 'react';
import { useGameGenerator } from '../hooks/useGameGenerator';

export const Home = () => {
  const [input, setInput] = useState('');
  const { gameConfig, loading, error, generate } = useGameGenerator();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      generate(input);
    }
  };

  const mockExamples = ['gato voador', 'dinossauro no deserto', 'ninja na chuva'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ÌæÆ GameForge AI</h1>
          <p className="text-gray-400">Descreva seu jogo, IA gera em segundos</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: endless runner com gatos voadores"
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? '‚è≥ Gerando...' : '‚ú® Gerar Jogo'}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-500 text-white rounded-lg">
            ‚ùå {error}
          </div>
        )}

        {/* Game Config Display */}
        {gameConfig && (
          <div className="mt-8 p-6 bg-slate-700 rounded-lg border border-slate-600">
            <h2 className="text-xl font-bold text-white mb-4">‚úÖ {gameConfig.title}</h2>
            <pre className="bg-slate-800 p-3 rounded text-xs text-green-400 overflow-auto max-h-64">
              {JSON.stringify(gameConfig, null, 2)}
            </pre>
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              ÌæÆ Jogar Agora
            </button>
          </div>
        )}

        {/* Mock Examples */}
        {!gameConfig && (
          <div className="mt-8 space-y-2">
            <p className="text-gray-400 text-sm">Ì≤° Ideias r√°pidas:</p>
            {mockExamples.map((idea) => (
              <button
                key={idea}
                onClick={() => {
                  setInput(idea);
                  generate(idea);
                }}
                className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded text-sm transition"
              >
                ‚Üí {idea}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
