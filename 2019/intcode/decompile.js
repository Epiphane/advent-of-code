// --------------------------------------------------------------------------------------
//
//                                INTCODE DECOMPILER
//
//  This program is meant to lend a little insight into what kind of bitcoin miner we've
//  been running for Advent of Code. It will read an Intcode program file and output the
//  assembly code that most resembles it, for the following opcodes:
//       1  add a b c
//       2  mul a b c
//       3  in  a
//       4  out a
//       5  jnz a b
//       6  jiz a b
//       7  lt  a b c
//       8  eq  a b c
//       99 exit
//
//  To run this program, simply call `node decompile.js <inputfile>`. An assembly version
//  of the program will be outputted to stdout, which you can then choose to pipe into a
//  file, or just look at lovingly*.
//
//  Details:
//  - Each line of output will start with the machine address at which it starts.
//  - If an opcode is detected to be mutable (i.e. another command modifies it), you will
//    see !! before the address number
//  - Operations are printed in a pseudocode most similar to C. r[1] = r[2] + r[3]
//    means "add 2 3 1", or add the value at address 2 with the one in address 3 and store
//    the result in address 1.
//  - read() consumes input from the input channel
//  - write() submits a value to the output channel
//  - r[6] = 1100 means that the value at address 6 is not a valid operation, and is most
//    likely used for manipulating variables. Its initial value is 1100.
//
//  NOTE: this implementation is still pretty naive. For example, if an opcode is changed
//  so severely that it actually _offsets_ all future operations (e.g. `add` is converted
//  to `out`), that will not be reflected here. For this reason, it shouldn't be assumed
//  that the decompiled program is perfect, just an indication of the kind of program you
//  are dealing with.
//
//  Example (from day 5):
//  $ node 2019/intcode/decompile.js 2019/5/input.txt
//  // --------------------------------------------------------------------------------------
//  //                              BEGIN PROGRAM 0
//  // --------------------------------------------------------------------------------------
//  !!0:      r[225] = read()
//    2:      r[6] = r[225] + r[6]
//  !!6:      r[6] = 1100
//    7:      r[104] = r[238] + r[225]
//    11:     r[11] = 0
//    12:     r[224] = r[43] * 69
//    16:     r[224] = -483 + r[224]
//    20:     write(r[224])
//   ...
//
//  * or not lovingly
//
// --------------------------------------------------------------------------------------

const fs = require('fs');
const file = process.argv[2] || 'input.txt';
const programs = fs.readFileSync(file).toString().trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);

const { Machine } = require('../intcode/machine');

