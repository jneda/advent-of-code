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

const raceHistory: Map<number, string[]>[] = [];

function race(reindeers: Reindeer[], duration: number) {
  const scores: { [k: string]: number } = {};
  for (const reindeer of reindeers) scores[reindeer.name] = 0;

  for (let i = 1; i <= duration; i++) {
    let max = -Infinity;
    const distances = new Map<number, string[]>();

    reindeers.forEach((reindeer) => {
      const traveled = getTraveledDistance(reindeer, i);
      if (traveled > max) max = traveled;

      if (distances.get(traveled) === undefined) {
        distances.set(traveled, [] as string[]);
      }
      distances.get(traveled)!.push(reindeer.name);
    });

    raceHistory.push(distances);

    distances
      .get(max)!
      .forEach((reindeer) => (scores[reindeer] = scores[reindeer] + 1));
  }

  return scores;
}

function formatRaceHistory(
  raceHistory: Map<number, string[]>[],
  reindeers: Reindeer[]
) {
  const formatted: { [k: string]: number[] } = {};
  reindeers.forEach(({ name }) => {
    formatted[name] = [] as number[];
  });
  raceHistory.forEach((distances) => {
    for (const [distance, reindeers] of distances.entries()) {
      for (const reindeer of reindeers) {
        formatted[reindeer].push(distance);
      }
    }
  });

  return formatted;
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
  const scores = race(reindeers, duration);
  // console.log(scores);
  // console.log({ maximumScore: Math.max(...Object.values(scores)) });

  try {
    await saveData(
      "race.json",
      JSON.stringify(formatRaceHistory(raceHistory, reindeers))
    );
  } catch (error) {
    console.error(error);
    return 1;
  }
}

if (process.env.NODE_ENV !== "test") {
  main();
}
