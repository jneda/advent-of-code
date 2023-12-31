import { expect } from "chai";
import {
  buildPairs,
  findGalaxies,
  getPathLength,
  findEmptyRowsAndCols,
} from ".";

describe("buildPairs", () => {
  describe("given an array of values", () => {
    it("should return all the correct pairs", () => {
      const input = [1, 2, 3, 4];
      const expected = [
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4],
      ];
      const actual = buildPairs(input);
      expect(actual).to.deep.equal(expected);
    });
  });
});

describe("findGalaxies", () => {
  describe("given an array of strings", () => {
    it("should return an array of the correct coordinates", () => {
      const input = [
        "....#........",
        ".........#...",
        "#............",
        ".............",
        ".............",
        "........#....",
        ".#...........",
        "............#",
        ".............",
        ".............",
        ".........#...",
        "#....#.......",
      ];
      const expected = [
        "4,0",
        "9,1",
        "0,2",
        "8,5",
        "1,6",
        "12,7",
        "9,10",
        "0,11",
        "5,11",
      ];
      const actual = findGalaxies(input);
      expect(actual).to.deep.equal(expected);
    });
  });
});

describe("getPathLength", () => {
  describe("given start and end points", () => {
    it("should return the correct path length", () => {
      const empty = { rows: [7, 3], cols: [8, 5, 2] };
      const factor = 10;
      const inputs = [
        ["3,0", "7,1"],
        ["3,0", "6,4"],
      ];
      const expected = [14, 25];
      inputs.forEach((input, index) => {
        const [start, end] = input;
        const actual = getPathLength(start, end, empty, factor);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("findEmptyRowsAndCols", () => {
  describe("given an array of strings", () => {
    it("should return the correct object of empty rows and columns", () => {
      const input = [
        "...#......",
        ".......#..",
        "#.........",
        "..........",
        "......#...",
        ".#........",
        ".........#",
        "..........",
        ".......#..",
        "#...#.....",
      ];
      const actual = findEmptyRowsAndCols(input);
      expect(actual.rows).to.have.deep.members([3, 7]);
      expect(actual.cols).to.have.deep.members([2, 5, 8]);
    });
  });
});
