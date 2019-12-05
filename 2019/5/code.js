const fs = require('fs');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split(',').map(i => parseInt(i));

let next = (machine) => machine[machine.ip++];

let getArg = (isImmediate, machine, n) => {
   let arg = next(machine);
   if (!isImmediate[n]) {
      arg = machine[arg];
   }
   return arg;
}

let getArgs = (isImmediate, machine, num) => {
   let args = [];
   for (let i = 0; i < num; ++i) {
      args.push(getArg(isImmediate, machine, i));
   }
   return args;
}

let consumeInput = () => 5;

let opcodes = {
   1: (imm, machine) => {
      let [ src1, src2 ] = getArgs(imm, machine, 2);
      let dst = next(machine);
      machine[dst] = src1 + src2;
   },
   2: (imm, machine) => {
      let [ src1, src2 ] = getArgs(imm, machine, 2);
      let dst = next(machine);
      machine[dst] = src1 * src2;
   },
   3: (imm, machine) => {
      let dst = next(machine);
      machine[dst] = consumeInput();
   },
   4: (imm, machine) => {
      let src = next(machine)
      console.log(machine[src]);
   },
   5: (imm, machine) => {
      let [ src1, src2 ] = getArgs(imm, machine, 2);
      if (src1 !== 0) {
         machine.ip = src2;
      }
   },
   6: (imm, machine) => {
      let [ src1, src2 ] = getArgs(imm, machine, 2);
      if (src1 === 0) {
         machine.ip = src2;
      }
   },
   7: (imm, machine) => {
      let [ src1, src2 ] = getArgs(imm, machine, 2);
      let dst = next(machine);
      machine[dst] = (src1 < src2) ? 1 : 0;
   },
   8: (imm, machine) => {
      let [ src1, src2 ] = getArgs(imm, machine, 2);
      let dst = next(machine);
      machine[dst] = (src1 === src2) ? 1 : 0;
   },
   99: () => { console.log('Exit'); return true; }
};

function program(input) {
   let machine = input.map(i => i);
   machine.ip = 0;

   let exit = false;
   do {
      let operation = machine[machine.ip++];
      let opcode = operation % 100;
      let isImmediate = ('0000000' + operation).split('').map(i => +i).reverse().slice(2).map(i => i === 1);

      if (opcodes[opcode]) {
         exit = opcodes[opcode](isImmediate, machine);
      } else {
         console.log(`Bad opcode. ip=${machine.ip - 1} operation=${operation} opcode=${opcode}`);
         exit = true;
      }
   } while (!exit);

   return machine;
}

program(input);
