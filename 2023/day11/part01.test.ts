import { expect } from "chai";
import { buildPairs, expand, findGalaxies, getPathLength } from ".";

describe("expand", () => {
  describe("given a valid array of strings", () => {
    it("should return the correct array", () => {
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
      const expected = [
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
      const actual = expand(input);
      expect(actual).to.deep.equal(expected);
    });
  });
});

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
      const inputs = [
        ["1,6", "5,11"],
        ["4,0", "9,10"],
        ["0,2", "12,7"],
        ["0,11", "5,11"],
      ];
      const expected = [9, 15, 17, 5];
      inputs.forEach((input, index) => {
        const [start, end] = input;
        const actual = getPathLength(start, end);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
