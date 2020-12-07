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
let input = lines;

let map = new Map(".");

// lines.forEach((line, y) => {
//     if (!line) {
//         print('No input');
//         return;
//     }

//     line.forEach((val, x) => {
//         map.set(x, y, val);
//     })

//     let match = line.match(/([0-9]+)([a-z]+)/);
//     if (match) {

//     }
//     else {
//         print(`ERROR: No match for string '${line}'`);
//     }
// });

// let N;
// if (lines.length === 1) {
//     N = +lines[0];
// }

let scores = [];
let current = {};
let count = 0;
let record;
lines.forEach((line) => {
  if (!line) {
    let s = 0;
    for (let k in current) {
      if (current[k] === count) {
        // print(k);
        s++;
      }
    }
    scores.push(s);
    current = {};
    count = 0;
    // print(current, count);
    return;
  }

  count++;
  line.split("").forEach((l) => (current[l] = (current[l] || 0) + 1));
});

let s = 0;
print(current, count);
for (let k in current) {
  if (current[k] === count) {
    s++;
  }
}
print(s);
scores.push(s);

print(scores);

print(scores.reduce((prev, i) => i + prev, 0));
