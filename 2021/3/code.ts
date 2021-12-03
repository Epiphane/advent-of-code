import * as fs from "fs";

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();
let input = raw.split("\n").map((line) => line.trim());

function gamma(numbers: string[]) {
  return numbers[0]
    .split("")
    .map((_, i) =>
      numbers.filter((n) => n[i] === "1").length >= numbers.length / 2
        ? "1"
        : "0"
    )
    .join("");
}

function inverse(number: string) {
  return number
    .split("")
    .map((i) => (i === "1" ? "0" : "1"))
    .join("");
}

console.log(
  `Part 1:`,
  parseInt(gamma(input), 2) * parseInt(inverse(gamma(input)), 2)
);

let oxygen = [...input];
for (let i = 0; oxygen.length > 1; i++) {
  const match = gamma(oxygen);
  oxygen = oxygen.filter((num) => num[i] === match[i]);
}

let co2 = [...input];
for (let i = 0; co2.length > 1; i++) {
  const match = inverse(gamma(co2));
  co2 = co2.filter((num) => num[i] === match[i]);
}
console.log(`Part 2:`, parseInt(oxygen[0], 2) * parseInt(co2[0], 2));
