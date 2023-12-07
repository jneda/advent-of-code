import { expect } from "chai";
import { decodeMove, applyMove, walk } from ".";
import { MoveChar, Direction } from ".";

describe("decodeMove", () => {
  describe("given a valid move", () => {
    it("should return the correct direction", () => {
      const inputs: MoveChar[] = ["^", "v", "<", ">"];
      const directions: Direction[] = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      inputs.forEach((input, index) => {
        const actual = decodeMove(input);
        expect(actual).to.deep.equal(directions[index]);
      });
    });
  });
});

describe("applyMove", () => {
  describe("given an initial position and a direction", () => {
    it("should return the correct position", () => {
      const initialPosition = { x: 0, y: 0 };
      const directions: Direction[] = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      const expected = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      directions.forEach((direction, index) => {
        const actual = applyMove(initialPosition, direction);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("walk", () => {
  describe("given a string made of characters representing a move", () => {
    it("should return the number of houses visited", () => {
      const inputs = [">", "^>v<", "^v^v^v^v^v"];
      const expected = [2, 4, 2];
      inputs.forEach((input, index) => {
        const actual = walk(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
