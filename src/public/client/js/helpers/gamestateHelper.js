import { initializeBoard } from "./uiHelper.js";

export let gameState = {
  board: null,
  turn: null,
  history: [],
  captured: {
    white: [],
    black: [],
  },
  timer: {
    white: 600,
    black: 600,
  },
};

export function saveGameState(game) {
  gameState.board = game.fen();
  gameState.turn = game.turn();
  gameState.history = game.history({ verbose: true });
  sessionStorage.setItem("chessGameState", JSON.stringify(gameState));
}

export function loadGameState(game) {
  const savedState = sessionStorage.getItem("chessGameState");
  if (savedState) {
    gameState = JSON.parse(savedState);
    game.load(gameState.board);
    return true;
  }
  return false;
}

export function resetGameState() {
  sessionStorage.removeItem("chessGameState");
}

export function endGame(chessboard, game) {
  game.reset();

  sessionStorage.removeItem("chessGameState");

  alert("Game Over!");
  initializeBoard(chessboard);
}
