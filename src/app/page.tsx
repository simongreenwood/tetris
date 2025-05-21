"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Grid from "./components/Grid";
import { CurrentPiece, Piece } from "./Pieces";
import { pieces } from "./Pieces";

export default function Home() {
  const [grid,setGrid] = useState<string[][]>([])
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);

  const gridRef = useRef(grid);
  const pieceRef = useRef(currentPiece);

  const pickRandomPiece = (): CurrentPiece | null => {
    const g = gridRef.current;
    console.log(g)
    if (!g) return null;

    const keys = Object.keys(pieces) as Array<keyof typeof pieces>;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPiece = pieces[randomKey];

    const gridWidth = g[0]?.length || 10; // fallback in case grid is malformed
    const pieceWidth = randomPiece.shape[0]?.length || 1;

    const maxX = Math.max(0, gridWidth - pieceWidth);
    const randomX = Math.floor(Math.random() * (maxX + 1));
    const newPiece = {
      ...randomPiece,
      position: {
        x: randomX,
        y: 0,
      }
    }
    return newPiece;
  }

  const checkCollision = (piece: CurrentPiece, grid: string[][]) => {
    const { x, y } = piece.position;
    // check if the piece is at the bottom
    /*if (y + piece.shape.length >= gridRef.current.length) {
      // fix piece to grid
      const newGrid = [...gridRef.current];
      piece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            newGrid[y + dy][x + dx] = piece.color;
          }
        });
      });
      setGrid(newGrid);
      setCurrentPiece(pickRandomPiece());
      return true;
    }*/
  const newGrid = [...gridRef.current];
  let collision = false;
  piece.shape.map((row, currentY) => {
    row.map((value, currentX) => {
      if (value) {
        // check if the square under the piece is colliding with the grid if the cell is not empty
        if (
          y + currentY + 1 >= grid.length ||
          grid[y + currentY + 1][x + currentX] !== ""
        ) {
          collision = true;
        }
      }
    });
  });
  if (collision) {
    return true;  
  }
  return false;
}
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);
  useEffect(() => {
    pieceRef.current = currentPiece;
  }, [currentPiece]);

  useEffect(() => {
      const newGrid = Array.from({ length: 20 }, () => Array(10).fill(""));
      setGrid(newGrid);

      const random = pickRandomPiece();
      setCurrentPiece(random)

      const gameLoop = () => {
        return setInterval(() => {
          const piece: CurrentPiece | null = pieceRef.current;
          if (!piece) return;
          // check if piece is at the bottom of the grid. if it is. fix it to the grid. if its not just update the piece
          if (checkCollision(piece, gridRef.current)) {
            const newGrid = [...gridRef.current];
            piece.shape.forEach((row, dy) => {
              row.forEach((value, dx) => {
                if (value) {
                  newGrid[piece.position.y + dy][piece.position.x + dx] = piece.color;
                }
              });
            });
            setGrid(newGrid);
            setCurrentPiece(pickRandomPiece());
            return;
          }
          setCurrentPiece((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              position: {
                x: prev.position.x,
                y: prev.position.y + 1,
              },
            };
          });

        }, 1/5);
      }
      
      const intervalId = gameLoop();
      return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20  font-[family-name:var(--font-geist-sans)] bg-slate-800 text-white">
      <Grid grid={grid} currentPiece={currentPiece} setGrid={setGrid}/>
    </div>
  );
}
