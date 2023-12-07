import path from "path";
import { readFile, writeFile } from "fs/promises";

type POJO = {
  [k: string]: any;
};

async function readData(filename: string) {
  const filepath = path.resolve(__dirname, filename);
  let fileContent: string;
  try {
    fileContent = await readFile(filepath, { encoding: "utf8" });
  } catch (error) {
    console.error(error);
    throw new Error("Could not read data");
  }
  return fileContent.split("\n");
}

async function saveData(filename: string, data: any) {
  const filepath = path.resolve(__dirname, filename);
  try {
    await writeFile(filepath, JSON.stringify(data));
  } catch (error) {
    console.error(error);
    throw new Error("Could not save data");
  }
}

function cleanCapturedGroups(groups: { [x: string]: string }) {
  const cleanedObject: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(groups)) {
    if (value === undefined) {
      continue;
    }
    if (key === "first" || key === "last") {
      if (!cleanedObject.source) cleanedObject.source = [];
      cleanedObject.source.push(value);
    } else {
      cleanedObject[key] = value;
    }
  }
  return cleanedObject;
}

function parseData(data: string[]) {
  const instructionRegex =
    /^(?:(?<first>\d+|[a-z]+) *)?(?<gate>[A-Z]+(?: \d+)?)?(?: (?<last>[a-z]*))? -> (?<destination>[a-z]+)$/;

  return data.map((instruction) => {
    const result = instruction.match(instructionRegex);
    if (!result) throw new Error(`Invalid data: "${instruction}"`);

    // clean up data from captured groups
    const groups = { ...result.groups };
    return cleanCapturedGroups(groups);
  });
}

function connectGate(
  graph: POJO,
  source: string[],
  gate: string,
  destination: string
) {
  let gateId: string = "";
  switch (gate) {
    case "AND":
    case "OR": {
      gateId = `${source[0]} ${gate} ${source[1]}`;
      break;
    }
    // handle NOT, LSHIFT x, and RSHIFT x
    default: {
      gateId = `${source[0]} ${gate} ${destination}`;
    }
  }
  for (const node of source) {
    if (!graph[node]) graph[node] = [];
    graph[node].push(gateId);
  }
  if (!graph[gateId]) graph[gateId] = [];
  graph[gateId].push(destination);
}

function connectGateReverse(
  graph: POJO,
  source: string[],
  gate: string,
  destination: string
) {
  let gateId: string = "";
  switch (gate) {
    case "AND":
    case "OR": {
      gateId = `${source[0]} ${gate} ${source[1]}`;
      break;
    }
    // handle NOT, LSHIFT x, and RSHIFT x
    default: {
      gateId = `${source[0]} ${gate} ${destination}`;
    }
  }
  for (const node of source) {
    if (!graph[gateId]) graph[gateId] = [];
    graph[gateId].push(node);
  }
  if (!graph[destination]) graph[destination] = [];
  graph[destination].push(gateId);
}

function buildGraph(instructions: POJO[]) {
  const graph: POJO = {};

  for (const instruction of instructions) {
    const { source, gate, destination } = instruction;
    if (gate) {
      // console.log("A gate needs to be connected...");
      connectGate(graph, source, gate, destination);
    } else {
      for (const node of source) {
        if (!graph[node]) graph[node] = [];
        graph[node].push(destination);
      }
    }
  }

  return graph;
}

function buildGraphReversed(instructions: POJO[]) {
  const graph: POJO = {};

  for (const instruction of instructions) {
    const { source, gate, destination } = instruction;
    if (gate) {
      // console.log("A gate needs to be connected...");
      connectGateReverse(graph, source, gate, destination);
    } else {
      for (const node of source) {
        if (!graph[destination]) graph[destination] = [];
        graph[destination].push(node);
      }
    }
  }

  return graph;
}

