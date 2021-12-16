import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import {
  permute,
  gcd,
  lcm,
  makeInt,
  range,
  addAll,
  multiplyAll,
} from "../../utils";
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
let asNumberMap = MapFromInput(0, makeInt);

let binary = raw
  .trim()
  .split("")
  .map((w) => {
    return parseInt(w, 16).toString(2).padStart(4, "0");
  })
  .join("");

function parseLiteral(i: number) {
  //   while (i % 4 !== 0) {
  //     i++;
  //   }

  let num = "";
  let goagain = true;
  while (goagain) {
    goagain = binary[i] === "1";
    i++;
    num += binary.substr(i, 4);
    i += 4;
  }

  //   while (i % 4 !== 0) {
  //     i++;
  //   }

  console.log(
    `Literal: ${parseInt(num, 2)} next i=${i} => ${binary.substr(i, 25)}`
  );
  return {
    i,
    val: parseInt(num, 2),
  };
}

// binary = "00111000000000000110111101000101001010010001001000000000";

let versions = 0;
function parseOp(type, i: number) {
  const lenTypeId = binary[i++];
  let lenBits, subPacks;
  const subpacks = [];
  if (lenTypeId === "0") {
    lenBits = parseInt(binary.substr(i, 15), 2);
    // console.log(i, `LenBits: ${lenBits} (${binary.substr(i, 15)})`);
    i += 15;
    let dest = i + lenBits;

    let val = 0;
    while (i + 6 < dest) {
      const { i: newI, val: newVal } = parse(i);
      i = newI;
      subpacks.push(newVal);
      //   console.log(i, dest, binary.length);
    }
  } else {
    subPacks = parseInt(binary.substr(i, 11), 2);
    i += 11;
    let val = 0;

    // console.log(`Subpacks: ${subPacks}`);
    for (let t = 0; t < subPacks; t++) {
      const { i: newI, val: newVal } = parse(i);
      i = newI;
      subpacks.push(newVal);
    }
  }

  if (type === 0) {
    return { i, val: subpacks.reduce(addAll, 0) };
  } else if (type === 1) {
    return { i, val: subpacks.reduce(multiplyAll, 1) };
  } else if (type === 2) {
    return { i, val: Math.min(...subpacks) };
  } else if (type === 3) {
    return { i, val: Math.max(...subpacks) };
  } else if (type === 5) {
    return { i, val: subpacks[0] > subpacks[1] ? 1 : 0 };
  } else if (type === 6) {
    return { i, val: subpacks[0] < subpacks[1] ? 1 : 0 };
  } else if (type === 7) {
    return { i, val: subpacks[0] === subpacks[1] ? 1 : 0 };
  }
}

function parse(i: number) {
  if (i + 6 >= binary.length) {
    return { i, val: 0 };
  }

  let version = parseInt(binary.substr(i, 3), 2);
  let type = parseInt(binary.substr(i + 3, 3), 2);

  //   print(version, type);
  print(i, `version`, version, `type`, type);
  versions += version;

  if (type === 4) {
    return parseLiteral(i + 6);
  } else {
    return parseOp(type, i + 6);
  }
}

// print(version, type);

print(binary);
print(binary.length);
print(versions);
print(parse(0));
