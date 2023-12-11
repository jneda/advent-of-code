import path from "path";
import fs from "fs/promises";

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

/**
 * Builds pairs from an array.
 * @param arr - The input array.
 * @returns An array of pairs, where each pair consists of two elements from the input array.
 * @example
 * ```typescript
 * const input = [1, 2, 3, 4];
 * const output = buildPairs(input);
 * console.log(output); // [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
 * ```
 */
export function buildPairs(arr: any[]) {
  const pairs: [any, any][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

/**
 * Finds the coordinates of galaxies in the universe.
 * @param universe - The universe represented as a 2D array of strings.
 * @returns An array of strings representing the coordinates of galaxies in the universe.
 * @example
 * ```typescript
 * const universe = [
 *   "....#........",
 *   ".........#...",
 *   "#............",
 *   ".............",
 *   ".............",
 *   "........#....",
 *   ".#...........",
 *   "............#",
 *   ".............",
 *   ".............",
 *   ".........#...",
 *   "#....#.......",
 * ];
 * const galaxies = findGalaxies(universe);
 * console.log(galaxies); // ["4,0", "9,1", "0,2", "8,5", "1,6", "12,7", "9,10", "0,11", "5,11"]
 * ```
 */
export function findGalaxies(universe: string[]) {
  const galaxies: string[] = [];
  for (let r = 0; r < universe.length; r++) {
    for (let c = 0; c < universe[0].length; c++) {
      if (universe[r][c] === "#") galaxies.push(`${c},${r}`);
    }
  }

  return galaxies;
}

/**
 * Converts a string representation of coordinates to an array of numbers.
 * @param pos - The string representation of coordinates (e.g., "x,y").
 * @returns An array of numbers representing the coordinates.
 */
function toCoords(pos: string) {
  return pos.split(",").map((v) => Number.parseInt(v));
}

/**
 * Calculates the path length between two points on a grid.
 *
 * @param start - The starting point.
 * @param end - The ending point.
 * @param empty - An object containing empty rows and columns on the grid.
 * @param factor - The factor to multiply the count of empty rows and columns by.
 * @returns The length of the path between the start and end points.
 * @example
 * ```typescript
 * const empty = { rows: [7, 3], cols: [8, 5, 2] };
 * const factor = 10;
 * const start = "3,0";
 * const end = "7,1";
 * const pathLength = getPathLength(start, end, empty, factor);
 * console.log(pathLength); // 14
 * ```
 */
export function getPathLength(
  start: string,
  end: string,
  empty: { [k: string]: number[] },
  factor: number
) {
  // due to diagonal movement not being allowed
  // P = |sX - eX| + |sY - eY|

  const [sX, sY] = toCoords(start);
  const [eX, eY] = toCoords(end);

  // we also need the counts of empty rows and cols
  const emptyColsCount = empty.cols.filter(
    (c) => Math.min(sX, eX) < c && c < Math.max(sX, eX)
  ).length;
  const emptyRowsCount = empty.rows.filter(
    (r) => Math.min(sY, eY) < r && r < Math.max(sY, eY)
  ).length;

  return (
    Math.abs(sX - eX) +
    Math.abs(sY - eY) +
    (emptyColsCount + emptyRowsCount) * (factor - 1)
  );
}

/**
 * Finds the indices of empty rows and columns in the given data array.
 *
 * @param data - The array of strings representing the data.
 * @returns An object containing the indices of empty rows and columns.
 * @example
 * ```typescript
 * const data = [
 *   "...#......",
 *   ".......#..",
 *   "#.........",
 *   "..........",
 *   "......#...",
 *   ".#........",
 *   ".........#",
 *   "..........",
 *   ".......#..",
 *   "#...#.....",
 * ];
 * const empty = findEmptyRowsAndCols(data);
 * console.log(empty); // { rows: [3, 7], cols: [2, 5, 8] }
 * ```
 */
export function findEmptyRowsAndCols(data: string[]) {
  const empty: { [k: string]: number[] } = {
    rows: [],
    cols: [],
  };

  // find empty columns indices, from right to left
  for (let c = data[0].length - 1; c >= 0; c--) {
    const isEmpty = data.map((r) => r[c]).every((c) => c === ".");
    if (isEmpty) empty.cols.push(c);
  }

  // find empty row indices, from bottom to top
  for (let r = data.length - 1; r >= 0; r--) {
    const isEmpty = data[r].split("").every((c) => c === ".");
    if (isEmpty) empty.rows.push(r);
  }

  return empty;
}

async function main() {
  let universe: string[];
  try {
    universe = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const galaxies = findGalaxies(universe);
  const pairs = buildPairs(galaxies);
  const empty = findEmptyRowsAndCols(universe);

  const expansionFactor = 1000 * 1000;

  const pathLengths = pairs.map((pair) => {
    const [start, end] = pair;
    return getPathLength(start, end, empty, expansionFactor);
  });

  const sum = pathLengths.reduce((a, b) => a + b);
  console.log(sum);

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
