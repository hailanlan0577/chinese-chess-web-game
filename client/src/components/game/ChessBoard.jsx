import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// This component serves as a wrapper for the Phaser game
function ChessBoard({ gameData, onMove }) {
  const gameContainerRef = useRef(null);
  const gameInstanceRef = useRef(null);

  useEffect(() => {
    // Only initialize the game once
    if (gameInstanceRef.current) {
      return;
    }

    // Game configuration
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 600,
      height: 650,
      backgroundColor: '#f8d8a8',
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    // Initialize the Phaser game
    gameInstanceRef.current = new Phaser.Game(config);

    // Game event callbacks
    function preload() {
      const scene = this;
      
      // In a real implementation, we would load assets here
      // scene.load.image('board', '/assets/board.png');
      // scene.load.image('red_general', '/assets/red_general.png');
      // etc.
      
      // For now, we'll use placeholder graphics
      scene.load.setBaseURL('https://labs.phaser.io');
      scene.load.image('red', 'assets/particles/red.png');
      scene.load.image('blue', 'assets/particles/blue.png');
    }

    function create() {
      const scene = this;
      
      // Store scene data
      scene.gameData = gameData;
      scene.selectedPiece = null;
      scene.possibleMoves = [];
      
      // Draw the board (9x10 grid)
      drawBoard(scene);
      
      // Place the pieces in their initial positions
      // In a real implementation, this would place the actual pieces
      placePieces(scene);
      
      // Setup input handlers
      scene.input.on('gameobjectdown', handlePieceClick);
    }

    function update() {
      // Update game state regularly
      // This could handle animations, timers, etc.
    }

    // Helper functions
    function drawBoard(scene) {
      // Draw the board as a grid
      const graphics = scene.add.graphics();
      
      // Brown board background
      graphics.fillStyle(0xd8b275, 1);
      graphics.fillRect(50, 50, 500, 550);
      
      // Grid lines
      graphics.lineStyle(2, 0x000000, 1);
      
      // Vertical lines
      for (let x = 0; x < 9; x++) {
        graphics.moveTo(100 + x * 50, 100);
        graphics.lineTo(100 + x * 50, 600);
      }
      
      // Horizontal lines
      for (let y = 0; y < 10; y++) {
        graphics.moveTo(100, 100 + y * 50);
        graphics.lineTo(500, 100 + y * 50);
      }
      
      // Draw river
      graphics.lineStyle(2, 0x0000ff, 0.5);
      graphics.moveTo(100, 350);
      graphics.lineTo(500, 350);
      
      // Draw palace diagonals
      graphics.lineStyle(2, 0x000000, 1);
      // Black palace (top)
      graphics.moveTo(200, 100);
      graphics.lineTo(300, 200);
      graphics.moveTo(300, 100);
      graphics.lineTo(200, 200);
      
      // Red palace (bottom)
      graphics.moveTo(200, 500);
      graphics.lineTo(300, 600);
      graphics.moveTo(300, 500);
      graphics.lineTo(200, 600);
      
      graphics.strokePath();
    }

    function placePieces(scene) {
      // Placeholder implementation - would use actual piece sprites
      // with game logic in a real implementation
      
      // Place some red pieces for demonstration
      for (let i = 0; i < 5; i++) {
        const redPiece = scene.add.image(100 + i * 100, 550, 'red').setInteractive();
        redPiece.setData('position', { x: i * 2, y: 9 });
        redPiece.setData('side', 'red');
        redPiece.setDisplaySize(40, 40);
      }
      
      // Place some black pieces for demonstration
      for (let i = 0; i < 5; i++) {
        const blackPiece = scene.add.image(100 + i * 100, 150, 'blue').setInteractive();
        blackPiece.setData('position', { x: i * 2, y: 0 });
        blackPiece.setData('side', 'black');
        blackPiece.setDisplaySize(40, 40);
      }
    }

    function handlePieceClick(pointer, gameObject) {
      const scene = this;
      
      // Get piece data
      const position = gameObject.getData('position');
      const side = gameObject.getData('side');
      
      console.log(`Clicked piece at (${position.x}, ${position.y}) with side ${side}`);
      
      // If no piece is selected, select this one (if it's the current player's turn)
      if (!scene.selectedPiece && side === scene.gameData.currentTurn) {
        scene.selectedPiece = gameObject;
        gameObject.setTint(0xffff00); // Highlight selected piece
        
        // Show possible moves (in a real implementation, this would calculate valid moves)
        showPossibleMoves(scene, position);
      }
      // If a piece is already selected...
      else if (scene.selectedPiece) {
        // If clicking the same piece, deselect it
        if (scene.selectedPiece === gameObject) {
          deselectPiece(scene);
        }
        // If clicking another piece of the same side, select the new one
        else if (side === scene.gameData.currentTurn) {
          deselectPiece(scene);
          scene.selectedPiece = gameObject;
          gameObject.setTint(0xffff00); // Highlight selected piece
          
          // Show possible moves for the new piece
          showPossibleMoves(scene, position);
        }
        // If clicking an enemy piece, try to capture it (if it's a valid move)
        else {
          const fromPos = scene.selectedPiece.getData('position');
          
          // Check if this is a valid capture (in a real implementation, this would use game rules)
          if (isValidMove(scene, fromPos, position)) {
            // Make the move
            makeMove(scene, fromPos, position);
          }
        }
      }
    }

    function deselectPiece(scene) {
      if (scene.selectedPiece) {
        scene.selectedPiece.clearTint();
        scene.selectedPiece = null;
      }
      
      // Clear possible moves
      scene.possibleMoves.forEach(marker => marker.destroy());
      scene.possibleMoves = [];
    }

    function showPossibleMoves(scene, position) {
      // Clear previous move markers
      scene.possibleMoves.forEach(marker => marker.destroy());
      scene.possibleMoves = [];
      
      // In a real implementation, this would use the game rules to determine valid moves
      // For now, just show some arbitrary moves
      const possiblePositions = [
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y },
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 }
      ];
      
      // Filter out invalid positions
      const validPositions = possiblePositions.filter(pos => 
        pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 10
      );
      
      // Draw markers for valid moves
      validPositions.forEach(pos => {
        const marker = scene.add.circle(
          100 + pos.x * 50, 
          100 + pos.y * 50, 
          15, 
          0x00ff00, 
          0.5
        ).setInteractive();
        
        marker.setData('position', pos);
        
        // Add click handler for the marker
        marker.on('pointerdown', () => {
          const fromPos = scene.selectedPiece.getData('position');
          makeMove(scene, fromPos, pos);
        });
        
        scene.possibleMoves.push(marker);
      });
    }

    function isValidMove(scene, fromPos, toPos) {
      // In a real implementation, this would check the game rules
      // For now, assume moves to adjacent squares are valid
      const dx = Math.abs(fromPos.x - toPos.x);
      const dy = Math.abs(fromPos.y - toPos.y);
      
      return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    function makeMove(scene, fromPos, toPos) {
      if (!scene.selectedPiece) return;
      
      // Get screen coordinates from board positions
      const fromX = 100 + fromPos.x * 50;
      const fromY = 100 + fromPos.y * 50;
      const toX = 100 + toPos.x * 50;
      const toY = 100 + toPos.y * 50;
      
      // Check if there's a piece at the target position
      scene.children.list.forEach(obj => {
        if (obj.getData && obj.getData('position')) {
          const pos = obj.getData('position');
          if (pos.x === toPos.x && pos.y === toPos.y) {
            // Capture the piece
            obj.destroy();
          }
        }
      });
      
      // Move the piece
      scene.selectedPiece.setData('position', toPos);
      
      // Animate the move
      scene.tweens.add({
        targets: scene.selectedPiece,
        x: toX,
        y: toY,
        duration: 200,
        ease: 'Power2',
        onComplete: () => {
          // Switch turns
          scene.gameData.currentTurn = scene.gameData.currentTurn === 'red' ? 'black' : 'red';
          
          // Notify parent component about the move
          if (onMove) {
            onMove(fromPos, toPos);
          }
        }
      });
      
      // Deselect the piece
      deselectPiece(scene);
    }

    // Clean up function
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [gameData, onMove]);

  return (
    <div className="chess-board">
      <div 
        ref={gameContainerRef} 
        className="game-canvas-container"
        style={{ width: '600px', height: '650px' }}
      />
    </div>
  );
}

export default ChessBoard;