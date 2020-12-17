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

let map = new Map(false);

let passes = [];
lines.forEach((line, y) => {
  //   if (!line) {
  //     print("No input");
  //     return;
  //   }

  //   line.forEach((val, x) => {
  //     map.set(x, y, val);
  //   });

  //   let match = line.match(/(\d+)([a-zA-Z]+)/);
  //   if (match) {
  //   } else {
  //     print(`ERROR: No match for string '${line}'`);
  //   }

  passes.push(line.split(""));
});

function id(row, col) {
  return row * 8 + col;
}

function seat(pass) {
  let topR = 127;
  let botR = 0;
  let topC = 7;
  let botC = 0;

  pass.slice(0, 7).forEach((l) => {
    if (l === "F") {
      topR = Math.floor((topR + botR) / 2);
    } else {
      botR = Math.floor((topR + botR) / 2) + 1;
    }
  });

  pass.slice(7).forEach((l) => {
    if (l === "R") {
      botC = Math.floor((topC + botC) / 2) + 1;
    } else {
      topC = Math.floor((topC + botC) / 2);
    }
  });

  map.set(topR, topC, "x");
  return id(topR, topC);
}

let best = 0;
passes.forEach((pass) => {
  if (seat(pass) > best) {
    best = seat(pass);
  }
});

let scores = passes.map(seat);

print(map.print());

for (let r = map.min.x; r < map.max.x; r++) {
  for (let c = map.min.y; c < map.max.y; c++) {
    let seat = id(r, c);
    if (!map.has(r, c)) print(seat, map.has(r, c));
  }
}

// print(scores.length);
print(seat("FBFBBFFRLR".split("")));
print(best);
