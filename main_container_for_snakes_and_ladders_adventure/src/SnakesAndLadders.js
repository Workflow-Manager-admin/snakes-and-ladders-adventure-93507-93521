import React, { useState } from "react";
import "./App.css";

/**
 * BOARD CONFIGURATION
 * Board: 10x10, squares 1 to 100, top left = 100, bottom left = 91, bottom right = 100
 * Ladders: mapping from base square to top square
 * Snakes: mapping from head square to tail square
 */
const BOARD_SIZE = 10;
const BOARD_SQUARES = 100;
// Example ladders and snakes for classic board experience, customizable for adventure version
const LADDERS = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91
};
const SNAKES = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 36,
  93: 73,
  95: 75,
  99: 78
};

const PLAYER_COLORS = ["#e87a41", "#22b8cf"];

/**
 * Get the screen coordinates (row, col) for the board square number.
 * Rows are zig-zag from bottom left to top right.
 */
function getBoardCoordinates(squareNumber) {
  const n = squareNumber - 1;
  const row = BOARD_SIZE - 1 - Math.floor(n / BOARD_SIZE);
  let col = n % BOARD_SIZE;
  if ((BOARD_SIZE - 1 - row) % 2 === 1) {
    col = BOARD_SIZE - 1 - col; // Reverse row direction every other row
  }
  return { row, col };
}

/**
 * Get the board square (1-based, 1 to 100) for given grid coordinates.
 */
function getSquareNumber(row, col) {
  let base = (BOARD_SIZE - 1 - row) * BOARD_SIZE;
  if ((BOARD_SIZE - 1 - row) % 2 === 1) {
    // Odd row: right to left
    col = BOARD_SIZE - 1 - col;
  }
  return base + col + 1;
}

