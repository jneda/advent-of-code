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

export function expand(data: string[]) {
  let expanded: string[] = data.map((r) => r);

  // find empty columns indices, from right to left
  for (let c = data[0].length - 1; c >= 0; c--) {
    const isEmpty = data.map((r) => r[c]).every((c) => c === ".");
    if (!isEmpty) continue;
    // insert "." character on every row, after the empty column
    expanded = expanded.map((r) => r.slice(0, c + 1) + "." + r.slice(c + 1));
  }

  // find empty row indices, from bottom to top
  for (let r = expanded.length - 1; r >= 0; r--) {
    const isEmpty = expanded[r].split("").every((c) => c === ".");
    if (!isEmpty) continue;
    // insert a row of "." after the empty row
    expanded = expanded
      .slice(0, r + 1)
      .concat(".".repeat(expanded[0].length), expanded.slice(r + 1));
  }

  return expanded;
}

export function buildPairs(arr: any[]) {
  const pairs: [any, any][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}

export function findGalaxies(universe: string[]) {
  const galaxies: string[] = [];
  for (let r = 0; r < universe.length; r++) {
    for (let c = 0; c < universe[0].length; c++) {
      if (universe[r][c] === "#") galaxies.push(`${c},${r}`);
    }
  }

  return galaxies;
}

function toCoords(pos: string) {
  return pos.split(",").map((v) => Number.parseInt(v));
}

export function getPathLength(start: string, end: string) {
  // due to diagonal movement not being allowed
  // P = |sX - eX| + |sY - eY|
  const [sX, sY] = toCoords(start);
  const [eX, eY] = toCoords(end);
  return Math.abs(sX - eX) + Math.abs(sY - eY);
}

async function main() {
  let data: string[];
  try {
    data = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const universe = expand(data);
  const galaxies = findGalaxies(universe);
  const pairs = buildPairs(galaxies);
  
  const pathLengths = pairs.map((pair) => {
    const [start, end] = pair;
    return getPathLength(start, end);
  });

  const sum = pathLengths.reduce((a, b) => a + b);
  console.log(sum);
}

if (process.env.NODE_ENV !== "test") {
  main();
}
