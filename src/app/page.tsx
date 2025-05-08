"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Grid from "./components/Grid";

export default function Home() {
  const [grid,setGrid] = useState<number[][]>([])

  useEffect(() => {
      // setup the grid
      setGrid(Array.from({ length: 20 }, () => 
        Array.from({ length: 10 }, () => 0)
      ))
  }, [])
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20  font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <Grid grid={grid} />
    </div>
  );
}
