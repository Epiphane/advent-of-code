const { Channel } = require('./channel');
const log = console.log;

class Machine {
   constructor(program, stdin, stdout, id) {
      if (typeof(program) === 'string') {
         program = program.trim().split(',').map(i => parseInt(i));
      }
      program.forEach(i => Array.prototype.push.apply(this, [i]));
      this.ip = 0;
      this.paused = false;
      this.exited = false;
      this.stdin = stdin || new Channel;
      this.stdout = stdout || new Channel;
      this.id = id;
      this.debug = !!process.env.DEBUG;
      this.relative = 0;
   }

   get(addr) {
      this[addr] = this[addr] || 0;
      return this[addr];
   }

   read() {
      return this.get(this.ip++);
   }

   run(timeout) {
      let clock = 0;
      do {
         this.step();
         if (timeout && clock++ > timeout) {
            break;
         }
      } while (!this.exited && !this.paused);
   }

   step() {
      this.paused = false;
      const operation = this.read();
      const opcode = operation % 100;
      const mode = ('0000000' + operation).split('').map(i => +i).reverse().slice(2).map(i => i);

      if (this.verbose) {
         log(`ip: ${this.ip - 1}`.padEnd(10, ' ') + `| opcode: ${operation}`)
      }
      const fnName = `op${opcode}`;
      if (!this[fnName]) {
         log(`Bad opcode. ip=${this.ip - 1} operation=${operation} opcode=${opcode}`);
         this.exited = true;
         return;
      }

      this[fnName](mode);
   }

   getArg(mode, n) {
      let val = this.read();
      if (mode[n] === 0) {
         val = this.get(val) || 0;
      } else if (mode[n] === 2) {
         val = this.get(this.relative + val) || 0;
      }
      return val;
   };

   getOutputArg(mode) {
      let val = this.read();
      if (mode === 2) {
         val += this.relative;
      }
      return val;
   }

   getArgs(mode, count) {
      let args = [];
      for (let i = 0; i < count; ++i) {
         args.push(this.getArg(mode, i));
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
      let dst = this.getOutputArg(imm[2]);
      this[dst] = src1 + src2;
   };

   // Mul
   op2(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      let dst = this.getOutputArg(imm[2]);
      this[dst] = src1 * src2;
   };

   // In
   op3(imm) {
      let dst = this.getOutputArg(imm[0]);
      if (this.stdin.empty()) {
         this.ip -= 2;
         this.paused = true;
         if (this.debug) { log(`${this.id} pausing for input`); }
         return;
      }

      this[dst] = this.stdin.read();
      if (this.debug) { log(`${this.id} <= ${this.get(dst)}`); }
   };

   // Out
   op4(imm) {
      let [ src ] = this.getArgs(imm, 1);
      this.stdout.submit(src);
      if (this.debug) { log(`${this.id} => ${src}`); }
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
      if (imm[2] === 2) {
         dst += this.relative;
      }
      this[dst] = (src1 < src2) ? 1 : 0;
   };

   // Equal
   op8(imm) {
      let [ src1, src2 ] = this.getArgs(imm, 2);
      let dst = this.getOutputArg(imm[2]);
      this[dst] = (src1 === src2) ? 1 : 0;
   };

   // Relative
   op9(imm) {
      let [ val ] = this.getArgs(imm, 1);
      this.relative += val;
   }
};

function DefaultIntcodeMachine() {
   const fs = require('fs');
   return new Machine(fs.readFileSync((process.argv[2] || 'input') + '.txt').toString().trim());
}

module.exports = {
   Machine,
   DefaultIntcodeMachine,
}
