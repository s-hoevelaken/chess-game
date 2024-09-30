export function highlightAllowedMoves(square, game) {
  clearHighlights();

  const legalMoves = game.moves({ square, verbose: true });
  legalMoves.forEach((move) => {
    const targetCell = document.querySelector(
      `.cell[data-position='${move.to}']`
    );
    if (targetCell) {
      targetCell.classList.add("highlight");
    }
  });
}

export function clearHighlights() {
  const highlightedCells = document.querySelectorAll(".highlight");
  highlightedCells.forEach((cell) => cell.classList.remove("highlight"));
}

export function deselectPiece(selectedPiece, startSquare) {
  if (selectedPiece) {
    selectedPiece.classList.remove("selected");
    selectedPiece = null;
    startSquare = null;
  }
}

export function initializeBoard(chessboard) {
  chessboard.innerHTML = "";

  const initialPosition = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  ];

  initialPosition.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const cell = document.createElement("div");
      cell.classList.add(
        "cell",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );
      const position = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
      cell.dataset.position = position;
      if (piece) {
        const img = document.createElement("img");
        img.src = `client/images/pieces/${piece}.svg`;
        img.alt = "";
        img.draggable = true;
        img.dataset.piece = piece;
        img.dataset.position = position;
        cell.appendChild(img);
      }
      chessboard.appendChild(cell);
    });
  });
}

export function renderBoardFromFen(chessboard, game) {
  const position = game.board();
  chessboard.innerHTML = "";

  position.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const cell = document.createElement("div");
      cell.classList.add(
        "cell",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );
      const position = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
      cell.dataset.position = position;

      if (piece) {
        const img = document.createElement("img");
        img.src = `client/images/pieces/${piece.color}${piece.type}.svg`;
        img.alt = "";
        img.draggable = true;
        img.dataset.piece = `${piece.color}${piece.type}`;
        img.dataset.position = position;
        cell.appendChild(img);
      }

      chessboard.appendChild(cell);
    });
  });
}
