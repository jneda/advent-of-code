import path from "path";
import { writeFile, readFile as fsReadFile } from "fs/promises";
import { readFile } from "../../lib/files";

export type Almanac = {
  seeds: number[];
  maps: {
    seedToSoilMap: AlmanacMap;
    soilToFertilizerMap: AlmanacMap;
    fertilizerToWaterMap: AlmanacMap;
    waterToLightMap: AlmanacMap;
    lightToTemperatureMap: AlmanacMap;
    temperatureToHumidityMap: AlmanacMap;
    humidityToLocationMap: AlmanacMap;
  };
};

export type AlmanacMaps = {
  [key: string]: { [key: string]: number };
};

export type AlmanacMap = number[][];

const mapEntries = [
  "seedToSoilMap",
  "soilToFertilizerMap",
  "fertilizerToWaterMap",
  "waterToLightMap",
  "lightToTemperatureMap",
  "temperatureToHumidityMap",
  "humidityToLocationMap",
];

export function parseData(rawData: string[]) {
  let parsedData: Almanac = {
    seeds: [],
    maps: {
      seedToSoilMap: [],
      soilToFertilizerMap: [],
      fertilizerToWaterMap: [],
      waterToLightMap: [],
      lightToTemperatureMap: [],
      temperatureToHumidityMap: [],
      humidityToLocationMap: [],
    },
  };

  // parse seeds
  const seedsData = rawData.shift();
  if (!seedsData) {
    throw new Error("Invalid data");
  }
  parsedData.seeds = parseNumbers(seedsData);

  // shift the folowing empty line
  rawData.shift();

  for (const mapEntry of mapEntries) {
    // shift the first text only line
    rawData.shift();
    let entryData: string[] = [];
    let currentLine: string;
    do {
      currentLine = rawData.shift()!;
      if (currentLine && currentLine.length > 0) {
        entryData.push(currentLine);
      }
    } while (rawData.length > 0 && currentLine.length > 0);

    const mapData = entryData.map((dataLine) => parseNumbers(dataLine));

    if (mapEntry in parsedData.maps) {
      parsedData.maps[mapEntry as keyof typeof parsedData.maps] = mapData;
    }
  }

  return parsedData;
}

export function parseNumbers(rawData: string) {
  const numberRegex = /\d+/g;
  const matches = rawData.match(numberRegex);
  if (!matches) {
    throw new Error("Invalid data");
  }
  return matches.map((n) => Number.parseInt(n));
}

export function buildMap(mapData: number[][]) {
  const map: { [key: string]: number } = {};
  for (const row of mapData) {
    const [destination, source, range] = row;
    for (let i = 0; i < range; i++) {
      map[source + i] = destination + i;
    }
  }

  return map;
}

/* 
function almanacToJson(almanac: Almanac) {
  const mapsToObjects: MapsLikeObject = {};
  for (const [prop, map] of Object.entries(almanac.maps)) {
    mapsToObjects[prop] = Object.fromEntries(map);
  }
  return {
    seeds: almanac.seeds,
    maps: mapsToObjects,
  };
}

function jsonToAlmanac(json: string) {
  const jsonAlmanac = JSON.parse(json);
  const objectsToMaps: { [key: string]: Map<number, number> } = {};
  for (const [prop, object] of Object.entries(
    jsonAlmanac.maps as MapsLikeObject
  )) {
    objectsToMaps[prop] = new Map(
      Object.entries(object).map(([key, value]) => [
        Number.parseInt(key),
        value,
      ])
    );
  }
  return {
    seeds: jsonAlmanac.seeds,
    maps: objectsToMaps,
  };
}
 */

async function main() {
  const filename = "input.test.txt";
  let rawData: string[] = [];
  try {
    rawData = (await readFile(path.resolve(__dirname, filename))) || [];
  } catch (error) {
    console.error(error);
  }
  if (rawData.length === 0) {
    console.error("Raw data is empty.");
    return;
  }

  const almanac = parseData(rawData);

  await writeFile(
    path.resolve(__dirname, "almanac.json"),
    JSON.stringify(almanac)
  );
  console.log("almanac written to file");

  /* 
  const json = await fsReadFile(
    path.resolve(__dirname, "almanac.json"),
    "utf8"
  );
   */

  let minimum = Infinity;

  const { seeds: seedRanges, maps } = almanac;

  if (seedRanges.length % 2 !== 0) {
    console.error("There is an odd number of elements in seedRanges");
    return;
  }

  const seeds: number[] = [];

  for (let i = 0; i < seedRanges.length; i += 2) {
    const [start, range] = seedRanges.slice(i, i + 2);
    for (let j = start; j < start + range; j++) {
      console.log(`\nseed: ${j}`);
      minimum = processSeed(j, maps, minimum);
    }
  }

  console.log(`\nThe minimum value is ${minimum}`);
}

if (process.env.NODE_ENV !== "test") {
  main();
}

function processSeed(seed: number, maps: Almanac["maps"], minimum: number) {
  let currentValue = seed;
  const history = [currentValue];
  for (const mapEntry of mapEntries) {
    // console.log(mapEntry);
    const map = maps[mapEntry as keyof typeof maps];
    let newValue = currentValue;
    for (const rangeData of map) {
      const [destination, source, range] = rangeData;
      const isInRange = (v: number) => source <= v && v < source + range;
      if (isInRange(currentValue)) {
        newValue = destination + currentValue - source;
      }
    }
    // console.log(`mapping currentValue ${currentValue} to new value ${newValue}`);
    currentValue = newValue;
    history.push(currentValue);
  }
  console.log(`${history.join(" -> ")}`);
  if (currentValue < minimum) {
    console.log(`\nNew minimum value found: ${currentValue} < ${minimum}`);
    minimum = currentValue;
  }

  return minimum;
}
