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

let inputToProgram = [];
let consumeInput = () => {
   let n = inputToProgram[0];
   inputToProgram.shift();
   return n;
};

let makeOpcodes = (inputfn, outputfn) => {
   return {
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
         machine[dst] = inputfn();
         if (machine[dst] === 'pause') {
            machine.pause = true;
         }
      },
      4: (imm, machine) => {
         let src = next(machine)
         // console.log(machine[src]);
         // machine.output = machine[src];
         outputfn(machine[src]);
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
};

function step(machine, opcodes) {
   let operation = machine[machine.ip++];
   let opcode = operation % 100;
   let isImmediate = ('0000000' + operation).split('').map(i => +i).reverse().slice(2).map(i => i === 1);

   if (opcodes[opcode]) {
      machine.exit = !!opcodes[opcode](isImmediate, machine);
   } else {
      console.log(`Bad opcode. ip=${machine.ip - 1} operation=${operation} opcode=${opcode}`);
      machine.exit = true;
   }
}

function program(input, inputfn, outputfn) {
   let machine = input.map(i => i);
   machine.ip = 0;

   const opcodes = makeOpcodes(inputfn, outputfn);

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

// program(input);

var permArr = [],
  usedChars = [];

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
  return permArr
};

function runSystem(inputters) {
   let aIn = inputters[0];
   let bIn = inputters[1];
   let cIn = inputters[2];
   let dIn = inputters[3];
   let eIn = inputters[4];

   let current = 0;

   let machines = [
      input.map(i => i),
      input.map(i => i),
      input.map(i => i),
      input.map(i => i),
      input.map(i => i),
   ];
   machines[0].ip = 0;
   machines[1].ip = 0;
   machines[2].ip = 0;
   machines[3].ip = 0;
   machines[4].ip = 0;

   let inputStreams = [
      [aIn, 0],
      [bIn],
      [cIn],
      [dIn],
      [eIn],
   ];
   let outputStreams = [
      [],
      [],
      [],
      [],
      [],
   ]
   let opcodes = [
      makeOpcodes(() => {
         if (inputStreams[0].length > 0) {
            let n = inputStreams[0].shift();
            console.log(`A in <= ${n}`);
            return n;
         }
         console.log('A pause');
         return 'pause';
      }, (output) => {
         console.log(`A out => ${output}`);
         inputStreams[1].push(output);
      }),
      makeOpcodes(() => {
         if (inputStreams[1].length > 0) {
            let n = inputStreams[1].shift();
            console.log(`B in <= ${n}`);
            return n;
         }
         console.log('B pause');
         return 'pause';
      }, (output) => {
         console.log(`B out => ${output}`);
         inputStreams[2].push(output);
      }),
      makeOpcodes(() => {
         if (inputStreams[2].length > 0) {
            let n = inputStreams[2].shift();
            console.log(`C in <= ${n}`);
            return n;
         }
         console.log('C pause');
         return 'pause';
      }, (output) => {
         console.log(`C out => ${output}`);
         inputStreams[3].push(output);
      }),
      makeOpcodes(() => {
         if (inputStreams[3].length > 0) {
            let n = inputStreams[3].shift();
            console.log(`D in <= ${n}`);
            return n;
         }
         console.log('D pause');
         return 'pause';
      }, (output) => {
         console.log(`D out => ${output}`);
         inputStreams[4].push(output);
      }),
      makeOpcodes(() => {
         if (inputStreams[4].length > 0) {
            let n = inputStreams[4].shift();
            console.log(`E in <= ${n}`);
            return n;
         }
         console.log('E pause');
         return 'pause';
      }, (output) => {
         console.log(`E out => ${output}`);
         inputStreams[0].push(output);
      }),
   ]

   while (!machines[4].exit) {
      mach = machines[current];
      ops = opcodes[current];

      if (mach.exit) {
         console.log(`Exit? current: ${current}`);
         return;
      }

      // console.log(current, mach);
      if (mach.pause) {
         // console.log('resume', current, mach.ip);
         mach.pause = false;
         mach.ip -= 2;
         // console.log(mach[mach.ip - 1]);
         // break;
      }

      step(mach, ops);
      // break;

      if (mach.exit || mach.pause) {
         // console.log(`Current: ${current} -> ${current + 1}`)
         current = (current + 1) % 5;
         // break;
      }
   }

   return inputStreams[0];
}


// console.log(runSystem([9, 8, 7, 6, 5]));

let best = 0;
// permute([5, 6, 7, 8, 9]).forEach(order => {
//    let output = runSystem(order);

//    if (output > best) {
//       best = output;
//    }
// });

console.log(best);

console.log(runSystem([5, 6, 7, 8, 9]));
