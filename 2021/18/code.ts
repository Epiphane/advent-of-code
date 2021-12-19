import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, makeInt, range } from "../../utils";
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

class SnailNum {
  //   depth?: number;
  value?: number;
  parent?: SnailNum;
  left?: SnailNum;
  right?: SnailNum;

  addRight(num: number) {
    let cursor: SnailNum = this;
    while (cursor.right) {
      cursor = cursor.right;
    }
    cursor.value += num;
  }

  addLeft(num: number) {
    // console.log("addLeft", num);
    let cursor: SnailNum = this;
    while (cursor.left) {
      cursor = cursor.left;
    }
    cursor.value += num;
  }

  explode() {
    console.log(' -> explode', this.toString());
    let cursor = this.parent;
    let me: SnailNum = this;
    while (cursor && cursor.left === me) {
      me = cursor;
      cursor = me.parent;
    }
    if (cursor) {
      // Diiiive
      cursor.left.addRight(this.left.value);
    }

    cursor = this.parent;
    me = this;
    // console.log(cursor, me, cursor.left === me);
    while (cursor && cursor.right === me) {
      //   console.log("cursor", cursor.toString());
      me = cursor;
      cursor = me.parent;
    }
    // console.log(cursor);
    if (cursor) {
      // Diiiive
      cursor.right.addLeft(this.right.value);
    }
    this.left = undefined;
    this.right = undefined;
    this.value = 0;
  }

  split() {
    console.log(' -> split', this.toString());
    this.left = new SnailNum();
    this.left.parent = this;
    this.left.value = Math.floor(this.value / 2);
    this.right = new SnailNum();
    this.right.parent = this;
    this.right.value = Math.ceil(this.value / 2);
    this.value = undefined;
  }

  reduce1() {
    if (
      this.left &&
      this.left.value != undefined &&
      this.right &&
      this.right.value != undefined &&
      this.parent?.parent?.parent?.parent
    ) {
      this.explode();
      return true;
    }
    if (this.left) {
      if (this.left.reduce1()) {
        return true;
      }
    }
    if (this.right) {
      if (this.right.reduce1()) {
        return true;
      }
    }
    return false;
  }

  reduce2() {
    if (this.value && this.value >= 10) {
      this.split();
      return true;
    }
    if (this.left) {
      if (this.left.reduce2()) {
        return true;
      }
    }
    if (this.right) {
      if (this.right.reduce2()) {
        return true;
      }
    }
    return false;
  }

  reduce() {
    if (this.reduce1()) {
      return true;
    }
    if (this.reduce2()) {
      return true;
    }
    return false;
  }

  clone() {
    let result = new SnailNum();
    result.value = this.value;
    if (this.left) {
      result.left = this.left.clone();
      result.left.parent = result;
    }
    if (this.right) {
      result.right = this.right.clone();
      result.right.parent = result;
    }
    return result;
  }

  add(other: SnailNum) {
    let result = new SnailNum();
    result.left = this.clone();
    result.right = other.clone();
    result.left.parent = result;
    result.right.parent = result;
    while (result.reduce()) {
      print(result.toString());
    }
    return result;
  }

  toString_() {
    if (this.value != undefined) {
      return this.value;
    } else {
      //   console.log(this);
      return [this.left.toString_(), this.right.toString_()];
    }
  }

  toString() {
    return JSON.stringify(this.toString_());
  }

  magnitude() {
    return this.value ?? this.left.magnitude() * 3 + this.right.magnitude() * 2;
  }
}

type SN = number | SN[];

function ToSnailNum(sn: SN, depth = 0) {
  let result = new SnailNum();
  //   console.log(sn);
  //   result.depth = depth;
  if (typeof sn === "number") {
    result.value = sn;
  } else {
    result.left = ToSnailNum(sn[0], depth + 1);
    result.left.parent = result;
    result.right = ToSnailNum(sn[1], depth + 1);
    result.right.parent = result;
  }
  return result;
}

console.log(ToSnailNum([1, 1]));

const numbers = [] as SnailNum[];
asLines.forEach((line) => {
  let i = 0;
  let depth = 0;

  let parsed = JSON.parse(line);
  numbers.push(ToSnailNum(parsed));
});

let original = numbers[0].clone();
numbers.forEach((n, i) => {
  if (i === 0) return;
  console.log(`\n---- Adding ${original.toString()} + ${n.toString()} ----`)
  original = original.add(n);
  console.log(`Result: ${original.toString()}`);
});

// print(original.toString());
// print(original.magnitude());

// let result = 0;
// numbers.forEach((n1, i) => {
//   numbers.forEach((n2, j) => {
//     if (i === j) return;
//     const m1 = n1.add(n2);
//     if (m1.magnitude() > result) {
//       result = m1.magnitude();
//       console.log(m1.toString(), result, console.log(n2.add(n1).magnitude()));
//     }
//   });
// });
// console.log(result);
