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

let blocks = raw
  .split(/\s/)
  .map((n) => parseInt(n))
  .filter((n) => !isNaN(n));

function hash(blocks) {
  return blocks.join();
}

function redist(blocks) {
  const max = blocks.indexOf(Math.max(...blocks));
  let amt = blocks[max];
  blocks[max] = 0;

  let i = max + 1;
  for (; amt > 0; i++) {
    i %= blocks.length;
    blocks[i]++;
    amt--;
  }
}

let steps = 0;
const seen = {};
let origin;
while (!seen[hash(blocks)]) {
  seen[hash(blocks)] = true;
  redist(blocks);

  steps++;
  origin = hash(blocks);
}
console.log(`Part 1:`, steps);

steps = 0;
do {
  redist(blocks);
  steps++;
} while (hash(blocks) !== origin);

console.log(`Part 2:`, steps);
