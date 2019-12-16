const fs = require('fs');
const Machine = require('../intcode/machine');
const log = console.log;
const { Map } = require('../../map');

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let machine = new Machine(raw);
const { stdin, stdout } = machine;

const WALL = '#',
      OPEN = ' ',
      MACHINE = '*',
      UNKNOWN = '?';

let pos = { x: 0, y: 0 };
let map = new Map(UNKNOWN);

function print() {
   log('---------------------------------');
   let prev = map.get(pos.x, pos.y);
   map.set(pos.x, pos.y, 'D');
   log(map.print());
   map.set(pos.x, pos.y, prev);
   log('---------------------------------');
}

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

let dest = false;

function move(dir) {
   let nx = pos.x;
   let ny = pos.y;

   switch (dir) {
      case NORTH: ny --; break;
      case SOUTH: ny ++; break;
      case EAST: nx ++; break;
      case WEST: nx --; break;
   }

   // Move
   stdin.submit(dir);
   machine.run();
   let output = stdout.read();

   if (output !== 0) {
      pos.x = nx;
      pos.y = ny;
   }

   return output;
}

function tryExplore(dir) {
   let nx = pos.x;
   let ny = pos.y;

   switch (dir) {
      case NORTH: ny --; break;
      case SOUTH: ny ++; break;
      case EAST: nx ++; break;
      case WEST: nx --; break;
   }

   if (map.has(nx, ny)) {
      return false;
   }

   let output = move(dir);

   let type = ' '
   if (output === 0) {
      type = '#';
   }
   else if (output === 2) {
      type = '*';
      dest = {x: nx, y: ny};
   }

   map.set(nx, ny, type);

   return output !== 0;
}

function explore() {
   let stack = [];
   do {
      if (tryExplore(NORTH)) {
         stack.push(SOUTH);
      } else if (tryExplore(SOUTH)) {
         stack.push(NORTH);
      } else if (tryExplore(EAST)) {
         stack.push(WEST);
      } else if (tryExplore(WEST)) {
         stack.push(EAST);
      } else {
         move(stack.pop());
      }
   } while (stack.length !== 0);
}

// Part 1
let explored = [];
function findPath(dest) {
   let queue = [{ x: 0, y: 0, travelled: 0, dist: 0 }];
   while (queue.length > 0) {
      let { x, y, travelled } = queue.shift();

      if (explored[y] && explored[y][x]) {
         continue;
      }

      explored[y] = explored[y] || [];
      explored[y][x] = true;

      if (x === dest.x && y === dest.y) {
         return travelled;
      }

      travelled ++;
      [
         { x: -1, y: 0  },
         { x: 1,  y: 0  },
         { x: 0,  y: -1 },
         { x: 0,  y: 1  },
      ].forEach(d => {
         let nx = x + d.x;
         let ny = y + d.y;
         if (map.get(nx, ny) !== '#') {
            let dist = Math.abs(dest.x - nx) + Math.abs(dest.y - ny);
            queue.push({ x: nx, y: ny, travelled: travelled, dist });
         }
      });

      queue.sort((a, b) => (a.dist + a.travelled) - (b.dist + b.travelled));
   }
}

explore();
print();

log(`Part 1: ${findPath(dest)} steps to machine`);

// Part 2
function oxygenate() {
   let oxygenated = new Map(-1);
   let queue = [{ x: dest.x, y: dest.y, dist: 0 }];
   while (queue.length > 0) {
      let { x, y, dist } = queue.shift();
      if (oxygenated.has(x, y) && oxygenated.get(x, y) < dist) {
         continue;
      }

      oxygenated.set(x, y, dist);

      dist ++;
      [
         { x: -1, y: 0  },
         { x: 1,  y: 0  },
         { x: 0,  y: -1 },
         { x: 0,  y: 1  },
      ].forEach(d => {
         let nx = x + d.x;
         let ny = y + d.y;
         if (map.get(nx, ny) !== '#') {
            queue.push({ x: nx, y: ny, dist });
         }
      });
   }

   return oxygenated.reduce((prev, val) => Math.max(prev, val), -1);
}

log(`Part 2: It takes ${oxygenate()} minutes to fill the maze`);
