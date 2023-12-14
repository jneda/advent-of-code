import path from "path";
import { readFile } from "../../lib/files";

function tiltNorth(data: string[], cache: Map<string, string[]>) {
  const lookup = cache.get(data.join(""));
  if (lookup) return lookup;

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

  cache.set(data.join(""), result);
  return result;
}

function tiltWest(data: string[], cache: Map<string, string[]>) {
  const lookup = cache.get(data.join(""));
  if (lookup) return lookup;

  const rows: string[] = [];
  for (let r = 0; r < data.length; r++) {
    let row: string[] = [];
    let min = 0;
    for (let c = 0; c < data[0].length; c++) {
      if (data[r][c] === "O") {
        if (min === c) {
          min = c + 1;
          row[c] = "O";
        } else {
          row[min] = "O";
          row[c] = ".";
          min++;
        }
      } else if (data[r][c] === "#") {
        min = c + 1;
        row[c] = "#";
      } else row[c] = ".";
    }
    rows.push(row.join(""));
  }

  cache.set(data.join(""), rows);
  return rows;
}

function tiltSouth(data: string[], cache: Map<string, string[]>) {
  const lookup = cache.get(data.join(""));
  if (lookup) return lookup;

  const cols: string[][] = [];
  for (let c = 0; c < data[0].length; c++) {
    let col: string[] = [];
    let max = data.length - 1;
    for (let r = data.length - 1; r >= 0; r--) {
      if (data[r][c] === "O") {
        if (max === r) {
          max = r - 1;
          col[r] = "O";
        } else {
          col[max] = "O";
          col[r] = ".";
          max--;
        }
      } else if (data[r][c] === "#") {
        max = r - 1;
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

  cache.set(data.join(""), result);
  return result;
}

function tiltEast(data: string[], cache: Map<string, string[]>) {
  const lookup = cache.get(data.join(""));
  if (lookup) return lookup;

  const rows: string[] = [];
  for (let r = 0; r < data.length; r++) {
    let row: string[] = [];
    let max = data[0].length - 1;
    for (let c = data[0].length - 1; c >= 0; c--) {
      if (data[r][c] === "O") {
        if (max === c) {
          max = c - 1;
          row[c] = "O";
        } else {
          row[max] = "O";
          row[c] = ".";
          max--;
        }
      } else if (data[r][c] === "#") {
        max = c - 1;
        row[c] = "#";
      } else row[c] = ".";
    }
    rows.push(row.join(""));
  }

  cache.set(data.join(""), rows);
  return rows;
}

function doCycle(data: string[]) {
  const northCache = new Map<string, string[]>();
  const westCache = new Map<string, string[]>();
  const southCache = new Map<string, string[]>();
  const eastCache = new Map<string, string[]>();

  let result = tiltNorth(data, northCache);
  result = tiltWest(result, westCache);
  result = tiltSouth(result, southCache);
  result = tiltEast(result, eastCache);
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

  let result: string[] = [...data];
  const I = 1 * 1000 * 1000 * 1000;
  const startTime = Date.now();
  console.log("Starting cycles...");
  for (let i = 0; i < I; i++) {
    console.log(
      `Cycle ${(i + 1).toLocaleString()} (${
        (Date.now() - startTime).toLocaleString()
      }ms)`
    );
    result = doCycle(result);
  }

  const total = scoreGrid(result);
  console.log(total);

  return 0;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
