import path from "path";
import fs from "fs/promises";
import type { FileHandle } from "fs/promises";

type GraphNode = {
  position: string;
  distance: number;
  parent: GraphNode | null;
};

async function getData(filename: string) {
  let data: string[] = [];
  let file: FileHandle | null = null;
  try {
    const filepath = path.resolve(__dirname, filename);
    file = await fs.open(filepath);
    for await (const line of file.readLines()) {
      data.push(line);
    }
    return data;
  } catch (error) {
    throw new Error("Could not read file.");
  } finally {
    if (file) {
      await file.close();
    }
  }
}

function initMap(data: string[]) {
  const map = new Map<string, number>();
  const height = data.length;
  const width = data[0].length;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      map.set(`${r},${c}`, parseInt(data[r][c]));
    }
  }
  return { height, width, map };
}

function findClosestPosition(
  unvisited: string[],
  graph: Map<string, GraphNode>
) {
  const graphDistances = Array.from(graph.entries())
    .filter(([pos, _node]) => unvisited.includes(pos))
    .map(([_pos, node]) => node.distance);
  const minDist = Math.min(...graphDistances);

  const closestPos = unvisited.find((pos) => {
    const currentNode = graph.get(pos);
    if (!currentNode) throw new Error(`Invalid position ${pos}.`);

    return currentNode.distance === minDist;
  });

  if (closestPos === undefined)
    throw new Error(
      `Could not find the closest position in ${JSON.stringify(unvisited)}`
    );
  return closestPos;
}

function getNeighbors(
  pos: string,
  height: number,
  width: number,
  graph: Map<string, GraphNode>,
  unvisited: string[]
) {
  const [r, c] = pos.split(",").map((v) => parseInt(v));
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const neighbors: string[] = [];
  for (const [dR, dC] of directions) {
    const [newR, newC] = [r + dR, c + dC];

    const isInBounds = 0 <= newR && newR < height && 0 <= newC && newC < width;
    if (!isInBounds) continue;

    const isVisited = unvisited.includes(pos);
    if (isVisited) continue;

    const isValidMove = (newR: number, newC: number) => {
      let currentNode = graph.get(pos);
      if (currentNode === undefined)
        throw new Error(`Invalid position: ${pos}.`);

      // prevent the path from traveling more than 3 spaces in the same direction consecutively
      let stepsCount = 0;
      let travelDirection: [number, number] | null = null;
      do {
        console.log({ stepsCount, travelDirection });
        const [currentR, currentC] = currentNode.position
          .split(",")
          .map((v) => parseInt(v));
        travelDirection = null;
        const parent = currentNode.parent;
        if (!parent) continue;

        const [parentR, parentC] = parent.position
          .split(",")
          .map((v) => parseInt(v));
        travelDirection = [currentR - parentR, currentC - parentC];
        stepsCount++;
        currentNode = parent as GraphNode;
      } while (
        travelDirection &&
        travelDirection[0] === dR &&
        travelDirection[1] === dC
      );

      return stepsCount < 4;
    };

    if (isValidMove(newR, newC)) {
      neighbors.push(`${newR},${newC}`);
    }
  }

  return neighbors;
}

function constrainedDijkstra(
  map: Map<string, number>,
  start: string,
  end: string,
  height: number,
  width: number
) {
  const graph = new Map<string, GraphNode>();
  let unvisited: string[] = [];
  for (const pos of map.keys()) {
    graph.set(pos, {
      position: pos,
      distance: pos === start ? 0 : Infinity,
      parent: null,
    });
    unvisited.push(pos);
  }

  while (unvisited.length > 0) {
    const currentPos = findClosestPosition(unvisited, graph);
    if (currentPos === end) {
      return graph;
    }
    unvisited = unvisited.filter((pos) => pos !== currentPos);

    const currentNode = graph.get(currentPos);
    if (currentNode === undefined)
      throw new Error(`Invalid position: ${currentPos}.`);

    const neighbors = getNeighbors(currentPos, height, width, graph, unvisited);
    for (const neighbor of neighbors) {
      const neighborDistance = map.get(neighbor);
      if (neighborDistance === undefined)
        throw new Error(`Invalid position: ${neighbor}.`);

      const neighborNode = graph.get(neighbor);
      if (neighborNode === undefined)
        throw new Error(`Invalid position: ${neighbor}.`);

      const currentDist = currentNode.distance + neighborDistance;

      if (currentDist < neighborNode.distance) {
        neighborNode.distance = currentDist;
        neighborNode.parent = currentNode;
      }
    }
  }

  return graph;
}

function getPath(end: string, graph: Map<string, GraphNode>) {
  const path: string[] = [];
  let current = graph.get(end);
  if (current !== undefined && current.parent) {
    while (current) {
      path.push(current.position);
      const parent = current.parent;
      if (!parent) break;
      current = graph.get(parent.position);
    }
  }
  return path;
}

async function main() {
  const data = await getData("test.txt");
  const { height, width, map } = initMap(data);
  const start = "0,0";
  const end = `${data.length - 1},${data[0].length - 1}`;
  const graph = constrainedDijkstra(map, start, end, height, width);

  const path = getPath(end, graph);
  console.log(path);

  for (let r = 0; r < height; r++) {
    let rString = "";
    for (let c = 0; c < width; c++) {
      const node = graph.get(`${r},${c}`);
      if (!node) throw new Error(`Invalid position: ${r},${c}.`);
      const dist = node.distance === Infinity ? -1 : node.distance;
      rString += dist.toString().padStart(3, " ");
    }
    console.log(rString);
  }
}

main();
