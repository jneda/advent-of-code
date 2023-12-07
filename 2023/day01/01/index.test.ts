import { expect } from "chai";
import path from "path";
import { readFile, parseLine, sum } from "./index";

const testFilePath = path.resolve(__dirname, "input.test.txt");

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

describe("sum function", () => {
  describe("given a file", () => {
    it("should return the sum of the parsed lines", async () => {
      const result = await sum(testFilePath);
      expect(result).to.equal(142);
    });
  });
});
