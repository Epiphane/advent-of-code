const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine } = require('../intcode/machine');
const log = console.log;

// let give = line.match(/value ([0-9]+) goes to bot ([0-9]+)/);
// let generators = [...line.matchAll(/([a-z]+) generator/g)];

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let machine = new Machine(raw);
const stdin = machine.stdin;
const stdout = machine.stdout;

let pos = { x: 0, y: 0 };
let map = [[' ']];

let minx = 0;
let maxx = 0;
let miny = 0;
let maxy = 0;

function print() {
   let rows = [];
   for (let y = miny; y <= maxy; y ++) {
      let row = [];
      for (let x = minx; x <= maxx; x ++) {
         row.push(map[y][x] || '?');
      }
      rows.push(row);
   }

   rows[pos.y - miny][pos.x - minx] = 'D';
   log('---------------------------------');
   log(rows.map(i => i.join('')).join('\n'));
   log('---------------------------------');

   // let prev = map[pos.y][pos.x];
   // map[pos.y][pos.x] = 'D';
   // log('----');
   // // log(map);
   // log(map.map(row => row.join('')).join('\n'));
   // // log(map[0].join(''));
   // log('----');
   // map[pos.y][pos.x] = prev;
}

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;
let DIRS = [0, 'NORTH', 'SOUTH', 'WEST', 'EAST'];

let dir = NORTH;

let dest = false;

function complete() {
   if (!dest) {
      return false;
   }

   for (let y = miny; y <= maxy; y ++) {
      for (let x = minx; x <= maxx; x ++) {
         if (!map[y][x]) return false;
      }
   }

   return true;
}

function move(dir) {
   let nx = pos.x;
   let ny = pos.y;

   switch (dir) {
      case NORTH: ny --; break;
      case SOUTH: ny ++; break;
      case EAST: nx ++; break;
      case WEST: nx --; break;
   }

   stdin.submit(dir);
   machine.run();
   let val = stdout.read();

   if (val !== 0) {
      pos.x = nx;
      pos.y = ny;
   }

   return val;
}

function tryDir(dir) {
   let nx = pos.x;
   let ny = pos.y;

   switch (dir) {
      case NORTH: ny --; break;
      case SOUTH: ny ++; break;
      case EAST: nx ++; break;
      case WEST: nx --; break;
   }

   if (map[ny] && map[ny][nx]) {
      return false;
   }

   if (nx < minx) { minx = nx; }
   if (nx > maxx) { maxx = nx; }
   if (ny < miny) { miny = ny; }
   if (ny > maxy) { maxy = ny; }

   let val = move(dir);

   // log(`Dir: ${DIRS[dir]} - Val: ${val}`);

   let type = ' '
   if (val === 0) {
      type = '#';
   }
   else if (val === 2) {
      type = '*';
      dest = {x: nx, y: ny};
   }

   map[ny] = map[ny] || [];
   map[ny][nx] = type;

   if (val !== 0) {
      pos.x = nx;
      pos.y = ny;
   }

   return val !== 0;
}

let stack = [];

let i = 0;
function explore() {
   while (!machine.exited && !complete()) {
      if (tryDir(NORTH)) {
         stack.push(SOUTH);
         // print();
         continue;
      }

      if (tryDir(SOUTH)) {
         stack.push(NORTH);
         // print();
         continue;
      }

      if (tryDir(EAST)) {
         stack.push(WEST);
         // print();
         continue;
      }

      if (tryDir(WEST)) {
         stack.push(EAST);
         // print();
         continue;
      }

      // print();

      if (stack.length === 0) {
         break;
      }

      let top = stack.pop();
      let v = move(top);
      // log('Backtrack', v, DIRS[top], pos);
      // print();
      // if (i++ > 10000000) {
      //    log(stack);
      //    // while (stack.length > 0) {
      //    //    let top = stack.pop();
      //    //    move(top);
      //    // }
      //    break;
      // }
      // break;
// print();
      // log(stack);
   }
}

let explored = [];
function findPath(dest) {
   let queue = [{ x: 0, y: 0, travelled: 0, dist: 0 }];
   while (queue.length > 0) {
      let { x, y, travelled, dist } = queue.shift();

      if (explored[y] && explored[y][x]) {
         continue;
      }

      explored[y] = explored[y] || [];
      explored[y][x] = true;

      if (x === dest.x && y === dest.y) {
         return travelled;
      }

      travelled ++;
      let nx = x;
      let ny = y - 1;
      if (map[ny] && map[ny][nx] !== '#') {
         let dist = Math.abs(dest.x - nx) + Math.abs(dest.y - ny);
         queue.push({ x: nx, y: ny, travelled: travelled, dist });
      }

      nx = x;
      ny = y + 1;
      if (map[ny] && map[ny][nx] !== '#') {
         let dist = Math.abs(dest.x - nx) + Math.abs(dest.y - ny);
         queue.push({ x: nx, y: ny, travelled: travelled, dist });
      }

      nx = x - 1;
      ny = y;
      if (map[ny] && map[ny][nx] !== '#') {
         let dist = Math.abs(dest.x - nx) + Math.abs(dest.y - ny);
         queue.push({ x: nx, y: ny, travelled: travelled, dist });
      }

      nx = x + 1;
      ny = y;
      if (map[ny] && map[ny][nx] !== '#') {
         let dist = Math.abs(dest.x - nx) + Math.abs(dest.y - ny);
         queue.push({ x: nx, y: ny, travelled: travelled, dist });
      }

      queue.sort((a, b) => (a.dist + a.travelled) - (b.dist + b.travelled));
   }
}

explore();
print();
log(pos);

log(findPath(dest));
log(dest);

let reached = [[1]];
function expand() {
   let max = 0;
   let queue = [{ x: dest.x, y: dest.y, t: 1 }];
   while (queue.length > 0) {
      let { x, y, t } = queue.shift();
      if (reached[y] && reached[y][x] && reached[y][x] < t) {
         continue;
      }

      reached[y] = reached[y] || [];
      reached[y][x] = t;

      if (t - 1 > max) {
         max = t - 1;
      }

      let nx = x;
      let ny = y - 1;
      if (map[ny] && map[ny][nx] !== '#') {
         queue.push({ x: nx, y: ny, t: t + 1 });
      }

      nx = x;
      ny = y + 1;
      if (map[ny] && map[ny][nx] !== '#') {
         queue.push({ x: nx, y: ny, t: t + 1 });
      }

      nx = x - 1;
      ny = y;
      if (map[ny] && map[ny][nx] !== '#') {
         queue.push({ x: nx, y: ny, t: t + 1 });
      }

      nx = x + 1;
      ny = y;
      if (map[ny] && map[ny][nx] !== '#') {
         queue.push({ x: nx, y: ny, t: t + 1 });
      }

      queue.sort((a, b) => (a.dist + a.travelled) - (b.dist + b.travelled));
   }

   return max;
}

log(expand());
print();
