/**
 * Base class for chess pieces
 */
class ChessPiece {
  /**
   * Create a chess piece
   * @param {string} side - 'red' or 'black'
   * @param {number} x - Initial x coordinate
   * @param {number} y - Initial y coordinate
   */
  constructor(side, x, y) {
    this.side = side; // 'red' or 'black'
    this.x = x; // column (0-8)
    this.y = y; // row (0-9)
    this.captured = false;
  }

  /**
   * Get valid moves for this piece
   * @param {Array} board - Current game board
   * @returns {Array} Array of valid move coordinates [x, y]
   */
  getValidMoves(board) {
    // To be implemented by subclasses
    return [];
  }

  /**
   * Check if a move is valid for this piece
   * @param {number} toX - Target x coordinate
   * @param {number} toY - Target y coordinate
   * @param {Array} board - Current game board
   * @returns {boolean} Whether the move is valid
   */
  isValidMove(toX, toY, board) {
    // To be implemented by subclasses
    return false;
  }

  /**
   * Check if a position is within the board
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @returns {boolean} Whether the position is valid
   */
  isValidPosition(x, y) {
    return x >= 0 && x < 9 && y >= 0 && y < 10;
  }

  /**
   * Get piece at a specific position
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   * @param {Array} board - Current game board
   * @returns {ChessPiece|null} The piece at the position or null
   */
  getPieceAt(x, y, board) {
    if (!this.isValidPosition(x, y)) {
      return null;
    }
    return board[y][x];
  }

  /**
   * Check if there's an obstacle between two positions (horizontally or vertically)
   * @param {number} fromX - Starting x coordinate
   * @param {number} fromY - Starting y coordinate
   * @param {number} toX - Target x coordinate
   * @param {number} toY - Target y coordinate
   * @param {Array} board - Current game board
   * @returns {boolean} Whether there's an obstacle
   */
  hasObstacleBetween(fromX, fromY, toX, toY, board) {
    // Only works for straight lines (horizontal or vertical)
    if (fromX !== toX && fromY !== toY) {
      return false; // Not a straight line
    }

    if (fromX === toX) { // Vertical movement
      const minY = Math.min(fromY, toY);
      const maxY = Math.max(fromY, toY);
      
      for (let y = minY + 1; y < maxY; y++) {
        if (this.getPieceAt(fromX, y, board)) {
          return true;
        }
      }
    } else { // Horizontal movement
      const minX = Math.min(fromX, toX);
      const maxX = Math.max(fromX, toX);
      
      for (let x = minX + 1; x < maxX; x++) {
        if (this.getPieceAt(x, fromY, board)) {
          return true;
        }
      }
    }
    
    return false;
  }
}

module.exports = ChessPiece;