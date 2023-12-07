import path from "path";
import { writeFile } from "fs/promises";

export const inputs: [string, string][] = [
  ["Time:      7  15   30", "Distance:  9  40  200"],
  [
    "Time:        51     69     98     78",
    "Distance:   377   1171   1224   1505",
  ],
];

let log: string[] = [];

const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

export function parseInput(input: [string, string]) {
  const numberRegex = /\d+/g;
  const results: number[][] = [];
  for (const elt of input) {
    const matches = elt.match(numberRegex);
    if (!matches) {
      throw new Error("Invalid data");
    }
    results.push(matches.map((match) => Number.parseInt(match)));
  }
  return results as [number[], number[]];
}

export function countPossibleWins(duration: number, record: number) {
  // let's attack this problem on both ends
  let min = 0;
  let max = duration;
  let recordBeaten = false;
  // find the minimum
  log.push("Searching the minimum...");
  while (!recordBeaten) {
    const speed = min;
    const distance = speed * (duration - min);
    log.push(JSON.stringify({ min, distance, record }));
    if (distance > record) {
      recordBeaten = true;
    } else {
      min++;
    }
  }
  log.push(`Minimum found: ${min}`);
  // find the maximum
  recordBeaten = false;
  log.push("Searching the maximum...");
  while (!recordBeaten) {
    const speed = max;
    const distance = speed * (duration - max);
    log.push(JSON.stringify({ max, distance, record }));
    if (distance > record) {
      recordBeaten = true;
    } else {
      max--;
    }
  }
  log.push(`Maximum found: ${max}`);
  const possibleWinsCount = max - min + 1;
  log.push(`Possible wins count: ${max} - ${min} + 1 -> ${max - min + 1}`);

  return possibleWinsCount;
}

export function countPossibleWins_v2(duration: number, record: number) {
  // let's try dichotomic search
  // we'll search first for the leftmost bound

  const getMiddle = (left: number, right: number) =>
    Math.floor((left + right) / 2);

  const getDistance = (v: number, duration: number, record: number) =>
    v * (duration - v);

  const isWinning = (distance: number) => distance > record;

  log.push(`Searching the minimum...`);

  let left = 0;
  let right = duration + 1;

  while (left < right) {
    const middle = getMiddle(left, right);
    log.push(`${left} - ${middle} - ${right}`);
    const distance = getDistance(middle, duration, record);
    if (isWinning(distance)) {
      log.push(
        `distance ${formatNumber(distance)} > ${formatNumber(
          record
        )}, right -> ${middle}`
      );
      right = middle;
    } else {
      log.push(
        `distance ${formatNumber(distance)} <= ${formatNumber(
          record
        )}, left -> ${middle + 1}`
      );
      left = middle + 1;
    }
  }

  const minimum = left;
  log.push(`Found minimum: ${minimum}`);

  // now for the rightmost bound

  log.push(`Searching the minimum...`);

  left = 0;
  right = duration + 1;

  while (left < right) {
    const middle = getMiddle(left, right);
    log.push(`${left} - ${middle} - ${right}`);
    const distance = getDistance(middle, duration, record);
    if (isWinning(distance)) {
      log.push(
        `distance ${formatNumber(distance)} > ${formatNumber(
          record
        )}, left -> ${middle + 1}`
      );
      left = middle + 1;
    } else {
      log.push(
        `distance ${formatNumber(distance)} <= ${formatNumber(
          record
        )}, right -> ${middle}`
      );
      right = middle;
    }
  }

  const maximum = right - 1;
  log.push(`Found maximum: ${maximum}`);

  return maximum - minimum + 1;
}

async function main() {
  log = [];
  const [durations, records] = parseInput(inputs[1]);

  // Part 1

  /*
  const possibleWinsCounts: number[] = [];
  durations.forEach((duration, i) => {
    const possibleWinsCount = countPossibleWins(duration, records[i]);
    possibleWinsCounts.push(possibleWinsCount);
  });
  log.push(JSON.stringify({ possibleWinsCounts }));

  console.log({ result: possibleWinsCounts.reduce((a, b) => a * b) });
   */

  // Part 2
  const reducer = (arr: number[]) =>
    Number.parseInt(arr.map((n) => n.toString()).reduce((a, b) => a + b, ""));
  const newDuration = reducer(durations);
  const newRecord = reducer(records);
  log.push(JSON.stringify({ durations, newDuration }));
  log.push(JSON.stringify({ records, newRecord }));

  const possibleWinsCount = countPossibleWins_v2(newDuration, newRecord);
  log.push(JSON.stringify({ possibleWinsCount }));

  console.log({ possibleWinsCount });

  // save log
  const filepath = path.resolve(__dirname, "log.txt");
  try {
    await writeFile(filepath, log.join("\n"));
  } catch (error) {
    console.error(error);
    return 1;
  }

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