// PUBLIC_INTERFACE
function SnakesAndLadders() {
  /**
   * players: [{position: int, name: string}]
   * turn: index of current player
   * diceValue: result of dice roll
   * history: [string] for displaying move narration (optional for basic UI)
   * gameState: "playing" | "ended"
   * winner: index or null
   */
  const [players, setPlayers] = useState([
    { name: "Player 1", color: PLAYER_COLORS[0], position: 1 },
    { name: "Player 2", color: PLAYER_COLORS[1], position: 1 },
  ]);
  const [turn, setTurn] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [gameState, setGameState] = useState("playing");
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("Welcome to Snakes and Ladders Adventure!");

  // Roll the dice, update player, check win/ladder/snake
  const handleDiceRoll = () => {
    if (gameState !== "playing") return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);

    let currPlayerIdx = turn;
    let newPlayers = [...players];
    let player = { ...newPlayers[currPlayerIdx] };

    let msg = `${player.name} rolled a ${roll}. `;

    let destination = player.position + roll;
    if (destination > BOARD_SQUARES) {
      // Can't move beyond 100, stay in place
      msg += `Cannot move. Needs exact roll to finish.`;
    } else {
      player.position = destination;
      // Check for ladder or snake
      if (LADDERS[player.position]) {
        msg += `Ladder up from ${player.position} to ${LADDERS[player.position]}! `;
        player.position = LADDERS[player.position];
      } else if (SNAKES[player.position]) {
        msg += `Oh no, snake down from ${player.position} to ${SNAKES[player.position]}. `;
        player.position = SNAKES[player.position];
      }
      // Win check
      if (player.position === BOARD_SQUARES) {
        setGameState("ended");
        setWinner(currPlayerIdx);
        msg += `🎉 ${player.name} WINS!`;
      }
    }

    newPlayers[currPlayerIdx] = player;
    setPlayers(newPlayers);

    if (gameState !== "ended" && player.position !== BOARD_SQUARES) {
      // Next player's turn
      setTurn((turn + 1) % players.length);
    }
    setMessage(msg);
  };

  const handleReset = () => {
    setPlayers([
      { name: "Player 1", color: PLAYER_COLORS[0], position: 1 },
      { name: "Player 2", color: PLAYER_COLORS[1], position: 1 },
    ]);
    setTurn(0);
    setDiceValue(null);
    setGameState("playing");
    setWinner(null);
    setMessage("Game reset. Good luck!");
  };

  // Helper rendering board squares with row/col, highlighting, and pieces
  function renderBoard() {
    // Build board grid from row 0 (top) to row 9 (bottom)
    let rows = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      let cols = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const sqNum = getSquareNumber(row, col);

        // Render player piece(s) on this square
        const pieces = players
          .map((p, idx) =>
            p.position === sqNum ? (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  background: p.color,
                  color: "#fff",
                  fontSize: "0.9em",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  lineHeight: "22px",
                  margin: "2px",
                  textAlign: "center",
                  fontWeight: "bold",
                  border: winner === idx ? "2px solid #FFD700" : "2px solid #fff",
                  boxShadow: winner === idx ? "0 0 10px yellow" : undefined,
                }}
                title={p.name}
              >
                {idx + 1}
              </span>
            ) : null
          )
          .filter(Boolean);

        // Check for ladder/snake
        let special = null;
        if (LADDERS[sqNum]) special = <div style={{ fontSize: "0.7em", color: "#1fa259" }}>L↑</div>;
        else if (SNAKES[sqNum]) special = <div style={{ fontSize: "0.7em", color: "#c92a2a" }}>S↓</div>;

        cols.push(
          <div
            key={col}
            className="board-cell"
            style={{
              border: "1px solid var(--border-color, #aaa)",
              background:
                sqNum === 1
                  ? "#e2e9f3"
                  : sqNum === BOARD_SQUARES
                  ? "#ffeab9"
                  : row % 2 === col % 2
                  ? "#28223a"
                  : "#322744",
              position: "relative",
              width: 38,
              height: 38,
              boxSizing: "border-box",
              padding: "2px",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              fontSize: "0.95em",
            }}
          >
            <div style={{ zIndex: 1 }}>{sqNum}</div>
            <div style={{ position: "absolute", bottom: 1, right: 2 }}>{special}</div>
            <div style={{ position: "absolute", top: 3, left: 4, display: "flex", gap: 2 }}>{pieces}</div>
          </div>
        );
      }
      rows.push(
        <div key={row} style={{ display: "flex", flexDirection: "row" }}>
          {cols}
        </div>
      );
    }
    return <div>{rows}</div>;
  }

  return (
    <div className="container" style={{ padding: "26px 0 50px 0" }}>
      <div style={{ display: "flex", flexDirection: "row", gap: 36, justifyContent: "center" }}>
        <div>
          <h2 style={{ color: "var(--kavia-orange)" }}>Snakes and Ladders Adventure</h2>
          <div style={{ fontSize: 18, margin: "10px 0 16px 0" }}>{message}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {players.map((p, idx) => (
              <div
                key={p.name}
                style={{
                  color: p.color,
                  fontWeight: turn === idx && gameState === "playing" ? "bold" : "normal",
                  border:
                    winner === idx
                      ? "2px solid gold"
                      : turn === idx && gameState === "playing"
                      ? "1px solid var(--kavia-orange)"
                      : "1px solid #333",
                  borderRadius: 8,
                  padding: "7px 13px",
                  marginBottom: 4,
                  background:
                    winner === idx
                      ? "#fffbe6"
                      : turn === idx && gameState === "playing"
                      ? "rgba(233, 122, 65, 0.09)"
                      : "transparent",
                  transition: "background 0.2s"
                }}
                data-testid={`player-status-${idx}`}
              >
                {p.name} ({p.position})
                {winner === idx ? " 🏆" : turn === idx && gameState === "playing" ? " ← Your Turn" : ""}
              </div>
            ))}
          </div>
          <button
            onClick={handleDiceRoll}
            className="btn btn-large"
            style={{ margin: "20px 0", width: 130 }}
            disabled={gameState !== "playing"}
            data-testid="roll-dice-btn"
          >
            {gameState === "playing"
              ? `🎲 Roll${diceValue !== null ? ` (${diceValue})` : ""}`
              : "Game Ended"}
          </button>
          <br />
          <button
            onClick={handleReset}
            className="btn"
            style={{ marginBottom: 12, marginTop: 0, background: "#333", color: "#fff" }}
            data-testid="reset-btn"
          >
            Reset
          </button>
        </div>
        <div>
          {renderBoard()}
        </div>
      </div>
    </div>
  );
}

export default SnakesAndLadders;
