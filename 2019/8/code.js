const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine } = require('../intcode/machine');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim()
   .split('')
   .map(i => parseInt(i))

const log = console.log;

log(input);

let layer0 = 0;
let layer1 = 0;
let layer2 = 0;
let count = [0, 0, 0];
let best = 150;
let n = 0;
// input.forEach((pixel, i) => {

//    count[pixel]++;
//    if (++n >= 25 * 6) {
//       if (count[0] < best) {
//          best = count[0];
//          console.log(count);
//          console.log(count[1] * count[2])
//       }
//       count = [0, 0, 0];
//       n = 0;
//    }
// })

let W = 25;
let H = 6;

// W = H = 2;

let final = MakeGrid(W, H, () => 0);

n = 0;
x = 0;
y = 0;
let l = 0;
input.forEach((pixel, i) => {

   // log(x, y, l);
   if (final.get(x, y) === 0) {
      if (pixel !== 2) {
         final.set(x, y, pixel === 1 ? 'X' : ' ');
      }
   }

   if (x++ >= W - 1) {
      y++
      x=0;
   }

   if (++n >= W * H) {
      l++;
      if (count[0] < best) {
         best = count[0];
      }
      count = [0, 0, 0];
      n = 0;
      x = 0;
      y = 0;
   }
})
log(final.print(''));

// log()
// log()
// log()

// final = MakeGrid(W, H, () => 0);

// for (let x = 0; x <= W; x ++) {
//    for (let y = 0; y <= H; y ++) {
//       let ndx = x + y * H;

//       for (let l = ndx; l < input.length; l += W * H) {
//          if (input[l] === 2) { continue; }
//          final.set(x, y, input[l] === 0 ? 'X' : ' ');
//          break;
//       }
//    }
// }

// log(final.print(' '));
