import {
  handleSpecialMoves,
  checkGameStatus,
  updateCapturedPieces,
} from "./helpers/chessUtilHelper.js";
import {
  highlightAllowedMoves,
  clearHighlights,
  deselectPiece,
  initializeBoard,
  renderBoardFromFen,
} from "./helpers/uiHelper.js";
import {
  gameState,
  saveGameState,
  loadGameState,
  resetGameState,
  endGame,
} from "./helpers/gameStateHelper.js";

const game = new Chess();

const socket = new WebSocket("ws://localhost:3000");

let playerColor = null;
let room = null;

socket.onopen = function () {
  console.log("WebSocket connection established");
};

socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  console.log("MESSAGE TYPE: " + message.type);
  console.log(message);

  if (message.type === "assign") {
    room = message.room;
    playerColor = message.color;
    console.log(`Assigned to room: ${room}, Color: ${playerColor}`);
  }
};

socket.onerror = function (error) {
  console.error("WebSocket error:", error);
};

document.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.querySelector(".chessboard");
  let draggedPiece = null;
  let selectedPiece = null;
  let startSquare = null;

  if (loadGameState(game)) {
    console.log("Game state loaded from sessionStorage");
    renderBoardFromFen(chessboard, game);
  } else {
    initializeBoard(chessboard);
  }

  function handleMove(piece, startSquare, targetSquare) {
    const move = game.move({
      from: startSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move) {
      const targetCell = document.querySelector(`.cell[data-position='${targetSquare}']`);
      handleSpecialMoves(move);

      targetCell.innerHTML = "";
      targetCell.appendChild(piece);
      piece.dataset.position = targetSquare;

      clearHighlights();
      deselectPiece(piece, startSquare);

      updateCapturedPieces(move, gameState);
      saveGameState(game);
      checkGameStatus(game);

      sendMoveToServer(move);
    }
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
      handleMove(draggedPiece, startSquare, targetPosition);
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
        handleMove(selectedPiece, startSquare, targetPosition);
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
        handleMove(selectedPiece, startSquare, targetPosition);
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