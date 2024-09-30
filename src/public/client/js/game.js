import { handleSpecialMoves, checkGameStatus, updateCapturedPieces, handleMove } from "./helpers/chessUtils.js";
import { highlightAllowedMoves, clearHighlights, deselectPiece, initializeBoard, renderBoardFromFen } from "./helpers/uiHelpers.js";
import { gameState, saveGameState, loadGameState, resetGameState, endGame } from "./helpers/gameState.js";

const game = new Chess();

document.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.querySelector(".chessboard");
  let draggedPiece = null;
  let selectedPiece = null;
  let startSquare = null;

  if (loadGameState(game)) {
    renderBoardFromFen(chessboard, game);
  } else {
    initializeBoard(chessboard);
  }

  document.addEventListener("dragstart", (event) => {
    if (event.target.tagName === "IMG") {
      draggedPiece = event.target;
      startSquare = draggedPiece.dataset.position;
      event.dataTransfer.setData("text/plain", "");
      event.dataTransfer.effectAllowed = "move";
    }
  });

  document.addEventListener("drop", (event) => {
    event.preventDefault();
    const targetCell = event.target.closest(".cell");
    if (targetCell && draggedPiece) {
      const targetPosition = targetCell.dataset.position;
      handleMove(draggedPiece, startSquare, targetPosition, game);
      draggedPiece = null;
      startSquare = null;
    }
  });

  document.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });

  document.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
      const clickedPiece = event.target;
      const position = clickedPiece.dataset.position;
      const pieceColor = clickedPiece.dataset.piece.charAt(0);
      const currentTurn = game.turn();

      if (selectedPiece === clickedPiece) {
        clearHighlights();
        deselectPiece(selectedPiece, startSquare);
        selectedPiece = null;
        startSquare = null;
        return;
      }

      if (pieceColor !== currentTurn && selectedPiece) {
        const targetCell = event.target.closest(".cell");
        const targetPosition = targetCell.dataset.position;
        handleMove(selectedPiece, startSquare, targetPosition, game);
        return;
      }

      clearHighlights();
      deselectPiece(selectedPiece, startSquare);

      selectedPiece = clickedPiece;
      startSquare = position;
      clickedPiece.classList.add("selected");

      highlightAllowedMoves(position, game);
    } else if (event.target.classList.contains("cell")) {
      const targetPosition = event.target.dataset.position;
      if (selectedPiece) {
        handleMove(selectedPiece, startSquare, targetPosition, game);
      }
    }
  });

  document.getElementById("forfeitButton").addEventListener("click", () => {
    const currentTurn = game.turn();
    const winner = currentTurn === "w" ? "Black wins by forfeit!" : "White wins by forfeit!";
    alert(winner);
    resetGameState();
    endGame(chessboard, game);
  });
});
