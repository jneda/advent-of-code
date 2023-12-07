import path, { parse } from "path";
import { expect } from "chai";
import { readFile } from "../lib/files";
import { parseLine, checkNeighbours, isNumberValid } from "./index";

const testInputLines = [
  "467..114..",
  "...*......",
  "..35..633.",
  "......#...",
  "617*......",
  ".....+.58.",
  "..592.....",
  "......755.",
  "...$.*....",
  ".664.598..",
];

describe("day03", () => {
  describe("readFile", () => {
    it("reads a file correctly", async () => {
      const filepath = path.resolve(__dirname, "./input.test.txt");
      const contents = await readFile(filepath);
      expect(contents).to.deep.equal(testInputLines);
    });
  });

  describe("parseLine", () => {
    it("finds all numbers in a line and the coordinates of their digits, \
as well as the coordinates of any symbols other than a point", () => {
      const lineIndex = 0;
      const line = "467*.114+.";
      const output = parseLine(line, lineIndex);
      const expected = {
        numbersData: [
          { number: 467, coordinates: ["0,0", "1,0", "2,0"] },
          { number: 114, coordinates: ["5,0", "6,0", "7,0"] },
        ],
        symbolsCoordinates: ["3,0", "8,0"],
      };
      expect(output).to.deep.equal(expected);
    });

    it("finds all symbols", () => {
      const symbols = "=-*/+$&%#@";
      const lineIndex = 0;
      const output = parseLine(symbols, lineIndex);
      const expected = {
        numbersData: [],
        symbolsCoordinates: symbols.split("").map((_, index) => `${index},0`),
      };
    });
  });

  describe("checkNeighbours", () => {
    it("returns true if a point has a neighbour with a symbol", () => {
      const coordinates = "2,0";
      const lineLength = 10;
      const symbolsCoordinates = ["3,1"];
      const output = checkNeighbours(
        coordinates,
        lineLength,
        symbolsCoordinates,
        42
      );
      expect(output).to.equal(true);
    });

    it("returns false if a point has no neighbours with a symbol", () => {
      const coordinates = "2,0";
      const lineLength = 10;
      const symbolsCoordinates = ["3,2"];
      const output = checkNeighbours(
        coordinates,
        lineLength,
        symbolsCoordinates,
        42
      );
      expect(output).to.equal(false);
    });
  });

  describe("isNumberValid", () => {
    it("returns true if a number is valid", () => {
      const numberData = {
        number: 467,
        coordinates: ["0,0", "1,0", "2,0"],
      };
      const lineLength = 10;
      const symbolsCoordinates = ["3,0", "8,0"];
      const output = isNumberValid(numberData, lineLength, symbolsCoordinates);
      expect(output).to.equal(true);
    });

    it("returns false if a number is invalid", () => {
      const numberData = {
        number: 114,
        coordinates: ["5,0", "6,0", "7,0"],
      };
      const lineLength = 10;
      const symbolsCoordinates = ["3,0", "9,0"];
      const output = isNumberValid(numberData, lineLength, symbolsCoordinates);
      expect(output).to.equal(false);
    });
  });
});
