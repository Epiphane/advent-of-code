const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine } = require('../intcode/machine');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim()
   .split('\n').map(line =>
      line.trim()
   .split('')
   )

const log = console.log;

let grid = MakeGrid(input[0].length, input.length, (x, y) => {
   return input[y][x];
})

function gcd_two_numbers(x, y) {
   if ((typeof x !== 'number') || (typeof y !== 'number'))
     return false;
   x = Math.abs(x);
   y = Math.abs(y);
   while(y) {
     var t = y;
     y = x % y;
     x = t;
   }
   return x;
 }

let best = 0;

// for (let x = 0; x < grid[0].length; x++) {
//    for (let y = 0; y < grid.length; y++) {
//       let i = grid[y][x];
//       console.log(x, y, grid[y]);
//    }
// }

let bestx = 0; let besty = 0;
grid.map((x, y, val) => {
   if (val !== '#') { return; }

   let n = 0;
   let visible = [];
   grid.map((x2, y2, other) => {
      if (other !== '#') { return; }
      if (x === x2 && y === y2) { return; }

      let dx = (x2 - x);
      let dy = (y2 - y);

      if (dx !== 0 && dy !== 0) {
         let gcd = gcd_two_numbers(dx, dy);

         dx /= gcd;
         dy /= gcd;
      } else if (dx !== 0) {
         dx = Math.sign(dx);
      } else {
         dy = Math.sign(dy);
      }

      let x3 = x;// x3 !== x2; ) {
      for (let y3 = y; x3 !== x2 || y3 !== y2; y3 += dy) {
         if (grid.get(x3, y3) === '#' && (x3 !== x || y3 !== y)) {
            // if (x === 6 && y === 3) console.log(`${x2},${y2} blocked by ${x3},${y3}`)
            return;
         }
         x3 += dx;
      }

      n ++;
      visible.push({ x: x2, y: y2, angle: Math.atan2(dy, dx) });
   })

   n = visible.length;
   // console.log(x, y, visible, visible.length);
   if (n > best) {
      best = n;
      bestx = x;
      besty = y;
      // console.log(x, y, best);
   }
})

console.log('winner', bestx, besty, best);

const x = bestx;
const y = besty;
const val = grid.get(x, y);
if (val !== '#') { return; }

let n = 0;
let visible = [];
grid.map((x2, y2, other) => {
   if (other !== '#') { return; }
   if (x === x2 && y === y2) { return; }

   let dx = (x2 - x);
   let dy = (y2 - y);

   if (dx !== 0 && dy !== 0) {
      let gcd = gcd_two_numbers(dx, dy);

      dx /= gcd;
      dy /= gcd;
   } else if (dx !== 0) {
      dx = Math.sign(dx);
   } else {
      dy = Math.sign(dy);
   }

   let blockers = 0;
   let x3 = x;// x3 !== x2; ) {
   for (let y3 = y; x3 !== x2 || y3 !== y2; y3 += dy) {
      if (grid.get(x3, y3) === '#' && (x3 !== x || y3 !== y)) {
         blockers ++;
      }
      x3 += dx;
   }

   n ++;
   visible.push({ x: x2, y: y2, dx, dy, angle: Math.atan2(dx, dy), blockers });
})

// n = visible.length;
// if (n > best) {
//    best = n;
//    bestx = x;
//    besty = y;
//    // console.log(x, y, best);
// }

console.log(bestx, besty);

let angle = visible[0].angle + 0.1;
function sorter(a, b) {
   if (b.blockers === a.blockers) {
      return (b.angle - angle) - (a.angle - angle);
   }
   return a.blockers - b.blockers;
}

visible.sort(sorter);
// console.log(x, y, visible, visible.length);
console.log(visible[199]);

// for (let vap = 0; vap < 200; vap ++) {
//    let deposed = visible.shift();

//    console.log(deposed);
//    visible.sort(sorter);
// }

// console.log(visible.slice(0, 20).map(i => i.angle))

// console.log('winner', bestx, besty, best);

// log(grid.print())
