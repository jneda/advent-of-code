import { expect } from "chai";
import { hash, verify, initialize, getFocusingPower } from ".";
import type { Lens, Boxes } from ".";

describe("hash", () => {
  describe("given a string", () => {
    it("should return the correct number", () => {
      const inputs = [
        "H",
        "HA",
        "HAS",
        "HASH",
        "rn=1",
        "cm-",
        "qp=3",
        "cm=2",
        "qp-",
        "pc=4",
        "ot=9",
        "ab=5",
        "pc-",
        "pc=6",
        "ot=7",
      ];
      const expected = [
        200, 153, 172, 52, 30, 253, 97, 47, 14, 180, 9, 197, 48, 214, 231,
      ];
      inputs.forEach((input, index) => {
        const actual = hash(input);
        expect(actual).to.equal(expected[index]);
      });
    });
  });
});

describe("verify", () => {
  describe("given a valid string", () => {
    it("should return the correct number", () => {
      const input = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";
      const expected = 1320;
      const actual = verify(input);
      expect(actual).to.equal(expected);
    });
  });
});

describe("initialize", () => {
  describe("given a valid input string", () => {
    it("should return the correct map of boxes", () => {
      const inputs = [
        "rn=1",
        "rn=1,cm-",
        "rn=1,cm-,qp=3",
        "rn=1,cm-,qp=3,cm=2",
        "rn=1,cm-,qp=3,cm=2,qp-",
        "rn=1,cm-,qp=3,cm=2,qp-,pc=4",
        "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9",
        "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5",
        "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-",
        "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6",
        "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7",
      ];
      const expected = [
        { 0: [["rn", 1]] },
        { 0: [["rn", 1]] },
        { 0: [["rn", 1]], 1: [["qp", 3]] },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          1: [["qp", 3]],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          3: [["pc", 4]],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          3: [
            ["pc", 4],
            ["ot", 9],
          ],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          3: [
            ["pc", 4],
            ["ot", 9],
            ["ab", 5],
          ],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          3: [
            ["ot", 9],
            ["ab", 5],
          ],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          3: [
            ["ot", 9],
            ["ab", 5],
            ["pc", 6],
          ],
        },
        {
          0: [
            ["rn", 1],
            ["cm", 2],
          ],
          3: [
            ["ot", 7],
            ["ab", 5],
            ["pc", 6],
          ],
        },
      ];

      inputs.forEach((input, index) => {
        const actual = initialize(input);
        const actualRecord: Record<string, [string, number][]> = {};
        actual.forEach((v, k) => (actualRecord[k.toString()] = v));
        for (const [k, v] of Object.entries(expected[index])) {
          expect(actualRecord[k]).to.deep.equal(v);
        }
      });
    });
  });
});

describe("getFocusingPower", () => {
  describe("given a lens boxes map", () => {
    it("should return the correct number", () => {
      const data: Record<number, Lens[]> = {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [
          ["ot", 7],
          ["ab", 5],
          ["pc", 6],
        ],
      };
      const input: Boxes = new Map<number, Lens[]>();
      for (let i = 0; i < 256; i++) {
        if (data[i] !== undefined) input.set(i, data[i]);
        else input.set(i, []);
      }
      const expected = 145;

      const actual = getFocusingPower(input);

      expect(actual).to.equal(expected);
    });
  });
});
