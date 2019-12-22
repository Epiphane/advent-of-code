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

function insert(element, array) {
   array.splice(locationOf(element, array) + 1, 0, element);
   return array;
 }

 function locationOf(element, array, start, end) {
   start = start || 0;
   end = end || array.length;
   var pivot = parseInt(start + (end - start) / 2, 10);
   if (end-start <= 1 || array[pivot] === element) return pivot;
   if (array[pivot].dist < element.dist) {
     return locationOf(element, array, pivot, end);
   } else {
     return locationOf(element, array, start, pivot);
   }
 }

 let explored;
function findBestPath(start) {
   explored = {};
   let queue = [{ ...start, dist: 0, keys: [], sorted: '' }];
   while (queue.length > 0) {
      const current = queue.shift();
      let { x, y, dist, keys, sorted } = current;
      const tile = map.get(x, y);

      if (isDone(keys)) {
         return dist;
      }

      let check = (x, y) => {
         let tile = map.get(x, y);
         if (tile === WALL) {
            return;
         }
         else if (isDoor(tile) && !keys.includes(tile.toLowerCase())) {
            return;
         }
         else {
            let newKeys = keys.map(id);
            if (isKey(tile) && !keys.includes(tile)) {
               newKeys.push(tile);
            }

            const sorted = newKeys.map(id).sort().join();
            explored[sorted] = explored[sorted] || new Map(Infinity);

            if (explored[sorted].has(x, y)) {
               return;
            }
            explored[sorted].set(x, y, dist + 1);

            insert({ x, y, dist: dist + 1, keys: newKeys, sorted }, queue);
         }
      };

      check(x - 1, y);
      check(x + 1, y);
      check(x, y - 1);
      check(x, y + 1);
   }

   return -1;
}

log(findBestPath(nodes['@']));
