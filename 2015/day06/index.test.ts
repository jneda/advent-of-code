import { expect } from "chai";
import {
  Light,
  Light_v2,
  Instructions,
  makeLight,
  makeLight_v2,
  parseInstruction,
  parseCoordinates,
  getCoordinatesRange,
  makeLightGrid,
} from ".";

describe("Light", () => {
  describe("makeLight", () => {
    it("should return an object of type Light", () => {
      const light = makeLight();
      const expectedProperties = [
        { name: "on", type: "boolean", value: false },
        { name: "turnOn", type: "function" },
        { name: "turnOff", type: "function" },
        { name: "toggle", type: "function" },
      ];
      expectedProperties.forEach((prop) => {
        expect(light).to.have.property(prop.name);
        const lightProp = light[prop.name as keyof Light];
        expect(lightProp).to.be.a(prop.type);
        if (prop.value) {
          expect(lightProp).to.equal(prop.value);
        }
      });
    });
  });

  describe("instance of Light", () => {
    let light: Light;

    before(() => {
      light = makeLight();
    });

    describe("from its initial state", () => {
      it("its on property should be false", () => {
        expect(light.on).to.be.false;
      });

      it("its on property should stay false when its turnOff method is invoked", () => {
        light.turnOff();
        expect(light.on).to.be.false;
      });

      it("its on property should become true when its turnOn method is invoked", () => {
        light.turnOn();
        expect(light.on).to.be.true;
      });

      it("its on property should stay true when its turnOn method is invoked", () => {
        light.turnOn();
        expect(light.on).to.be.true;
      });

      it("its on property should become false when its turnOff method is invoked", () => {
        light.turnOff();
        expect(light.on).to.be.false;
      });

      it("its on property should become true when its toggle method is invoked", () => {
        light.toggle();
        expect(light.on).to.be.true;
      });

      it("its on property should become false when its toggle method is invoked", () => {
        light.toggle();
        expect(light.on).to.be.false;
      });
    });
  });
});

describe("Light_v2", () => {
  describe("makeLight", () => {
    it("should return an object of type Light_v2", () => {
      const light = makeLight_v2();
      const expectedProperties = [
        { name: "brightness", type: "number", value: 0 },
        { name: "turnOn", type: "function" },
        { name: "turnOff", type: "function" },
        { name: "toggle", type: "function" },
      ];
      expectedProperties.forEach((prop) => {
        expect(light).to.have.property(prop.name);
        const lightProp = light[prop.name as keyof Light_v2];
        expect(lightProp).to.be.a(prop.type);
        if (prop.value) {
          expect(lightProp).to.equal(prop.value);
        }
      });
    });
  });

  describe("instance of Light", () => {
    let light: Light_v2;

    before(() => {
      light = makeLight_v2();
    });

    describe("from its initial state", () => {
      it("its brightness property should be 0", () => {
        expect(light.brightness).to.equal(0);
      });

      it("its brightness property should stay 0 when its turnOff method is invoked", () => {
        light.turnOff();
        expect(light.brightness).to.equal(0);
      });

      it("its brightness property should become 1 when its turnOn method is invoked", () => {
        light.turnOn();
        expect(light.brightness).to.equal(1);
      });

      it("its brightness property should increment by 1 when its turnOn method is invoked", () => {
        light.turnOn();
        expect(light.brightness).to.equal(2);
      });

      it("its brightness property should decrement by 1 when its turnOff method is invoked", () => {
        light.turnOff();
        expect(light.brightness).to.equal(1);
      });

      it("its brightness property should increment by 2 when its toggle method is invoked", () => {
        light.toggle();
        expect(light.brightness).to.equal(3);
      });
    });
  });
});

