import path from "path";
import fs from "fs/promises";

type POJO = {
  [k: string]: any;
};

async function readFile(filename: string) {
  let file;
  try {
    file = await fs.open(path.resolve(__dirname, filename));
    let lines: string[] = [];
    for await (const line of file.readLines()) {
      lines.push(line);
    }
    return lines.join("\n");
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("Unable to read file");
    }
    throw error;
  } finally {
    if (file) await file.close();
  }
}

async function saveData(filename: string, data: string) {
  const filepath = path.resolve(__dirname, filename);
  try {
    await fs.writeFile(filepath, data);
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error("Unable to read file");
    }
    throw error;
  }
}

function parse(data: string) {
  const numberRegex = /-?\d+/g;
  const matches = data.match(numberRegex);
  if (!matches) return null;
  return matches.map((x) => {
    const n = Number.parseInt(x);
    if (isNaN(n)) throw new Error("Invalid data");
    return n;
  });
}

async function main() {
  let data: string;

  // part 1

  /* 
  try {
    data = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const numbers = parse(data);
  if (!numbers) {
    console.error("Invalid data");
    return 1;
  }

  console.log({ total: numbers.reduce((a, b) => a + b) });
   */

  // part 2
  let json: string;
  try {
    json = await readFile("input.json");
  } catch (error) {
    console.error(error);
    return 1;
  }

  data = JSON.parse(json);

  // prune data from objects having any property whose value is "red"

  let log: string[] = [];

  function clean(o: unknown, parent: any = null) {
    log.push(
      `cleaning ${JSON.stringify(o)} whose parent is ${JSON.stringify(parent)}`
    );
    if (Array.isArray(o)) {
      const cleanArray: any[] = o
        .filter((elt) => typeof elt !== "string")
        .map((elt) => clean(elt, o))
        .filter((elt) => elt !== null);
      return cleanArray;
    }
    if (o && typeof o === "object" && !Array.isArray(o)) {
      const cleanObject: POJO = {};
      for (const [k, v] of Object.entries(o)) {
        const cleanV = clean(v, o);
        if (!cleanV) continue;
        if (cleanV === "red") {
          log.push(
            `found ${JSON.stringify(v)} in property ${k} of ${JSON.stringify(
              o
            )}...`
          );
          if (Array.isArray(parent)) {
            log.push(`filtering out of parent array ${JSON.stringify(parent)}`);
            parent = parent.filter((elt) => elt !== o);
            log.push(
              `state of the parent after deletion: ${JSON.stringify(parent)}`
            );
          } else if (parent && typeof parent === "object") {
            log.push(
              `preparing to delete ${JSON.stringify(
                o
              )} from parent object ${JSON.stringify(parent)}`
            );
            for (const [k, v] of Object.entries(parent)) {
              if (v === o) {
                delete parent[k];
                log.push(
                  `state of the parent after deletion: ${JSON.stringify(
                    parent
                  )}`
                );
              }
            }
          }
          return null;
        }
        if (typeof cleanV === "string") continue;
        cleanObject[k] = cleanV;
      }

      return Object.values(cleanObject);
    }

    return o;
  }

  let cleanedData: POJO | null = null;
  if (typeof data === "object") {
    cleanedData = clean(data) as POJO;
  }
  // save to file
  if (cleanedData) {
    try {
      await saveData("cleaned.json", JSON.stringify(cleanedData));
    } catch (error) {
      console.error(error);
      return 1;
    }
  } else {
    console.warn("Unable to process data");
    return 1;
  }

  const numbers = parse(JSON.stringify(cleanedData));
  // console.log({ amendedSum: numbers?.reduce((a, b) => a + b) });

  function flatten(data: unknown) {
    if (!Array.isArray(data)) return data;
    let flattened: any[] = [];
    for (const elt of data) {
      flattened = flattened.concat(flatten(elt));
    }
    return flattened;
  }

  const flattenedData = flatten(cleanedData) as number[];
  console.log(flattenedData.reduce((a, b) => a + b));
  // save to file
  try {
    await saveData("flattened.json", JSON.stringify(flattenedData));
  } catch (error) {
    console.error(error);
    return 1;
  }

  await saveData("log.txt", log.join("\n"));
}

if (process.env.NODE_ENV !== "test") {
  main();
}
