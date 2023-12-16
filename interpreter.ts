// @ts-nocheck

export class Interpreter {
  instructions: [string, ...(number | string)[]][];
  registers = Array.from(new Array(100), () => 0);
  pc = 0;
  steps = 0;
  debug = false;

  constructor(instructions?: string | string[]) {
    if (typeof instructions === "undefined") {
      instructions = require("fs")
        .readFileSync((process.argv[2] || "input") + ".txt")
        .toString()
        .trim();
    }
    if (typeof instructions === "string") {
      instructions = instructions.split("\n").map((line) => line.trim());
    }
    this.instructions = instructions.map((line) =>
      line.split(" ").map((piece) => {
        const parsed = parseInt(piece);
        return isNaN(parsed) ? piece : parsed;
      })
    ) as [string, ...(number | string)[]][];
  }

  step() {
    if (this.complete()) return;
    const [cmd, ...args] = this.instructions[this.pc];

    if (this.debug) console.log([cmd, ...args].join(" "));
    if ((this as any)[cmd]) {
      (this as any)[cmd].apply(this, args);
      if (this.debug) console.log("   " + this.registers.slice(0, 4).join(" "));
    } else {
      console.error(`Unrecognized instruction: ${cmd}`);
      this.pc = this.instructions.length;
    }

    if (isNaN(this.pc)) {
      console.error(`PC NaN after ${[cmd, ...args].join(" ")}`);
    } else {
      this.pc++;
    }
    this.steps++;
  }

  stop() {
    return this.complete();
  }

  complete() {
    return isNaN(this.pc) || this.pc < 0 || this.pc >= this.instructions.length;
  }

  run() {
    while (!this.stop()) {
      this.step();
    }
  }

  reg(register: number | string) {
    if (typeof register === "string") {
      register = register.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
    }
    return register;
  }

  get(register: number | string) {
    return this.registers[this.reg(register)];
  }

  set(register: number | string, val: number) {
    this.registers[this.reg(register)] = val;
  }
}