describe("parseIntruction", () => {
  const inputs = [
    "turn on 0,0 through 999,999",
    "toggle 0,0 through 999,0",
    "turn off 499,499 through 500,500",
  ];

  describe("given a valid string", () => {
    it("should return an instruction and a pair of coordinates", () => {
      const expected = [
        [Instructions.TURN_ON, "0,0", "999,999"],
        [Instructions.TOGGLE, "0,0", "999,0"],
        [Instructions.TURN_OFF, "499,499", "500,500"],
      ];
      inputs.forEach((input, index) => {
        const actual = parseInstruction(input);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("parseCoordinates", () => {
  const inputs = ["0,0", "2,2", "999,999", "999,0", "499,499", "500,500"];

  describe("given a valid coordinates string", () => {
    it("should return an array of the correct numbers", () => {
      const expected = [
        [0, 0],
        [2, 2],
        [999, 999],
        [999, 0],
        [499, 499],
        [500, 500],
      ];
      inputs.forEach((input, index) => {
        const actual = parseCoordinates(input);
        expect(actual).to.deep.equal(expected[index]);
      });
    });
  });
});

describe("getCoordinatesRange", () => {
  const inputs = [
    ["0,0", "2,2"],
    ["0,0", "999,999"],
    ["0,0", "999,0"],
    ["499,499", "500,500"],
  ];

  describe("given a pair of valid coordinates strings", () => {
    it("should return an array of coordinates strings", function (done) {
      // this.timeout(0);

      inputs.forEach((input) => {
        const actual = getCoordinatesRange(input[0], input[1]);
        expect(actual).to.be.an("array");
        expect(actual.length).to.be.greaterThan(0);

        /* (actual as unknown as any[]).forEach((elt) => {
          expect(elt).to.be.a("string");
          const validationRegex = /(\d+,\d+)/g;
          expect(elt.match(validationRegex)).to.exist;
        }); */
      });
      done();
    });

    it("should return an array with the correct number of coordinates strings", function (done) {
      // this.timeout(0);

      const expected = [9, 1000 * 1000, 1000, 4];
      inputs.forEach((input, index) => {
        const [topleft, bottomright] = input;
        const actual = getCoordinatesRange(topleft, bottomright);
        expect(actual.length).to.equal(expected[index]);
      });

      done();
    });
  });
});

describe("makeLightGrid", () => {
  describe("with Light", () => {
    describe("given a size", () => {
      it("should return the correct grid of Lights", () => {
        const size = 3;
        const lightGrid = makeLightGrid(size, makeLight);
        // check LightGrid properties
        expect(lightGrid).to.have.property("map");
        expect(lightGrid.map.size).to.equal(9);
        expect(lightGrid).to.have.property("update");
        expect(lightGrid.update).to.be.a("function");
        // check Light properties
        const lights = Array.from(lightGrid.map.values());
        const light = lights[0];
        const expectedProperties = [
          { name: "on", type: "boolean", value: false },
          { name: "turnOn", type: "function" },
          { name: "turnOff", type: "function" },
          { name: "toggle", type: "function" },
        ];
        expectedProperties.forEach((prop) => {
          expect(light).to.have.property(prop.name);
          const lightProp = light[prop.name as keyof Light];
          expect(lightProp).to.be.a(prop.type);
          if (prop.value) {
            expect(lightProp).to.equal(prop.value);
          }
        });
      });
    });

    describe("given an instruction and a coordinates range", () => {
      it("should be able to update its lights map correctly", () => {
        const inputs = [
          {
            gridSize: 2,
            instructions: ["turnOn", "0,0", "0,0"],
            testedValues: [["0,0", true]],
            expectedLightsOnCount: 1,
            expectedLightsOffCount: 3,
          },
          {
            gridSize: 2,
            instructions: ["turnOn", "1,1", "1,1"],
            testedValues: [["0,0", false]],
            expectedLightsOnCount: 1,
            expectedLightsOffCount: 3,
          },
          {
            gridSize: 2,
            instructions: ["turnOn", "0,0", "1,1"],
            testedValues: [["0,0", true]],
            expectedLightsOnCount: 4,
            expectedLightsOffCount: 0,
          },
          {
            gridSize: 3,
            instructions: ["toggle", "0,0", "2,2"],
            testedValues: [["0,0", true]],
            expectedLightsOnCount: 9,
            expectedLightsOffCount: 0,
          },
          {
            gridSize: 3,
            instructions: ["turnOff", "0,0", "2,2"],
            testedValues: [["0,0", false]],
            expectedLightsOnCount: 0,
            expectedLightsOffCount: 9,
          },
          {
            gridSize: 3,
            instructions: ["toggle", "1,1", "2,2"],
            testedValues: [["0,0", false]],
            expectedLightsOnCount: 4,
            expectedLightsOffCount: 5,
          },
          {
            gridSize: 3,
            instructions: ["toggle", "1,1", "1,1"],
            testedValues: [["0,0", false]],
            expectedLightsOnCount: 1,
            expectedLightsOffCount: 8,
          },
        ];

        inputs.forEach(
          ({
            gridSize,
            instructions,
            testedValues,
            expectedLightsOnCount,
            expectedLightsOffCount,
          }) => {
            const lightGrid = makeLightGrid(gridSize, makeLight);

            const [instruction, topleft, bottomright] = instructions;
            lightGrid.update(instruction, topleft, bottomright);

            testedValues.forEach((test) => {
              const [coords, expected] = test;
              expected
                ? expect(lightGrid.map.get(coords).on).to.be.true
                : expect(lightGrid.map.get(coords).on).to.be.false;
            });

            const lightOnValues = Array.from(lightGrid.map.values()).map(
              (light) => light.on
            );
            const lightsOnCount = lightOnValues.filter((v) => v === true);
            const lightsOffCount = lightOnValues.filter((v) => v !== true);
            expect(lightsOnCount.length).to.equal(expectedLightsOnCount);
            expect(lightsOffCount.length).to.equal(expectedLightsOffCount);
          }
        );
      });
    });
  });

  describe("with Light_v2", () => {
    describe("given a size", () => {
      it("should return the correct grid of Lights", () => {
        const size = 3;
        const lightGrid = makeLightGrid(size, makeLight_v2);
        // check LightGrid properties
        expect(lightGrid).to.have.property("map");
        expect(lightGrid.map.size).to.equal(9);
        expect(lightGrid).to.have.property("update");
        expect(lightGrid.update).to.be.a("function");
        // check Light properties
        const lights = Array.from(lightGrid.map.values());
        const light = lights[0];
        const expectedProperties = [
          { name: "brightness", type: "number", value: 0 },
          { name: "turnOn", type: "function" },
          { name: "turnOff", type: "function" },
          { name: "toggle", type: "function" },
        ];
        expectedProperties.forEach((prop) => {
          expect(light).to.have.property(prop.name);
          const lightProp = light[prop.name as keyof Light_v2];
          expect(lightProp).to.be.a(prop.type);
          if (prop.value) {
            expect(lightProp).to.equal(prop.value);
          }
        });
      });
    });

    describe("given an instruction and a coordinates range", () => {
      it("should be able to update its lights map correctly", () => {
        const inputs = [
          {
            gridSize: 2,
            instructions: ["turnOn", "0,0", "0,0"],
            testedValues: [["0,0", 1]],
            expectedTotalBrightness: 1,
          },
          {
            gridSize: 2,
            instructions: ["turnOn", "1,1", "1,1"],
            testedValues: [["0,0", 0]],
            expectedLightsOnCount: 1,
            expectedTotalBrightness: 1,
          },
          {
            gridSize: 2,
            instructions: ["turnOn", "0,0", "1,1"],
            testedValues: [["0,0", 1]],
            expectedTotalBrightness: 4,
          },
          {
            gridSize: 3,
            instructions: ["toggle", "0,0", "2,2"],
            testedValues: [["0,0", 2]],
            expectedTotalBrightness: 18,
          },
          {
            gridSize: 3,
            instructions: ["turnOff", "0,0", "2,2"],
            testedValues: [["0,0", 0]],
            expectedTotalBrightness: 0,
          },
          {
            gridSize: 3,
            instructions: ["toggle", "1,1", "2,2"],
            testedValues: [["0,0", 0]],
            expectedTotalBrightness: 8,
          },
          {
            gridSize: 3,
            instructions: ["toggle", "1,1", "1,1"],
            testedValues: [["0,0", 0]],
            expectedTotalBrightness: 2,
          },
        ];

        inputs.forEach(
          ({
            gridSize,
            instructions,
            testedValues,
            expectedTotalBrightness,
          }) => {
            const lightGrid = makeLightGrid(gridSize, makeLight_v2);

            const [instruction, topleft, bottomright] = instructions;
            lightGrid.update(instruction, topleft, bottomright);

            testedValues.forEach((test) => {
              const [coords, expected] = test;
              expect(lightGrid.map.get(coords).brightness).to.equal(expected);
            });

            const totalBrightnessSum = Array.from(lightGrid.map.values())
              .map((light) => light.brightness)
              .reduce((a, b) => a + b);
            expect(totalBrightnessSum).to.equal(expectedTotalBrightness);
          }
        );
      });
    });
  });
});
