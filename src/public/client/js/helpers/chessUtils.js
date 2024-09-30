import { highlightAllowedMoves, clearHighlights, deselectPiece } from "./uiHelpers.js";
import { gameState, saveGameState, endGame } from "./gameState.js";

export function handleMove(piece, startSquare, targetSquare, game) {
  const move = game.move({
    from: startSquare,
    to: targetSquare,
    promotion: "q",
  });

  if (move) {
    const targetCell = document.querySelector(
      `.cell[data-position='${targetSquare}']`
    );
    handleSpecialMoves(move);

    targetCell.innerHTML = "";
    targetCell.appendChild(piece);
    piece.dataset.position = targetSquare;

    clearHighlights();
    deselectPiece(piece, startSquare);

    updateCapturedPieces(move, gameState);
    saveGameState(game);
    checkGameStatus(game);
  }
}

export function handleSpecialMoves(move) {
  // Handle en passant
  if (move.flags.includes("e")) {
    const capturedPawnPosition = `${move.to[0]}${move.from[1]}`;
    const capturedPawnCell = document.querySelector(
      `.cell[data-position='${capturedPawnPosition}']`
    );
    if (capturedPawnCell) {
      capturedPawnCell.innerHTML = "";
    }
  }

  // Handle castling
  if (move.flags.includes("k")) {
    const rookFrom = move.color === "w" ? "h1" : "h8";
    const rookTo = move.color === "w" ? "f1" : "f8";
    moveRook(rookFrom, rookTo);
  } else if (move.flags.includes("q")) {
    const rookFrom = move.color === "w" ? "a1" : "a8";
    const rookTo = move.color === "w" ? "d1" : "d8";
    moveRook(rookFrom, rookTo);
  }
}

function moveRook(rookFrom, rookTo) {
  const rookCellFrom = document.querySelector(
    `.cell[data-position='${rookFrom}']`
  );
  const rookCellTo = document.querySelector(`.cell[data-position='${rookTo}']`);
  if (rookCellFrom && rookCellTo) {
    const rook = rookCellFrom.querySelector("img");
    if (rook) {
      rookCellFrom.innerHTML = "";
      rookCellTo.appendChild(rook);
      rook.dataset.position = rookTo;
    }
  }
}

export function checkGameStatus(game, chessboard) {
    if (game.in_checkmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      alert(`${winner} wins by checkmate!`);
      endGame(chessboard, game);
    } else if (game.in_stalemate()) {
      alert("Game ends in a stalemate!");
      endGame(chessboard, game);
    } else if (game.in_draw()) {
      alert("Game ends in a draw!");
      endGame(chessboard, game);
    } 
    return;
  }
  

export function updateCapturedPieces(move, gameState) {
  if (move.captured) {
    const color = move.color === "w" ? "black" : "white";
    gameState.captured[color].push(move.captured);
  }
}
