const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd } = require('../utils');
const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');

process.env.DEBUG = true;

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim()
      .split(',').map(i => +i)

const log = console.log;

const UP = 0, LEFT = 1, DOWN = 2, RIGHT = 3;
let pos = {x: 0, y: 0, dir: UP};
let machine = new Machine(input, new Channel, new Channel, 'robo');
const stdout = machine.stdout;
const stdin = machine.stdin;

// CHANGE TO 0 FOR PART 1
let map = [[0]];
stdin.submit(map[0][0]);

let painted = [];

let minx = 0;
let miny = 0;
let maxx = 0;
let maxy = 0;
while (!machine.exited) {
   do {
      machine.step();
   } while (!machine.paused);

   let color = stdout.read();
   let dir = stdout.read();

   map[pos.y][pos.x] = color;
   if (painted.filter(p => p.x === pos.x && p.y === pos.y).length === 0) {
      painted.push({ x: pos.x, y: pos.y });
   }
   if (dir === 0) {
      pos.dir = (pos.dir + 1) % 4;
   } else {
      pos.dir --;
      if (pos.dir < 0) {
         pos.dir = RIGHT;
      }
   }

   switch (pos.dir) {
      case UP:
         pos.y --;
         break;
      case DOWN:
         pos.y ++;
         break;
      case LEFT:
         pos.x --;
         break;
      case RIGHT:
         pos.x ++;
         break;
   }

   map[pos.y] = map[pos.y] || [];
   map[pos.y][pos.x] = map[pos.y][pos.x] || 0;

   stdin.submit(map[pos.y][pos.x]);

   if (pos.x < minx) { minx = pos.x; }
   if (pos.y < miny) { miny = pos.y; }
   if (pos.x > maxx) { maxx = pos.x; }
   if (pos.y > maxy) { maxy = pos.y; }
}

console.log(`Painted: ${painted.length}`);

let output = [];
for (let y = miny; y <= maxy; y ++) {
   let row = [];
   for (let x = minx; x <= maxx; x ++) {
      row.push(map[y][x] ? '#' : ' ');
   }
   output.push(row.join(''));
}
console.log(output.join('\n'))
