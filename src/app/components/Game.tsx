"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors, Piece, pieces } from "../piecedata";

const rotate = (shape: number[][]): number[][] => {
  const rotated = shape[0].map((_, index) =>
    shape.map((row) => row[index]).reverse()
  );
  return rotated;
};

const shuffle = (array: Piece[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export default function Game() {
  const [board, setBoard] = useState<number[][]>(() =>
    Array.from({ length: 20 }, () => Array(10).fill(0))
  );
  const [currentPiecePosition, setCurrentPiecePosition] = useState({
    x: 4,
    y: 0,
  });
  // store random current piece object including colour and shape
  const [currentPiece, setCurrentPiece] = useState<Piece>(pieces[0]);

  const currentPieceRef = useRef({
    position: currentPiecePosition,
    piece: currentPiece,
  });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [pieceQueue, setPieceQueue] = useState<Piece[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffled = shuffle([...pieces]);
    const firstPiece = shuffled[0];
    setCurrentPiece(firstPiece);
    setCurrentPiecePosition({ x: 4, y: 0 });
    setPieceQueue(shuffled.slice(1));
  }, []);

  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    currentPieceRef.current.position = currentPiecePosition;
    currentPieceRef.current.piece = currentPiece;
  }, [currentPiecePosition, currentPiece]);

  useEffect(() => {
    const linePoints = [0, 40, 100, 300, 1200];

    const clearedRows = board.filter((row) =>
      row.every((cell) => cell !== 0)
    ).length;
    if (clearedRows > 0) {
      const newBoard = board.filter((row) => row.some((cell) => cell === 0));
      const emptyRows = Array.from({ length: clearedRows }, () =>
        Array(10).fill(0)
      );
      setBoard([...emptyRows, ...newBoard]);
      setLinesCleared((prev) => {
        const total = prev + clearedRows;
        if (total >= level * 10) {
          setLevel((lvl) => lvl + 1);
        }
        return total;
      });
      const points = linePoints[clearedRows] * level;
      setScore((old) => old + points);
    }
  }, [board, level]);

  const canMoveDown = useCallback(() => {
    return currentPiece.shape.every((row, rowIndex) =>
      row.every((cell, colIndex) => {
        if (cell === 1) {
          const nextY = currentPiecePosition.y + rowIndex + 1;
          const nextX = currentPiecePosition.x + colIndex;
          return nextY < board.length && board[nextY]?.[nextX] === 0;
        }
        return true;
      })
    );
  }, [board, currentPiece, currentPiecePosition]);

  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]);
      const { x, y } = currentPieceRef.current.position;
      const currentPiece = currentPieceRef.current.piece;

      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell === 1) {
            newBoard[y + rowIndex][x + colIndex] = currentPiece.color;
          }
        });
      });
      return newBoard;
    });
  }, [setBoard]);
  const checkCollision = useCallback(
    (pieceShape: number[][], position: { x: number; y: number }): boolean => {
      return pieceShape.every((row, rowIndex) =>
        row.every((cell, colIndex) => {
          if (cell === 1) {
            const nextY = position.y + rowIndex;
            const nextX = position.x + colIndex;
            return (
              nextX >= 0 &&
              nextX < board[0].length &&
              nextY < board.length &&
              (nextY < 0 || board[nextY]?.[nextX] === 0)
            );
          }
          return true;
        })
      );
    },
    [board]
  );

  const newCurrentPiece = useCallback(() => {
    const nextPiece = pieceQueue[0] || pieces[0];
    const startPos = { x: 4, y: 0 };
    if (!checkCollision(nextPiece.shape, startPos)) {
      setGameOver(true);
      return;
    }
    setPieceQueue((prevQueue) => {
      setCurrentPiece(nextPiece);
      setCurrentPiecePosition(startPos);
      const newQueue = prevQueue.slice(1);
      if (newQueue.length <= 7) {
        return [...newQueue, ...shuffle([...pieces])];
      }
      return newQueue;
    });
  }, [checkCollision, pieceQueue]);

  const pieceFall = useCallback(() => {
    if (canMoveDown()) {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = null;
      }
      setCurrentPiecePosition((prevPos) => ({
        x: prevPos.x,
        y: prevPos.y + 1,
      }));
    } else {
      if (!lockTimeoutRef.current) {
        lockTimeoutRef.current = setTimeout(() => {
          lockPiece();
          setIsLocked(true);
        }, 500);
      }
    }
  }, [canMoveDown, lockPiece]);

  useEffect(() => {
    // This effect runs after the board has been updated by lockPiece()
    if (isLocked) {
      newCurrentPiece();
      setIsLocked(false); // Reset the trigger
    }
  }, [isLocked, newCurrentPiece]);

  useEffect(() => {
    if (gameOver) {
      console.log("Game Over");
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        // check if can move left
        const nextPos = {
          x: currentPiecePosition.x - 1,
          y: currentPiecePosition.y,
        };
        if (checkCollision(currentPiece.shape, nextPos)) {
          if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
            lockTimeoutRef.current = null;
          }

          setCurrentPiecePosition(nextPos);
          const isGrounded = !checkCollision(currentPiece.shape, {
            x: nextPos.x,
            y: nextPos.y + 1,
          });
          if (isGrounded) {
            lockTimeoutRef.current = setTimeout(() => {
              lockPiece();
              setIsLocked(true);
            }, 500);
          }
        }
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        // check if can move right
        const nextPos = {
          x: currentPiecePosition.x + 1,
          y: currentPiecePosition.y,
        };
        const canMoveRight = checkCollision(currentPiece.shape, nextPos);
        if (canMoveRight) {
          if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
            lockTimeoutRef.current = null;
          }
          setCurrentPiecePosition(nextPos);
          const isGrounded = !checkCollision(currentPiece.shape, {
            x: nextPos.x,
            y: nextPos.y + 1,
          });
          if (isGrounded) {
            lockTimeoutRef.current = setTimeout(() => {
              lockPiece();
              setIsLocked(true);
            }, 500);
          }
        }
      }
      if (e.key === "ArrowUp" || e.key === "w") {
        const rotatedShape = rotate(currentPiece.shape);
        const canRotate = checkCollision(rotatedShape, currentPiecePosition);
        if (canRotate) {
          if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
            lockTimeoutRef.current = null;
          }
          setCurrentPiece((prevPiece) => ({
            ...prevPiece,
            shape: rotatedShape,
          }));

          const isGrounded = !checkCollision(rotatedShape, {
            x: currentPiecePosition.x,
            y: currentPiecePosition.y + 1,
          });
          if (isGrounded) {
            lockTimeoutRef.current = setTimeout(() => {
              lockPiece();
              setIsLocked(true);
            }, 500);
          }
        }
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        pieceFall();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const fallSpeed =
      1000 - (level - 1) * 50 > 100 ? 1000 - (level - 1) * 50 : 100;
    const gameLoop = setInterval(() => {
      pieceFall();
    }, fallSpeed);
    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    pieceFall,
    level,
    currentPiecePosition,
    checkCollision,
    currentPiece,
    lockPiece,
    newCurrentPiece,
    gameOver,
  ]);

  const getCellColor = (rowIndex: number, colIndex: number) => {
    if (
      currentPiece.shape[rowIndex - currentPiecePosition.y]?.[
        colIndex - currentPiecePosition.x
      ] === 1
    ) {
      return colors[currentPiece.color];
    }
    return colors[board[rowIndex][colIndex] || 0];
  };

  return (
    <div className="flex flex-row gap-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl mb-4 text-white">{score}</h1>
        <div className="grid grid-rows-20 grid-cols-10 gap-0.5 bg-gray-800 p-2">
          {board.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 ${getCellColor(rowIndex, colIndex)}`}
                ></div>
              );
            })
          )}
        </div>
        <div className="text-white mt-4 flex justify-between w-64">
          <div>Level: {level}</div>
          <div>Lines: {linesCleared}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <h2 className="text-2xl text-white mb-2 ">Next</h2>
        <div className="bg-gray-800 rounded-lg p-2">
          {pieceQueue.slice(0, 3).map((piece, index) => (
            <div
              key={index}
              className="p-2 w-[9.375rem] rounded-lg grid gap-0.5 py-4 "
            >
              {piece.shape.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-0.5">
                  {row.map((cell, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-8 h-8 ${
                        cell === 1 ? colors[piece.color] : "bg-transparent"
                      }`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
