export const pieces = {
  "T": {
    color: "bg-purple-500",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  "I": {
    color: "bg-cyan-400",
    shape: [
      [1, 1, 1, 1],
    ],
  },
  "O": {
    color: "bg-yellow-300",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  "L": {
    color: "bg-orange-400",
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
    color: "bg-cyan-400",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  "Z": {
    color: "bg-orange-400",
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