import path from "path";
import { readFile } from "../../lib/files";

export async function getFileContents(filenames: string[]) {
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

export enum Instructions {
  TURN_ON = "turnOn",
  TURN_OFF = "turnOff",
  TOGGLE = "toggle",
}

export const InstructionDictionary = {
  "turn on": Instructions.TURN_ON,
  "turn off": Instructions.TURN_OFF,
  toggle: Instructions.TOGGLE,
};

export type Light = {
  on: boolean;
  turnOn: () => void;
  turnOff: () => void;
  toggle: () => void;
};

export type Light_v2 = {
  brightness: number;
  turnOn: () => void;
  turnOff: () => void;
  toggle: () => void;
};

export function makeLight(): Light {
  return {
    on: false,
    turnOn: function () {
      this.on = true;
    },
    turnOff: function () {
      this.on = false;
    },
    toggle: function () {
      this.on = !this.on;
    },
  };
}

export function makeLight_v2(): Light_v2 {
  return {
    brightness: 0,
    turnOn: function () {
      this.brightness = this.brightness + 1;
    },
    turnOff: function () {
      this.brightness = Math.max(this.brightness - 1, 0);
    },
    toggle: function () {
      this.brightness = this.brightness + 2;
    },
  };
}

export function makeLightGrid(size: number, makeLightFunction: () => object) {
  const lightGrid = {
    map: new Map(),
    update: function (
      instruction: string,
      topleft: string,
      bottomright: string
    ) {
      const coordsRange = getCoordinatesRange(topleft, bottomright);
      for (const coords of coordsRange) {
        const light = this.map.get(coords);
        light[instruction]();
      }
    },
  };
  // initialize lights map
  const topleft = `0,0`;
  const bottomright = `${size - 1},${size - 1}`;
  const range = getCoordinatesRange(topleft, bottomright);
  for (const coords of range) {
    lightGrid.map.set(coords, makeLightFunction());
  }

  return lightGrid;
}

export function parseInstruction(s: string): [string, string, string] | null {
  const parsingRegex = /^(.+) (\d+,\d+) through (\d+,\d+)$/;
  const matchArray = s.match(parsingRegex);

  if (!matchArray || matchArray.length === 0) {
    return null;
  }

  const [_match, instruction, coordA, coordB] = matchArray;
  if (
    instruction !== "turn on" &&
    instruction !== "turn off" &&
    instruction !== "toggle"
  ) {
    throw new Error("Invalid data");
  }

  return [InstructionDictionary[instruction], coordA, coordB];
}

export function parseCoordinates(coords: string) {
  const validationRegex = /(\d+,\d+)/g;
  if (!coords.match(validationRegex)) {
    throw new Error("Invalid data");
  }
  const [x, y] = coords.split(",").map((x) => Number.parseInt(x));
  return [x, y];
}

export function getCoordinatesRange(topleft: string, bottomright: string) {
  const validationRegex = /(\d+,\d+)/g;
  if (!topleft.match(validationRegex) || !bottomright.match(validationRegex)) {
    throw new Error("Invalid data");
  }

  const range: string[] = [];
  const [leftX, topY] = parseCoordinates(topleft);
  const [rightX, bottomY] = parseCoordinates(bottomright);

  for (let y = topY; y <= bottomY; y++) {
    for (let x = leftX; x <= rightX; x++) {
      range.push(`${x},${y}`);
    }
  }

  return range;
}

async function main() {
  const filepath = ["input.txt"];
  const [instructions] = await getFileContents(filepath);

  const startTime = Date.now();
  console.log("Starting program...");

  let choice = 1;
  if (process.argv.length > 2 && process.argv[2] === "2") {
    choice = 2;
  }

  switch (choice) {
    case 1: {
      const gridSize = 1000;
      const lightGrid = makeLightGrid(gridSize, makeLight);

      for (const instruction of instructions) {
        const details = parseInstruction(instruction);
        if (!details) {
          throw new Error("Invalid data");
        }
        lightGrid.update(...details);
      }

      const lightsOnCount = Array.from(lightGrid.map.values()).filter(
        (light) => light.on === true
      ).length;

      const elapsedTime = Date.now() - startTime;

      console.log(
        `After all instructions were applied, there are ${lightsOnCount} lit lights.
     - ${(elapsedTime / 1000).toFixed(3)} seconds`
      );

      return;
    }

    case 2: {
      const gridSize = 1000;
      const lightGrid = makeLightGrid(gridSize, makeLight_v2);

      for (const instruction of instructions) {
        const details = parseInstruction(instruction);
        if (!details) {
          throw new Error("Invalid data");
        }
        lightGrid.update(...details);
      }

      const totalBrightnessSum = Array.from(lightGrid.map.values())
        .map((light) => light.on)
        .reduce((a, b) => a + b);

      const elapsedTime = Date.now() - startTime;

      console.log(
        `After all instructions were applied, there total brightness of the lights is ${totalBrightnessSum}.
     - ${(elapsedTime / 1000).toFixed(3)} seconds`
      );
    }
  }
}

if (process.env.NODE_ENV !== "test") {
  main();
}
