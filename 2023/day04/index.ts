import path from "path";
import { readFile } from "../../lib/files";

export async function getFileContents(filenames: string[]) {
  const filepaths = filenames.map((filename) =>
    path.resolve(__dirname, filename)
  );
  let fileContents: string[][] = [];
  for (const filepath of filepaths) {
    try {
      const fileContent = await readFile(filepath);
      if (!fileContent) {
        throw new Error(`Unable to read file ${filepath}`);
      }
      fileContents.push(fileContent);
    } catch (error) {
      console.error(error);
    }
  }
  return fileContents;
}

export function parseNumbers(s: string) {
  const [_cardIndex, numbersPart] = s.split(/:\s+/);
  const [winningNumbers, ownNumbers] = numbersPart.split(/\s+\|\s+/);

  const stringToNumbersArray = (s: string) =>
    s.split(/\s+/).map((c) => {
      const n = Number.parseInt(c);
      if (isNaN(n)) {
        throw new Error(`Cannot parse character "${c}" into a number.`);
      }
      return n;
    });

  return [
    stringToNumbersArray(winningNumbers),
    stringToNumbersArray(ownNumbers),
  ];
}

export function getScoringNumbersCount(card: string) {
  const [winningNumbers, ownNumbers] = parseNumbers(card);
  const nonWinningNumbers = ownNumbers.filter(
    (n) => !winningNumbers.includes(n)
  );
  let scoringNumbersCount = ownNumbers.length - nonWinningNumbers.length;
  if (scoringNumbersCount <= 0) {
    return 0;
  }
  return scoringNumbersCount;
}

export function getCardScore(card: string) {
  const scoringNumbersCount = getScoringNumbersCount(card);

  return scoringNumbersCount > 0 ? Math.pow(2, scoringNumbersCount - 1) : 0;
}

export function getTotalScore(cards: string[]) {
  return cards.map((card) => getCardScore(card)).reduce((a, b) => a + b);
}
export function processCards(cards: string[]) {
  const cardScores = cards.map((card) => getScoringNumbersCount(card));
  const cardCounts = Array(cardScores.length).fill(1);
  for (let i = 0; i < cardScores.length; i++) {
    for (let j = 0; j < cardScores[i] && i + j + 1 < cardScores.length; j++) {
      cardCounts[i + j + 1] = cardCounts[i + j + 1] + cardCounts[i];
    }
  }
  return cardCounts;
}

async function main() {
  const filenames = ["input.txt"];
  const fileContents = await getFileContents(filenames);
  const [cards] = fileContents;

  const totalScore = getTotalScore(cards);

  console.log(`The total score for these cards is: ${totalScore}.`);

  const processedCards = processCards(cards);
  const totalCardsCount = processedCards.reduce((a, b) => a + b);

  console.log(`The total number of cards is: ${totalCardsCount}`);
}

if (process.env.NODE_ENV !== "test") {
  main();
}
