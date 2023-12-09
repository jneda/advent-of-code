import path from "path";
import fs from "fs/promises";

async function readFile(filename: string) {
  const filepath = path.resolve(__dirname, filename);
  let content: string;
  try {
    content = await fs.readFile(filepath, "utf8");
    return content.split("\n");
  } catch (error) {
    console.error(error);
    throw new Error("Could not read file");
  }
}

/**
 * Parses a string entry and returns an object representing an ingredient.
 * @param entry - The string entry to parse.
 * @returns An object representing the ingredient with properties for name, capacity, durability, flavor, texture, and calories.
 * @throws {Error} If the data is invalid and cannot be parsed.
 */
function parseEntry(entry: string) {
  const parsingRegex =
    /^(?<name>\w+): capacity (?<capacity>-?\d+), durability (?<durability>-?\d+), flavor (?<flavor>-?\d+), texture (?<texture>-?\d+), calories (?<calories>-?\d+)$/;
  const match = entry.match(parsingRegex);
  if (!match || !match.groups) throw new Error("Invalid data");

  const ingredient: { [k: string]: string | number } = {};

  // convert all values, except name, into numbers
  for (const [k, v] of Object.entries(match.groups)) {
    let actualV: string | number = v;
    if (k !== "name") actualV = Number.parseInt(v);
    ingredient[k] = actualV;
  }

  return ingredient;
}

async function getIngredients(filename: string) {
  let data: string[];
  try {
    data = await readFile(filename);
    data.pop(); // discard the last line
  } catch (error) {
    throw error;
  }
  return data.map((entry) => parseEntry(entry));
}

type Ingredients = Awaited<ReturnType<typeof getIngredients>>;

/**
 * Calculates the score of a cookie based on the given ingredients and ingredient counts.
 * The score is calculated by multiplying the scores of each property of the ingredients.
 * If a property score is negative, it is treated as 0.
 *
 * @param ingredients - An array of ingredient objects.
 * @param ingredientCounts - An object containing the counts of each ingredient.
 * @returns The score of the cookie.
 */
function scoreCookie(
  ingredients: Ingredients,
  ingredientCounts: { [k: string]: number }
) {
  const properties = Object.keys(ingredients[0]).filter(
    (k) => k !== "name" && k !== "calories"
  );
  const propertyScores: number[] = [];

  for (const prop of properties) {
    let propertyScore = 0;
    for (const ingredient of ingredients) {
      const ingredientScore =
        (ingredient[prop] as number) * ingredientCounts[ingredient.name];
      propertyScore += ingredientScore;
    }
    propertyScores.push(Math.max(0, propertyScore));
  }

  return propertyScores.reduce((a, b) => a * b);
}

// source: https://rosettacode.org/wiki/Combinations_with_repetitions#Imperative

/**
 * Finds the maximum score for a given combination of ingredients.
 *
 * @param n - The length of the combination.
 * @param combination - The current combination of ingredients.
 * @param pos - The starting position for ingredient selection.
 * @param ingredients - The list of available ingredients.
 * @returns The maximum score for the combination.
 */
function findMaxScore(
  n: number,
  combination: string[],
  pos: number,
  ingredients: Ingredients
) {
  let maxScore = 0;

  // we built a sequence of the required length
  if (combination.length == n) {
    // make sure it contains each element from the ingredients array at least once
    const hasAllValues = (arr: any[]) =>
      new Set(arr).size === new Set(ingredients).size;

    if (!hasAllValues(combination)) {
      return 0;
    }

    // process
    const ingredientCounts = getCounts(combination);

    // make sure the calories count is 500
    if (getCalories(ingredients, ingredientCounts) !== 500) {
      return 0;
    }

    const combinationScore = scoreCookie(ingredients, ingredientCounts);
    return combinationScore;
  }

  // use recursion to build all combinations of n ingredients, with repetitions
  for (let i = pos; i < ingredients.length; i++) {
    combination.push(ingredients[i].name as string);
    const score = findMaxScore(n, combination, i, ingredients);
    if (score > maxScore) maxScore = score;
    combination.pop();
  }

  return maxScore;
}

/**
 * Counts the occurrences of each element in the given array.
 *
 * @param arr - The array to count the occurrences from.
 * @returns An object containing the counts of each element.
 */
function getCounts(arr: any[]) {
  const counts: { [k: string]: any } = {};
  for (const elt of arr) {
    if (!counts[elt]) counts[elt] = 0;
    counts[elt] += 1;
  }
  return counts;
}

/**
 * Calculates the total number of calories in a recipe based on the given ingredients and ingredient counts.
 * @param ingredients - An array of ingredient objects.
 * @param ingredientCounts - An object containing the counts of each ingredient.
 * @returns The total number of calories in the recipe.
 */
function getCalories(
  ingredients: Ingredients,
  ingredientCounts: { [k: string]: number }
) {
  return ingredients
    .map(
      (ingredient) =>
        (ingredient.calories as number) * ingredientCounts[ingredient.name]
    )
    .reduce((a, b) => a + b);
}

async function main() {
  let ingredients: Ingredients;
  try {
    ingredients = await getIngredients("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const maxScore = findMaxScore(100, [], 0, ingredients);
  console.log({ maxScore });
}

if (process.env.NODE_ENV !== "test") main();
