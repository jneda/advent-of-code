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

async function saveData(filename: string, data: string) {
  try {
    const filepath = path.resolve(__dirname, filename);
    await fs.writeFile(filepath, data);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw "Could not save data.";
  }
}

/**
 * Returns an array of difference sequences generated from the given history array.
 * Each difference sequence is obtained by subtracting each element from its previous element.
 * The function continues generating difference sequences until a sequence of all zeros is obtained.
 *
 * @param history - The array of numbers representing the history.
 * @returns An array of difference sequences.
 *
 * @example
 * const history = [1, 4, 7, 10];
 * const sequences = getDiffSequences(history);
 * console.log(sequences);
 * // Output: [[1, 4, 7, 10], [3, 3, 3], [0, 0, 0]]
 */
function getDiffSequences(history: number[]) {
  const diffSequences: number[][] = [history];
  let current = [...history];
  const isDone = (sequence: number[]) => sequence.every((elt) => elt === 0);

  while (!isDone(current)) {
    const next: number[] = [];
    for (let i = 1; i < current.length; i++) {
      const diff = current[i] - current[i - 1];
      next.push(diff);
    }
    diffSequences.push(next);
    current = [...next];
  }

  return diffSequences;
}

/**
 * Returns the sum of the last values in each sequence of a 2D number array.
 * @param diffSeq - The 2D number array containing sequences.
 * @returns The sum of the last values in each sequence.
 * @example
 * const diffSeq = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
 * const result = extrapolate(diffSeq);
 * console.log(result); // Output: 18
 */
function extrapolate(diffSeq: number[][]) {
  const lastValues = diffSeq.map((seq) => seq[seq.length - 1]);
  return lastValues.reduce((a, b) => a + b);
}

async function main() {
  let data: string[];
  try {
    data = await readFile("test.txt");
  } catch (error) {
    console.log(error);
    return 1;
  }

  const histories = data.map((line) =>
    line.split(" ").map((x) => Number.parseInt(x))
  );
  const diffSequences = histories.map((history) => getDiffSequences(history));

  const extrapolatedSum = diffSequences
    .map((diffSeq) => extrapolate(diffSeq))
    .reduce((a, b) => a + b);

  console.log(extrapolatedSum);
}

if (process.env.NODE_ENV !== "test") main();
