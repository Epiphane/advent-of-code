const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');
const log = console.log;

let TEST = (process.argv[2] === 'test');
let file = 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let input = raw.split('').map(i => +i);

let PATTERN = [0, 1, 0, -1];
function accum(list, index) {
   let accumulator = 0;
   let ndx = 1;
   for (let i = index; i < list.length; i ++) {
      let repeats = index + 1;
      // let ndx = Math.floor((i + 1) / repeats) % PATTERN.length;
      let mult = PATTERN[ndx];
      ndx = (ndx + 1) % PATTERN.length;

      for (let j = 0; j < repeats && i < list.length; j ++) {
         accumulator += mult * list[i];
         i ++;
      }
   }

   return accumulator;
}

function iterate(list, start) {
   let output = list.map(i => i);

   let bounds = list.map((_, i) => (start + 1) * i + (start)).filter(i => i <= list.length);
   let accumulator = accum(list, start);
   log(bounds, accumulator);

   for (let index = start; index < output.length; index ++) {
      output[index] = Math.abs(accumulator) % 10;

      let nextBounds = bounds.map((i, ndx) => {
         let next = i + ndx + 1;

         // let mult = PATTERN[(ndx + 1) % PATTERN.length];
         // for (let start = i; start < next; start ++) {

         // }
         return next;
      })
      for (let b = 0; b < bounds.length; b ++) {
         let lastMult = PATTERN[b % PATTERN.length];
         let mult = PATTERN[(b + 1) % PATTERN.length];
         let lastStart = bounds[b];
         let nextStart = nextBounds[b];

         for (let i = lastStart; i < nextStart && i < list.length; i ++) {
            accumulator -= mult * list[i];
            accumulator += lastMult * list[i];
            // log(i, `Add ${lastMult} * ${list[i]}, Sub ${mult} * ${list[i]}`)
         }
      }
      bounds = nextBounds.filter(b => b <= list.length);
      // log(accumulator, nextBounds, bounds);
   }

   // let output = Array.apply(null, new Array(list.length)).map(i => 0);
   // for (let i = base; i < list.length; i ++) {
   //    let digitVal = list.reduce((prev, val, index) => {
   //       let repeats = i + 1;

   //       let ndx = Math.floor((index + 1) / repeats) % PATTERN.length;
   //       // console.log(prev, val * PATTERN[ndx], val, index, ndx, PATTERN[ndx]);
   //       return prev + val * PATTERN[ndx];
   //    }, 0);

   //    output[i] = (Math.abs(digitVal) % 10);
   // };

   return output;
}

// log(iterate([1, 2, 3, 4, 5, 6, 7, 8]))
// return;

final = [];
let I = 10000;
if (TEST) { I = 1 }
for (let i = 0; i < I; i ++) {
   input.forEach(i => final.push(i));
}

N = 5973847 % final.length;

if (0) {
   let map = {};
   function digit(it, position) {
      if (it === 0) {
         return final[position];
      }

      map[it] = map[it] || [];

      if (position in map[it]) {
         return map[it][position];
      }

      let repeat = position + 1;
      let ndx = 1;
      let digitVal = 0;
         // log (it, position, '--');
      for (let i = repeat - 1; i < final.length; i += repeat) {
         let mult = PATTERN[ndx];
         ndx = (ndx + 1) % PATTERN.length;

         if (mult === 0) { continue; }

         if (mult === -1) {
            for (let j = 0; j < repeat && i + j < final.length; j++) {
               let d = digit(it - 1, i + j);
               // log(i + j, d);
               digitVal -= d
            }
         }
         else {
            for (let j = 0; j < repeat && i + j < final.length; j++) {
               let d = digit(it - 1, i + j);
               // log(i + j, d);
               digitVal += d
            }
         }
      }

      map[it][position] = Math.abs(digitVal) % 10;
      return map[it][position];
   }

   for (let i = N; i < N+8; ++i) {
      log(digit(10, i));
   }

   return;
}

let state = final.map(i => i);
for (let step = 0; step < 100; step ++) {
   // log(state);
   log(step);
   state = iterate(state, N);
   // log(state);
}
log(state.slice(N, N + 8));

// console.log(state.slice(0, 8));
// console.log(state.slice(5973847, 5973847+8).join(''));

// console.log(
//    iterate([1, 2, 3, 4, 5, 6, 7, 8], [0, 1, 0, -1])
// )
