const { Map } = require('../../map');
const { DefaultIntcodeMachine } = require('../intcode/machine');
const log = console.log;

function test(x, y) {
   let machine = DefaultIntcodeMachine();
   let { stdin, stdout } = machine;
   stdin.submit(x);
   stdin.submit(y);
   machine.run();

   return stdout.read();
}

// Part 1
let map = new Map();
for (let x = 0; x < 50; x ++) {
   for (let y = 0; y < 50; y ++) {
      map.set(x, y, test(x, y));
   }
}

log(`Area: ${map.reduce((prev, val) => prev + val, 0)}`);

// Part 2
function makeBox(y) {
   let first = -1;
   let last = -1;
   for (let x = Math.floor(y / 2);; x ++) {
      if (test(x, y)) {
         last = x;

         if (first < 0) {
            first = x;
         }
      }
      else if (first >= 0 || x > 10 * y) {
         break;
      }
   }

   for (let nx = first; nx <= last; nx++) {
      let size = last - nx;
      if (test(nx, y + size)) {
         return { x: nx, size: size + 1 };
      }
   }

   return { x: 0, size: 0 };
}

let found = false;
const TARGET = 100;
let minY, maxY;
// Broad strokes
for (let y = 1; !found; ) {
   let box = makeBox(y);
   if (box.size >= TARGET) {
      found = true;
      maxY = y;
   } else {
      minY = y;
      y = Math.ceil(y * 1.5);
   }
}

// Narrow it down
while (maxY - minY > 1) {
   let y = Math.floor((maxY + minY) / 2);
   let box = makeBox(y);
   if (box.size >= TARGET) {
      maxY = y;
   }
   else {
      minY = y;
   }
}

let box = makeBox(maxY);
log(`Closest 100x100 box: ${box.x * 10000 + maxY}`);
