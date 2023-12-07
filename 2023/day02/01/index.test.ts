import path from "path";
import { expect } from "chai";
import {
  readFile,
  parseId,
  parseSet,
  parseSets,
  gameIsValid,
  parseLine,
  findValidGames,
  calcGamePower,
} from "../../day02/01";

const testFilepath = path.join(__dirname, "input.test.txt");
const testFilepath02 = path.join(__dirname, "input.test.02.txt");

describe("day02/01", () => {
  describe("readFile function", () => {
    it("should return null if file does not exist", async () => {
      const contents = await readFile("does-not-exist.txt");
      expect(contents).to.be.null;
    });

    it("should return an array of strings", async () => {
      const contents = await readFile(testFilepath);
      expect(contents).to.be.an("array");
      expect(contents).to.have.lengthOf(5);
      expect(contents).to.deep.equal([
        "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
        "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
        "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
        "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
        "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
      ]);
    });
  });

  describe("parseId function", () => {
    it("should return null if no id is found", () => {
      const id = parseId("Game:");
      expect(id).to.be.null;
    });

    it("should return the id if found", () => {
      const id = parseId("Game 1:");
      expect(id).to.equal(1);
    });
  });

  describe("parseSet function", () => {
    it("should return an object with the correct counts", () => {
      const set = parseSet("1 red, 2 green, 6 blue");
      expect(set).to.deep.equal({
        blue: 6,
        green: 2,
        red: 1,
      });
    });

    it("should throw an error if an invalid color is found", () => {
      expect(() => parseSet("1 red, 2 green, 6 purple")).to.throw(
        "Invalid color: purple"
      );
    });

    it("should throw an error if an invalid count is found", () => {
      expect(() => parseSet("a red, 2 green, 6 blue, 1")).to.throw(
        "Invalid count: a"
      );
    });
  });

  describe("parseSets function", () => {
    it("should throw an error if an invalid color is found", () => {
      const sets = "3 blue, 4 red; 1 red, 2 green, 6 purple; 2 green";
      expect(() => parseSets(sets)).to.throw("Invalid color: purple");
    });

    it("should return the correct counts", () => {
      const sets = "3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green";
      const counts = parseSets(sets);
      expect(counts).to.deep.equal({
        blue: 6,
        green: 2,
        red: 4,
      });
    });
  });

  describe("gameIsValid function", () => {
    it("should return false if a count is too high", () => {
      const counts = {
        blue: 21,
        green: 2,
        red: 4,
      };
      expect(gameIsValid(counts)).to.be.false;
    });

    it("should return true if all counts are valid", () => {
      const counts = {
        blue: 5,
        green: 2,
        red: 4,
      };
      expect(gameIsValid(counts)).to.be.true;
    });
  });

  describe("parseLine function", () => {
    describe("when the game is valid", () => {
      it("should return the correct game object", () => {
        const line = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green";
        const game = parseLine(line);
        expect(game).to.deep.equal({
          id: 1,
          blue: 6,
          green: 2,
          red: 4,
          isValid: true,
        });
      });
    });

    describe("when the game is invalid", () => {
      it("should return the correct game object", () => {
        const line = "Game 1: 3 blue, 4 red; 1 red, 21 green, 6 blue; 2 green";
        const game = parseLine(line);
        expect(game).to.deep.equal({
          id: 1,
          blue: 6,
          green: 21,
          red: 4,
          isValid: false,
        });
      });
    });

    describe("given test input 02", () => {
      it("should return the correct counts", async () => {
        let inputs: string[] | null = null;
        try {
          inputs = await readFile(testFilepath02);
        } catch (error) {
          console.error(error);
        }
        if (inputs === null) {
          throw new Error("No inputs found");
        }
        const games = inputs.map(parseLine);
        expect(games).to.deep.equal([
          { id: 1, blue: 6, green: 2, red: 4, isValid: true },
          { id: 2, blue: 4, green: 3, red: 1, isValid: true },
          { id: 3, blue: 6, green: 13, red: 20, isValid: false },
          { id: 4, blue: 15, green: 3, red: 14, isValid: false },
          { id: 5, blue: 2, green: 3, red: 6, isValid: true },
        ]);
      });
    });
  });

  describe("findValidGames function", () => {
    it("should return the correct number of valid games", async () => {
      let inputs: string[] | null = null;
      try {
        inputs = await readFile(testFilepath);
      } catch (error) {
        console.error(error);
      }
      if (inputs === null) {
        throw new Error("No inputs found");
      }
      const games = findValidGames(inputs);
      expect(games).to.have.lengthOf(3);
      const ids = games.map((game) => game.id);
      expect(ids).to.deep.equal([1, 2, 5]);
    });
  });

  describe.only("calcGamePower function", () => {
    it("should return the correct power", () => {
      const game = {
        id: 1,
        blue: 6,
        green: 2,
        red: 4,
        isValid: true,
      };
      const power = calcGamePower(game);
      expect(power).to.equal(48);
    });
  });
});
