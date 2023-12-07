import path from "path";
import { writeFile } from "fs/promises";
import { readFile } from "../../lib/files";

type NumberData = { number: number; coordinates: string[] };

let debugBuffer: string[] = [];
const debugFilepath = path.resolve(__dirname, "./debug.txt");

const gearsMap = new Map();

export function parseLine(line: string, lineIndex: number) {
  const numbersRegex = /(\d+)/g;
  let numberStrings: string[] | null = line.match(numbersRegex);
  if (!numberStrings) {
    numberStrings = [];
  }

  let debugLine = `line ${lineIndex}:\n${line}\n${JSON.stringify(
    numberStrings
  )}\n`;

  const numbersData = [];
  let cursor = 0;
  for (const numberString of numberStrings) {
    const numberData: NumberData = {
      number: Number.parseInt(numberString),
      coordinates: [],
    };
    const leftmostIndex = line.indexOf(numberString, cursor);
    cursor = leftmostIndex + numberString.length;
    for (let x = leftmostIndex; x < leftmostIndex + numberString.length; x++) {
      numberData.coordinates.push(`${x},${lineIndex}`);
    }
    numbersData.push(numberData);
  }

  debugLine += `${JSON.stringify(numbersData)}\n`;

  const symbolsRegex = /([^\d\.])/g;
  let symbols: string[] | null = line.match(symbolsRegex);
  if (!symbols) {
    symbols = [];
  }

  const symbolsCoordinates: string[] = [];

  cursor = 0;
  for (const symbol of symbols) {
    const symbolIndex = line.indexOf(symbol, cursor);
    cursor = symbolIndex + 1;
    const symbolCoordinates = `${symbolIndex},${lineIndex}`;
    symbolsCoordinates.push(symbolCoordinates);

    if (symbol === "*") {
      // console.log("Found gear at", symbolCoordinates);
      gearsMap.set(symbolCoordinates, []);
    }
  }

  debugLine += `${JSON.stringify(symbolsCoordinates)}\n${JSON.stringify(
    Array.from(gearsMap)
  )}\n`;
  debugBuffer.push(debugLine);

  return { numbersData, symbolsCoordinates, gearsMap };
}

