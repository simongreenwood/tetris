export const pieces = {
  "T": {
    color: "bg-red-500",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  "I": {
    color: "bg-blue-500",
    shape: [
      [1, 1, 1, 1],
    ],
  },
  "O": {
    color: "bg-yellow-500",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  "L": {
    color: "bg-green-500",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  "J": {
    color: "bg-purple-500",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  "S": {
    color: "bg-cyan-500",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  "Z": {
    color: "bg-orange-500",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  }
};
export type Piece = {
  color: string;  
  shape: number[][];
};

export type CurrentPiece = Piece & {
  position: {
    x: number;
    y: number;
  };
};