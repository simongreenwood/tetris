export default function Grid({ grid }: { grid: number[][] }) {

  return (
    <div className="h-full w-full flex flex-col flex-1">
      {grid.map((row, rowIndex) => ( 
        <div key={rowIndex} className="flex flex-1">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`border border-gray-500 flex items-center justify-center w-full aspect-square ${
                cell === 1 ? "bg-blue-500" : "bg-gray-900"
              }`}
            >
               
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}