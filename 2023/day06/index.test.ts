import { expect } from "chai";
import { inputs, parseInput, countPossibleWins, countPossibleWins_v2 } from ".";

describe("parseInput", () => {
  describe("given a tuple of strings", () => {
    it("should return the correct tuple of arrays of numbers", () => {
      const expected = [
        [
          [7, 15, 30],
          [9, 40, 200],
        ],
        [
          [51, 69, 98, 78],
          [377, 1171, 1224, 1505],
        ],
      ];
      inputs.forEach((input, index) => {
        const actual = parseInput(input);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("countPossibleWins", () => {
  describe("given a duration and a record distance", () => {
    it("should return the number of possibilities to beat the record", () => {
      const inputs = [
        [7, 9],
        [15, 40],
        [30, 200],
        [71530, 940200],
      ];
      const expected = [4, 8, 9, 71503];
      inputs.forEach((input, index) => {
        const [duration, record] = input;
        const actual = countPossibleWins(duration, record);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("countPossibleWins_v2", () => {
  describe("given a duration and a record distance", () => {
    it("should return the number of possibilities to beat the record", () => {
      const inputs = [
        [7, 9],
        [15, 40],
        [30, 200],
        [71530, 940200],
      ];
      const expected = [4, 8, 9, 71503];
      inputs.forEach((input, index) => {
        const [duration, record] = input;
        const actual = countPossibleWins_v2(duration, record);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
