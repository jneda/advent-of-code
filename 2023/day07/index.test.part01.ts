import { expect } from "chai";
import { HAND_TYPES, getHandType, getCardScore, sortFunction } from ".";

describe("getHandType", () => {
  describe("given a valid hand", () => {
    it("should return the correct hand type", () => {
      const inputs = [
        "32T3K",
        "T55J5",
        "KK677",
        "KTJJT",
        "QQQJA",
        "AAAAA",
        "AA8AA",
        "23332",
        "23456",
      ];

      const expected = [
        HAND_TYPES.ONE_PAIR,
        HAND_TYPES.THREE_OF_A_KIND,
        HAND_TYPES.TWO_PAIR,
        HAND_TYPES.TWO_PAIR,
        HAND_TYPES.THREE_OF_A_KIND,
        HAND_TYPES.FIVE_OF_A_KIND,
        HAND_TYPES.FOUR_OF_A_KIND,
        HAND_TYPES.FULL_HOUSE,
        HAND_TYPES.HIGH_CARD,
      ];

      inputs.forEach((input, index) => {
        const actual = getHandType(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getCardScore", () => {
  describe("given a valid card string", () => {
    it("should return the correct number", () => {
      const inputs = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "T",
        "J",
        "Q",
        "K",
        "A",
      ];

      const expected = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

      inputs.forEach((input, index) => {
        const actual = getCardScore(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("sortFunction", () => {
  describe("given two cards to compare", () => {
    it("should return the correct result", () => {
      const inputs = [
        ["32T3K", "T55J5"],
        ["T55J5", "32T3K"],
        ["KK677", "KTJJT"],
        ["KTJJT", "KK677"],
        ["KTJJT", "KTJJT"],
      ];

      const expected = [-2, 2, 3, -3, 0];

      inputs.forEach(([a, b], index) => {
        const actual = sortFunction(a, b);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
