import fs from "fs/promises";
import path from "path";

export async function readFile(filepath: string) {
  try {
    const file = await fs.open(filepath, "r");
    const contents: string[] = [];
    for await (const line of file.readLines()) {
      contents.push(line);
    }
    return contents;
  } catch (error) {
    return null;
  }
}

export function parseLine(line: string) {
  const firstDigitMatch = line.match(/\d/);
  const lastDigitMatch = line.match(/\d(?!.*\d)/) || firstDigitMatch;

  if (firstDigitMatch && lastDigitMatch) {
    const stringResult = firstDigitMatch[0] + lastDigitMatch[0];
    return Number.parseInt(stringResult);
  }
  return null;
}

export async function sum(filepath: string) {
  try {
    const lines = await readFile(filepath);
    if (!lines) {
      throw new Error("Could not read file");
    }

    return lines.reduce((acc, line) => {
      const value = parseLine(line);
      if (!value) {
        throw new Error("Could not parse line");
      }
      return acc + value;
    }, 0);
  } catch (error) {
    return null;
  }
}

async function main() {
  const filepath = path.join(__dirname, "input.txt");
  const result = await sum(filepath);
  // console.log({ result });
}

main();
