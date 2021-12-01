import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from "../../utils";
import { question } from "readline-sync";
const md5 = require("../../md5");
const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let asLines = raw.split("\n").map((line) => line.trim());
let asNumbers = raw.split("\n").map((line) => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map((line) =>
  line
    .trim()
    .split("\n")
    .map((line) => line.trim())
);
let asMap = MapFromInput(".");
let asNumberMap = MapFromInput(0, (s) => parseInt(s));

let sum = 0;
let sum2 = 0;
let rows = asLines.map((line) =>
  line
    .split(/\s/)
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n))
);
rows.forEach((row) => {
  let min = 10000;
  let max = 0;
  let done = false;

  row.forEach((n) => {
    if (n > max) max = n;
    if (n < min) min = n;
  });
  sum += max - min;

  row.forEach((n) => {
    if (done) {
      return;
    }

    row.forEach((n2) => {
      if (done || n >= n2) {
        return;
      }

      if (n2 % n === 0) {
        sum2 += n2 / n;
        done = true;
      }
    });
  });
});
print(`Part 1: ${sum}`);
print(`Part 2: ${sum2}`);

// Haha clever solution I'm suuuuuch a cool dude
print(
  `Part 1: ${rows.reduce(
    (prev, row) => prev + Math.max(...row) - Math.min(...row),
    0
  )}`
);
print(
  `Part 2: ${rows.reduce((prev, row) => {
    for (let i = 0; i < row.length; i++) {
      for (let j = 0; j < row.length; j++) {
        if (row[i] >= row[j] || row[j] % row[i] !== 0) {
          continue;
        }
        return prev + row[j] / row[i];
      }
    }
  }, 0)}`
);
