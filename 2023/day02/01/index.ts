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

/*
 * Example input line:
 * Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
 */

type Color = "blue" | "green" | "red";
function isColor(s: string): s is Color {
  return ["blue", "green", "red"].includes(s);
}

type ColorCount = Record<Color, number>;

type Game = { id: number; isValid: boolean } & ColorCount;

export const MAX_COUNTS_ALLOWED = {
  blue: 14,
  green: 13,
  red: 12,
};

const maxCounts = {
  blue: 0,
  green: 0,
  red: 0,
};

export function gameIsValid(setColorCounts: ColorCount) {
  for (const [color, count] of Object.entries(setColorCounts)) {
    if (!isColor(color)) {
      throw new Error(`Invalid color: ${color}`);
    }
    if (count > MAX_COUNTS_ALLOWED[color]) {
      return false;
    }
  }
  return true;
}

export function parseLine(line: string): Game {
  const [idPart, setsPart] = line.split(": ");
  const id = parseId(idPart);
  if (id === null) {
    throw new Error(`Invalid id: ${idPart}`);
  }
  const setColorCounts = parseSets(setsPart);
  const isValid = gameIsValid(setColorCounts);
  return { id, ...setColorCounts, isValid };
}

export function parseId(idPart: string) {
  const match = idPart.match(/\d+/);
  if (!match) {
    return null;
  }
  const [matchedId] = match;
  return Number.parseInt(matchedId);
}

export function parseSet(set: string) {
  const colors = set.split(", ");
  const setColorCounts: ColorCount = {
    blue: 0,
    green: 0,
    red: 0,
  };
  colors.forEach((color) => {
    const [count, colorName] = color.split(" ");
    if (!isColor(colorName)) {
      throw new Error(`Invalid color: ${colorName}`);
    }
    if (isNaN(Number.parseInt(count))) {
      throw new Error(`Invalid count: ${count}`);
    }
    setColorCounts[colorName] = Number.parseInt(count);
  });
  return setColorCounts;
}

export function parseSets(setsPart: string) {
  const setMaxCounts: ColorCount = {
    blue: 0,
    green: 0,
    red: 0,
  };
  const sets = setsPart.split("; ");
  sets.forEach((set) => {
    const setColorCounts = parseSet(set);
    for (const [color, colorCount] of Object.entries(setColorCounts)) {
      if (!isColor(color)) {
        throw new Error(`Invalid color: ${color}`);
      }
      if (colorCount > setMaxCounts[color]) {
        setMaxCounts[color] = colorCount;
      }
    }
  });
  return setMaxCounts;
}

export function findValidGames(inputs: string[]) {
  const validGames: Game[] = [];
  inputs.forEach((line) => {
    const game = parseLine(line);
    if (game.isValid) {
      validGames.push(game);
    }
  });
  return validGames;
}

export function calcGamePower(game: Game) {
  const colorCounts = Object.entries(game)
    .filter(([color, count]) => isColor(color) && typeof count === "number")
    .map(([_color, count]) => count as number);
  return colorCounts.reduce((a, b) => a * b);
}

async function main() {
  const filepath = path.join(__dirname, "input.txt");
  const contents = await readFile(filepath);
  if (!contents) {
    console.error("Couldn't open file", filepath);
    return;
  }

  const validGames = findValidGames(contents);
  const sum = validGames.map((game) => game.id).reduce((a, b) => a + b, 0);
  console.log("Sum of valid game ids:", sum);

  const games = contents.map(parseLine);
  const gamePowers = games.map(calcGamePower);
  console.log(
    "Sum of game powers:",
    gamePowers.reduce((a, b) => a + b)
  );
}

main();
