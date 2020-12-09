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

let instr = raw
  .split("\n")
  .map((line) => line.trim())
  .map((line) => line.split(" "))
  .map(([a, b]) => [a, +b]);

function Machine(instr) {
  this.accm = 0;
  this.ip = 0;
  this.instr = instr;
  this.hasRun = instr.map(() => false);

  this.acc = (i) => {
    this.accm += +i;
  };
  this.jmp = (i) => {
    this.ip += +i - 1;
  };
  this.nop = () => {};

  this.step = () => {
    this.hasRun[this.ip] = true;
    let [cmd, val] = this.instr[this.ip++];
    this[cmd](val);
  };
}

// Part 1
let machine = new Machine(instr);
while (!machine.hasRun[machine.ip]) {
  machine.step();
}

print(`Part 1: ${machine.accm}`);

// Part 2
function isGood(lines) {
  let machine = new Machine(lines);
  while (!machine.hasRun[machine.ip] && machine.ip < machine.instr.length) {
    machine.step();
  }

  return {
    good: machine.ip >= machine.instr.length,
    machine,
  };
}

instr.forEach((inst, line) => {
  if (inst[0] === "acc") return;

  let newInstr = instr.map((inst, i) => {
    if (i !== line) return inst;
    if (inst[0] === "jmp") return ["nop", inst[1]];
    if (inst[0] === "nop") return ["jmp", inst[1]];
  });

  let machine = new Machine(newInstr);
  while (!machine.hasRun[machine.ip] && machine.ip < machine.instr.length) {
    machine.step();
  }

  if (machine.ip >= newInstr.length) {
    print(`Part 2: ${machine.accm}`);
  }
});
