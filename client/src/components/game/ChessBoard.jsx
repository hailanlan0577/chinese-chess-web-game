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

    console.log("Initializing game with data:", gameData);
    
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
      // For now, we'll use placeholder graphics
      scene.load.setBaseURL('https://labs.phaser.io');
      scene.load.image('red', 'assets/particles/red.png');
      scene.load.image('blue', 'assets/particles/blue.png');
      
      // Add a log to confirm preload is running
      console.log("Phaser preload function running");
    }

    function create() {
      const scene = this;
      
      // Add a log to confirm create is running
      console.log("Phaser create function running");
      
      // Store scene data
      scene.gameData = {...gameData};  // Create a copy to ensure it's set properly
      scene.selectedPiece = null;
      scene.possibleMoves = [];
      scene.isAIThinking = false;
      
      console.log("Scene gameData set:", scene.gameData);
      
      // Draw the board (9x10 grid)
      drawBoard(scene);
      
      // Place the pieces in their initial positions
      placePieces(scene);
      
      // Setup input handlers - explicitly bind to the scene context
      scene.input.on('gameobjectdown', function(pointer, gameObject) {
        handlePieceClick.call(scene, pointer, gameObject);
      });
      
      // Add a debug handler for any interactive object
      scene.input.on('pointerdown', function(pointer) {
        console.log("Canvas clicked at:", pointer.x, pointer.y);
      });
    }

    function update() {
      // Update game state regularly
      const scene = this;
      
      // Check if it's AI's turn (black) in single player mode
      if (scene.gameData && 
          scene.gameData.options && 
          scene.gameData.options.gameType === 'ai' &&
          scene.gameData.currentTurn === 'black' &&
          !scene.isAIThinking) {
        
        // Set flag to prevent multiple AI moves being triggered
        scene.isAIThinking = true;
        
        console.log("AI thinking...");
        
        // Delay AI move to make it feel more natural
        scene.time.delayedCall(800, () => {
          makeAIMove(scene);
          scene.isAIThinking = false;
        });
      }
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
      
      console.log("Board drawn");
    }

    function placePieces(scene) {
      // Place some red pieces for demonstration
      for (let i = 0; i < 5; i++) {
        const redPiece = scene.add.image(100 + i * 100, 550, 'red').setInteractive();
        redPiece.setData('position', { x: i * 2, y: 9 });
        redPiece.setData('side', 'red');
        redPiece.setData('type', 'red_piece'); // Add type for debugging
        redPiece.setDisplaySize(40, 40);
        
        // Add debug input handler directly to this piece
        redPiece.on('pointerdown', function() {
          console.log(`Direct click on red piece at (${this.getData('position').x}, ${this.getData('position').y})`);
        });
      }
      
      // Place some black pieces for demonstration
      for (let i = 0; i < 5; i++) {
        const blackPiece = scene.add.image(100 + i * 100, 150, 'blue').setInteractive();
        blackPiece.setData('position', { x: i * 2, y: 0 });
        blackPiece.setData('side', 'black');
        blackPiece.setData('type', 'black_piece'); // Add type for debugging
        blackPiece.setDisplaySize(40, 40);
        
        // Add debug input handler directly to this piece
        blackPiece.on('pointerdown', function() {
          console.log(`Direct click on black piece at (${this.getData('position').x}, ${this.getData('position').y})`);
        });
      }
      
      console.log("Pieces placed on board");
    }

    function handlePieceClick(pointer, gameObject) {
      const scene = this;
      
      // Get piece data
      const position = gameObject.getData('position');
      const side = gameObject.getData('side');
      
      console.log(`Clicked piece at (${position.x}, ${position.y}) with side ${side}`);
      
      // Safety check to ensure gameData is available
      if (!scene.gameData) {
        console.error("gameData is not available in the scene");
        return;
      }
      
      // If it's AI's turn in single player mode, ignore clicks
      if (scene.gameData.options && 
          scene.gameData.options.gameType === 'ai' && 
          scene.gameData.currentTurn === 'black') {
        console.log("It's AI's turn, ignoring click");
        return;
      }
      
      // If no piece is selected, select this one (if it's the current player's turn)
      if (!scene.selectedPiece && side === scene.gameData.currentTurn) {
        scene.selectedPiece = gameObject;
        gameObject.setTint(0xffff00); // Highlight selected piece
        console.log("Piece selected:", position);
        
        // Show possible moves
        showPossibleMoves(scene, position);
      }
      // If a piece is already selected...
      else if (scene.selectedPiece) {
        // If clicking the same piece, deselect it
        if (scene.selectedPiece === gameObject) {
          console.log("Deselecting piece");
          deselectPiece(scene);
        }
        // If clicking another piece of the same side, select the new one
        else if (side === scene.gameData.currentTurn) {
          console.log("Selecting different piece");
          deselectPiece(scene);
          scene.selectedPiece = gameObject;
          gameObject.setTint(0xffff00); // Highlight selected piece
          
          // Show possible moves for the new piece
          showPossibleMoves(scene, position);
        }
        // If clicking an enemy piece, try to capture it (if it's a valid move)
        else {
          const fromPos = scene.selectedPiece.getData('position');
          console.log("Attempting to capture:", position, "from:", fromPos);
          
          // Check if this is a valid capture
          if (isValidMove(scene, fromPos, position)) {
            // Make the move
            makeMove(scene, fromPos, position);
          } else {
            console.log("Invalid capture attempt");
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
      
      console.log("Valid moves:", validPositions);
      
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
        marker.on('pointerdown', function() {
          console.log("Move marker clicked at:", pos);
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
      
      console.log("Making move from", fromPos, "to", toPos);
      
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
            console.log("Capturing piece at", pos);
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
          console.log("Turn switched to:", scene.gameData.currentTurn);
          
          // Notify parent component about the move
          if (onMove) {
            onMove(fromPos, toPos);
          }
        }
      });
      
      // Deselect the piece
      deselectPiece(scene);
    }

    function makeAIMove(scene) {
      console.log("AI making move...");
      
      // Get all black pieces
      const blackPieces = [];
      scene.children.list.forEach(obj => {
        if (obj.getData && obj.getData('side') === 'black') {
          blackPieces.push(obj);
        }
      });
      
      if (blackPieces.length === 0) {
        console.log("No black pieces found for AI move");
        return;
      }
      
      console.log("Found", blackPieces.length, "black pieces");
      
      // Select a random piece for the AI
      const randomIndex = Math.floor(Math.random() * blackPieces.length);
      const selectedPiece = blackPieces[randomIndex];
      const fromPos = selectedPiece.getData('position');
      
      console.log("AI selected piece at", fromPos);
      
      // Get possible moves for the selected piece
      const possiblePositions = [
        { x: fromPos.x + 1, y: fromPos.y },
        { x: fromPos.x - 1, y: fromPos.y },
        { x: fromPos.x, y: fromPos.y + 1 },
        { x: fromPos.x, y: fromPos.y - 1 }
      ];
      
      // Filter out invalid positions
      const validPositions = possiblePositions.filter(pos => {
        // Check if position is on the board
        if (pos.x < 0 || pos.x >= 9 || pos.y < 0 || pos.y >= 10) {
          return false;
        }
        
        // Check if position is occupied by another black piece
        let isOccupiedByBlack = false;
        scene.children.list.forEach(obj => {
          if (obj.getData && obj.getData('position') && obj.getData('side') === 'black') {
            const piecePos = obj.getData('position');
            if (piecePos.x === pos.x && piecePos.y === pos.y) {
              isOccupiedByBlack = true;
            }
          }
        });
        
        return !isOccupiedByBlack;
      });
      
      console.log("AI found", validPositions.length, "valid moves");
      
      if (validPositions.length === 0) {
        // Try another piece if this one has no valid moves
        console.log("No valid moves for selected piece, trying another");
        makeAIMove(scene);
        return;
      }
      
      // Choose a random valid move
      const toPos = validPositions[Math.floor(Math.random() * validPositions.length)];
      console.log("AI chose move to", toPos);
      
      // Get screen coordinates
      const toX = 100 + toPos.x * 50;
      const toY = 100 + toPos.y * 50;
      
      // Check if there's a red piece at the target position (capture)
      scene.children.list.forEach(obj => {
        if (obj.getData && obj.getData('position') && obj.getData('side') === 'red') {
          const pos = obj.getData('position');
          if (pos.x === toPos.x && pos.y === toPos.y) {
            // Capture the piece
            console.log("AI capturing red piece at", pos);
            obj.destroy();
          }
        }
      });
      
      // Update piece position
      selectedPiece.setData('position', toPos);
      
      // Animate the move
      scene.tweens.add({
        targets: selectedPiece,
        x: toX,
        y: toY,
        duration: 200,
        ease: 'Power2',
        onComplete: () => {
          // Switch turns
          scene.gameData.currentTurn = 'red';
          console.log("Turn switched to red");
          
          // Notify parent component
          if (onMove) {
            onMove(fromPos, toPos);
          }
        }
      });
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