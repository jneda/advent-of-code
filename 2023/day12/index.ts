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

function getValidStrings(s: string, pattern: number[]): string[] {
  if (!s.includes("?")) return validateString(s, pattern) ? [s] : [];
  return [
    ...getValidStrings(s.replace(/\?/, "#"), pattern),
    ...getValidStrings(s.replace(/\?/, "."), pattern),
  ];
}

function findSpringGroups(s: string) {
  const sGroups: number[] = [];
  let inGroup = false;
  let groupSize = 0;
  for (let i = 0; i < s.length; i++) {
    switch (s[i]) {
      case "#":
        if (!inGroup) {
          inGroup = true;
          groupSize = 0;
        }
        groupSize += 1;
        if (i === s.length - 1) {
          sGroups.push(groupSize);
        }
        break;
      case ".":
        if (inGroup) {
          sGroups.push(groupSize);
          inGroup = false;
          groupSize = 0;
        }
    }
  }
  return sGroups;
}

function validateString(s: string, pattern: number[]) {
  const sGroups = findSpringGroups(s);

  // validate against pattern
  if (sGroups.length !== pattern.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (sGroups[i] !== pattern[i]) return false;
  }
  return true;
}

async function main() {
  let rawData: string[];
  try {
    rawData = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const data = rawData.map((line) => {
    const [record, groups] = line.split(" ");
    return [record, groups.split(",").map((v) => Number.parseInt(v))];
  });

  // brute force...
  const validStrings: string[][] = [];
  for (let i = 0; i < data.length; i++) {
    const record = data[i][0] as string;
    const pattern = data[i][1] as number[];
    validStrings.push(getValidStrings(record, pattern));
  }

  console.log(validStrings.map((vS) => vS.length).reduce((a, b) => a + b));

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
