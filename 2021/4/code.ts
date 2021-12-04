import * as fs from "fs";
import { Map } from "../../map";

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let asLines = raw.split("\n").map((line) => line.trim());
let asGroups = raw.split(/\r?\n\r?\n/).map((line) =>
  line
    .trim()
    .split("\n")
    .map((line) => line.trim())
);

const numbers = asLines[0].split(",").map((i) => parseInt(i));

const maps = asGroups.slice(1).map((group) => {
  let map = new Map(0);
  group.forEach((line, y) => {
    line
      .split(/\s/)
      .map((i) => parseInt(i))
      .filter((i) => !isNaN(i))
      .forEach((v, x) => map.set(x, y, v));
  });
  return map;
});

function winner(complete) {
  let good = true;
  for (let x = 0; x < 5; x++) {
    good = true;
    for (let y = 0; y < 5; y++) {
      if (!complete.get(x, y)) {
        good = false;
        break;
      }
    }

    if (good) break;
  }

  if (good) {
    return true;
  }

  // cols
  for (let y = 0; y < 5; y++) {
    good = true;
    for (let x = 0; x < 5; x++) {
      if (!complete.get(x, y)) {
        good = false;
        break;
      }
    }
    if (good) break;
  }

  if (good) {
    return true;
  }

  // TY DABBBBRUH
  // good = true;
  // if (
  //   complete.get(0, 0) &&
  //   complete.get(1, 1) &&
  //   complete.get(2, 2) &&
  //   complete.get(3, 3) &&
  //   complete.get(4, 4)
  // ) {
  //   return true;
  // }

  // if (
  //   complete.get(4, 0) &&
  //   complete.get(3, 1) &&
  //   complete.get(2, 2) &&
  //   complete.get(1, 3) &&
  //   complete.get(0, 4)
  // ) {
  //   return true;
  // }
}

function getUnmarked(map: Map<number>, complete: Map<boolean>) {
  return complete.reduce((prev, val, x, y) => {
    if (val) {
      return prev;
    } else {
      return prev + map.get(x, y);
    }
  }, 0);
}

const times = maps.map(() => -1);
const scores = maps.map(() => -1);
maps.forEach((map, i) => {
  const complete = map.map(() => false);
  for (let t = 0; t < numbers.length; t++) {
    map.forEach((val, x, y) => {
      if (val == numbers[t]) {
        complete.set(x, y, true);
      }
    });

    if (winner(complete)) {
      times[i] = t;
      scores[i] = numbers[t] * getUnmarked(map, complete);
      return;
    }
  }
});

console.log("Part 1", scores[times.indexOf(Math.min(...times))]);
console.log("Part 1", scores[times.indexOf(Math.max(...times))]);
