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
  step() {
    const amt = this.instructions[this.pc][0] as any as number;
    if (amt >= 3) this.instructions[this.pc][0] = (amt - 1) as any as string;
    else this.instructions[this.pc][0] = (amt + 1) as any as string;

    this.pc += amt;
    this.steps++;
  }
}

const interp = new MyInterpreter();
interp.run();
console.log(interp.steps);
