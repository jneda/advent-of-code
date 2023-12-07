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

export async function readFiles(filenames: string[]) {
  const filepaths = filenames.map((filename) =>
    path.resolve(__dirname, filename)
  );
  let fileContents: string[][] = [];
  for (const filepath of filepaths) {
    try {
      const fileContent = await readFile(filepath);
      if (!fileContent) {
        throw new Error(`Unable to read file ${filepath}`);
      }
      fileContents.push(fileContent);
    } catch (error) {
      console.error(error);
    }
  }
  return fileContents;
}
