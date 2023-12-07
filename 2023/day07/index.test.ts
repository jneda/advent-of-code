import { expect } from "chai";
import {
  HAND_TYPES,
  getHandType,
  getCardScore,
  sortFunction,
  countCards,
} from ".";

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
        "2222J",
        "2234J",
        "2233J",
        "234JJ",
        "23JJJ",
        "2JJJJ",
        "JJJJJ",
        "2345J"
      ];

      const expected = [
        HAND_TYPES.ONE_PAIR,
        HAND_TYPES.FOUR_OF_A_KIND,
        HAND_TYPES.TWO_PAIR,
        HAND_TYPES.FOUR_OF_A_KIND,
        HAND_TYPES.FOUR_OF_A_KIND,
        HAND_TYPES.FIVE_OF_A_KIND,
        HAND_TYPES.FOUR_OF_A_KIND,
        HAND_TYPES.FULL_HOUSE,
        HAND_TYPES.HIGH_CARD,
        HAND_TYPES.FIVE_OF_A_KIND,
        HAND_TYPES.THREE_OF_A_KIND,
        HAND_TYPES.FULL_HOUSE,
        HAND_TYPES.THREE_OF_A_KIND,
        HAND_TYPES.FOUR_OF_A_KIND,
        HAND_TYPES.FIVE_OF_A_KIND,
        HAND_TYPES.FIVE_OF_A_KIND,
        HAND_TYPES.ONE_PAIR
      ];

      inputs.forEach((input, index) => {
        const actual = getHandType(input);
        console.log({ index, input, actual, expected: expected[index] });
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("countCards", () => {
  describe("given a valid hand", () => {
    it("should return the correct counts", () => {
      const inputs = [
        "22222",
        "23456",
        "2222J",
        "222JJ",
        "22JJJ",
        "2JJJJ",
        "JJJJJ",
      ];
      const expected = [
        { 2: 5 },
        { 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
        { 2: 5 },
        { 2: 5 },
        { 2: 5 },
        { 2: 5 },
        { J: 5 },
      ];
      inputs.forEach((input, index) => {
        const actual = countCards(input);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("getCardScore", () => {
  describe("given a valid card string", () => {
    it("should return the correct number", () => {
      const inputs = [
        "J",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "T",
        "Q",
        "K",
        "A",
      ];

      const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

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

      const expected = [-4, 4, -3, 3, 0];

      inputs.forEach(([a, b], index) => {
        const actual = sortFunction(a, b);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
