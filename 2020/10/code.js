import fs from "fs";
const print = console.log;

let file = process.argv[2] || "input";
let input = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim()
  .split("\n")
  .map((line) => +line.trim())
  .sort((a, b) => a - b);

input.unshift(0);
input.push(Math.max(...input) + 3);

let diffs = input.reduce(
  (prev, value) => {
    prev[value - prev[0]]++;
    prev[0] = value;
    return prev;
  },
  [0, 0, 0, 0]
);

print(`Part 1: ${diffs[1] * diffs[3]}`);

let cache = {};
function combinations(voltage) {
  let i = input.indexOf(voltage);

  // Invalid
  if (i < 0) return 0;

  // Complete
  if (voltage === input[input.length - 1]) return 1;

  // Cached
  if (!cache[voltage]) {
    cache[voltage] = [1, 2, 3].reduce(
      (prev, diff) => prev + combinations(voltage + diff),
      0
    );
  }

  return cache[voltage];
}

print(`Part 2: ${combinations(0)}`);
