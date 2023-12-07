import { expect } from "chai";
import path from "path";
import {
  readFile,
  parseLine,
  sumFromLines,
  wordsToDigits,
  main,
} from "./index";

const testFilePath = path.resolve(__dirname, "input.test.txt");

describe("day 1 part 2", () => {
  describe("readFile function", () => {
    describe("when the file exists", () => {
      it("should return the file contents", async () => {
        const contents = await readFile(testFilePath);
        expect(contents).to.be.an("array");
        expect(contents).to.have.lengthOf(4);
        expect(contents).to.deep.equal([
          "1abc2",
          "pqr3stu8vwx",
          "a1b2c3d4e5f",
          "treb7uchet",
        ]);
      });
    });

    describe("when the file does not exist", () => {
      it("should return null", async () => {
        const contents = await readFile("nonexistent.txt");
        expect(contents).to.be.null;
      });
    });
  });

  describe("parseLine function", () => {
    describe("given a line", () => {
      it("should return a number", () => {
        const line = "1abc2";
        const result = parseLine(line);
        expect(result).to.be.a("number");
      });

      it("should return a double digit number made from of the first and last digits in the line", () => {
        const lines = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];
        const expectedResults = [12, 38, 15, 77];
        lines.forEach((line, index) => {
          const result = parseLine(line);
          expect(result).to.equal(expectedResults[index]);
        });
      });
    });
  });

  describe("sum from lines function", () => {
    describe("given an array of sanitized lines", () => {
      it("should return the sum of the parsed lines", () => {
        const input = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];
        const result = sumFromLines(input);
        expect(result).to.equal(142);
      });
    });
  });

  describe("wordsToDigits function", () => {
    describe("given a line", () => {
      it("should return a line with the words replaced by digits", () => {
        let line = "onetwothreefourfivesixseveneightnine";
        let result = wordsToDigits(line);
        let expected = "123456789";
        expect(result).to.equal(expected);

        line = "trebsevenuchet";
        result = wordsToDigits(line);
        expected = "treb7uchet";
        expect(result).to.equal(expected);
      });
    });
  });

  describe("main function", () => {
    describe("given a filepath", () => {
      it("should return the sum of the parsed lines", async () => {
        const testFilePath02 = path.resolve(__dirname, "input.test.02.txt");
        const testFilePaths = [testFilePath, testFilePath02];
        const expectedResults = [142, 281];
        expectedResults.forEach(async (expectedResult, index) => {
          const result = await main(testFilePaths[index]);
          expect(result).to.equal(expectedResult);
        });
      });
    });
  });
});
