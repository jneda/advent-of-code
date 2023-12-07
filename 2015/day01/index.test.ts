import { expect } from "chai";
import {
  getAscendingSteps,
  getDescendingSteps,
  getFinalFloor,
  findBasementFirstPosition,
} from ".";

describe("getAscendingSteps", () => {
  describe("when given a string", () => {
    it("should return a number", () => {
      const input = "";
      const actual = getAscendingSteps(input);
      expect(actual).to.be.a("number");
    });
  });

  describe("when given a string with one open parenthesis", () => {
    it("should return 1", () => {
      const input = "(";
      const expected = 1;
      const actual = getAscendingSteps(input);
      expect(actual).to.equal(expected);
    });
  });

  describe("when given a string with no open parentheses", () => {
    it("should return 0", () => {
      const input = "";
      const expected = 0;
      const actual = getAscendingSteps(input);
      expect(actual).to.equal(expected);
    });
  });

  describe("when given a string with a mix of open and closed parentheses", () => {
    it("should return the count of open parentheses", () => {
      const input = "(())))()";
      const expected = 3;
      const actual = getAscendingSteps(input);
      expect(actual).to.equal(expected);
    });
  });
});

describe("getDescendingSteps", () => {
  describe("when given a string", () => {
    it("should return a number", () => {
      const input = "";
      const actual = getDescendingSteps(input);
      expect(actual).to.be.a("number");
    });
  });

  describe("when given a string with one closing parenthesis", () => {
    it("should return 1", () => {
      const input = ")";
      const expected = 1;
      const actual = getDescendingSteps(input);
      expect(actual).to.equal(expected);
    });
  });

  describe("when given a string with no open parentheses", () => {
    it("should return 0", () => {
      const input = "";
      const expected = 0;
      const actual = getDescendingSteps(input);
      expect(actual).to.equal(expected);
    });
  });

  describe("when given a string with a mix of open and closed parentheses", () => {
    it("should return the count of open parentheses", () => {
      const input = "(())))()";
      const expected = 5;
      const actual = getDescendingSteps(input);
      expect(actual).to.equal(expected);
    });
  });
});

describe("getFinalFloor", () => {
  describe("given a string", () => {
    it("should return a number", () => {
      const input = "";
      const actual = getFinalFloor(input);
      expect(actual).to.be.a("number");
    });
  });

  describe("given an empty string", () => {
    it("should return 0", () => {
      const input = "";
      const expected = 0;
      const actual = getFinalFloor(input);
      expect(actual).to.equal(expected);
    });
  });

  describe("given a string of mixed open and closing parentheses", () => {
    it("should return the appropriate result", () => {
      const inputs = [
        "(())",
        "()()",
        "(((",
        "(()(()(",
        "))(((((",
        "())",
        "))(",
        ")))",
        ")())())",
      ];
      const expected = [0, 0, 3, 3, 3, -1, -1, -3, -3];
      inputs.forEach((input, index) => {
        const actual = getFinalFloor(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("findBasementFirstPosition", () => {
  describe("given a string", () => {
    it("should return a number", () => {
      const input = "";
      const actual = findBasementFirstPosition(input);
      expect(actual).to.be.a("number");
    });

    it("should return the appropriate position", () => {
      const inputs = [")", "()())"];
      const expected = [1, 5];
      inputs.forEach((input, index) => {
        const actual = findBasementFirstPosition(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
