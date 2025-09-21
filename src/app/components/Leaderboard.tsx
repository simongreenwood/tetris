import { useEffect, useState } from "react";
import { getTopScores } from "../actions";

type Score = {
  id: number;
  name: string;
  score: number;
};
export default function Leaderboard({
  setShowLeaderboard,
}: {
  setShowLeaderboard: (show: boolean) => void;
}) {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const topScores = await getTopScores(10);
      setScores(topScores);
    };
    fetchScores();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Leaderboard</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setShowLeaderboard(false)}
      >
        Back
      </button>
      <ul>
        {scores.map((score: Score) => (
          <li key={score.id}>
            {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
