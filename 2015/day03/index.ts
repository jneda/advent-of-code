import path from "path";
import { readFile } from "../../lib/files";

export type MoveChar = "^" | "v" | "<" | ">";
function isMoveChar(char: string): char is MoveChar {
  return char === "^" || char === "v" || char === "<" || char === ">";
}

export type Direction =
  | { x: 0; y: -1 }
  | { x: 0; y: 1 }
  | { x: -1; y: 0 }
  | { x: 1; y: 0 };

export type Position = {
  x: number;
  y: number;
};

export function decodeMove(char: MoveChar) {
  const MovesDictionary: Record<MoveChar, Direction> = {
    "^": { x: 0, y: -1 },
    v: { x: 0, y: 1 },
    "<": { x: -1, y: 0 },
    ">": { x: 1, y: 0 },
  };
  return MovesDictionary[char];
}

export function applyMove(position: Position, direction: Direction) {
  const { x: px, y: py } = position;
  const { x: dx, y: dy } = direction;
  return {
    x: px + dx,
    y: py + dy,
  };
}

function pointToString(p: Position) {
  return `${p.x},${p.y}`;
}

function stringToPoint(s: string) {
  const [x, y] = s.split(",");
  return { x, y };
}

export function walk(input: string) {
  const delivering = new Map();
  let position = { x: 0, y: 0 };
  delivering.set(pointToString(position), 1);

  const moveChars = input.split("");
  if (!moveChars.every((char) => isMoveChar(char))) {
    throw new Error("Invalid input");
  }

  for (const moveChar of moveChars as MoveChar[]) {
    if (!isMoveChar(moveChar)) {
      throw new Error(
        `Invalid character ${moveChar} in string ${moveChars.join("")}`
      );
    }
    position = applyMove(position, decodeMove(moveChar));
    const coords = pointToString(position);
    if (!delivering.get(coords)) {
      delivering.set(coords, 0);
    }
    delivering.set(coords, delivering.get(coords) + 1);
  }

  // console.log(Array.from(delivering));

  return delivering;
}

async function main() {
  const filePath = path.resolve(__dirname, "./input.txt");
  let input;
  try {
    input = await readFile(filePath);
  } catch (error) {
    return console.error(error);
  }
  if (!input) {
    return console.error("Unable to read file.");
  }
  
  const [moveChars] = input;
  const delivering = walk(moveChars);
  console.log(`Santa has visited ${delivering.size} houses.`);

  const routeA = Array.from(moveChars)
    .filter((_v, index) => index % 2 !== 0)
    .join("");
  const routeB = Array.from(moveChars)
    .filter((_v, index) => index % 2 === 0)
    .join("");

  const [deliveringA, deliveringB] = [walk(routeA), walk(routeB)];

  const stopsA = Array.from(deliveringA.keys());
  const stopsB = Array.from(deliveringB.keys());
  const uniqueStops = new Set([...stopsA, ...stopsB]);

  console.log(`Santa and RoboSanta have visited ${uniqueStops.size} houses.`);
}

if (process.env.NODE_ENV !== "test") {
  main();
}
