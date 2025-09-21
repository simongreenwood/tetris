import { useState } from "react";
import { handleGameOver } from "../actions";

export default function GameOver({
  score,
  restartGame,
}: {
  score: number;
  restartGame: () => void;
}) {
  const [name, setName] = useState("");
  const [sentScore, setSentScore] = useState(false);
  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentScore) {
      await handleGameOver(score, name);
    }

    setSentScore(true);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl mb-4 text-white">Game Over</h1>
      <p className="text-2xl mb-4 text-white">Score: {score}</p>
      {sentScore ? (
        <p>submitted!</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            className="mb-4 p-2 rounded text-black bg-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={submitScore}
          >
            Submit Score
          </button>
        </div>
      )}
      <button
        onClick={() => {
          restartGame();
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Restart Game
      </button>
    </div>
  );
}
