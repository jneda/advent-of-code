import { expect } from "chai";
import path from "path";
import { readFile } from "../../lib/files";
import { parseData, buildMap } from ".";
import type { AlmanacMap } from ".";

describe("parseData", () => {
  let rawData: string[] = [];

  before(async () => {
    const filename = "input.test.txt";
    const filepath = path.resolve(__dirname, filename);
    try {
      rawData = (await readFile(filepath)) || [];
      if (rawData.length === 0) {
        throw new Error("rawData is empty");
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

  describe("given raw data", () => {
    it("returns the correct JS object", () => {
      const expected = {
        seeds: [79, 14, 55, 13],

        maps: {
          seedToSoilMap: [
            [50, 98, 2],
            [52, 50, 48],
          ],

          soilToFertilizerMap: [
            [0, 15, 37],
            [37, 52, 2],
            [39, 0, 15],
          ],

          fertilizerToWaterMap: [
            [49, 53, 8],
            [0, 11, 42],
            [42, 0, 7],
            [57, 7, 4],
          ],

          waterToLightMap: [
            [88, 18, 7],
            [18, 25, 70],
          ],

          lightToTemperatureMap: [
            [45, 77, 23],
            [81, 45, 19],
            [68, 64, 13],
          ],

          temperatureToHumidityMap: [
            [0, 69, 1],
            [1, 0, 69],
          ],

          humidityToLocationMap: [
            [60, 56, 37],
            [56, 93, 4],
          ],
        },
      };
      const actual = parseData(rawData);
      expect(actual).to.deep.equal(expected);
    });
  });
});
/* 
describe("buildMap", () => {
  describe("given an array of arrays of numbers", () => {
    it("should return the correct map", () => {
      const input = [
        [50, 98, 2],
        [52, 50, 48],
      ];
      const actualMap = buildMap(input) as AlmanacMap;
      expect(actualMap[42]).to.be.undefined;
      for (let i = 0; i < 2; i++) {
        expect(actualMap[98 + i]).to.be.a("number");
        const actual = actualMap[98 + i];
        const expected = 50 + i;
        expect(actual).to.equal(expected);
      }
      for (let i = 0; i < 2; i++) {
        expect(actualMap[50 + i]).to.be.a("number");
        const actual = actualMap[50 + i];
        const expected = 52 + i;
        expect(actual).to.equal(expected);
      }
      const testCases = [
        { input: 79, expected: 81 },
        { input: 14, expected: 14 },
        { input: 55, expected: 57 },
        { input: 13, expected: 13 },
      ];
      testCases.forEach(({ input, expected }) => {
        const actual = actualMap[input] || input;
        expect(actual).to.equal(expected);
      });
    });
  });
});
 */
