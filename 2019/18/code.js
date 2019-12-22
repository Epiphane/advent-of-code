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

      if (val === START || isKey(val)) {
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

 function findBestPath(robots) {
    let explored = {};
    let queue = [{
       robots: robots.map(r => { return { ...r }; }),
       dist: 0,
       keys: [],
       visits: [],
    }];
    while (queue.length > 0) {
       const { robots, dist, keys, visits } = queue.shift();

       if (isDone(keys)) {
          return dist;
       }

       const newDist = dist + 1;
       let check = (robot, x, y) => {
          let tile = map.get(x, y);
          if (tile === WALL) {
             return;
          }
          else if (isDoor(tile) && !keys.includes(tile.toLowerCase())) {
             return;
          }
          else {
             let newKeys = keys.map(id);
             let newVisits = visits.map(id);
             let sorted = newKeys.map(id).sort().join();
             explored[sorted] = explored[sorted] || new Map(Infinity);

             if (explored[sorted].has(x, y)) {
                return;
             }
             explored[sorted].set(x, y, newDist);

             if (isKey(tile) && !newKeys.includes(tile)) {
                newKeys.push(tile);
                newVisits.push(newDist);
             }

             sorted = newKeys.map(id).sort().join();
             explored[sorted] = explored[sorted] || new Map(Infinity);
             explored[sorted].set(x, y, newDist);

             insert({
                robots: robots.map((r, i) => {
                   if (i === robot) {
                      return { x, y };
                   }
                   else {
                      return r;
                   }
                }),
                dist: newDist,
                keys: newKeys,
                visits: newVisits,
             }, queue);
          }
       };

       robots.forEach(({ x, y }, i) => {
          check(i, x - 1, y);
          check(i, x + 1, y);
          check(i, x, y - 1);
          check(i, x, y + 1);
       });
    }

    return -1;
 }

log(`Part 1: ${findBestPath([{ ...nodes['@'] }])}`);

// Part 2 is a doozy!
const { x, y } = nodes['@'];

map.set(x, y, WALL);
map.set(x - 1, y, WALL);
map.set(x + 1, y, WALL);
map.set(x, y - 1, WALL);
map.set(x, y + 1, WALL);
map.set(x - 1, y - 1, START);
map.set(x - 1, y + 1, START);
map.set(x + 1, y - 1, START);
map.set(x + 1, y + 1, START);

let robots = [
   { x: x - 1, y: y - 1 },
   { x: x - 1, y: y + 1 },
   { x: x + 1, y: y - 1 },
   { x: x + 1, y: y + 1 },
];

log(`Part 2: ${findBestPath(robots)}`);
