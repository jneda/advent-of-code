import { expect } from "chai";
import {
  getFileContents,
  parseNumbers,
  getCardScore,
  getTotalScore,
  processCards,
} from ".";

const filenames = ["input.test.txt"];

describe("getFileContents", () => {
  describe("given an array of filenames", () => {
    it("should return an array of arrays of strings", async () => {
      const fileContents = await getFileContents(filenames);
      expect(fileContents).to.be.an("array");
      fileContents.every((fileContent: string[]) => {
        expect(fileContent).to.be.an("array");
        fileContent.every((elt) => {
          expect(elt).to.be.a("string");
        });
      });
    });

    it("should return the correct values", async () => {
      const fileContents = await getFileContents(filenames);
      const expected = [
        "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
        "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
        "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
        "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
        "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
        "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
      ];
      const actual = fileContents[0];
      expect(actual).to.deep.equal(expected);
    });
  });
});

describe("parseNumbers", () => {
  let inputs: string[][];

  before(async () => {
    inputs = await getFileContents(filenames);
  });

  describe("given a valid card", () => {
    it("should return the correct arrays of numbers", () => {
      const cards = inputs[0];
      const expected = [
        [
          [41, 48, 83, 86, 17],
          [83, 86, 6, 31, 17, 9, 48, 53],
        ],
        [
          [13, 32, 20, 16, 61],
          [61, 30, 68, 82, 17, 32, 24, 19],
        ],
        [
          [1, 21, 53, 59, 44],
          [69, 82, 63, 72, 16, 21, 14, 1],
        ],
        [
          [41, 92, 73, 84, 69],
          [59, 84, 76, 51, 58, 5, 54, 83],
        ],
        [
          [87, 83, 26, 28, 32],
          [88, 30, 70, 12, 93, 22, 82, 36],
        ],
        [
          [31, 18, 13, 56, 72],
          [74, 77, 10, 23, 35, 67, 36, 11],
        ],
      ];
      cards.forEach((card, index) => {
        const actual = parseNumbers(card);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("getCardScore", () => {
  let inputs: string[][];

  before(async () => {
    inputs = await getFileContents(filenames);
  });

  describe("given a valid card", () => {
    it("should return the correct score", () => {
      const cards = inputs[0];
      const expected = [8, 2, 2, 1, 0, 0];
      cards.forEach((card, index) => {
        const actual = getCardScore(card);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getTotalScore", () => {
  let inputs: string[][];

  before(async () => {
    inputs = await getFileContents(filenames);
  });

  it("should return the correct total score", () => {
    const cards = inputs[0];
    const expected = 13;
    const actual = getTotalScore(cards);
  });
});

describe("processCards", () => {
  let inputs: string[][];
  let cards: string[];

  before(async () => {
    inputs = await getFileContents(filenames);
    [cards] = inputs;
  });

  it("should return an array of numbers", () => {
    const actual = processCards(cards);
    expect(actual).to.be.an("array");
    expect(actual).to.be.of.length(6);
    actual.every((elt: unknown) => {
      expect(elt).to.be.a("number");
    });
  });

  it("should return the correct numbers", () => {
    const expected = [1, 2, 4, 8, 14, 1];
    const actual = processCards(cards);
    expect(actual).to.deep.equal(expected);
  });
});
