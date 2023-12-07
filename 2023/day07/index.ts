import path from "path";
import fs from "fs/promises";

export const HAND_TYPES = {
  HIGH_CARD: 0,
  ONE_PAIR: 1,
  TWO_PAIR: 2,
  THREE_OF_A_KIND: 3,
  FULL_HOUSE: 4,
  FOUR_OF_A_KIND: 5,
  FIVE_OF_A_KIND: 6,
};

async function readFile(filename: string) {
  let content: string;
  const filepath = path.resolve(__dirname, filename);
  try {
    content = await fs.readFile(filepath, "utf8");
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not read file");
  }
}

function parseHandData(handData: string): [string, number] {
  const [cards, bid] = handData.split(" ");
  return [cards, Number.parseInt(bid)];
}

export function countCards(cards: string) {
  const cardCounts: { [k: string]: number } = {};

  const uniqueCards = Array.from(new Set(cards));
  for (const card of uniqueCards) {
    const cardRegex = new RegExp(`${card}`, "g");
    const matches = cards.match(cardRegex);

    if (!matches) throw new Error("Invalid data");

    const count = matches.length;

    cardCounts[card] = count;
  }

  if (cardCounts.J && cardCounts.J < 5) {
    const sortedCards = Object.entries(cardCounts)
      .sort((a, b) => a[1] - b[1])
      .map(([k, _v]) => k);
    let done = false;
    while (!done) {
      const mostCounted = sortedCards.pop();
      if (!mostCounted) {
        throw new Error("Unexpected end of array");
      }
      if (mostCounted === "J") continue;
      cardCounts[mostCounted] = cardCounts[mostCounted] + cardCounts.J;
      delete cardCounts.J;
      done = true;
    }
  }

  return cardCounts;
}

export function getHandType(cards: string) {
  const cardCounts = countCards(cards);
  const counts = Object.values(cardCounts);
  const maxCount = Math.max(...counts);

  const getOccurrences = (arr: number[], n: number) =>
    arr.filter((x) => x === n).length;

  if (maxCount === 1) return HAND_TYPES.HIGH_CARD;
  if (maxCount === 4) return HAND_TYPES.FOUR_OF_A_KIND;
  if (maxCount === 5) return HAND_TYPES.FIVE_OF_A_KIND;

  if (maxCount === 2 && getOccurrences(counts, 1) === 3)
    return HAND_TYPES.ONE_PAIR;
  if (maxCount === 2 && getOccurrences(counts, 2) === 2)
    return HAND_TYPES.TWO_PAIR;
  if (maxCount === 3 && getOccurrences(counts, 1) === 2)
    return HAND_TYPES.THREE_OF_A_KIND;
  if (maxCount === 3 && getOccurrences(counts, 2) === 1)
    return HAND_TYPES.FULL_HOUSE;
  throw new Error("Invalid data");
}

export function getCardScore(card: string) {
  const faceCards = {
    T: 10,
    J: 1,
    Q: 11,
    K: 12,
    A: 13,
  };
  const cardToInt = Number.parseInt(card);
  if (isNaN(cardToInt)) {
    if (!Object.keys(faceCards).includes(card)) {
      throw new Error("Invalid data");
    }
    return faceCards[card as keyof typeof faceCards];
  }
  return cardToInt;
}

export function sortFunction(a: string, b: string) {
  const handTypeComparison = getHandType(a) - getHandType(b);
  if (handTypeComparison !== 0) return handTypeComparison;

  for (let i = 0; i < a.length; i++) {
    const cardComparison = getCardScore(a[i]) - getCardScore(b[i]);
    if (cardComparison !== 0) return cardComparison;
  }

  return 0;
}

async function main() {
  let data: string;
  try {
    data = await readFile("input.txt");
  } catch (error) {
    console.error(error);
    return 1;
  }

  const hands = data.split("\n").map((handData) => parseHandData(handData));
  const handsSorted = hands.sort((a, b) => sortFunction(a[0], b[0]));

  const totalWinnings = handsSorted
    .map(([_card, bid], index) => bid * (index + 1))
    .reduce((a, b) => a + b);

  console.log({ totalWinnings });
}

if (process.env.NODE_ENV !== "test") {
  main();
}
