const Channel = require('./channel');

const log = console.log;

module.exports = class Machine {
   constructor(program, stdin, stdout, id) {
      if (typeof(program) === 'string') {
         program = program.split(',').map(i => parseInt(i));
      }
      program.forEach(i => Array.prototype.push.apply(this, [i]));
      this.ip = 0;
      this.paused = false;
      this.exited = false;
      this.stdin = stdin || new Channel;
      this.stdout = stdout || new Channel;
      this.id = id;
      this.debug = !!process.env.DEBUG;
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
         if (this.debug) { log(`${this.id} pausing for input`); }
         return;
      }

      this[dst] = this.stdin.read();
      if (this.debug) { log(`${this.id} <= ${this[dst]}`); }
   };

   // Out
   op4(imm) {
      let src = this.read();
      this.stdout.submit(this[src]);
      if (this.debug) { log(`${this.id} => ${this[src]}`); }
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
