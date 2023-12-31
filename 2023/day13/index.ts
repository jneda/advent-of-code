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
 * Splits an array of strings into patterns based on empty lines.
 * Each pattern is represented as an array of strings.
 *
 * @param data - The array of strings to be split into patterns.
 * @returns An array of patterns, where each pattern is represented as an array of strings.
 */
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

/**
 * Searches for a horizontal pattern in a given array of strings.
 * @param pattern - The array of strings representing the pattern to search for.
 * @returns The number of columns in the pattern where there is exactly one difference between the left and right slices, or 0 if no such pattern is found.
 */
function horizontalSearch(pattern: string[]) {
  for (let col = 0; col < pattern[0].length - 1; col++) {
    const leftColsCount = col + 1;
    const rightColsCount = pattern[0].length - leftColsCount;
    const colsCount = Math.min(leftColsCount, rightColsCount);

    const leftBounds = [col + 1 - colsCount, col + 1];
    const rightBounds = [col + 1, col + 1 + colsCount];

    // https://www.reddit.com/r/adventofcode/comments/18h9n4q/comment/kd5emtf
    let differencesCount = 0;
    for (let row = 0; row < pattern.length; row++) {
      const leftSlice = pattern[row].slice(...leftBounds);
      const rightSlice = pattern[row].slice(...rightBounds);

      const reverse = (s: string) => s.split("").reverse().join("");
      const reversedRight = reverse(rightSlice);

      if (leftSlice !== reversedRight) {
        for (let i = 0; i < leftSlice.length; i++) {
          if (leftSlice[i] !== reversedRight[i]) differencesCount++;
        }
      }
    }
    if (differencesCount === 1) return leftColsCount;
  }

  return 0;
}

/**
 * Searches for a vertical pattern in an array of strings.
 * @param pattern - The array of strings representing the pattern.
 * @returns The number of rows in the pattern where the top and bottom slices differ by exactly one character, or 0 if no such rows are found.
 */
function verticalSearch(pattern: string[]) {
  for (let row = 0; row < pattern.length - 1; row++) {
    // https://www.reddit.com/r/adventofcode/comments/18h9n4q/comment/kd5emtf
    let differencesCount = 0;
    const topRowsCount = row + 1;
    const bottomRowsCount = pattern.length - topRowsCount;
    const rowsCount = Math.min(topRowsCount, bottomRowsCount);

    const topBounds = [row + 1 - rowsCount, row + 1];
    const bottomBounds = [row + 1, row + 1 + rowsCount];

    const topSlice = pattern.slice(...topBounds).join("");
    const bottomSlice = pattern
      .slice(...bottomBounds)
      .reverse()
      .join("");

    if (topSlice !== bottomSlice) {
      for (let i = 0; i < topSlice.length; i++) {
        if (topSlice[i] !== bottomSlice[i]) {
          differencesCount++;
        }
      }
      if (differencesCount === 1) return topRowsCount;
    }
  }

  return 0;
}

/**
 * Main function that reads input from a file, processes the data, and calculates a result.
 * @returns {Promise<number>} A promise that resolves to the calculated result.
 */
async function main(): Promise<number> {
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

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
