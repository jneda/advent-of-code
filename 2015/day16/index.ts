import path from "path";
import fs from "fs/promises";
import type { FileHandle } from "fs/promises";

/**
 * Reads a file and returns its contents as an array of strings.
 * @param filename - The name of the file to read.
 * @returns A promise that resolves to an array of strings representing the file contents.
 * @throws An error if the file cannot be read.
 */
async function readFile(filename: string) {
  const filepath = path.resolve(__dirname, filename);
  let file: FileHandle;
  try {
    file = await fs.open(filepath);
    const contents: string[] = [];
    for await (const line of file.readLines()) {
      if (line.length > 0) {
        contents.push(line);
      }
    }
    return contents;
  } catch (error) {
    console.error(error);
    throw new Error("Could not read file.");
  }
}

/**
 * Reads the contents of a file named "sample.txt" and parses it into a key-value object.
 * Each line in the file should be in the format "key: value".
 * @returns A promise that resolves to the parsed key-value object.
 * @throws An error if the file cannot be read.
 */
async function getSample() {
  let sampleData: string[];
  try {
    sampleData = await readFile("sample.txt");
  } catch (error) {
    throw new Error("Could not read file.");
  }

  const sample: { [k: string]: number } = {};
  for (const line of sampleData) {
    const [k, v] = line.split(": ");
    sample[k] = Number.parseInt(v);
  }
  return sample;
}

/**
 * Reads the data from a file and parses it to create a dictionary of aunts.
 * Each aunt is represented by a unique ID and has a set of properties with corresponding values.
 * @returns A promise that resolves to an object containing the aunt data.
 * @throws {Error} If there is an error reading the file or if the data is invalid.
 */
async function getAunts() {
  let auntsData: string[];
  try {
    auntsData = await readFile("data.txt");
  } catch (error) {
    throw new Error("Could not read file.");
  }

  const aunts: { [k: string]: { [k: string]: number } } = {};

  //'Sue 35: akitas: 3, vizslas: 5, cars: 10'
  const auntRegex = /Sue (\d+)/;
  const propsRegex = /\w+: \d+/g;

  for (const line of auntsData) {
    const aunt = line.match(auntRegex);
    const props = line.match(propsRegex);
    if (!props || !aunt) throw new Error("Invalid data.");

    const id = aunt[1];
    aunts[id] = {};

    for (const prop of props) {
      const [k, v] = prop.split(": ");
      aunts[id][k] = Number.parseInt(v);
    }
  }

  return aunts;
}

/**
 * The main function that executes the program.
 * @returns {Promise<number>} A promise that resolves to the exit code.
 */
async function main(): Promise<number> {
  let sample: Awaited<ReturnType<typeof getSample>>;
  let aunts: Awaited<ReturnType<typeof getAunts>>;
  try {
    sample = await getSample();
    aunts = await getAunts();
  } catch (error) {
    console.error(error);
    return 1;
  }

  // part 01
  /* 
  const validAunts = Object.entries(aunts)
    .map(([aunt, clues]) => {
      for (const k of Object.keys(clues)) {
        if (clues[k] !== sample[k]) return null;
      }
      return aunt;
    })
    .filter((v) => v !== null);
  if (validAunts.length !== 1) {
    console.error("Invalid number of valid aunts found.");
    return 1;
  }
  console.log({ validAunt: validAunts[0] });
  return 0;
   */

  // part 02
  const validAunts = Object.entries(aunts)
    .map(([aunt, clues]) => {
      for (const k of Object.keys(clues)) {
        switch (k) {
          case "cats":
          case "trees":
            if (clues[k] <= sample[k]) return null;
            break;
          case "pomeranians":
          case "goldfish":
            if (clues[k] >= sample[k]) return null;
            break;
          default:
            if (clues[k] !== sample[k]) return null;
            break;
        }
      }
      return aunt;
    })
    .filter((v) => v !== null);
  if (validAunts.length !== 1) {
    console.error("Invalid number of valid aunts found.");
    return 1;
  }
  console.log({ validAunt: validAunts[0] });
  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
