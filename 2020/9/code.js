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

let lines = raw
  .split("\n")
  .map((line) => line.trim())
  .map((i) => +i);
let input = lines;

let map = new Map(".");

let NN;
for (let i = 25; i < lines.length; ++i) {
  let N = lines[i];
  let good = true;
  let min = 10000000000000;
  let max = 0;
  for (let j = i - 25; j < i && good; ++j) {
    for (let k = j + 1; k < i && good; ++k) {
      if (N === lines[j] + lines[k]) {
        good = false;
      }
    }
  }

  if (good) {
    NN = N;
    break;
  }
}

let N = NN;
print(N);

let bot = 0;
let top = 0;
let sum = lines[0];
while (true) {
  if (sum < N) {
    top++;
    sum += lines[top];
  }

  if (sum > N) {
    sum -= lines[bot];
    bot++;
  }

  if (sum === N) {
    let min = Math.min(...lines.slice(bot, top + 1));
    let max = Math.max(...lines.slice(bot, top + 1));
    print(max + min);

    break;
  }
}
