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

let machines = Array.apply(null, new Array(50)).map((_, i) => {
   const machine = DefaultIntcodeMachine();
   // machine.stdin.setOnEmpty(() => {
   //    machine.paused = true;
   //    return -1;
   // });
   machine.stdin.submit(i);
   return machine;
});

let stdins = machines.map(machine => machine.stdin);
let stdouts = machines.map(machine => machine.stdout);

let current = 0;

let NAT = { x: 0, y: 0 };
let last = -1;
let idle = 0;
while (true) {
   let machine = machines[current];
   let { stdin, stdout } = machine;
   if (stdin.stream.length === 1 && stdin.peek() === -1) {
      idle ++;
   }
   else {
      idle = 0;
   }

   if (idle >= machines.length) {
      if (last === NAT.y) {
         log(`Part 2: ${NAT.y}`);
         break;
      }
      last = NAT.y;

      stdins[0].read();
      stdins[0].submit(NAT.x);
      stdins[0].submit(NAT.y);
      current = 0;
      continue;
   }

   machine.run();

   if (machine.paused && stdin.empty()) {
      stdin.submit(-1);

      current = (current + 1) % machines.length;
   }

   if (!stdout.empty()) {
      let dest = stdout.read();
      let x = stdout.read();
      let y = stdout.read();

      if (dest === 255) {
         NAT = { x, y };
         if (last === -1) {
            log(`Part 1: ${NAT.y}`);
            last = 0;
         }
      }
      else {
         stdins[dest].submit(x);
         stdins[dest].submit(y);
      }
   }
}
