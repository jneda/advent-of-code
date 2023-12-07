import path from "path";
import fs from "fs/promises";

async function readFile(filename: string) {
  let file;
  try {
    file = await fs.open(path.resolve(__dirname, filename));
    let lines: string[] = [];
    for await (const line of file.readLines()) {
      lines.push(line);
    }
    return lines.join("\n");
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("Unable to read file");
    }
    throw error;
  } finally {
    if (file) await file.close();
  }
}

type Graph = { [x: string]: string[] };
type Relations = { [k: string]: { [k: string]: number } };

function parseData(data: string) {
  const relations: [string, string, number][] = [];

  const parsingRegex =
    /^(?<left>\w+) would (?<type>gain|lose) (?<value>\d+) happiness units by sitting next to (?<right>\w+).$/;

  for (const line of data.split("\n")) {
    const match = line.match(parsingRegex);
    if (!match || !match.groups) throw new Error("Invalid data");

    const { left, type, value, right } = match.groups;
    const actualValue =
      type === "gain" ? Number.parseInt(value) : Number.parseInt(value) * -1;

    relations.push([left, right, actualValue]);
  }

  return relations;
}

function buildRelationsTable(data: [string, string, number][]) {
  const relations: Relations = {};
  for (const item of data) {
    const [left, right, value] = item;
    if (!relations[left]) relations[left] = {};
    relations[left][right] = value;
  }
  return relations;
}

function buildGraph(nodes: string[]) {
  const graph: Graph = {};
  for (const node of nodes) {
    graph[node] = nodes.filter((n) => n !== node);
  }
  return graph;
}

function makeSearchObject(
  currentNode: string,
  steps: number,
  cameFrom: Set<string>,
  parent: string | null
) {
  return {
    currentNode,
    steps,
    cameFrom,
    parent,
  };
}

function findPaths(graph: Graph) {
  const start = Object.keys(graph)[0];
  const maxSteps = Object.entries(graph).length - 1;
  const paths = [];
  const cameFrom = new Set<string>();

  const stack = [makeSearchObject(start, 0, cameFrom, null)];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) throw new Error("Array is unexpectedly empty");
    const { currentNode, steps, cameFrom, parent } = current;

    if (cameFrom.has(currentNode)) continue;
    cameFrom.add(currentNode);

    if (steps === maxSteps) {
      paths.push(Array.from(cameFrom));
      continue;
    }

    for (const neighbor of graph[currentNode]) {
      if (neighbor !== parent)
        stack.push(
          makeSearchObject(neighbor, steps + 1, new Set(cameFrom), currentNode)
        );
    }
  }

  return paths;
}

function scorePair(left: string, right: string, relations: Relations) {
  return relations[left][right] + relations[right][left];
}

function scorePath(path: string[], relations: Relations) {
  let score = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const left = path[i];
    const right = path[i + 1];
    score += scorePair(left, right, relations);
  }

  // close the circle
  const left = path[path.length - 1];
  const right = path[0];
  score += scorePair(left, right, relations);

  return score;
}

function addMe(relations: Relations) {
  const people = Object.keys(relations);
  relations["me"] = {};
  for (const person of people) {
    relations[person]["me"] = 0;
    relations["me"][person] = 0;
  }

  return relations;
}

function getBestScore(relations: Relations) {
  const nodes = Object.keys(relations);
  const graph = buildGraph(nodes);
  const paths = findPaths(graph);

  const pathsScores = paths.map((path) => scorePath(path, relations));
  return Math.max(...pathsScores);
}

async function main() {
  const filename = "input.txt";
  let data: string;

  try {
    data = await readFile(filename);
  } catch (error) {
    console.error(error);
    return 1;
  }

  const relations = buildRelationsTable(parseData(data));

  const bestScore = getBestScore(relations);
  console.log({ bestScore });

  const relationsWithMe = addMe(relations);

  const bestScoreWithMe = getBestScore(relationsWithMe);
  console.log({ bestScoreWithMe });
}

if (process.env.NODE_ENV !== "test") {
  main();
}
