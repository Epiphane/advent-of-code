const fs = require('fs');

let file = 'input';
let input = fs.readFileSync(file + '.txt').toString();
let lines = input.split('\n');

const LinkedList = require('../linkedlist');
const { MakeRow, MakeGrid } = require('../makegrid');

console.time();

let inputReg = [0, 0, 0, 0];
let opcode = [0, 0, 0, 0];
let outputs = [0, 0, 0, 0];

const operations = [
   [addr, 'addr'], [addi, 'addi'],
   [mulr, 'mulr'], [muli, 'muli'],
   [banr, 'banr'], [bani, 'bani'],
   [borr, 'borr'], [bori, 'bori'],
   [setr, 'setr'], [seti, 'seti'],
   [gtir, 'gtir'], [gtri, 'gtri'], [gtrr, 'gtrr'],
   [eqir, 'eqir'], [eqri, 'eqri'], [eqrr, 'eqrr'],
];

let possibilities = [
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
   operations.map(op => op),
];

let currentLine = 0;
let numThrees = 0;
while (currentLine < lines.length) {
   let line = lines[currentLine++];
   if (line.indexOf('Before') >= 0) {
      inputReg = line.substr(line.indexOf('[') + 1, 10).split(', ').map(i => parseInt(i));

      line = lines[currentLine++];
      opcode = line.split(' ').map(i => parseInt(i));

      line = lines[currentLine++];
      outputs = line.substr(line.indexOf('[') + 1, 10).split(', ').map(i => parseInt(i));

      // Do the thing
      let matches = 0;
      operations.forEach(operation => {
         let registers = inputReg.map(r => r);
         operation[0](registers, opcode[1], opcode[2], opcode[3]);
         let match = true;
         registers.forEach((r, i) => {
            if (r !== outputs[i]) {
               match = false;
            }
         });

         if (match) {
            matches ++;
         }
         else {
            possibilities[opcode[0]] = possibilities[opcode[0]].filter(op => {
               return op[1] !== operation[1]
            });
         }
      });

      if (matches >= 3) {
         numThrees ++;
      }
   }
   else if (line.trim().length > 0) {
      currentLine--;
      // time to execute
      break;
   }
}

let opIndexed = [];
let removed = [];
while (removed.length < 16) {
   possibilities.forEach((oplist, i) => {
      if (oplist.length === 1) {
         opIndexed[i] = oplist[0];
         removed.push(oplist[0][1]);
      }
   });
   possibilities.forEach((oplist, i) => {
      possibilities[i] = possibilities[i].filter(op => {
         return removed.indexOf(op[1]) < 0;
      });
   });
}

console.log(opIndexed.map((op, i) => i + ': ' + op[1]).join('\n'));

// Execute
registers = [0, 0, 0, 0];
while (currentLine < lines.length) {
   let line = lines[currentLine++];
   opcode = line.split(' ').map(i => parseInt(i));

   console.log(opcode);
   opIndexed[opcode[0]][0](registers, opcode[1], opcode[2], opcode[3]);
   console.log(opIndexed[opcode[0]][1], opcode[1], opcode[2], opcode[3]);
   console.log(registers);
}

function addr(registers, a, b, c) {
   registers[c] = registers[a] + registers[b];
}

function addi(registers, a, b, c) {
   registers[c] = registers[a] + b;
}

function mulr(registers, a, b, c) {
   registers[c] = registers[a] * registers[b];
}

function muli(registers, a, b, c) {
   registers[c] = registers[a] * b;
}

function banr(registers, a, b, c) {
   registers[c] = registers[a] & registers[b];
}

function bani(registers, a, b, c) {
   registers[c] = registers[a] & b;
}

function borr(registers, a, b, c) {
   registers[c] = registers[a] | registers[b];
}

function bori(registers, a, b, c) {
   registers[c] = registers[a] | b;
}

function setr(registers, a, _, c) {
   registers[c] = registers[a];
}

function seti(registers, a, _, c) {
   registers[c] = a;
}

function gtir(registers, a, b, c) {
   registers[c] = a > registers[b] ? 1 : 0;
}

function gtri(registers, a, b, c) {
   registers[c] = registers[a] > b ? 1 : 0;
}

function gtrr(registers, a, b, c) {
   registers[c] = registers[a] > registers[b] ? 1 : 0;
}

function eqir(registers, a, b, c) {
   registers[c] = a === registers[b] ? 1 : 0;
}

function eqri(registers, a, b, c) {
   registers[c] = registers[a] === b ? 1 : 0;
}

function eqrr(registers, a, b, c) {
   registers[c] = registers[a] === registers[b] ? 1 : 0;
}

console.timeEnd();