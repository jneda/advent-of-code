import { expect } from "chai";
import {
  incrementString,
  hasSuite,
  hasTwoPairs,
  incrementPassword,
  hasForbiddenChars,
} from ".";

describe("incrementString", () => {
  describe("given a alphabetic string", () => {
    it("should increment it correctly and return it", () => {
      const inputs = ["a", "b", "z", "zz", "aaz", "h", "k", "n"];
      const expected = ["b", "c", "aa", "aaa", "aba", "j", "m", "p"];
      inputs.forEach((input, index) => {
        const actual = incrementString(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("hasSuite", () => {
  describe("given an alphabetic string", () => {
    it("should return false if the string doesn't have a suite (i.e. abc, bcd, etc.)", () => {
      const inputs = ["a", "aaa", "cfg"];
      inputs.forEach((input) => {
        const actual = hasSuite(input);
        expect(actual).to.be.false;
      });
    });

    it("should return true if the string contains a suite", () => {
      const inputs = ["abc", "cde", "xyz"];
      inputs.forEach((input) => {
        const actual = hasSuite(input);
        expect(actual).to.be.true;
      });
    });
  });
});

describe("hasTwoPairs", () => {
  describe("given an alphabetic string", () => {
    it("should return false if the string doesn't contain two pairs (i.e. aa, bb, zz, etc.)", () => {
      const inputs = ["abnsdmj", "az", "lmkmlsjdfjsdmfj"];
      inputs.forEach((input) => {
        const actual = hasTwoPairs(input);
        expect(actual).to.be.false;
      });
    });

    it("should return true if the string contains two pairs", () => {
      const inputs = ["aaaa", "aabb", "ghjaabcc", "abcdffaa"];
      inputs.forEach((input) => {
        const actual = hasTwoPairs(input);
        expect(actual).to.be.true;
      });
    });
  });
});

describe("hasForbiddenChars", () => {
  describe("given a password that doesn't contain i, o, nor l", () => {
    it("should return false", () => {
      const inputs = ["abcdffaa", "ghjaabcc"];
      inputs.forEach((input) => {
        const actual = hasForbiddenChars(input);
        expect(actual).to.be.false;
      });
    });
  });

  describe("given a password that does contain a forbidden character", () => {
    it("should return true", () => {
      const inputs = ["abcdofgh", "ghijklmn", "ghlaabcc"];
      inputs.forEach((input) => {
        const actual = hasForbiddenChars(input);
        expect(actual).to.be.true;
      });
    });
  });
});

describe("incrementPassword", () => {
  describe("given a password", () => {
    it("should return the next password", () => {
      const inputs = ["abcdefgh", "ghijklmn"];
      const expected = ["abcdffaa", "ghjaabcc"];
      inputs.forEach((input, index) => {
        const actual = incrementPassword(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
