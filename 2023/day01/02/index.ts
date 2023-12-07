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

export function parseLine(line: string) {
  const firstDigitMatch = line.match(/\d/);
  const lastDigitMatch = line.match(/\d(?!.*\d)/);

  if (firstDigitMatch && lastDigitMatch) {
    const stringResult = firstDigitMatch[0] + lastDigitMatch[0];
    return Number.parseInt(stringResult);
  }
  return null;
}

export function wordsToDigits(line: string) {
  const digitsMap: { [key: string]: string } = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  const regex = new RegExp(Object.keys(digitsMap).join("|"), "g");
  return line.replace(regex, (word) => digitsMap[word]);
}

export function sumFromLines(lines: string[]) {
  try {
    return lines.reduce((acc, line) => {
      const value = parseLine(line);
      if (!value) {
        throw new Error(`Could not parse line "${line}"`);
      }
      return acc + value;
    }, 0);
  } catch (error) {
    // console.log(error);
    return null;
  }
}

export async function main(filepath: string) {
  try {
    const lines = await readFile(filepath);
    if (!lines) {
      throw new Error("Could not read file");
    }
    // console.log({
    //   lines: lines.join(" "),
    // });
    const sanitizedLines = lines.map((line) =>
      wordsToDigits(line).replace(/\D/g, "")
    );
    // console.log({
    //   sanitizedLines: sanitizedLines.join(" "),
    // });

    const parsedLines = sanitizedLines.map((line) => parseLine(line));
    if (parsedLines.some((line) => line === null)) {
      throw new Error("Could not parse lines: at least one line is null");
    }
    // console.log({
    //   parsedLines: parsedLines.join(" "),
    //   // repeatedDigitsLines: (parsedLines as number[])
    //   //   .filter((line) => Math.floor(line / 10) === line % 10)
    //   //   .join(" "),
    // });

    const result = (parsedLines as number[]).reduce((acc, line) => acc + line);

    // console.log({ result });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const filepath = path.join(__dirname, "input.txt");
main(filepath);
