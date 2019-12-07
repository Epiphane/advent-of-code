const DEBUG = false;

const fs = require('fs');
let file = process.argv[2] || 'input';
const input = fs.readFileSync(file + '.txt').toString().trim().split(',').map(i => parseInt(i));

const log = console.log;

class Channel {
   constructor() {
      this.stream = [];
   }

   submit(elem) {
      this.stream.push(elem);
   }

   empty() {
      return this.stream.length === 0;
   }

   read() {
      return this.stream.shift();
   }
}

class Machine {
   constructor(program, stdin, stdout, id) {
      program.forEach(i => Array.prototype.push.apply(this, [i]));
      this.ip = 0;
      this.paused = false;
      this.exited = false;
      this.stdin = stdin;
      this.stdout = stdout;
      this.id = id;
      this.debug = DEBUG;
   }

   read() {
      return this[this.ip++];
   }

   step() {
      this.paused = false;
      const operation = this.read();
      const opcode = operation % 100;
      const isImmediate = ('0000000' + operation).split('').map(i => +i).reverse().slice(2).map(i => i === 1);

      const fnName = `op${opcode}`;
      if (!this[fnName]) {
         log(`Bad opcode. ip=${this.ip - 1} operation=${operation} opcode=${opcode}`);
         this.exit = true;
         return;
      }

      this[fnName](isImmediate);
   }

   getArg(isImmediate, n) {
      let val = this.read();
      if (!isImmediate[n]) {
         val = this[val];
      }
      return val;
   };

   getArgs(isImmediate, count) {
      let args = [];
      for (let i = 0; i < count; ++i) {
         args.push(this.getArg(isImmediate, i));
      }
      return args;
   };

   // -------------------------------------------------------------
   // |                                                           |
   // |                       Operations                          |
   // |                                                           |
   // -------------------------------------------------------------
   op99() {
      this.exited = true;
   }

   // Add
   op1(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      let dst = this.read();
      this[dst] = src1 + src2;
   };

   // Mul
   op2(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      let dst = this.read();
      this[dst] = src1 * src2;
   };

   // In
   op3(imm) {
      let dst = this.read();
      if (this.stdin.empty()) {
         this.ip -= 2;
         this.paused = true;
         if (DEBUG) { log(`${this.id} pausing for input`); }
         return;
      }

      this[dst] = this.stdin.read();
      if (DEBUG) { log(`${this.id} <= ${this[dst]}`); }
   };

   // Out
   op4(imm) {
      let src = this.read();
      this.stdout.submit(this[src]);
      if (DEBUG) { log(`${this.id} => ${this[src]}`); }
   };

   // Jump if non-0
   op5(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      if (src1 !== 0) {
         this.ip = src2;
      }
   };

   // Jump if 0
   op6(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      if (src1 === 0) {
         this.ip = src2;
      }
   };

   // Less than
   op7(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      let dst = this.read();
      this[dst] = (src1 < src2) ? 1 : 0;
   };

   // Equal
   op8(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      let dst = this.read();
      this[dst] = (src1 === src2) ? 1 : 0;
   };
};

function runSystem(phaseSettings) {
   let toB = new Channel;
   let toC = new Channel;
   let toD = new Channel;
   let toE = new Channel;
   let toA = new Channel;

   const machines = [
      new Machine(input, toA, toB, 'A'),
      new Machine(input, toB, toC, 'B'),
      new Machine(input, toC, toD, 'C'),
      new Machine(input, toD, toE, 'D'),
      new Machine(input, toE, toA, 'E'),
   ];

   toA.submit(phaseSettings[0]);
   toB.submit(phaseSettings[1]);
   toC.submit(phaseSettings[2]);
   toD.submit(phaseSettings[3]);
   toE.submit(phaseSettings[4]);
   toA.submit(0);

   let executor = 0;
   while (!machines[4].exited) {
      let currentMachine = machines[executor];

      if (currentMachine.exited) {
         log(`Unexpected exit? current: ${executor}`);
         return;
      }

      currentMachine.step();

      if (currentMachine.exited || currentMachine.paused) {
         executor = (executor + 1) % 5;
      }
   }

   return toA.read();
};

// Permutations
var permArr = [], usedChars = [];
function permute(input) {
   var i, ch;
   for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
         permArr.push(usedChars.slice());
      }
      permute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
   }
   return permArr;
};

log(permute([5, 6, 7, 8, 9]).reduce((prev, order) => {
   return Math.max(prev, runSystem(order));
}, 0));