export function checkNeighbours(
  coordinates: string,
  lineLength: number,
  symbolsCoordinates: string[],
  number: number
) {
  const directions = [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  const coordinatesToPoint = (coordinates: string) => {
    const [x, y] = coordinates.split(",").map((n) => Number.parseInt(n));
    return { x, y };
  };

  const point = coordinatesToPoint(coordinates);

  const isInBounds = (point: { x: number; y: number }) => {
    return (
      point.x >= 0 &&
      point.x < lineLength &&
      point.y >= 0 &&
      point.y < lineLength
    );
  };

  for (const direction of directions) {
    const neighbour = { x: point.x + direction.x, y: point.y + direction.y };
    if (isInBounds(neighbour)) {
      const neighbourCoordinates = `${neighbour.x},${neighbour.y}`;
      if (symbolsCoordinates.includes(neighbourCoordinates)) {
        if (gearsMap.has(neighbourCoordinates)) {
          const neighbouringNumbers = gearsMap.get(neighbourCoordinates);
          // console.log(
          //   `Numbers ${neighbouringNumbers} are neighbours of gear at ${neighbourCoordinates}}`
          // );
          gearsMap.set(neighbourCoordinates, [...neighbouringNumbers, number]);
        }

        return true;
      }
    }
  }
  return false;
}

export function isNumberValid(
  numberData: NumberData,
  lineLength: number,
  symbolsCoordinates: string[]
) {
  let isNumberValid = false;
  for (const coordinate of numberData.coordinates) {
    const hasNeighbouringSymbol = checkNeighbours(
      coordinate,
      lineLength,
      symbolsCoordinates,
      numberData.number
    );
    if (hasNeighbouringSymbol) {
      isNumberValid = true;
    }
  }
  return isNumberValid;
}

async function main() {
  const filepath = path.join(__dirname, "input.txt");
  // const filepath = path.join(__dirname, "input.test.txt");
  // const filepath = path.join(__dirname, "input.test.02.txt");

  console.log("Reading file...");

  const lines = await readFile(filepath);
  if (!lines) {
    console.error("Couldn't open file", filepath);
    return;
  }
  const lineLength = lines[0].length;
  // console.log("Line length:", lineLength);
  // console.log("Number of lines:", lines.length);

  // figure out how many different characters there are, and what they are
  const characters = lines.map((line) => line.split("")).flat();
  // const uniqueCharacters = [...new Set(characters)];
  // console.log("Unique characters...:", uniqueCharacters);
  // const uniqueSymbols = uniqueCharacters.filter((char) => {
  //   return char !== "." && Number.isNaN(Number.parseInt(char));
  // });
  // console.log("Unique symbols...:", uniqueSymbols.join(""));
  const gearsCount = characters.filter((char) => char === "*").length;
  console.log("Gears count:", gearsCount);

  console.log("Parsing lines...");
  debugBuffer = [];

  const numbersData: NumberData[] = [];
  let symbolsCoordinates: string[] = [];

  lines.forEach((line, lineIndex) => {
    const {
      numbersData: lineNumbersData,
      symbolsCoordinates: lineSymbolsCoordinates,
    } = parseLine(line, lineIndex);
    numbersData.push(...lineNumbersData);
    symbolsCoordinates.push(...lineSymbolsCoordinates);
  });

  symbolsCoordinates = [...new Set(symbolsCoordinates)];

  await writeFile(debugFilepath, debugBuffer.join("\n"));

  console.log("Checking for valid numbers...");
  console.log("Also looking for gears...");

  const validNumbers: NumberData[] = [];
  const invalidNumbers: NumberData[] = [];

  numbersData.forEach((numberData, index) => {
    // console.log(`Checking number ${index + 1} of ${numbersData.length}...`);
    let numberIsValid = isNumberValid(
      numberData,
      lineLength,
      symbolsCoordinates
    );

    if (numberIsValid) {
      validNumbers.push(numberData);
    } else {
      invalidNumbers.push(numberData);
    }
  });

  // console.log("Gears map:", gearsMap);

  // console.log("Number of valid numbers:", validNumbers.length);
  // console.log("Number of invalid numbers:", invalidNumbers.length);
  // console.log(
  //   "Sum of valid and invalid numbers:",
  //   validNumbers.length + invalidNumbers.length
  // );
  // console.log("Expected number of numbers:", numbersData.length);

  console.log("Summing valid numbers...");

  const validNumbersSum = validNumbers
    .map((n) => n.number)
    .reduce((a, b) => a + b);

  console.log("Sum of valid numbers:", validNumbersSum);

  console.log("Computing sum of gear ratios...");

  const actualGearsMap = new Map();

  const actualGearsNeighbours: [number, number][] = [];
  for (const [_gearCoordinates, neighbouringNumbers] of gearsMap) {
    const uniqueNumbers = [...new Set(neighbouringNumbers)] as number[];
    if (uniqueNumbers.length === 2) {
      actualGearsNeighbours.push(uniqueNumbers as [number, number]);
      actualGearsMap.set(_gearCoordinates, uniqueNumbers);
    }
  }
  const getGearRatio = (a: number, b: number) => a * b;
  const gearRatioSum = actualGearsNeighbours
    .map((neighbours: [number, number]) => getGearRatio(...neighbours))
    .reduce((a, b) => a + b);
  console.log("Sum of gear ratios:", gearRatioSum);

  const mapToPOJO = (map: Map<any, any>) => {
    const pojo: any = {};
    for (const [key, value] of map) {
      pojo[key] = value;
    }
    return pojo;
  };

  const outputFilepath = path.resolve(__dirname, "output.json");
  console.log("Outputting to", outputFilepath);
  await writeFile(
    outputFilepath,
    JSON.stringify(
      {
        numbersData,
        symbolsCoordinates,
        validNumbers,
        invalidNumbers,
        gearsMap: mapToPOJO(gearsMap),
        actualGearsMap: mapToPOJO(actualGearsMap),
      },
      null,
      2
    )
  );

  console.log("Output written to", outputFilepath);
}

main();
