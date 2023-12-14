import path from "path";
import { readFile } from "../../lib/files";

function tiltNorth(data: string[]) {
  const cols: string[][] = [];
  for (let c = 0; c < data[0].length; c++) {
    let col: string[] = [];
    let min = 0;
    for (let r = 0; r < data.length; r++) {
      if (data[r][c] === "O") {
        if (min === r) {
          min = r + 1;
          col[r] = "O";
        } else {
          col[min] = "O";
          col[r] = ".";
          min++;
        }
      } else if (data[r][c] === "#") {
        min = r + 1;
        col[r] = "#";
      } else col[r] = ".";
    }
    cols.push(col);
  }

  const result: string[] = [];
  for (let r = 0; r < data.length; r++) {
    let row = "";
    for (let c = 0; c < data[0].length; c++) {
      row += cols[c][r];
    }
    result.push(row);
  }

  return result;
}

function scoreGrid(grid: string[]) {
  let total = 0;
  grid.forEach((row, i) => {
    total += row.split("").filter((c) => c === "O").length * (grid.length - i);
  });
  return total;
}

async function main() {
  let data: string[] | null;
  try {
    const filepath = path.resolve(__dirname, "input.txt");
    data = await readFile(filepath);
  } catch (error) {
    console.error(error);
    return 1;
  }
  if (!data) {
    console.error("Invalid data.");
    return 1;
  }

  const result = tiltNorth(data);
  const total = scoreGrid(result);
  console.log(total);

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
