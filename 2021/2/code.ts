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
  x = 0;
  y = 0;
  aim = 0;

  forward(x) {
    this.x += parseInt(x);
    this.y += this.aim * parseInt(x);
  }

  up(y) {
    this.aim -= parseInt(y);
  }

  down(y) {
    this.aim += parseInt(y);
  }
}

const interp = new MyInterpreter();
interp.run();

console.log(interp.x * interp.y);
