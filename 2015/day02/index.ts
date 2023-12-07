import path from "path";
import { readFile } from "../../lib/files";

export type Dimensions = [number, number, number];

function isDimensions(value: unknown): value is Dimensions {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every((elt) => typeof elt === "number")
  );
}

export function getBoxSurface(dimensions: string): number {
  const [l, w, h] = getDimensions(dimensions);
  return 2 * l * w + 2 * w * h + 2 * l * h;
}

export function getBoxVolume(dimensions: string) {
  const [l, w, h] = getDimensions(dimensions);
  return l * w * h;
}

export function getDimensions(dimensions: string): Dimensions {
  const parsedDimensions = dimensions.split("x").map((n) => Number.parseInt(n));
  if (isDimensions(parsedDimensions)) {
    return parsedDimensions;
  }
  throw new Error("Invalid argument");
}

export function getSmallestArea(dimensions: string): number {
  const [l, w, h] = getDimensions(dimensions);
  return Math.min(l * w, w * h, l * h);
}

export function getSmallestPerimeter(dimensions: string): number {
  const [l, w, h] = getDimensions(dimensions);
  const perimeter = (a: number, b: number) => 2 * (a + b);
  return Math.min(perimeter(l, w), perimeter(w, h), perimeter(l, h));
}

export function getSquareFeetForWrapping(dimensions: string): number {
  return getBoxSurface(dimensions) + getSmallestArea(dimensions);
}

export function getFeetForRibbon(dimensions: string) {
  return getSmallestPerimeter(dimensions) + getBoxVolume(dimensions);
}

async function main() {
  const filepath = path.resolve(__dirname, "./input.txt");
  const lines = await readFile(filepath);
  if (lines === null) {
    return console.error("Unable to open file.");
  }

  const squareFeetForWrapping = lines
    .map((dimensions) => getSquareFeetForWrapping(dimensions))
    .reduce((a, b) => a + b);

  console.log(
    "In total",
    squareFeetForWrapping,
    "square feet of wrapping paper will be needed."
  );

  const feetForRibbon = lines
    .map((dimensions) => getFeetForRibbon(dimensions))
    .reduce((a, b) => a + b);

  console.log(
    "In total",
    feetForRibbon,
    "feet of ribbon paper will be needed."
  );
}

if (process.env.NODE_ENV !== "test") {
  main();
}
