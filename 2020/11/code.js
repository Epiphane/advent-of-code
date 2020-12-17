import fs from "fs";
import { Map } from "../../map.js";

const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let lines = raw.split("\n").map((line) => line.trim());

let map;

function step(isPart1) {
  let nextMap = new Map("L");
  let changed = false;
  map.forEach((val, x, y) => {
    let occupied = [-1, 0, 1].reduce(
      (prev, di) =>
        prev +
        [-1, 0, 1].reduce((prev, dj) => {
          if (di === 0 && dj === 0) return prev;

          if (isPart1) {
            return prev + (map.get(x + di, y + dj) === "#" ? 1 : 0);
          } else {
            for (let d = 1; map.has(x + d * di, y + d * dj); d++) {
              let v = map.get(x + d * di, y + d * dj);
              if (v === "L") return prev;
              if (v === "#") return prev + 1;
            }
            return prev;
          }
        }, 0),
      0
    );

    const needed = isPart1 ? 4 : 5;
    if (val === "L" && occupied === 0) {
      nextMap.set(x, y, "#");
      changed = true;
    } else if (val === "#" && occupied >= needed) {
      nextMap.set(x, y, "L");
      changed = true;
    } else {
      nextMap.set(x, y, val);
    }
  });

  map = nextMap;
  return changed;
}

// Part 1
map = new Map("L");
lines.forEach((line, y) => {
  line.split("").forEach((val, x) => {
    map.set(x, y, val);
  });
});
while (step(true));
print(`Part 1: ${map.reduce((prev, v) => prev + (v === "#" ? 1 : 0), 0)}`);

// Part 2
map = new Map("L");
lines.forEach((line, y) => {
  line.split("").forEach((val, x) => {
    map.set(x, y, val);
  });
});
while (step(false));
print(`Part 2: ${map.reduce((prev, v) => prev + (v === "#" ? 1 : 0), 0)}`);
