import path from "path";
import { readFile } from "../../lib/files";

export type Lens = [string, number];
export type Boxes = Map<number, Lens[]>;

/**
 * Calculates the hash value of a given string.
 * 
 * @param s - The input string.
 * @returns The hash value of the input string.
 */
export function hash(s: string): number {
  let current = 0;
  for (const c of s) {
    current += c.charCodeAt(0);
    current *= 17;
    current %= 256;
  }
  return current;
}

/**
 * Calculates the total hash value of a given string.
 * 
 * @param s - The input string containing comma-separated steps.
 * @returns The total hash value.
 */
export function verify(s: string): number {
  let total = 0;
  for (const step of s.split(",")) {
    total += hash(step);
  }
  return total;
}

/**
 * Initializes the boxes based on the given instructions.
 * @param instructions - The instructions for initializing the boxes.
 * @returns The initialized boxes.
 * @throws Error if the step is invalid or the box id is invalid.
 */
export function initialize(instructions: string) {
  const boxes: Boxes = new Map<number, Lens[]>();
  for (let i = 0; i < 256; i++) {
    boxes.set(i, []);
  }

  for (const step of instructions.split(",")) {
    // find where the op instruction starts
    let breakpoint: number = -1;
    if (step.includes("=")) breakpoint = step.indexOf("=");
    else if (step.includes("-")) breakpoint = step.indexOf("-");
    if (breakpoint === -1) throw new Error(`Invalid step: ${step}`);

    const label = step.slice(0, breakpoint);
    const boxId = hash(label);
    const op = step.slice(breakpoint);

    switch (op[0]) {
      case "=": {
        const box = boxes.get(boxId);
        if (!box) throw new Error(`Invalid box id: ${boxId}`);

        const newBox = [...box];
        const newValue = parseInt(op.slice(1));

        // check if label already exists
        let alreadyExists = false;
        for (let i = 0; i < box.length; i++) {
          if (box[i][0] === label) {
            alreadyExists = true;
            newBox[i][1] = newValue;
          }
        }
        if (!alreadyExists) newBox.push([label, newValue]);

        boxes.set(boxId, newBox);
        break;
      }

      case "-": {
        const box = boxes.get(boxId);
        if (!box) throw new Error(`Invalid box id: ${boxId}`);

        const newBox = box.filter((lens) => lens[0] !== label);
        boxes.set(boxId, newBox);
      }
    }
  }

  return boxes;
}

/**
 * Calculates the focusing power based on the given boxes.
 * The focusing power is calculated by multiplying the index of the box, the index of the lens within the box, and the value of the lens.
 * @param boxes - The boxes containing lenses.
 * @returns The total focusing power.
 * @throws Error if no data is found for a specific index.
 */
export function getFocusingPower(boxes: Boxes) {
  let total = 0;
  for (let i = 0; i < boxes.size; i++) {
    const lenses = boxes.get(i);
    if (!lenses) throw new Error(`No data found for index ${i}`);
    if (lenses.length === 0) continue;

    for (let j = 0; j < lenses.length; j++) {
      const [_label, value] = lenses[j];
      total += (i + 1) * (j + 1) * value;
    }
  }

  return total;
}

async function main() {
  let input: string;
  try {
    const filepath = path.resolve(__dirname, "input.txt");
    const contents = await readFile(filepath);
    if (!contents || contents.length !== 1) throw new Error("Invalid data.");
    input = contents[0];
  } catch (error) {
    console.error(error);
    return 1;
  }

  // const total = verify(input);
  // console.log({ total });

  const boxes = initialize(input);
  const focusingPower = getFocusingPower(boxes);
  console.log({ focusingPower });

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
