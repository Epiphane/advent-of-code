import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
// import { MakeGrid, MakeRow } from '../../makegrid.js';
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

let x = 0;
let y = 0;

const targetX = [206, 250];
const targetY = [-105, -57];

let dx = 0;
let dy = 0;
function step() {
  x += dx;
  y += dy;
}

function test(dx, dy) {
  let x = 0;
  let y = 0;
  let maxY = 0;
  for (let i = 0; i < 5000; i++) {
    x += dx;
    y += dy;
    if (dx !== 0) dx -= Math.sign(dx);
    dy--;

    maxY = Math.max(maxY, y);

    if (x >= 206 && x <= 250 && y >= -105 && y <= -57) {
      return { maxY, i };
    }
  }

  return false;
}

let max = 0;
let count = 0;
let velocities = [];
for (let dx = -500; dx < 500; dx++) {
  for (let dy = -500; dy < 500; dy++) {
    const res = test(dx, dy);
    if (res) {
      console.log(dx, dy, res);
      max = Math.max(max, res.maxY);
      count++;
      velocities.push({
        dx,
        dy,
        res,
      });
    }
  }
}
console.log(max);

console.log(count);
console.log(velocities);
console.log(velocities.length);
