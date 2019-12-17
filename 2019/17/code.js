const fs = require('fs');
const md5 = require('../../md5');
let { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');
const log = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())

let input = [
   '..................................#####....',
   '..................................#...#....',
   '..................................#...#....',
   '..................................#...#....',
   '..............................#########....',
   '..............................#...#........',
   '..............................#...#........',
   '..............................#...#........',
   '..............................#...#........',
   '..............................#...#........',
   '..............................#...#........',
   '..............................#...#........',
   '..........................#########........',
   '..........................#...#............',
   '..........................#...#############',
   '..........................#...............#',
   '..........................#############...#',
   '......................................#...#',
   '..................................#########',
   '..................................#...#....',
   '#####...........###########.......#...#....',
   '#...#...........#.........#.......#...#....',
   '#...#...........#.........#.......#...#....',
   '#...#...........#.........#.......#...#....',
   '#############...#.........#.......#...#....',
   '....#.......#...#.........#.......#...#....',
   '....#.......#...#.........#...^########....',
   '....#.......#...#.........#.......#........',
   '....###########.#.........#########........',
   '............#.#.#..........................',
   '............#.#.#..........................',
   '............#.#.#..........................',
   '............#####..........................',
   '..............#............................',
   '..........#########........................',
   '..........#...#...#........................',
   '......#########...#........................',
   '......#...#.......#........................',
   '......#...#.......#........................',
   '......#...#.......#........................',
   '......#...#.......#........................',
   '......#...#.......#........................',
   '......#...#.......#############............',
   '......#...#...................#............',
   '..#########...................#............',
   '..#...#.......................#............',
   '..#...#...................#####............',
   '..#...#....................................',
   '..#####....................................'
];

let map = new Map('.');

input.forEach((line, y) => {
   line.split('').forEach((c, x) => {
      map.set(x, y, c);
   })
})

log(map.print());

let total = 0;
map.forEach((val, x, y) => {
   if (val != '#') {
      return
   }

   if (map.get(x - 1, y) === '#' &&
   map.get(x + 1, y) === '#' &&
   map.get(x, y - 1) === '#' &&
   map.get(x, y + 1) === '#') {
      total += x * y;
   }
})
log(total);

// raw[0] = '2';

let machine = new Machine(raw);
const { stdin, stdout } = machine;

function writeProgram(line) {
   line.split('').forEach(c => {
      stdin.submit(c.charCodeAt(0));
   });
   stdin.submit(10);
}

// R8,L10,L12,R4,R8,
// L12,R4,R4,
// R8,L10,
// L12,R4,R8,L10,R8,
// R8,L10,L12,R4,R8,
// L12,R4,R4,
// R8,L10,R8,R8,
// L12,R4,R4,
// R8,L10,R8,R8,
// L12,R4,R4

// A,
// B,
// A,
// L10,R8,
// A,
// B,
// C,B
// C,B


// A
// R,8,L,10,L,12,R,4,
// B
// R,8,L,12,R,4,R,4,
// A
// R,8,L,10,L,12,R,4,
// C
// R,8,L,10,R,8,
// A
// R,8,L,10,L,12,R,4,
// B
// R,8,L,12,R,4,R,4,
// C
// R,8,L,10,R,8,
// B
// R,8,L,12,R,4,R,4,
// C
// R,8,L,10,R,8,
// B
// R,8,L,12,R,4,R,4

writeProgram('A,B,A,C,A,B,C,B,C,B');
writeProgram('R,8,L,10,L,12,R,4');
writeProgram('R,8,L,12,R,4,R,4');
writeProgram('R,8,L,10,R,8');
writeProgram('n');

while (!machine.exited) {
   machine.run();

   if (machine.paused) {
      break;
   }
}

while (!stdout.empty()) {
   log(stdout.read());
}

// while (!stdout.empty()) {
//    let i = stdout.read();
//    process.stdout.write(String.fromCharCode(i));
// }
// log();
