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

let map = new Map(".");

let contains = {};

lines.forEach((line, y) => {
  let match = line.match(/([a-z ]+) bags contain (.+)/);
  if (match) {
    contains[match[1]] = match[2].split(", ").map((thing) => {
      let m = thing.match(/([0-9]+) ([a-z ]+) bag/);
      if (m) {
        return {
          type: m[2],
          num: +m[1],
        };
      }
    });
  } else {
    print(`ERROR: No match for string '${line}'`);
  }
});

// print(contains);

let containedBy = {};

for (let k in contains) {
  contains[k].forEach((obj) => {
    if (!obj) return;
    containedBy[obj.type] = containedBy[obj.type] || [];
    containedBy[obj.type].push(k);
  });
}

let fullList = {};

// print(containedBy);

let valid = ["shiny gold"];
while (valid.length > 0) {
  let color = valid.shift();
  let parents = containedBy[color];
  if (!parents) continue;
  parents.forEach((p) => {
    if (!fullList[p]) {
      fullList[p] = 1;
    }
    valid.push(p);
  });
}

print(fullList);
let r = 0;
for (let k in fullList) {
  r++;
}
print(r);

let tot = -1;
let stack = [{ type: "shiny gold", num: 1 }];

while (stack.length > 0) {
  let { type, num } = stack.shift();
  tot += num;

  contains[type].forEach((obj) => {
    if (!obj) return;
    stack.push({ type: obj.type, num: num * obj.num });
  });
}

print(tot);
