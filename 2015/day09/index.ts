import path from "path";
import { open, writeFile } from "fs/promises";

let log: string[] = [];

type Node = {
  [x: string]: number;
};

type Graph = {
  [x: string]: Node;
};

async function readFile(filename: string) {
  const filepath = path.resolve(__dirname, filename);
  let file;
  try {
    const lines: string[] = [];
    file = await open(filepath);
    for await (const line of file.readLines()) {
      lines.push(line);
    }
    return lines;
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("Unable to open file");
    }
    throw error;
  } finally {
    await file?.close();
  }
}

async function saveData(filename: string, data: any) {
  try {
    const filepath = path.resolve(__dirname, filename);
    await writeFile(filepath, data);
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("Could not save data");
    }
    throw error;
  }
}

function parseLine(line: string): [string, string, number] {
  const parsingRegex = /^(\w+) to (\w+) = (\d+)$/;
  const result = line.match(parsingRegex);
  if (!result) {
    throw new Error("Invalid data");
  }
  const [_match, a, b, distance] = result;
  return [a, b, Number.parseInt(distance)];
}

function buildGraph(data: string[]) {
  const graph: Graph = {};

  for (const line of data) {
    const [a, b, distance] = parseLine(line);
    if (!graph[a]) graph[a] = {};
    if (!graph[b]) graph[b] = {};
    graph[a][b] = distance;
    graph[b][a] = distance;
  }

  return graph;
}

function enumeratePairs(graph: Graph) {
  const nodes: string[] = Object.keys(graph);
  const pairs: [string, string][] = [];
  while (nodes.length > 0) {
    const current = nodes.pop();
    if (!current) continue;
    for (const node of nodes) {
      pairs.push([current, node]);
    }
  }
  return pairs;
}

function getMinimumAndMaximumDistance(
  graph: Graph,
  nodesCount: number,
  pairs: [string, string][]
) {
  let minimum = Infinity;
  let maximum = -Infinity;

  // for each pair of nodes
  for (const pair of pairs) {
    const [start, end] = pair;
    log.push(`Looking for shortest distance between ${start} and ${end}...`);

    // find the shortest distance
    let shortest = Infinity;
    let longest = -Infinity;
    const stack: [string, number, number, string[]][] = [[start, 0, 0, []]]; // node, distance, steps, came from
    while (stack.length > 0) {
      const top = stack.pop();
      if (!top) {
        throw new Error("The stack was unexpectedly empty");
      }
      // log.push("  " + JSON.stringify({ top }));
      // log.push("  " + JSON.stringify({ stack }));
      // log.push("  " + JSON.stringify({ shortest, minimum }));
      const [current, distance, steps, cameFrom] = top;
      // check if we have reached the destination
      if (current === end) {
        // check if we have traversed all nodes
        if (steps === nodesCount - 1) {
          // update shortest
          log.push(
            `  Travel complete, distance: ${distance} shortest: ${shortest} longest: ${longest}`
          );
          if (distance < shortest) shortest = distance;
          if (distance > longest) longest = distance;
        }
        continue;
      }

      // have we reached the maximum number of steps?
      if (steps === nodesCount - 1) {
        continue;
      }

      // we can push neighbors on the stack
      for (const neighbor of Object.keys(graph[current])) {
        // except whence we came from
        if (!cameFrom.includes(neighbor)) {
          stack.push([
            neighbor,
            distance + graph[current][neighbor],
            steps + 1,
            cameFrom.concat(current),
          ]);
        }
      }
    }
    log.push(
      `Found all possible paths, shortest: ${shortest}, minimum: ${minimum}, longest: ${longest}, maximum: ${maximum}`
    );
    if (shortest < minimum) minimum = shortest;
    if (longest > maximum) maximum = longest;
  }

  return [minimum, maximum];
}

async function main() {
  // read data
  let data: string[] = [];
  try {
    data = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  // build graph
  const graph = buildGraph(data);
  // save graph to file
  try {
    await saveData("graph.json", JSON.stringify(graph));
  } catch (error) {
    console.error(error);
    return 1;
  }

  // enumerate pairs
  const nodesCount = Object.keys(graph).length;
  const pairs = enumeratePairs(graph);

  // look for the minimum and maximum:

  const [minimum, maximum] = getMinimumAndMaximumDistance(
    graph,
    nodesCount,
    pairs
  );

  console.log({ minimum });
  console.log({ maximum });

  // save log
  try {
    await saveData("log.txt", log.join("\n"));
  } catch (error) {
    console.error(error);
    return 1;
  }

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
