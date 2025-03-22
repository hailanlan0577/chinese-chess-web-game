# Chinese Chess (Xiangqi) Web Game

A modern, web-based implementation of the traditional Chinese Chess (Xiangqi) game, featuring both single-player and multiplayer modes.

## Features

- Single-player mode with multiple AI difficulty levels
- Real-time multiplayer mode
- Traditional and international piece styles
- Game recording and replay functionality
- Mobile-friendly responsive design
- Customizable themes and settings

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Phaser.js
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: PostgreSQL, Redis
- **Deployment**: Docker, CI/CD with GitHub Actions

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL
- Redis

### Installation

1. Clone the repository
```bash
git clone https://github.com/hailanlan0577/chinese-chess-web-game.git
cd chinese-chess-web-game
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## Project Structure

```
chinese-chess-web-game/
├── client/                  # Frontend code
│   ├── assets/              # Game assets (images, audio)
│   ├── src/                 # Source code
│   │   ├── game/            # Phaser game implementation
│   │   ├── components/      # UI components
│   │   └── utils/           # Utility functions
│   └── public/              # Static files
├── server/                  # Backend code
│   ├── src/                 # Source code
│   │   ├── api/             # API routes
│   │   ├── game/            # Game logic
│   │   ├── models/          # Data models
│   │   └── socket/          # WebSocket handlers
│   └── config/              # Server configuration
├── shared/                  # Shared code between client and server
├── docs/                    # Documentation
└── scripts/                 # Build and utility scripts
```

## Contribution Guidelines

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Phaser.js](https://phaser.io/) - HTML5 game framework
- [Socket.IO](https://socket.io/) - Real-time communication
- Traditional Chinese Chess rules and concepts
