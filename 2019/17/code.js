const { Map } = require('../../map');
const { Machine, DefaultIntcodeMachine } = require('../intcode/machine');
const log = console.log;

let machine = DefaultIntcodeMachine();
const { stdin, stdout } = machine;

// Part 2 modification.
machine[0] = 2;

// Get initial output
machine.run();

let map = new Map('.');

function updateMap() {
   let y = 0;
   while (!stdout.empty()) {
      let line = stdout.readline();
      if (line === '') {
         break;
      }
      line.split('').forEach((val, x) => {
         map.set(x, y, val);
      });
      y ++;
   }
}

updateMap();
log(map.print());

// Part 1
log('Part 1: ' + map.reduce((prev, val, x, y) => {
   if (val !== '#') { return prev; }
   if (
      map.get(x - 1, y) !== '#' ||
      map.get(x + 1, y) !== '#' ||
      map.get(x, y - 1) !== '#' ||
      map.get(x, y + 1) !== '#'
   ) {
      return prev;
   }
   return prev + x * y;
}, 0));
log();

// Part 2
const NORTH = 0,
      EAST  = 1,
      SOUTH = 2,
      WEST  = 3;
function dirToMove(dir) {
   if (dir === NORTH) return { x:  0, y: -1 };
   if (dir === EAST) return  { x:  1, y:  0 };
   if (dir === SOUTH) return { x:  0, y:  1 };
   if (dir === WEST) return  { x: -1, y:  0 };
   return null;
}

function compile(fn) {
   return fn.split(/([LR])/g).map(contents => {
      if (contents === 'L') {
         return 'L';
      }
      else if (contents === 'R') {
         return 'R';
      }
      else {
         return `${contents.length}`;
      }
   }).filter(i => i !== '0').join(',')
}

let start;
let end;
map.forEach((val, x, y) => {
   if (val === '^') {
      start = { x, y, dir: NORTH };
   }
   else if (val === '>') {
      start = { x, y, dir: EAST };
   }
   else if (val === 'v') {
      start = { x, y, dir: SOUTH };
   }
   else if (val === '<') {
      start = { x, y, dir: WEST };
   }
   else if (val === '#') {
      let score =
         (map.get(x - 1, y) === '.' ? 1 : 0) +
         (map.get(x + 1, y) === '.' ? 1 : 0) +
         (map.get(x, y - 1) === '.' ? 1 : 0) +
         (map.get(x, y + 1) === '.' ? 1 : 0);
      if (score === 3) {
         end = { x, y };
      }
   }
});

// Determine path
let path = '';
let pos = { ...start };
while (pos.x !== end.x || pos.y !== end.y) {
   let move = dirToMove(pos.dir);
   if (map.get(pos.x + move.x, pos.y + move.y) === '#') {
      path += '.';
      pos.x += move.x;
      pos.y += move.y;
   }
   else {
      let left = dirToMove((pos.dir + 3) % 4);
      let right = dirToMove((pos.dir + 1) % 4);
      if (map.get(pos.x + left.x, pos.y + left.y) === '#') {
         pos.dir = (pos.dir + 3) % 4;
         path += 'L';
      }
      else if (map.get(pos.x + right.x, pos.y + right.y) === '#') {
         pos.dir = (pos.dir + 1) % 4;
         path += 'R';
      }
      else {
         log('Turn around? Something is broken');
         return;
      }
   }
}

let program = [];
let A;
let B;
let C;
let found = false;
const MAX_LENGTH = 20;

const aMax = path.length - 2;
for (let aLength = aMax; !found && aLength > 0; aLength --) {
   const A_ = path.slice(0, aLength);
   A = compile(A_);
   if (A.length > MAX_LENGTH) {
      continue;
   }

   let aCursor = 0;
   let aProgram = [];
   while (aCursor < path.length) {
      if (aProgram.length > MAX_LENGTH / 2) {
         break;
      }
      else if (path.slice(aCursor, aCursor + aLength) === A_) {
         aProgram.push('A');
         aCursor += aLength;
      }
      else {
         break;
      }
   }

   const bMax = path.length - aCursor - 1;
   for (let bLength = bMax; !found && bLength > 0; bLength --) {
      const B_ = path.slice(aCursor, aCursor + bLength);
      B = compile(B_);
      if (B.length > MAX_LENGTH) {
         continue;
      }

      let bCursor = aCursor;
      let bProgram = aProgram.map(i => i);
      while (bCursor < path.length) {
         if (program.length > MAX_LENGTH / 2) {
            break;
         }
         else if (path.slice(bCursor, bCursor + aLength) === A_) {
            bProgram.push('A');
            bCursor += aLength;
         }
         else if (path.slice(bCursor, bCursor + bLength) === B_) {
            bProgram.push('B');
            bCursor += bLength;
         }
         else {
            break;
         }
      }

      const cMax = path.length - aCursor - bCursor;
      for (let cLength = cMax; !found && cLength > 0; cLength --) {
         const C_ = path.slice(bCursor, bCursor + cLength);
         C = compile(C_);
         if (C.length > MAX_LENGTH) {
            continue;
         }

         let cCursor = bCursor;
         let cProgram = bProgram.map(i => i);
         while (cCursor < path.length) {
            if (cProgram.length > MAX_LENGTH / 2) {
               break;
            }
            else if (path.slice(cCursor, cCursor + aLength) === A_) {
               cProgram.push('A');
               cCursor += aLength;
            }
            else if (path.slice(cCursor, cCursor + bLength) === B_) {
               cProgram.push('B');
               cCursor += bLength;
            }
            else if (path.slice(cCursor, cCursor + cLength) === C_) {
               cProgram.push('C');
               cCursor += cLength;
            }
            else {
               break;
            }
         }

         if (cCursor === path.length) {
            program = cProgram.join(',');
            found = true;
         }
      }
   }
}

if (!found) {
   log('No valid program found');
   return;
}

log(`${stdout.readline()} ` + program);
stdin.writeline(program);
machine.run();

log(`${stdout.readline()} ` + A);
stdin.writeline(A);
machine.run();

log(`${stdout.readline()} ` + B);
stdin.writeline(B);
machine.run();

log(`${stdout.readline()} ` + C);
stdin.writeline(C);
machine.run();

log(`${stdout.readline()} n`);
stdin.writeline('n');;

machine.run();

// Read initial map
updateMap();

// Read final map
updateMap();

log(`Part 2: ${stdout.read()}`);
