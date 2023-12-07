import { createHash } from "crypto";

export function MD5Hash(input: string) {
  const hash = createHash("MD5");
  hash.update(input);
  return hash.digest("hex");
}

export function hashNumberWithSecret(secret: string, n: number) {
  const input = secret.concat(n.toString());
  return MD5Hash(input);
}

export function lookForPattern(pattern: string) {
  const SECRET = "bgvyzdsv";
  let i = 1;
  let done = false;
  while (!done) {
    const hash = hashNumberWithSecret(SECRET, i);
    if (hash.startsWith(pattern)) {
      done = true;
      return i;
    }
    i++;
  }
}

function main() {
  let result = lookForPattern("00000");
  console.log("The number we are looking for is:", result);
  result = lookForPattern("000000");
  console.log("The number we are looking for is:", result);
}

if (process.env.NODE_ENV !== "test") {
  main();
}
