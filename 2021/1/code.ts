import * as fs from "fs";
let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let asNumbers = raw.split("\n").map((line) => parseInt(line.trim()));

// I'm very cool and clever
console.log(
  `Part 1: ${asNumbers.reduce(
    (prev, n, i) => prev + (i > 0 && n > asNumbers[i - 1] ? 1 : 0),
    0
  )}`
);

console.log(
  `Part 2: ${asNumbers.reduce(
    (prev, n, i) => prev + (i > 2 && n > asNumbers[i - 3] ? 1 : 0),
    0
  )}`
);

// Original Solution
// let result = 0;
// let sum = asNumbers[0] + asNumbers[1] + asNumbers[2];
// for (let i = 3; i < asNumbers.length; i++) {
//   const num = asNumbers[i];
//   const prev = sum;

//   // const prev = asNumbers[i - 1];
//   // if (num > prev) {
//   //   result++;
//   // }

//   const newsum = sum - asNumbers[i - 3] + asNumbers[i];
//   if (newsum > sum) {
//     result++;
//   }

//   sum = newsum;
// }
// print(result);
