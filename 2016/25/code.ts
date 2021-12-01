import * as fs from "fs";
import { Map, MapFromInput } from "../../map";
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from "../../utils";
import { question } from "readline-sync";
import { Interpreter } from "../../interpreter";
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

class MyInterpreter extends Interpreter {
  clock = 1;
  output = [];

  get(r) {
    if (typeof r === "number") {
      return r;
    }
    return super.get(r);
  }

  cpy(x, y) {
    if (typeof y === "number") return;
    this.set(y, this.get(x));
  }

  inc(x) {
    if (typeof x === "number") return;
    this.set(x, this.get(x) + 1);
  }

  dec(x) {
    if (typeof x === "number") return;
    this.set(x, this.get(x) - 1);
  }

  jnz(x, y) {
    if (this.get(x) !== 0) {
      this.pc += this.get(y) - 1;
    }
  }

  tgl(x) {
    const pos = this.pc + this.get(x);
    if (pos < 0 || pos >= this.instructions.length) {
      return;
    }

    const inst = this.instructions[pos];
    if (inst[0] === "inc") {
      inst[0] = "dec";
    } else if (["out", "dec", "tgl"].indexOf(inst[0]) >= 0) {
      inst[0] = "inc";
    } else if (inst[0] === "jnz") {
      inst[0] = "cpy";
    } else if (["cpy"].indexOf(inst[0]) >= 0) {
      inst[0] = "jnz";
    }

    // console.log(pos, this.instructions[pos]);
  }

  fail = false;

  stop() {
    return super.stop() || this.fail || this.steps > 1000000;
  }

  out(x) {
    const val = this.get(x);
    this.output.push(val);
    if (val !== 0 && val !== 1) {
      this.fail = true;
      return;
    }
    if (this.clock === val) {
      this.fail = true;
      return;
    }
    this.clock = val;
  }
}

let interp = new MyInterpreter();
interp.run();
console.log(interp.registers[0]);

for (let a = 0; ; a++) {
  interp = new MyInterpreter();

  interp.registers[0] = a;
  interp.run();
  if (!interp.fail) {
    console.log(`winner`, a);
    break;
  }

  console.log(a, interp.output);
}
