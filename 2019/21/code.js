const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine, DefaultIntcodeMachine } = require('../intcode/machine');
const log = console.log;
const prompt = require('readline-sync').question;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

function doProblem(program) {
   let machine = DefaultIntcodeMachine();
   const { stdin, stdout } = machine;
   machine.run();

   stdout.readline();
   program.forEach(instr => {
      stdin.writeline(instr);
   })

   while (!machine.exited) {
      machine.run();
   }

   while (!stdout.empty()) {
      let next = stdout.readline();
      if (typeof(next) !== 'string') {
         return next;
      }
   }
}

// Part 1
const P1 = [
   'NOT C J', // C is hole
   'NOT B T', // or B is hole
   'OR T J',
   'NOT A T', // or A is hole
   'OR T J',

   'AND D J', // and D is wall

   'WALK',
];
log(`Part 1: ${doProblem(P1)}`);

// Part 2
const P2 = [
   'NOT C T', // C is hole
   'AND H T', // and H is wall
   'OR T J',

   'NOT B T', // or B is hole
   'OR T J',
   'NOT A T', // or A is hole
   'OR T J',

   'AND D J', // and D is wall

   'RUN',
];
log(`Part 2: ${doProblem(P2)}`);
