import path from "path";
import { readFile, writeFile } from "fs/promises";

let log: string[] = [];

async function main() {
  const filepath = path.resolve(__dirname, "input.txt");
  let contents;
  try {
    contents = await readFile(filepath, { encoding: "utf8" });
  } catch (error) {
    console.error(error);
    return 1;
  }
  // console.log(contents);

  const unquote = (s: string) => s.slice(1, -1);

  const unescape = (s: string) => s.replace(/\\\\|\\"/g, "-");

  const unUnicode = (s: string) => s.replace(/\\x[a-f0-9]{2}/g, "-");

  const getMemoryLength = (s: string) => {
    const unquoted = unquote(s);
    const unescaped = unescape(unquoted);
    const unUnicoded = unUnicode(unescaped);
    // log.push(
    //   `${s.length} -> ${unUnicoded.length}\n  ${s} -> ${unquoted} -> ${unescaped} -> ${unUnicoded}`
    // );
    return unUnicoded.length;
  };

  const encodeQuotes = (s: string) => s.replace(/^"|"$/g, '\\"');

  const encodeEscapes = (s: string) => s.replace(/\\\\|\\"/g, "----");

  const encodeUnicode = (s: string) => s.replace(/\\x[a-f0-9]{2}/g, "-----");

  const getEncodedLength = (s: string) => {
    const encodedEscapes = encodeEscapes(s);
    const encodedQuotes = encodeQuotes(encodedEscapes);
    const encodedUnicode = encodeUnicode(encodedQuotes);
    log.push(
      `${s.length} -> ${
        encodedUnicode.length + 2
      }\n  ${s} -> ${encodedEscapes} -> ${encodedQuotes} -> ${encodedUnicode} -> "${encodedUnicode}"`
    );
    // don't forget to add 2 to account for the initial and final quote
    return encodedUnicode.length + 2;
  };

  const inputs = contents.split("\n");
  log = [];

  const totalCodeLength = inputs.map((s) => s.length).reduce((a, b) => a + b);

  // part 1

  const totalMemoryLength = inputs
    .map((s) => getMemoryLength(s))
    .reduce((a, b) => a + b);

  const difference = totalCodeLength - totalMemoryLength;

  // part 2

  const totalEncodedLength = inputs
    .map((s) => getEncodedLength(s))
    .reduce((a, b) => a + b);

  const difference_2 = totalEncodedLength - totalCodeLength;

  // write log
  const logpath = path.resolve(__dirname, "log.txt");
  try {
    await writeFile(logpath, log.join("\n"));
  } catch (error) {
    console.error(error);
    return 1;
  }

  // console.log({ totalCodeLength, totalMemoryLength, difference });
  console.log({ totalEncodedLength, totalCodeLength, difference_2 });
}

if (process.env.NODE_ENV !== "test") {
  main();
}
