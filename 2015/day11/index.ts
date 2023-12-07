const A = "a".charCodeAt(0);
const LIMIT = 25;

const charToIndex = (c: string) => c.charCodeAt(0) - A;

const I = charToIndex("i");
const O = charToIndex("o");
const L = charToIndex("l");

const isForbidden = (i: number) => i === I || i === O || i === L;

const indexToChar = (i: number) => String.fromCharCode(i + A);

export function incrementString(s: string) {
  const charCodes = s.split("").map((c) => charToIndex(c));

  // make a pass and increment forbidden chars if they exist
  charCodes.forEach((c, i) => {
    if (isForbidden(c)) {
      charCodes[i] = c + 1;
      // reset all following digits to a
      for (let j = i + 1; j < charCodes.length; j++) {
        charCodes[j] = 0;
      }
    }
  });

  // increment last digit
  let last = charCodes.pop();
  if (last === undefined) {
    throw new Error("Invalid data");
  }

  last += 1;

  // handle forbidden i, o, and l
  if (isForbidden(last)) {
    last += 1;
  }

  // handle wrapping over z
  const tail: number[] = [];
  while (last > LIMIT) {
    last = 0;
    tail.unshift(last);
    last = charCodes.pop();
    if (last === undefined) {
      last = 0;
    } else {
      last += 1;
    }
  }

  charCodes.push(last, ...tail);
  const incremented = charCodes.map((i) => indexToChar(i)).join("");
  return incremented;
}

export function hasSuite(s: string) {
  if (s.length < 3) return false;
  // work on slices
  // figure out if the char codes increment
  for (let i = 0; i <= s.length - 3; i++) {
    const slice = s
      .slice(i, i + 3)
      .split("")
      .map((c) => charToIndex(c));
    const [a, b, c] = slice;
    if (b - a === 1 && c - b === 1) {
      return true;
    }
  }
  return false;
}

export function hasTwoPairs(s: string) {
  const pairRegex = /(?:([a-hj-km-np-z])\1)/g;
  const matches = s.match(pairRegex);
  if (!matches) return false;
  if (matches.length >= 2) return true;
  return false;
}

export function hasForbiddenChars(s: string) {
  const forbiddenRegex = /i|o|l/;
  const matches = s.match(forbiddenRegex);
  if (matches) return true;
  return false;
}

export function incrementPassword(password: string) {
  const isValid = (password: string) =>
    hasSuite(password) && hasTwoPairs(password) && !hasForbiddenChars(password);
  do {
    password = incrementString(password);
  } while (!isValid(password));

  return password;
}

function main() {
  const input = "hxbxwxba";
  const nextPassword = incrementPassword(input);
  console.log({ nextPassword });
  const nextNextPassword = incrementPassword(nextPassword);
  console.log({ nextNextPassword });
}

if (process.env.NODE_ENV != "test") {
  main();
}