async function main() {
  // read file
  const filename = "input.txt";
  let data: string[];
  try {
    data = await readData(filename);
  } catch (error) {
    console.error(error);
    return 1;
  }

  // parse data
  const instructions = parseData(data);
  // save to file
  try {
    await saveData("instructions.json", instructions);
  } catch (error) {
    console.error(error);
    return 1;
  }

  // build graph
  const graph = buildGraph(instructions);
  // save to file
  try {
    await saveData("graph.json", graph);
  } catch (error) {
    console.error(error);
    return 1;
  }

  // build graph reversed
  const reversedGraph = buildGraphReversed(instructions);
  // save to file
  try {
    await saveData("reversedGraph.json", reversedGraph);
  } catch (error) {
    console.error(error);
    return 1;
  }

  // from a starting node, recursively traverse the graph
  // (which is probably rather a tree...)
  // to find its value

  // for science
  const log: string[] = [];

  let padSize = 0;
  let maxPadSize = 0;
  function updateMaxPadSize(padSize: number, maxPadSize: number) {
    return Math.max(padSize, maxPadSize);
  }
  function multilog(message: string) {
    message = message.padStart(message.length + padSize, " ");
    console.log(message);
    log.push(message);
  }

  let cache: POJO; // cache FTW

  function explore(graph: POJO, start: string, cache: POJO): number {
    multilog(`exploring from ${start}`);
    if (cache[start]) {
      multilog(`retrieved value from cache: ${cache[start]}`);
      return cache[start];
    }

    if (start.includes("NOT")) {
      const value = explore(graph, graph[start][0], cache);
      const result = ~value + 65536;
      cache[start] = result;
      multilog(`computed and cached NOT ${value} -> ${result}`);
      return result;
    }
    if (start.includes("RSHIFT")) {
      const value = explore(graph, graph[start][0], cache);
      const complement = Number.parseInt(start.replace(/ ?\D ?/g, ""));
      const result = value >> complement;
      cache[start] = result;
      multilog(
        `computed and cached ${value} RSHIFT ${complement} -> ${result}`
      );
      return value >> complement;
    }
    if (start.includes("LSHIFT")) {
      const value = explore(graph, graph[start][0], cache);
      const complement = Number.parseInt(start.replace(/ ?\D ?/g, ""));
      const result = value << complement;
      cache[start] = result;
      multilog(
        `computed and cached ${value} LSHIFT ${complement} -> ${result}`
      );
      return result;
    }
    if (start.includes("AND")) {
      multilog("AND gate, branching out");
      padSize += 2;
      maxPadSize = updateMaxPadSize(padSize, maxPadSize);
      const a = explore(graph, graph[start][0], cache);
      padSize -= 2;
      multilog(
        `AND gate, first value found (${a}), exploring second branch...`
      );
      padSize += 2;
      maxPadSize = updateMaxPadSize(padSize, maxPadSize);
      const b = explore(graph, graph[start][1], cache);
      const result = a & b;
      cache[start] = result;
      padSize -= 2;
      multilog(`computed and cached ${a} AND ${b} -> ${result}`);
      return result;
    }
    if (start.includes("OR")) {
      multilog("OR gate, branching out");
      padSize += 2;
      maxPadSize = updateMaxPadSize(padSize, maxPadSize);
      const a = explore(graph, graph[start][0], cache);
      padSize -= 2;
      multilog(`OR gate, first value found (${a}), exploring second branch...`);
      padSize += 2;
      maxPadSize = updateMaxPadSize(padSize, maxPadSize);
      const b = explore(graph, graph[start][1], cache);
      const result = a | b;
      cache[start] = result;
      padSize -= 2;
      multilog(`computed and cached ${a} OR ${b} -> ${result}`);
      return a | b;
    }

    const toInt = Number.parseInt(start);
    if (!isNaN(toInt)) {
      cache[start] = toInt;
      multilog(`found and cached signal ${toInt}`);
      return toInt;
    }

    multilog("unpowered wire, digging down...");
    return explore(graph, graph[start][0], cache);
  }

  let result;

  cache = {};
  result = explore(reversedGraph, "a", cache);
  console.log({ result });

  // cache = {};
  // result = explore(reversedGraph, "d", cache);
  // console.log({ result });
  // cache = {};
  // result = explore(reversedGraph, "e", cache);
  // console.log({ result });
  // cache = {};
  // result = explore(reversedGraph, "f", cache);
  // console.log({ result });
  // cache = {};
  // result = explore(reversedGraph, "g", cache);
  // console.log({ result });
  // cache = {};
  // result = explore(reversedGraph, "h", cache);
  // console.log({ result });
  // cache = {};
  // result = explore(reversedGraph, "i", cache);
  // console.log({ result });

  console.log({ maxPadSize });

  // write log
  try {
    const filepath = path.resolve(__dirname, "log.txt");
    try {
      await writeFile(filepath, log.join("\n"));
    } catch (error) {
      console.error(error);
      throw new Error("Could not write log to file");
    }
  } catch (error) {
    console.error(error);
    return 1;
  }

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
