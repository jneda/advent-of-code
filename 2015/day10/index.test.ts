import { expect } from "chai";
import { lookAndSay } from ".";

describe("lookAndSay", () => {
  describe("given a string of digits", () => {
    it("should return the correct string", () => {
      /* 
        1 becomes 11 (1 copy of digit 1).
        11 becomes 21 (2 copies of digit 1).
        21 becomes 1211 (one 2 followed by one 1).
        1211 becomes 111221 (one 1, one 2, and two 1s).
        111221 becomes 312211 (three 1s, two 2s, and one 1).
     */
      const inputs = ["1", "11", "21", "1211", "111221"];
      const expected = ["11", "21", "1211", "111221", "312211"];
      inputs.forEach((input, index) => {
        const actual = lookAndSay(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
