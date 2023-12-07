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

function findMaxCount(cards: string, uniqueCards: string[]) {
  let maxCount = -Infinity;
  for (const card of uniqueCards) {
    const cardRegex = new RegExp(`${card}`, "g");
    const matches = cards.match(cardRegex);
    if (!matches) throw new Error("Invalid data");
    if (matches.length > maxCount) maxCount = matches.length;
  }
  return maxCount;
}

export function getHandType(cards: string) {
  const uniqueCards = Array.from(new Set(cards));

  if (uniqueCards.length === 5) return HAND_TYPES.HIGH_CARD;
  if (uniqueCards.length === 4) return HAND_TYPES.ONE_PAIR;
  if (uniqueCards.length === 1) return HAND_TYPES.FIVE_OF_A_KIND;

  const maxCount = findMaxCount(cards, uniqueCards);
  if (uniqueCards.length === 3 && maxCount === 2) return HAND_TYPES.TWO_PAIR;
  if (uniqueCards.length === 3 && maxCount === 3)
    return HAND_TYPES.THREE_OF_A_KIND;
  if (uniqueCards.length === 2 && maxCount === 3) return HAND_TYPES.FULL_HOUSE;
  if (uniqueCards.length === 2 && maxCount === 4)
    return HAND_TYPES.FOUR_OF_A_KIND;
  throw new Error("Invalid data");
}

export function getCardScore(card: string) {
  const faceCards = {
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
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
  const handsSorted = hands.sort((a, b) => {
    const [cardsA] = a;
    const [cardsB] = b;
    return sortFunction(cardsA, cardsB);
  });

  const totalWinnings = handsSorted
    .map(([_card, bid], index) => bid * (index + 1))
    .reduce((a, b) => a + b);

  console.log({ totalWinnings });
}

if (process.env.NODE_ENV !== "test") {
  main();
}