programs.forEach((program, i) => {
   let mutable = {};
   function formatArg(machine, mode, isOutput) {
      let value;
      if (mutable[machine.ip]) {
         value = `r[${machine.ip++}]`;
      }
      else {
         value = machine.read();

         if (isOutput) {
            mutable[value] = true;
         }
      }

      if (mode === 2) {
         value = `base + ${value}`;
      }

      return mode === 1 ? value : `r[${value}]`;
   }

   if (programs.length > 0) {
      console.log('// --------------------------------------------------------------------------------------');
      console.log(`//                              BEGIN PROGRAM ${i}`);
      console.log('// --------------------------------------------------------------------------------------');
   }

   // Make one pass where we determine what's mutable and what's instruction
   // before doing outputs.
   for (let output = 0; output <= 2; output ++) {
      const machine = new Machine(program);
      while (machine.ip < machine.length - 1) {
         const addr = machine.ip;
         const operation = machine.read();
         const opcode = operation % 100;
         const mode = ('0000000' + operation).split('').map(i => +i).reverse().slice(2);
         const volatile = !!mutable[addr];

         let cmd = [];
         let nice = '';
         if (opcode === 1) {
            cmd.push('add');
            cmd.push(formatArg(machine, mode[0], false));
            cmd.push(formatArg(machine, mode[1], false));
            cmd.push(formatArg(machine, false, true));
            if (cmd[1] === 0) {
               nice = `${cmd[3]} = ${cmd[2]}`;
            }
            else if (cmd[2] === 0) {
               nice = `${cmd[3]} = ${cmd[1]}`;
            }
            else if (cmd[3] === cmd[1]) {
               nice = `${cmd[3]} += ${cmd[2]}`;
            }
            else if (cmd[3] === cmd[2]) {
               nice = `${cmd[3]} += ${cmd[1]}`;
            }
            else {
               nice = `${cmd[3]} = ${cmd[1]} + ${cmd[2]}`;
            }
         }
         else if (opcode === 2) {
            cmd.push('mul');
            cmd.push(formatArg(machine, mode[0], false));
            cmd.push(formatArg(machine, mode[1], false));
            cmd.push(formatArg(machine, false, true));
            if (cmd[1] === 1) {
               nice = `${cmd[3]} = ${cmd[2]}`;
            }
            else if (cmd[2] === 1) {
               nice = `${cmd[3]} = ${cmd[1]}`;
            }
            else if (cmd[3] === cmd[1]) {
               nice = `${cmd[3]} *= ${cmd[2]}`;
            }
            else if (cmd[3] === cmd[2]) {
               nice = `${cmd[3]} *= ${cmd[1]}`;
            }
            else {
               nice = `${cmd[3]} = ${cmd[1]} * ${cmd[2]}`;
            }
         }
         else if (opcode === 3) {
            cmd.push('in');
            cmd.push(formatArg(machine, false, true));
            nice = `${cmd[1]} = read()`;

            if (addr !== 0 && output === 1) {
               console.log();
            }
         }
         else if (opcode === 4) {
            cmd.push('out');
            cmd.push(formatArg(machine, false, false));
            nice = `write(${cmd[1]})`;
         }
         else if (opcode === 5) {
            cmd.push('jnz');
            cmd.push(formatArg(machine, mode[0], false));
            cmd.push(formatArg(machine, mode[1], false));
            nice = `if (${cmd[1]} != 0) jump ${cmd[2]}`;
            if (!volatile && (+cmd[1] > 0 || +cmd[1] < 0)) {
               nice = `jump ${cmd[2]}`;
            }
         }
         else if (opcode === 6) {
            cmd.push('jiz');
            cmd.push(formatArg(machine, mode[0], false));
            cmd.push(formatArg(machine, mode[1], false));
            nice = `if (${cmd[1]} == 0) jump ${cmd[2]}`;
            if (!volatile && (+cmd[1] === 0)) {
               nice = `jump ${cmd[2]}`;
            }
         }
         else if (opcode === 7) {
            cmd.push('lt');
            cmd.push(formatArg(machine, mode[0], false));
            cmd.push(formatArg(machine, mode[1], false));
            cmd.push(formatArg(machine, false, true));
            nice = `${cmd[3]} = (${cmd[1]} < ${cmd[2]})`;
         }
         else if (opcode === 8) {
            cmd.push('eq');
            cmd.push(formatArg(machine, mode[0], false));
            cmd.push(formatArg(machine, mode[1], false));
            cmd.push(formatArg(machine, false, true));
            nice = `${cmd[3]} = (${cmd[1]} == ${cmd[2]})`;
         }
         else if (opcode === 9) {
            cmd.push('base')
            cmd.push(formatArg(machine, mode[0], false));
            nice = `base += ${cmd[1]}`;
         }
         else if (opcode === 99) {
            if (operation === 99) {
               cmd.push('exit');
               nice = `exit()\n`;
            }
            else {
               cmd.push(operation);
               nice = `r[${machine.ip - 1}] = ${operation}`;
            }
         }
         else {
            cmd.push(operation);
            nice = `r[${machine.ip - 1}] = ${operation}`;
         }
         // console.log(`${addr}\t| ${cmd.join('\t')}`);
         if (output === 1) {
            let addrfront = `${addr}:`.padEnd(6, ' ');
            if (mutable[addr]) {
               console.log(`!!${addrfront}  ${nice}`);
            }
            else {
               console.log(`  ${addrfront}  ${nice}`);
            }
         }
      }
   }
});
