import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from "../../utils";
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
let asNumberMap = MapFromInput(0, (s) => parseInt(s));

let gamma = "";
let epsilon = "";
let totalZero = [];
let totalOne = [];
asLines.forEach((line) => {
  line.split("").forEach((val, i) => {
    totalZero[i] = totalZero[i] || 0;
    totalOne[i] = totalOne[i] || 0;
    if (val === "1") {
      totalOne[i]++;
    } else {
      totalZero[i]++;
    }
  });
});

totalOne.forEach((v, i) => {
  gamma += v >= totalZero[i] ? "1" : "0";
  epsilon += v >= totalZero[i] ? "0" : "1";
});

console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));

let oxygen = 0;
let co2 = 0;

let copy = [...asLines];
let copy2 = [...asLines];

for (let i = 0; i < asLines[0].length; i++) {
  if (copy.length > 1) {
    let totalZero = [];
    let totalOne = [];
    copy.forEach((line) => {
      line.split("").forEach((val, i) => {
        totalZero[i] = totalZero[i] || 0;
        totalOne[i] = totalOne[i] || 0;
        if (val === "1") {
          totalOne[i]++;
        } else {
          totalZero[i]++;
        }
      });
    });

    copy = copy.filter((val) => {
      if (totalOne[i] >= totalZero[i]) {
        return val[i] === "1";
      } else {
        return val[i] === "0";
      }
    });
    console.log(i, copy, totalOne[i] >= totalZero[i]);
  }

  if (copy2.length > 1) {
    let totalZero = [];
    let totalOne = [];
    copy2.forEach((line) => {
      line.split("").forEach((val, i) => {
        totalZero[i] = totalZero[i] || 0;
        totalOne[i] = totalOne[i] || 0;
        if (val === "1") {
          totalOne[i]++;
        } else {
          totalZero[i]++;
        }
      });
    });
    copy2 = copy2.filter((val) => {
      if (totalOne[i] >= totalZero[i]) {
        return val[i] === "0";
      } else {
        return val[i] === "1";
      }
    });
  }
}
console.log(copy, copy2);
console.log(parseInt(copy[0], 2) * parseInt(copy2[0], 2));
