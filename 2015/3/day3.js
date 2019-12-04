const fs = require('fs');

let inputFile = 'input';
let input = fs.readFileSync(inputFile + '.txt').toString().trim();

let delivered = [];
let minx = 0, miny = 0, maxx = 0, maxy = 0;

function Deliver(x, y) {
   delivered[y] = delivered[y] || [];
   delivered[y][x] = delivered[y][x] || 0;
   delivered[y][x]++;

   if (x < minx) minx = x;
   if (y < miny) miny = y;
   if (x > maxx) maxx = x;
   if (y > maxy) maxy = y;
}

let x = [0, 0];
let y = [0, 0];
let t = 0;
Deliver(x[0], y[0]);
for (let i = 0; i < input.length; i ++) {
   switch (input[i]) {
      case '<':
         Deliver(--x[t], y[t]);
         break;
      case '>':
         Deliver(++x[t], y[t]);
         break;
      case '^':
         Deliver(x[t], --y[t]);
         break;
      case 'v':
         Deliver(x[t], ++y[t]);
         break;
   }
   t = (++t) % 2;
}

let total = 0;
for (let x = minx; x <= maxx; x ++) {
   for (let y = miny; y <= maxy; y ++) {
      if (delivered[y][x] >= 0) {
         total ++;
      }
   }
}
console.log(total);