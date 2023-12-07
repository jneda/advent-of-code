import path from "path";
import fs from "fs/promises";

let log: string[] = [];

export function lookAndSay(s: string) {
  const parsingRegex = /([1-9])(\1)*/g;
  return s.replace(parsingRegex, (match) => match.length.toString() + match[0]);
}

async function main() {
  const input = "1113122113";
  let current = input;
  log.push(current);
  for (let i = 0; i < 40; i++) {
    current = lookAndSay(current);
    log.push(current);
  }

  console.log({ finalLength: current.length });

  try {
    await fs.writeFile(path.resolve(__dirname, "log.txt"), log.join("\n"));
  } catch (error) {
    console.error(error);
    return 1;
  }
}

if (process.env.NODE_ENV !== "test") {
  main();
}
