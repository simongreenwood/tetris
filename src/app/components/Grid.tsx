import { useEffect } from "react";
import { CurrentPiece } from "../Pieces";
import Cell from "./Cell";


export default function Grid({
  grid,
  currentPiece,
  setGrid,
}: {
  grid: string[][];
  currentPiece: CurrentPiece | null;
  setGrid: (grid: string[][]) => void;
}) {
  const addCurrentPieceToGrid = (piece: CurrentPiece) => {
    const newGrid = grid.map((row) => [...row]);
    const { shape, color } = piece;
    shape.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        console.log(color,rowIndex, colIndex);
        if (col === 1) {
          newGrid[rowIndex][colIndex] = color;
        }
        if (col === 0) {
          newGrid[rowIndex][colIndex] = "bg-slate-900";
        }
      });
    });
    setGrid(newGrid);
  };

  useEffect(() => {
    console.log("currentPiece", currentPiece);
    if (currentPiece) {
      addCurrentPieceToGrid(currentPiece);
    }
  }, [currentPiece]);

  return (
    <div className="h-full w-full flex flex-col flex-1">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-1">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} color={cell ? cell : "bg-slate-900"} />
         ))}
        </div>
      ))}
    </div>
  );
}