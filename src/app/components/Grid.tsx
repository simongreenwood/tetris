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

  const getCellColour = (x,y) => {
    const defaultColor = "bg-slate-900";
    // check if cell contains current piece, if so draw it. if not then draw whatevers on the grid. if theres nothing in the grid. draw defaultColor
    if (currentPiece) {
      const { shape, color, position } = currentPiece;
      if (shape[y - position.y] && shape[y - position.y][x - position.x]) {
        return color;
      }
    }
    if (grid[y] && grid[y][x]) { 
      return grid[y][x];
    }
    return defaultColor;
  }
  const drawCurrentPiece = (piece: CurrentPiece) => {
    const newGrid = grid.map((row) => [...row]);
    const { shape, color, position } = piece;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell) {
          const x = position.x + cellIndex;
          const y = position.y + rowIndex;
          if (y >= 0 && y < newGrid.length && x >= 0 && x < newGrid[0].length) {
            newGrid[y][x] = color;
          }
        }
      });
    }
    );
  };

  useEffect(() => {
    if (currentPiece) {
      drawCurrentPiece(currentPiece);
    }
  }, [currentPiece]);

  return (
    <div className="h-full w-full flex flex-col flex-1">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-1">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} color={getCellColour(cellIndex, rowIndex)} />
         ))}
        </div>
      ))}
    </div>
  );
}