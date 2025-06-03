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

  const getCellColour = (x: number,y: number) => {
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