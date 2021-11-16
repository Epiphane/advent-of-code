import fs from "fs";
import md5 from "../../md5.js";
import { Map } from "../../map.js";
import { MakeGrid, MakeRow } from "../../makegrid.js";
import { permute, gcd, lcm } from "../../utils.js";
import { question } from "readline-sync";

const log = console.log;
const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let lines = raw.split("\n").map((line) => line.trim());

let groups = raw.split(/\r?\n\r?\n/).map((line) =>
  line
    .trim()
    .split("\n")
    .map((line) => line.trim())
);

let map = new Map(".");

let N1 = 5764801;
N1 = 13316116;
let N2 = 13651422;

let val = 1;
function transform(val, N) {
  return (val * N) % 20201227;
}

val = 1;
let i = 0;
while (val !== N1) {
  val = transform(val, 7);
  //   if (hits.indexOf(val) >= 0) {
  //     print(val);
  //     a = 100;
  //   }
  //   hits.push(val);
  i++;
}

val = 1;
let j = 0;
while (val !== N2) {
  val = transform(val, 7);
  //   if (hits.indexOf(val) >= 0) {
  //     print(val);
  //     a = 100;
  //   }
  //   hits.push(val);
  j++;
}

print(i, j);

val = 1;
for (let k = 0; k < i; k++) {
  val = transform(val, N2);
}
print(val);

val = 1;
for (let k = 0; k < j; k++) {
  val = transform(val, N1);
}
print(val);
