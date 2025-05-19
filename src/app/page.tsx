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
      console.log("RANDOM PIECE", random)
      setCurrentPiece(random)


      const gameLoop = () => setInterval(() => {
        console.log("gameLoop");
        console.log(pieceRef.current);  
        if (pieceRef.current) {
          const newPiece = { ...pieceRef.current };
          newPiece.position.y += 1;
          console.log(newPiece)
          if (newPiece.position.y + newPiece.shape.length > grid.length) {
            newPiece.position.y = grid.length - newPiece.shape.length;
            setCurrentPiece(newPiece);
          }
        }
      }
      , 1000);
      const intervalId = gameLoop();
      return () => clearInterval(intervalId);
  }, [])


  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20  font-[family-name:var(--font-geist-sans)] bg-slate-800 text-white">
      <Grid grid={grid} currentPiece={currentPiece} setGrid={setGrid}/>
    </div>
  );
}
