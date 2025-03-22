import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Chinese Chess</h1>
        <p>Play the traditional game of Xiangqi online against friends or AI opponents!</p>
        <div className="cta-buttons">
          <Link to="/game/new" className="btn btn-primary">Start New Game</Link>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Game Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Play Against AI</h3>
            <p>Challenge our intelligent computer opponents with multiple difficulty levels</p>
          </div>
          <div className="feature-card">
            <h3>Online Multiplayer</h3>
            <p>Play with friends or random opponents from around the world</p>
          </div>
          <div className="feature-card">
            <h3>Game Analysis</h3>
            <p>Review your past games and learn from your mistakes</p>
          </div>
          <div className="feature-card">
            <h3>Learn the Rules</h3>
            <p>New to Chinese Chess? Learn the rules and strategies</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;