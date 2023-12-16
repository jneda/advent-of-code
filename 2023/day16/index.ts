import path from "path";
import { readFile } from "../../lib/files";

type Direction = ">" | "<" | "^" | "v";

function makeMaps(input: string[]) {
  const map = new Map<string, string>();
  // lightMap stores history of visits as strings
  const lightMap = new Map<string, Direction[]>();
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      const pos = `${row},${col}`;
      map.set(pos, input[row][col]);
      lightMap.set(pos, []);
    }
  }

  return { map, lightMap };
}

function isInBounds(x: number, y: number, width: number, height: number) {
  return 0 <= x && x < width && 0 <= y && y < height;
}

function getNeighbors(pos: string, width: number, height: number) {
  const [y, x] = pos.split(",").map((v) => parseInt(v));

  const directions = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
  };

  const neighbors: Record<string, string> = {};

  for (const [name, direction] of Object.entries(directions)) {
    const [dY, dX] = direction;
    const [newY, newX] = [y + dY, x + dX];
    if (isInBounds(newX, newY, width, height)) {
      neighbors[name] = `${newY},${newX}`;
    }
  }

  return neighbors;
}

function isLooping(
  cameFrom: Direction,
  currentTile: string,
  visitDirections: Direction[]
) {
  // we don't want
  // > | <

  if (
    currentTile === "|" &&
    ((cameFrom === ">" && visitDirections.includes("<")) ||
      (cameFrom === "<" && visitDirections.includes(">")))
  ) {
    return true;
  }

  // v
  // -
  // ^

  if (
    currentTile === "-" &&
    ((cameFrom === "v" && visitDirections.includes("^")) ||
      (cameFrom === "^" && visitDirections.includes("v")))
  ) {
    return true;
  }

  //  v
  // >/
  //
  // /<
  // ^

  if (
    currentTile === "/" &&
    ((cameFrom === ">" && visitDirections.includes("v")) ||
      (cameFrom === "v" && visitDirections.includes(">")) ||
      (cameFrom === "<" && visitDirections.includes("^")) ||
      (cameFrom === "^" && visitDirections.includes("<")))
  ) {
    return true;
  }

  // v
  // \<
  //
  // >\
  //  ^

  if (
    currentTile === "\\" &&
    ((cameFrom === "v" && visitDirections.includes("<")) ||
      (cameFrom === "<" && visitDirections.includes("v")) ||
      (cameFrom === ">" && visitDirections.includes("^")) ||
      (cameFrom === "^" && visitDirections.includes(">")))
  ) {
    return true;
  }

  return false;
}

function walk(
  map: Map<string, string>,
  lightMap: Map<string, Direction[]>,
  width: number,
  height: number
) {
  const start = "0,0";
  const stack: [string, Direction | null][] = [[start, null]]; // position, came from

  while (stack.length > 0) {
    console.log({ stackLength: stack.length });
    const current = stack.pop();
    if (!current) throw new Error("Unexpected end of stack.");

    let [currentPos, cameFrom] = current;
    if (cameFrom === null) cameFrom = ">";

    // prevent infinite loop from happening

    const visitDirections = lightMap.get(currentPos);
    if (visitDirections === undefined)
      throw new Error(`Invalid position: ${currentPos}.`);

    const currentTile = map.get(currentPos);
    if (!currentTile) throw new Error(`Invalid position: ${currentPos}.`);

    if (isLooping(cameFrom, currentTile, visitDirections)) continue;

    // then update light map

    lightMap.set(currentPos, [...visitDirections, cameFrom]);

    // get next steps

    const neighbors = getNeighbors(currentPos, width, height);
    const next: [string, Direction][] = [];

    if (cameFrom === ">") {
      if (currentTile === "." || currentTile === "-") {
        if (neighbors.right) next.push([neighbors.right, ">"]);
      }
      if (
        currentTile === "/" ||
        (currentTile === "|" && !visitDirections.includes("^"))
      ) {
        if (neighbors.up) next.push([neighbors.up, "^"]);
      }
      if (
        currentTile === "\\" ||
        (currentTile === "|" && !visitDirections.includes("v"))
      ) {
        if (neighbors.down) next.push([neighbors.down, "v"]);
      }
    }

    if (cameFrom === "<") {
      if (currentTile === "." || currentTile === "-") {
        if (neighbors.left) next.push([neighbors.left, "<"]);
      }
      if (
        currentTile === "\\" ||
        (currentTile === "|" && !visitDirections.includes("^"))
      ) {
        if (neighbors.up) next.push([neighbors.up, "^"]);
      }
      if (
        currentTile === "/" ||
        (currentTile === "|" && !visitDirections.includes("v"))
      ) {
        if (neighbors.down) next.push([neighbors.down, "v"]);
      }
    }

    if (cameFrom === "^") {
      if (currentTile === "." || currentTile === "|") {
        if (neighbors.up) next.push([neighbors.up, "^"]);
      }
      if (
        currentTile === "\\" ||
        (currentTile === "-" && !visitDirections.includes("<"))
      ) {
        if (neighbors.left) next.push([neighbors.left, "<"]);
      }
      if (
        currentTile === "/" ||
        (currentTile === "-" && !visitDirections.includes(">"))
      ) {
        if (neighbors.right) next.push([neighbors.right, ">"]);
      }
    }

    if (cameFrom === "v") {
      if (currentTile === "." || currentTile === "|") {
        if (neighbors.down) next.push([neighbors.down, "v"]);
      }
      if (
        currentTile === "/" ||
        (currentTile === "-" && !visitDirections.includes("<"))
      ) {
        if (neighbors.left) next.push([neighbors.left, "<"]);
      }
      if (
        currentTile === "\\" ||
        (currentTile === "-" && !visitDirections.includes(">"))
      ) {
        if (neighbors.right) next.push([neighbors.right, ">"]);
      }
    }

    // update stack
    for (const nextNode of next) {
      stack.push(nextNode);
    }
  }
}

async function main() {
  let input;
  try {
    const filepath = path.resolve(__dirname, "input.txt");
    input = await readFile(filepath);
    if (!input) throw new Error("Invalid data.");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const height = input.length;
  const width = input[0].length;
  const { map, lightMap } = makeMaps(input);
  walk(map, lightMap, width, height);

  let count = 0;
  for (let row = 0; row < height; row++) {
    let rowString = "";
    for (let col = 0; col < width; col++) {
      const visits = lightMap.get(`${row},${col}`);
      if (!visits) throw new Error(`Invalid position: ${row},${col}.`);
      const visited = visits.length > 0;
      if (visited) count++;
      rowString += visited ? "#" : ".";
    }
    console.log(rowString);
  }
  console.log({ count });

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
