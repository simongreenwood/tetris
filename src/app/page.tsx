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

  const keysPressedRef = useRef<Set<string>>(new Set());


  
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

  const checkCollision = (piece: CurrentPiece, grid: string[][], offset: { x: number; y: number }) => {
    const { x, y } = piece.position;
    let collision = false;
    piece.shape.map((row, currentY) => {
      row.map((value, currentX) => {
        if (value) {
          // check if the square under the piece is colliding with the grid if the cell is not empty
          const newY = y + currentY + offset.y;
          const newX = x + currentX + offset.x;
          if (
            newY < 0 || newY >= grid.length ||
            newX < 0 || newX >= grid[0].length ||
            grid[newY][newX] !== ""
          ) {
            collision = true;
          }
        }
      });
    });
    return collision
  }
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);
  useEffect(() => {
    pieceRef.current = currentPiece;
  }, [currentPiece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const newGrid = Array.from({ length: 20 }, () => Array(10).fill(""));
    setGrid(newGrid);
    setCurrentPiece(pickRandomPiece());

    let lastTime = performance.now();
    const dropInterval = 100; // ms between automatic piece drops

    const animationRef = { current: 0 };

    const gameLoop = (now: number) => {
      const deltaTime = now - lastTime;

      if (deltaTime >= dropInterval) {
        lastTime = now;

        const piece: CurrentPiece | null = pieceRef.current;
        if (!piece) {
          animationRef.current = requestAnimationFrame(gameLoop);
          return;
        }

        const currentGrid = [...gridRef.current];

        if (checkCollision(piece, currentGrid, { x: 0, y: 1 })) {
          piece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
              if (value) {
                currentGrid[piece.position.y + dy][piece.position.x + dx] = piece.color;
              }
            });
          });
          setGrid(currentGrid);
          setCurrentPiece(pickRandomPiece());
        } else {
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
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);




  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const piece: CurrentPiece | null = pieceRef.current;
      if (!piece) return;
      const newGrid = [...gridRef.current];
      const { x, y } = piece.position;
      switch (event.key) {
        case "a":
          if (!checkCollision(piece, newGrid, { x: -1, y: 0 })) {
            setCurrentPiece((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                position: {
                  x: prev.position.x - 1,
                  y: prev.position.y,
                },
              };
            });
          }
          break;
        case "d":
          if (!checkCollision(piece, newGrid, { x: 1, y: 0 })) {
            setCurrentPiece((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                position: {
                  x: prev.position.x + 1,
                  y: prev.position.y,
                },
              };
            });
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20  font-[family-name:var(--font-geist-sans)] bg-slate-800 text-white">
      <Grid grid={grid} currentPiece={currentPiece} setGrid={setGrid}/>
    </div>
  );
}
