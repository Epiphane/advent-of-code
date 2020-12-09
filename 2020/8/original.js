import fs, { access } from "fs";
import md5 from "../../md5.js";
import { Map } from "../../map.js";
import { MakeGrid, MakeRow } from "../../makegrid.js";
import { permute, gcd, lcm } from "../../utils.js";
import { question } from "readline-sync";
import { kill } from "process";

const log = console.log;
const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let lines = raw.split("\n").map((line) => line.trim());

function isGood(lines) {
  let accm = 0;
  let ip = 0;
  function acc(i) {
    accm += i;
  }

  function jmp(i) {
    ip += i;
  }

  let done = {};

  while (ip < lines.length) {
    if (done[ip]) return { good: false, accm };
    done[ip] = true;
    let p = lines[ip].split(" ");

    ip++;
    if (p[0] === "acc") {
      acc(+p[1]);
    }
    if (p[0] === "jmp") {
      ip--;
      jmp(+p[1]);
    }
  }

  return { good: true, accm };
}

// Part 1
print(isGood(lines).accm);

lines.forEach((_, i) => {
  if (lines[i].indexOf("acc") >= 0) return;
  let { accm, good } = isGood(
    lines.map((l, i_) => {
      if (i !== i_) return l;
      let s = l.split(" ");
      if (s[0] === "jmp") return `nop ${s[1]}`;
      return `jmp ${s[1]}`;
    })
  );
  if (good) {
    // Part 2
    print(`Change line ${i}`);
    print(accm);
  }
});
