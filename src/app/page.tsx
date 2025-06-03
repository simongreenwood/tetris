"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import Grid from "./components/Grid";
import { CurrentPiece, Piece } from "./Pieces";
import { pieces } from "./Pieces";

export default function Home() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);

  const gridRef = useRef(grid);
  const pieceRef = useRef(currentPiece);

  const keysPressedRef = useRef<Set<string>>(new Set());
  const dropTimeRef = useRef(performance.now());

  const autoShiftDelay = 150;
  const autoShiftInterval = 25;

  const directionRef = useRef<number | null>(0);
  const autoShiftStartRef = useRef(performance.now());
  const lastShiftRef = useRef(performance.now());

  const pickRandomPiece = useCallback((): CurrentPiece | null => {
    const g = gridRef.current;
    if (!g) return null;

    const keys = Object.keys(pieces) as Array<keyof typeof pieces>;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPiece = pieces[randomKey];

    const gridWidth = g[0]?.length || 10;
    const pieceWidth = randomPiece.shape[0]?.length || 1;
    const maxX = Math.max(0, gridWidth - pieceWidth);
    const randomX = Math.floor(Math.random() * (maxX + 1));

    return {
      ...randomPiece,
      position: { x: randomX, y: 0 },
    };
  }, [gridRef, pieceRef]);

  const checkCollision = (
    piece: CurrentPiece,
    grid: string[][],
    offset: { x: number; y: number }
  ): boolean => {
    const { x, y } = piece.position;

    for (let currentY = 0; currentY < piece.shape.length; currentY++) {
      const row = piece.shape[currentY];
      for (let currentX = 0; currentX < row.length; currentX++) {
        if (row[currentX]) {
          const newY = y + currentY + offset.y;
          const newX = x + currentX + offset.x;
          if (
            newY < 0 ||
            newY >= grid.length ||
            newX < 0 ||
            newX >= grid[0].length ||
            grid[newY][newX] !== ""
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const moveSideways = useCallback((direction:number) => {
    const piece = pieceRef.current;
    const currentActiveGrid = gridRef.current;

    if (piece && currentActiveGrid && currentActiveGrid.length > 0) {
      const newPosition = { x: piece.position.x + direction, y: piece.position.y };
      if (!checkCollision(piece, currentActiveGrid, { x: direction, y: 0 })) {
        setCurrentPiece(prev => prev && ({ ...prev, position: newPosition }));
        return true; // piece moved 
      }
    }
    return false; // piece did not move
  }, []);


  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { pieceRef.current = currentPiece; }, [currentPiece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "a" && directionRef.current !== -1) {
        directionRef.current = -1;
        moveSideways(-1);
        autoShiftStartRef.current = performance.now();
        lastShiftRef.current = 0;
      } else if (key === "d" && directionRef.current !== 1) {
        directionRef.current = 1;
        moveSideways(1);
        autoShiftStartRef.current = performance.now();
        lastShiftRef.current = 0;
      }

      keysPressedRef.current.add(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressedRef.current.delete(key);

      if ((key === "a" && directionRef.current === -1) ||
          (key === "d" && directionRef.current === 1)) {
        directionRef.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
  const inputLoop = setInterval(() => {
    if (directionRef.current !== null) {
      const now = performance.now();
      const elapsed = now - autoShiftStartRef.current;

      if (
        elapsed >= autoShiftDelay &&
        now - lastShiftRef.current >= autoShiftInterval
      ) {
        if (moveSideways(directionRef.current)) {
          lastShiftRef.current = now;
        } else {
          directionRef.current = null;
        }
      }
    }
  }, 16); // ~60 FPS

  return () => clearInterval(inputLoop);
}, []);

  useEffect(() => {
    const newGrid = Array.from({ length: 20 }, () => Array(10).fill(""));
    setGrid(newGrid);
    setCurrentPiece(pickRandomPiece());

    const dropInterval = 500;
    const animationRef = { current: 0 };

    const gameLoop = (now: number) => {
      const grid = gridRef.current;
      const piece = pieceRef.current;
      const dropDelta = now - dropTimeRef.current;

      if (!piece) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      const currentGrid = gridRef.current.map(row => [...row]);


      if (dropDelta >= dropInterval) {
        dropTimeRef.current = now;
        if (checkCollision(piece, currentGrid, { x: 0, y: 1 })) {
          piece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
              if (!value) return; // Skip empty cells
              const gridX = piece.position.x + dx;
              const gridY = piece.position.y + dy;
              if (
                gridY >= 0 &&
                gridY < currentGrid.length &&
                gridX >= 0 &&
                gridX < currentGrid[0].length &&
                value
              ) {
                currentGrid[gridY][gridX] = piece.color;
              }
            });
          });
          setGrid(currentGrid);
          setCurrentPiece(null);
          setTimeout(() => {
            setCurrentPiece(pickRandomPiece());
          }, 500);
        } else {
          setCurrentPiece(prev => prev && ({
            ...prev,
            position: {
              x: prev.position.x,
              y: prev.position.y + 1,
            },
          }));
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-slate-800 text-white">
      <Grid grid={grid} currentPiece={currentPiece} setGrid={setGrid} />
    </div>
  );
}
