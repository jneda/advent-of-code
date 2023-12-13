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

function getPatterns(data: string[]) {
  const patterns: string[][] = [];
  let current: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    if (line !== "") current.push(line);
    if (line === "" || i === data.length - 1) {
      patterns.push(current);
      current = [];
    }
  }

  return patterns;
}

function horizontalSearch(pattern: string[]) {
  for (let col = 0; col < pattern[0].length - 1; col++) {
    const leftColsCount = col + 1;
    const rightColsCount = pattern[0].length - leftColsCount;
    const colsCount = Math.min(leftColsCount, rightColsCount);

    const leftBounds = [col + 1 - colsCount, col + 1];
    const rightBounds = [col + 1, col + 1 + colsCount];

    let isMatch = true;
    for (let row = 0; row < pattern.length; row++) {
      const leftSlice = pattern[row].slice(...leftBounds);
      const rightSlice = pattern[row].slice(...rightBounds);

      const reverse = (s: string) => s.split("").reverse().join("");

      if (leftSlice !== reverse(rightSlice)) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) return leftColsCount;
  }

  return 0;
}

function verticalSearch(pattern: string[]) {
  for (let row = 0; row < pattern.length - 1; row++) {
    const topRowsCount = row + 1;
    const bottomRowsCount = pattern.length - topRowsCount;
    const rowsCount = Math.min(topRowsCount, bottomRowsCount);

    const topBounds = [row + 1 - rowsCount, row + 1];
    const bottomBounds = [row + 1, row + 1 + rowsCount];

    const topSlice = pattern.slice(...topBounds);
    const bottomSlice = pattern.slice(...bottomBounds);

    if (topSlice.join("") === bottomSlice.reverse().join("")) {
      return topRowsCount;
    }
  }

  return 0;
}

async function main() {
  let data: string[];
  try {
    data = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const patterns = getPatterns(data);

  let leftCount = 0;
  let topCount = 0;

  patterns.forEach((pattern, i) => {
    leftCount += horizontalSearch(pattern);
    topCount += verticalSearch(pattern);
  });

  console.log(topCount * 100 + leftCount);
}

if (process.env.NODE_ENV !== "test") {
  main();
}
