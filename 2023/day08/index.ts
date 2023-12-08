import path from "path";
import fs from "fs/promises";

type Node = {
  value: string;
  left: string;
  right: string;
};

type Tree = {
  [k: string]: Node;
};

async function readFile(filename: string) {
  let content: string;
  const filepath = path.resolve(__dirname, filename);
  try {
    content = await fs.readFile(filepath, "utf8");
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not read file");
  }
}

function parseNodeData(nodeData: string) {
  const parsingRegex =
    /^(?<value>[A-Z]{3}) = \((?<left>[A-Z]{3}), (?<right>[A-Z]{3})\)$/;

  const match = nodeData.match(parsingRegex);
  if (!match || !match.groups) throw new Error("Invalid data");

  const { value, left, right } = match.groups;
  return [value, left, right];
}

function parse(fileContent: string) {
  const data = fileContent.split("\n");

  const instructions = data.shift()?.split("");
  if (!instructions) {
    throw new Error("Invalid data");
  }

  data.shift();
  const nodesData = [...data];

  const nodes = nodesData.map((nodeData) => parseNodeData(nodeData));

  return { instructions, nodes };
}

function buildTree(nodes: string[][]) {
  const tree: Tree = {};
  for (const node of nodes) {
    const [value, left, right] = node;
    tree[value] = { value, left, right };
  }
  return tree;
}

function followInstructions(instructions: string[], tree: Tree) {
  const start = "AAA";
  const goal = "ZZZ";

  let steps = 0;
  let current = tree[start];

  while (current.value !== goal) {
    const instruction = instructions[steps % instructions.length];
    switch (instruction) {
      case "L": {
        current = tree[current.left];
        break;
      }
      case "R": {
        current = tree[current.right];
      }
    }
    steps++;
  }

  return steps;
}

async function main() {
  let fileContent: string;

  try {
    fileContent = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const { instructions, nodes } = parse(fileContent);
  const tree = buildTree(nodes);

  console.log(instructions);
  console.log(tree);

  const stepsTaken = followInstructions(instructions, tree);
  console.log({ stepsTaken });
}

if (process.env.NODE_ENV !== "test") {
  main();
}
