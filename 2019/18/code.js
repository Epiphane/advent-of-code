const fs = require('fs');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { id } = require('../utils');
const log = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim());

let map = new Map('#');

let WALL = '#';
let OPEN = '.';
let START = '@';

let A = 'A'.charCodeAt(0);
let Z = 'Z'.charCodeAt(0);
let a = 'a'.charCodeAt(0);
let z = 'z'.charCodeAt(0);

function isKey(tile) {
   return tile.charCodeAt(0) >= a && tile.charCodeAt(0) <= z;
}

function isDoor(tile) {
   return tile.charCodeAt(0) >= A && tile.charCodeAt(0) <= Z;
}

let start = false;
let nodes = {};

lines.forEach((line, y) => {
   line.split('').forEach((val, x) => {
      map.set(x, y, val);

      if (val === START || isKey(val)) { //} || isDoor(val)) {
         nodes[val] = { x, y };
      }
   });
});

function isDone(visited) {
   for (let node in nodes) {
      if (isKey(node) && !visited.includes(node)) {
         return false;
      }
   }

   return true;
}

function findBestPath(start) {
   let explored = {};
   let queue = [{ ...start, dist: 0, keys: [] }];
   while (queue.length > 0) {
      const current = queue.shift();
      const { x, y, dist, keys } = current;
      const tile = map.get(x, y);

      if (keys[0] === 'a' && keys[1] === 'f') {
         log(x, y, tile, dist, keys);
      }

      if (isDone(keys)) {
         log(keys);
         return dist;
      }

      if (tile === WALL) {
         continue;
      }
      else if (isDoor(tile) && !keys.includes(tile.toLowerCase())) {
         continue;
      }
      else if (isKey(tile)) {
         if (!keys.includes(tile)) {
            keys.push(tile);
         }
      }

      const sorted = keys.map(id).sort().join();
      explored[sorted] = explored[sorted] || new Map(Infinity);
      explored[sorted].set(x, y, dist);

      let check = (x, y) => {
         let tile = map.get(x, y);
         if (tile === WALL) {
            return;
         }
         else if (isDoor(tile) && !keys.includes(tile.toLowerCase())) {
            return;
         }
         else if (isKey(tile) && keys[keys.length - 1] === tile) {
            return;
         }
         else if (explored[sorted].get(x, y) < dist + 1) {
            return;
         }
         else {
            queue.push({ x, y, dist: dist + 1, keys: keys.map(id) });
         }
      };

      check(x - 1, y);
      check(x + 1, y);
      check(x, y - 1);
      check(x, y + 1);

      queue.sort((a, b) => a.dist - b.dist);
   }

   return -1;
}

log(findBestPath(nodes['@']));
