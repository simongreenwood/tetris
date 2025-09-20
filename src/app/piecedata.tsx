export const pieces = [
  {
    color: 1, // T
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    color: 2, // I
    shape: [[1, 1, 1, 1]],
  },
  {
    color: 3, // O
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    color: 4, // L
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    color: 5, // J
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    color: 6, // S
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    color: 7, // Z
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
];

export const colors = [
  "bg-gray-900", // background/empty color
  "bg-purple-500", // T
  "bg-cyan-400", // I
  "bg-yellow-400", // O
  "bg-orange-500", // L
  "bg-blue-500", // J
  "bg-green-400", // S
  "bg-red-400", // Z
];

export const ghostColors = [
  "bg-gray-900",
  "border bg-gray-900 border-purple-800",
  "border bg-gray-900 border-cyan-700",
  "border bg-gray-900 border-yellow-700",
  "border bg-gray-900 border-orange-800",
  "border bg-gray-900 border-blue-800",
  "border bg-gray-900 border-green-700",
  "border bg-gray-900 border-red-700",
];

export type Piece = {
  color: number;
  shape: number[][];
};

export type CurrentPiece = Piece & {
  position: {
    x: number;
    y: number;
  };
};
