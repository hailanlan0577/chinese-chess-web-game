import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChessBoard from '../components/game/ChessBoard';

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        
        // Mock API call - in a real app, this would fetch actual game data
        // const response = await fetch(`/api/game/${id}`);
        // const data = await response.json();
        
        // Using mock data for now
        const mockData = {
          id: id,
          status: 'playing',
          redPlayer: { id: '123', username: 'Player1' },
          blackPlayer: { id: '456', username: 'Player2' },
          currentTurn: 'red',
          // Board state would be here
        };
        
        setGameData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game data');
        setLoading(false);
      }
    };

    if (id === 'new') {
      // Handle creating a new game
      setGameData({
        id: 'temp-new-game',
        status: 'setup',
        options: {
          gameType: 'ai', // default to AI opponent
          aiDifficulty: 'medium'
        }
      });
      setLoading(false);
    } else {
      fetchGameData();
    }
  }, [id]);

  const handleMove = (from, to) => {
    // In a real app, this would send the move to the server
    console.log('Move made:', from, to);
  };

  const handleForfeit = () => {
    if (window.confirm('Are you sure you want to forfeit the game?')) {
      // In a real app, this would notify the server
      console.log('Game forfeited');
      navigate('/');
    }
  };

  const handleGameSetup = (options) => {
    // In a real app, this would create a new game with the specified options
    console.log('Game setup with options:', options);
    setGameData({
      ...gameData,
      status: 'playing',
      options
    });
  };

  if (loading) {
    return <div className="loading">Loading game...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (gameData.status === 'setup') {
    return (
      <div className="game-setup">
        <h2>New Game</h2>
        <div className="setup-options">
          <div className="form-group">
            <label>Game Type</label>
            <select 
              value={gameData.options.gameType}
              onChange={(e) => setGameData({
                ...gameData,
                options: {
                  ...gameData.options,
                  gameType: e.target.value
                }
              })}
            >
              <option value="ai">Play against AI</option>
              <option value="friend">Play with a friend</option>
              <option value="online">Find online opponent</option>
            </select>
          </div>
          
          {gameData.options.gameType === 'ai' && (
            <div className="form-group">
              <label>AI Difficulty</label>
              <select 
                value={gameData.options.aiDifficulty}
                onChange={(e) => setGameData({
                  ...gameData,
                  options: {
                    ...gameData.options,
                    aiDifficulty: e.target.value
                  }
                })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}
          
          <button 
            className="btn btn-primary"
            onClick={() => handleGameSetup(gameData.options)}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-info">
        <h2>Game #{gameData.id}</h2>
        <div className="players-info">
          <div className="player red">
            <span className="player-name">
              {gameData.redPlayer?.username || 'Red Player'}
            </span>
            {gameData.currentTurn === 'red' && <span className="turn-indicator">Your turn</span>}
          </div>
          <div className="player black">
            <span className="player-name">
              {gameData.blackPlayer?.username || 'Black Player'}
            </span>
            {gameData.currentTurn === 'black' && <span className="turn-indicator">Your turn</span>}
          </div>
        </div>
      </div>
      
      <div className="game-container">
        <div className="game-controls">
          <button className="btn" onClick={handleForfeit}>Forfeit</button>
        </div>
        
        <ChessBoard 
          gameData={gameData}
          onMove={handleMove}
        />
      </div>
    </div>
  );
}

export default GamePage;