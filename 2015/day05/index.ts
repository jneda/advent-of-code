import path from "path";
import { readFile } from "../../lib/files";

export function countVowels(s: string): number {
  const vowelsRegex = /[aeiou]/g;
  const vowelMatches = s.match(vowelsRegex) || [];
  return vowelMatches.length;
}

export function findTwoInARow(s: string) {
  const twoInARowRegex = /(.)\1+/g;
  const twoInARowMatches = s.match(twoInARowRegex) || [];
  return twoInARowMatches.length > 0;
}

export function findForbiddenStrings(s: string) {
  const forbiddenRegex = /ab|cd|pq|xy/g;
  const forbiddenMatches = s.match(forbiddenRegex) || [];
  return forbiddenMatches.length > 0;
}

export function findRepeatPairs(s: string) {
  const findRepeatPairsRegex = /((\w)(\w)).*(\1)+/g;
  const repeatPairsMatches = s.match(findRepeatPairsRegex) || [];
  return repeatPairsMatches.length > 0;
}

export function findUwU(s: string) {
  const findUwURegex = /(\w).(\1)/g;
  const UwUMatches = s.match(findUwURegex) || [];
  return UwUMatches.length > 0;
}

export function isStringNice(s: string) {
  if (findForbiddenStrings(s)) {
    return false;
  }
  if (findTwoInARow(s) && countVowels(s) > 2) {
    return true;
  }
  return false;
}

export function isStringNice_v2(s: string) {
  return findRepeatPairs(s) && findUwU(s);
}

async function main() {
  const filePath = path.resolve(__dirname, "./input.txt");
  let input;
  try {
    input = await readFile(filePath);
  } catch (error) {
    return console.error(error);
  }
  if (!input) {
    return console.error("Unable to read file.");
  }
  
  const niceCount = input
    .map((s) => isStringNice(s))
    .filter((elt) => elt === true).length;

  console.log(`There were ${niceCount} nice strings.`);

  const niceCount_v2 = input
    .map((s) => isStringNice_v2(s))
    .filter((elt) => elt === true).length;

  console.log(
    `There were ${niceCount_v2} nice strings according to the new rules.`
  );
}

if (process.env.NODE_ENV !== "test") {
  main();
}
