const fs = require('fs');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const log = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim());

let map = new Map();

let WALL = '#';
let OPEN = '.';
let START = '@';

let A = 'A'.charCodeAt(0);
let Z = 'Z'.charCodeAt(0);
let a = 'a'.charCodeAt(0);
let z = 'z'.charCodeAt(0);

let start = false;
let nodes = {};

lines.forEach((line, y) => {
   line.split('').forEach((val, x) => {
      map.set(x, y, val);
   });
});

function explore(start, end) {
   let result = {};
   let queue = [{ ...start, dist: 0, doors: [] }];
   while (queue.length > 0) {
      const current = queue.shift();
      const { x, y, dist, doors } = current;
      const tile = map.get(x, y);

      if (tile === '#') {
         continue;
      }
      else if (tile >= a && tile <= z) {
         // Key
         if (!result[tile]) {
            result[tile] = { dist, doors: doors.map(id) };
         }
         else if (result[tile].doors.filter(l => doors.indexOf(l) < 0)) {

         }
      }
      else if (tile >= A && tile <= Z) {
         // Door
      }


   }

   return result;
}
