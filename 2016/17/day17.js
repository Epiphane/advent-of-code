const fs = require('fs');

// let file = process.argv[2] || 'input';
// let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

var md5 = require('./md5');

console.log(md5('hijkl'))

let passcode = 'pgflpeqp';

function options(path) {
   let hash = md5(path);

   let options = [];
   if (hash.charCodeAt(0) >= 'b'.charCodeAt(0) && hash.charCodeAt(0) <= 'z'.charCodeAt(0)) {
      options.push('U');
   }
   if (hash.charCodeAt(1) >= 'b'.charCodeAt(0) && hash.charCodeAt(1) <= 'z'.charCodeAt(0)) {
      options.push('D');
   }
   if (hash.charCodeAt(2) >= 'b'.charCodeAt(0) && hash.charCodeAt(2) <= 'z'.charCodeAt(0)) {
      options.push('L');
   }
   if (hash.charCodeAt(3) >= 'b'.charCodeAt(0) && hash.charCodeAt(3) <= 'z'.charCodeAt(0)) {
      options.push('R');
   }

   return options
}

function getBest(x, y, path, last = '') {
   if (x === 3 && y == 3) {
      console.log('done', path);
      return '';
   }

   opts = options(path);
   console.log(last, path, opts);

   let bestPath = '';
   let best = 'none';
   if (opts.indexOf('U') >= 0 && y > 0) {
      let mUp = getBest(x, y - 1, path + 'U', last + ' ');
      if (bestPath.length === 0 || mUp.length < bestPath) {
         bestPath = 'U' + mUp;
         best = 'U';
      }
   }
   opts = options(path);
   if (opts.indexOf('D') >= 0 && y < 3) {
      let mDown = getBest(x, y + 1, path + 'D', last + ' ');
      if (bestPath.length === 0 || mDown.length < bestPath) {
         bestPath = 'D' + mDown;
         best = 'D';
      }
   }
   opts = options(path);
   if (opts.indexOf('L') >= 0 && x > 0) {
      let mUp = getBest(x - 1, y, path + 'L', last + ' ');
      if (bestPath.length === 0 || mUp.length < bestPath) {
         bestPath = 'L' + mUp;
         best = 'L';
      }
   }
   opts = options(path);
   if (opts.indexOf('R') >= 0 && x < 3) {
      let mDown = getBest(x + 1, y, path + 'R', last + ' ');
      if (bestPath.length === 0 || mDown.length < bestPath) {
         bestPath = 'R' + mDown;
         best = 'R';
      }
   }

   console.log(last, 'best', bestPath, best);
   return bestPath
}

// passcode = 'udskfozm';
let queue = [{x: 0, y: 0, path: passcode}];
while (queue.length > 0) {
   let front = queue.shift()

   let { x, y, path } = front;
   if (x === 3 && y === 3) {
      console.log(`Done! ${path.length}`);
      // console.log(front);
      continue;
   }

   let opts = options(path);
   // console.log(front, opts);
   if (opts.indexOf('U') >= 0 && y > 0) {
      queue.push({ x, y: y - 1, path: path + 'U' });
   }
   if (opts.indexOf('D') >= 0 && y < 3) {
      queue.push({ x, y: y + 1, path: path + 'D' });
   }
   if (opts.indexOf('L') >= 0 && x > 0) {
      queue.push({ x: x - 1, y, path: path + 'L' });
   }
   if (opts.indexOf('R') >= 0 && x < 3) {
      queue.push({ x: x + 1, y, path: path + 'R' });
   }
}

console.log('end');

let x = 0;
let y = 0;

let opts = options(passcode);
let path = passcode;
let a = 0;
// console.log(getBest(0, 0, passcode, ''));
// while (opts.length === 1 && a++ < 10) {
//    switch (opts[0]) {
//       case 'U':
//          y --;
//          break;
//       case 'D':
//          y ++;
//          break;
//       case 'L':
//          x --;
//          break;
//       case 'R':
//          x ++;
//          break;
//    }
//    path += opts[0];
//    console.log(`Path: ${path} x=${x} y=${y}`);
//    opts = options(path);
//    console.log(`Options: ${opts.join(' ')}`)
// }
