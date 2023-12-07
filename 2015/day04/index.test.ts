import { expect } from "chai";
import { MD5Hash, hashNumberWithSecret, lookForPattern } from ".";

console.log("Running tests, NODE_ENV:", process.env.NODE_ENV);

describe("MD5Hash", () => {
  describe("given a string", () => {
    it("should output the correct hash", () => {
      const input = "coucou";
      const expected = "721a9b52bfceacc503c056e3b9b93cfa";
      const actual = MD5Hash(input);
      expect(actual).to.equal(expected);
    });
  });
});

describe("hashNumberWithSecret", () => {
  describe("given a string and a number", () => {
    it("should output the correct hash", () => {
      const inputs: [string, number][] = [
        ["abcdef", 609043],
        ["pqrstuv", 1048970],
      ];
      const expected = [
        "000001dbbfa3a5c83a2d506429c7b00e",
        "000006136ef2ff3b291c85725f17325c",
      ];
      inputs.forEach((input, index) => {
        const actual = hashNumberWithSecret(input[0], input[1]);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("lookForPattern", () => {
  describe("given a string", () => {
    it("should output the correct number", function (done) {
      this.timeout(5000);
      const inputs = ["00000", "000000"];
      const expected = [254575, 1038736];
      inputs.forEach((input, index) => {
        const actual = lookForPattern(input);
        expect(actual).to.equal(expected[index]);
      });
      done();
    });
  });
});
