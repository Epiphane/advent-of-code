import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
import { permute, gcd, lcm, makeInt, range } from "../../utils";
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
let asNumberMap = MapFromInput(0, makeInt);

let result = 0;

function step() {
  let newMap = asMap.map((v) => v);
  let moved = false;

  asMap.forEach((v, x, y) => {
    if (v === ">") {
      if (asMap.contains(x + 1, y)) {
        if (asMap.get(x + 1, y) === ".") {
          newMap.set(x + 1, y, ">");
          newMap.set(x, y, ".");
          moved = true;
        }
      } else {
        if (asMap.get(0, y) === ".") {
          newMap.set(0, y, ">");
          newMap.set(x, y, ".");
          moved = true;
        }
      }
    }
  });
  asMap = newMap;

  newMap = asMap.map((v) => v);
  asMap.forEach((v, x, y) => {
    if (v === "v") {
      if (asMap.contains(x, y + 1)) {
        if (asMap.get(x, y + 1) === ".") {
          newMap.set(x, y + 1, "v");
          newMap.set(x, y, ".");
          moved = true;
        }
      } else {
        if (asMap.get(x, 0) === ".") {
          newMap.set(x, 0, "v");
          newMap.set(x, y, ".");
          moved = true;
        }
      }
    }
  });

  asMap = newMap;
  return moved;
}

console.log(asMap.print());
let steps = 0;
while (true) {
  steps++;
  if (!step()) {
    break;
  }

  //   break;
}

console.log();
console.log(asMap.print());

console.log(steps);
