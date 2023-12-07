import { expect } from "chai";
import {
  getBoxSurface,
  getDimensions,
  getSmallestArea,
  getSquareFeetForWrapping,
  getBoxVolume,
  getFeetForRibbon,
  getSmallestPerimeter,
} from ".";

describe("getBoxSurface", () => {
  describe("given a valid string", () => {
    it("returns a number", () => {
      const input = "2x3x4";
      const actual = getBoxSurface(input);
      expect(actual).to.be.a("number");
    });

    it("returns the correct number", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [52, 42];
      inputs.forEach((input, index) => {
        const actual = getBoxSurface(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getDimensions", () => {
  describe("given a valid string", () => {
    it("returns a tuple of three numbers", () => {
      const input = "2x3x4";
      const actual = getDimensions(input);
      expect(actual).to.be.an("array");
      expect(actual).to.be.of.length(3);
      actual.forEach((element: unknown) => {
        expect(element).to.be.a("number");
      });
    });

    it("returns the correct numbers", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [
        [2, 3, 4],
        [1, 1, 10],
      ];
      inputs.forEach((input, index) => {
        const actual = getDimensions(input);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("getSmallestArea", () => {
  describe("given a valid string", () => {
    it("returns a number", () => {
      const input = "2x3x4";
      const actual = getSmallestArea(input);
      expect(actual).to.be.a("number");
    });

    it("returns the correct number", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [6, 1];
      inputs.forEach((input, index) => {
        const actual = getSmallestArea(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getSquareFeetForWrapping", () => {
  describe("given a valid string", () => {
    it("returns the correct number", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [58, 43];
      inputs.forEach((input, index) => {
        const actual = getSquareFeetForWrapping(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getBoxVolume", () => {
  describe("given a valid string", () => {
    it("returns the correct number", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [24, 10];
      inputs.forEach((input, index) => {
        const actual = getBoxVolume(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getSmallestPerimeter", () => {
  describe("given a valid string", () => {
    it("returns the correct number", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [10, 4];
      inputs.forEach((input, index) => {
        const actual = getSmallestPerimeter(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("getFeetForRibbon", () => {
  describe("given a valid string", () => {
    it("returns the correct number", () => {
      const inputs = ["2x3x4", "1x1x10"];
      const expected = [34, 14];
      inputs.forEach((input, index) => {
        const actual = getFeetForRibbon(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});
