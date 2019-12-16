const fs = require('fs');
const log = console.log;
let input = fs.readFileSync('input.txt').toString().trim().split('').map(i => +i);
let PATTERN = [0, 1, 0, -1];

function iterate(list, output, start) {
   let bounds = [];
   for (let i = 0; i < output.length; i ++) {
      let bound = (start + 1) * i + start;
      if (bound > list.length) {
         break;
      }
      bounds.push(bound);
   }
   let accumulator = 0;

   let repeats = start + 1;
   let ndx = Math.floor((start + 1) / repeats) % PATTERN.length;
   for (let i = start; i < list.length;) {
      let mult = PATTERN[ndx];

      for (let j = 0; j < repeats && i < list.length; j ++) {
         accumulator += mult * list[i];
         i ++;
      }

      ndx = (ndx + 1) % PATTERN.length;
   }

   // Now update the elements.
   for (let index = start; index < output.length; index ++) {
      output[index] = Math.abs(accumulator) % 10;

      let nextBounds = bounds.map((i, ndx) => i + ndx + 1);
      nextBounds.forEach((nextStart, ndx) => {
         let nextMult = PATTERN[(ndx + 1) % PATTERN.length];
         let lastMult = PATTERN[ndx % PATTERN.length];
         let lastStart = bounds[ndx];

         for (let i = lastStart; i < nextStart && i < list.length; i ++) {
            accumulator += lastMult * list[i];
            accumulator -= nextMult * list[i];
         }
      })
      bounds = nextBounds.filter(b => b <= list.length);
   }

   return output;
}

// Part 1
let state = input.map(i => i);
let buf = state.map(i => i);
for (let gen = 0; gen < 100; gen ++) {
   let tmp = iterate(state, buf, 0);
   buf = state;
   state = tmp;
}

log(state.slice(0, 8).join(''));

// Part 2
let fullState = [];
for (let i = 0; i < 10000; i ++) {
   input.forEach(i => fullState.push(i));
}

let startIndex = 0;
for (let i = 0; i < 7; i ++) {
   startIndex *= 10;
   startIndex += fullState[i];
}

buf = fullState.map(i => i);
for (let gen = 0; gen < 100; gen ++) {
   let tmp = iterate(fullState, buf, startIndex);
   buf = fullState;
   fullState = tmp;
}

log(fullState.slice(startIndex, startIndex + 8).join(''));
