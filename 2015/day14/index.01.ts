import path from "path";
import fs from "fs/promises";

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

type Reindeer = {
  name: string;
  speed: number;
  uptime: number;
  downtime: number;
};

function toInt(s: string) {
  return Number.parseInt(s);
}

function parse(data: string) {
  const reindeers: Reindeer[] = [];

  const parsingRegex =
    /^(?<name>\w+) can fly (?<speed>\d+) km\/s for (?<uptime>\d+) seconds, but then must rest for (?<downtime>\d+) seconds.$/;

  for (const item of data.split("\n")) {
    const match = item.match(parsingRegex);
    if (!match || !match.groups) throw new Error("Invalid data");

    const reindeer: { [k: string]: any } = {};
    for (let [k, v] of Object.entries(match.groups)) {
      if (k === "name") {
        reindeer[k] = v;
      } else {
        reindeer[k] = toInt(v);
      }
    }

    reindeers.push(reindeer as Reindeer);
  }

  return reindeers;
}

function getFlytime(reindeer: Reindeer, duration: number) {
  const { uptime, downtime } = reindeer;

  const cycle = uptime + downtime;
  const cycles = Math.floor(duration / cycle);
  let flytime = cycles * uptime;

  const remainder = duration % cycle;
  flytime += Math.min(remainder, uptime);

  return flytime;
}

function getTraveledDistance(reindeer: Reindeer, duration: number) {
  const { speed } = reindeer;
  return speed * getFlytime(reindeer, duration);
}

async function main() {
  const filename = "input.txt";
  let data: string;

  // read data
  try {
    data = await readFile(filename);
  } catch (error) {
    console.error(error);
    return 1;
  }

  const reindeers = parse(data);
  const duration = 2503;
  const traveledDistances = reindeers.map((reindeer) =>
    getTraveledDistance(reindeer, duration)
  );
  console.log({ maxTraveledDistance: Math.max(...traveledDistances) });
}

if (process.env.NODE_ENV !== "test") {
  main();
}
