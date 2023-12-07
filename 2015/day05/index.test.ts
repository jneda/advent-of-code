import { expect } from "chai";
import {
  countVowels,
  findTwoInARow,
  findForbiddenStrings,
  isStringNice,
  findRepeatPairs,
  findUwU,
} from ".";

const inputs = [
  "ugknbfddgicrmopn",
  "aaa",
  "jchzalrnumimnmhp",
  "haegwjzuvuyypxyu",
  "dvszwmarrgswjxmb",
];

describe("countVowels", () => {
  describe("given a string", () => {
    it("returns the number of vowels", () => {
      const expected = [3, 3, 3, 5, 1];
      inputs.forEach((input, index) => {
        const actual = countVowels(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("findTwoInARow", () => {
  describe("given a string", () => {
    it("returns true of false depending if characters occur two in a row or not", () => {
      const expected = [true, true, false, true, true];
      inputs.forEach((input, index) => {
        const actual = findTwoInARow(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("findForbiddenStrings", () => {
  describe("given a string", () => {
    it("returns true of false depending if forbidden characters occur or not", () => {
      const expected = [false, false, false, true, false];
      inputs.forEach((input, index) => {
        const actual = findForbiddenStrings(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("isStringNice", () => {
  describe("given a string", () => {
    it("returns true or false depending on if the string is nice or not", () => {
      const expected = [true, true, false, false, false];
      inputs.forEach((input, index) => {
        const actual = isStringNice(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("findRepeatPairs", () => {
  describe("given a string", () => {
    it("returns true or false whether the string contains a repeated pair or not", () => {
      const inputs = [
        "xyxy",
        "aabcdefgaa",
        "aaa",
        "qjhvhtzxzqqjkmpb",
        "xxyxx",
        "uurcxstgmygtbstg",
        "ieodomkazucvgmuy",
      ];
      const expected = [true, true, false, true, true, true, false];
      inputs.forEach((input, index) => {
        const actual = findRepeatPairs(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("findUwU", () => {
  describe("given a string", () => {
    it("returns true or false whether the string contains an UwU like pattern or not", () => {
      const inputs = [
        "xyxy",
        "aabcdefgaa",
        "aaa",
        "qjhvhtzxzqqjkmpb",
        "xxyxx",
        "uurcxstgmygtbstg",
        "ieodomkazucvgmuy",
      ];
      const expected = [true, false, true, true, true, false, true];
      inputs.forEach((input, index) => {
        const actual = findUwU(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
