export default function Start({ startGame }: { startGame: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-5xl mb-4 text-white">TETRIS</h1>
      <button
        onClick={startGame}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Start Game
      </button>
      <p className="text-sm text-gray-500">
        Use arrow keys/A and D to move, up/W to rotate, c to hold
      </p>
      <p>Press space to hard drop, and down arrow/S to soft drop</p>
      <p className="text-sm text-gray-500">Created by Simon</p>
    </div>
  );
}
