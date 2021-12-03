import * as fs from "fs";

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let asLines = raw.split("\n").map((line) => line.trim());

console.log(
  `Part 1:`,
  asLines.reduce((prev, line) => {
    let exists = {};
    let score = 1;
    line.split(" ").forEach((word) => {
      if (exists[word]) {
        score = 0;
      }
      exists[word] = true;
    });
    return prev + score;
  }, 0)
);
console.log(
  `Part 2:`,
  asLines.reduce((prev, line) => {
    let exists = {};
    let score = 1;
    line.split(" ").forEach((word) => {
      word = word.split("").sort().join("");
      if (exists[word]) {
        score = 0;
      }
      exists[word] = true;
    });
    return prev + score;
  }, 0)
);
