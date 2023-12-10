import path from "path";
import fs from "fs/promises";

type Position = [number, number];
type Node = [Position, NodeType, number, Position | null];
type NodeType = "S" | "|" | "-" | "L" | "J" | "7" | "F" | ".";

async function readFile(filename: string) {
  const filepath = path.resolve(__dirname, filename);
  let fileHandle;
  try {
    fileHandle = await fs.open(filepath);
    const lines = [];
    for await (const line of fileHandle.readLines()) {
      lines.push(line);
    }
    return lines;
  } catch (error) {
    if (error instanceof Error) {
      throw Error;
    }
    throw new Error("Could not open file.");
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}

async function saveData(filename: string, data: string) {
  try {
    const filepath = path.resolve(__dirname, filename);
    await fs.writeFile(filepath, data);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw "Could not save data.";
  }
}

/**
 * Converts a position to a string representation.
 * @param p The position to convert.
 * @returns The string representation of the position.
 */
const posToString = (p: Position) => {
  const [r, c] = p;
  return `${r},${c}`;
};

/**
 * Finds the starting position in the given data.
 * @param data - The data array.
 * @returns The starting position as a tuple of row and column indices, or null if not found.
 */
function getStartingPosition(data: string[]) {
  let start: [number, number] | null = null;
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[0].length; c++) {
      if (data[r][c] === "S") {
        start = [r, c];
        break;
      }
    }
  }
  return start;
}

/**
 * Calculates the destination position based on the current position, direction, and data.
 * @param pos The current position.
 * @param direction The direction to move.
 * @param data The data representing the grid.
 * @returns The destination position if it is within the bounds of the grid, otherwise null.
 */
function getDestination(pos: Position, direction: Position, data: string[]) {
  const isInXBounds = (c: number) => 0 <= c && c < data[0].length;
  const isInYBounds = (r: number) => 0 <= r && r < data.length;
  const isInBounds = (r: number, c: number) => isInYBounds(r) && isInXBounds(c);

  const [r, c] = pos;
  const [dy, dx] = direction;
  const newR = r + dy;
  const newC = c + dx;

  if (!isInBounds(newR, newC)) return null;
  return [newR, newC] as Position;
}

/**
 * Returns the neighboring positions of a given position based on the type of node.
 * @param pos The current position.
 * @param type The type of node.
 * @param data The data array representing the grid.
 * @returns An array of neighboring positions.
 * @throws Error if the data is invalid.
 */
function getNeighbors(pos: Position, type: NodeType, data: string[]) {
  const neighbors: Position[] = [];

  let directions: Position[];
  switch (type) {
    case "S":
      directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      break;
    case "|":
      directions = [
        [-1, 0],
        [1, 0],
      ];
      break;
    case "-":
      directions = [
        [0, -1],
        [0, 1],
      ];
      break;
    case "L":
      directions = [
        [-1, 0],
        [0, 1],
      ];
      break;
    case "J":
      directions = [
        [-1, 0],
        [0, -1],
      ];
      break;
    case "7":
      directions = [
        [1, 0],
        [0, -1],
      ];
      break;
    case "F":
      directions = [
        [1, 0],
        [0, 1],
      ];
      break;
    case ".":
      directions = [];
      break;
    default:
      throw new Error("Invalid data.");
  }

  for (const direction of directions) {
    const destination = getDestination(pos, direction, data);
    if (!destination) {
      continue;
    }
    const isConnected = connects(direction, getType(destination, data));
    if (isConnected) neighbors.push(destination);
  }

  return neighbors;
}

/**
 * Determines if a given direction connects to a specific destination type.
 * @param direction - The position direction.
 * @param destinationType - The type of the destination node.
 * @returns True if the direction connects to the destination type, false otherwise.
 * @throws Error if the direction is invalid.
 */
function connects(direction: Position, destinationType: NodeType) {
  switch (posToString(direction)) {
    case "-1,0":
      return (
        destinationType === "S" ||
        destinationType === "7" ||
        destinationType === "F" ||
        destinationType === "|"
      );
    case "1,0":
      return (
        destinationType === "S" ||
        destinationType === "J" ||
        destinationType === "L" ||
        destinationType === "|"
      );
    case "0,-1":
      return (
        destinationType === "S" ||
        destinationType === "-" ||
        destinationType === "F" ||
        destinationType === "L"
      );
    case "0,1":
      return (
        destinationType === "S" ||
        destinationType === "-" ||
        destinationType === "7" ||
        destinationType === "J"
      );
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}

/**
 * Gets the type of a tile at the specified position.
 * @param pos The position of the tile.
 * @param data The array of strings representing the grid.
 * @returns The type of the tile.
 * @throws Error if the tile is invalid.
 */
function getType(pos: Position, data: string[]) {
  const [r, c] = pos;
  const tile = data[r][c];
  if (
    tile !== "S" &&
    tile !== "|" &&
    tile !== "-" &&
    tile !== "L" &&
    tile !== "J" &&
    tile !== "7" &&
    tile !== "F" &&
    tile !== "."
  ) {
    throw new Error("Invalid data.");
  }
  return tile;
}

/**
 * Explores the given data starting from the specified position using BFS.
 * Returns the distance traveled to reach the farthest point from the start.
 *
 * @param start - The starting position.
 * @param data - The data to explore.
 * @returns The distance traveled to reach the farthest point from the start.
 */
function explore(start: Position, data: string[]) {
  // do BFS, keeping track of the distance traveled
  // when the second branch reaches an already visited cell,
  // we have found the point farthest from the start

  const queue: Node[] = [[start, "S", 0, null]]; // node, type, distance traveled, came from
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) throw new Error("Unexpected end of queue.");

    const [currentPos, type, distance, cameFrom] = current;
    if (visited.has(posToString(currentPos))) {
      console.log(`Farthest point reached. Distance from start: ${distance}`);
      return distance;
    }

    visited.add(posToString(currentPos));

    const neighbors = getNeighbors(currentPos, type, data);
    for (const position of neighbors) {
      if (
        cameFrom &&
        position[0] === cameFrom[0] &&
        position[1] === cameFrom[1]
      ) {
        continue;
      }
      queue.push([position, getType(position, data), distance + 1, currentPos]);
    }
  }
}

async function main() {
  let data: string[];
  try {
    data = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const start: Position | null = getStartingPosition(data);
  if (!start) throw new Error("Invalid data.");

  explore(start, data);
  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
