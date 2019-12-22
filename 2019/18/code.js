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
return;

// for (let node in nodes) {
//    nodes[node].distances = explore(nodes[node]);
// }

// const ANSWER = ['a', 'f', 'b', 'j', 'g', 'n', 'h', 'd', 'l', 'o', 'e', 'p', 'c', 'i', 'k', 'm'];
// function test(v) {
//    return v.filter((el, i) => ANSWER[i] !== el).length === 0;
// }

// Part 1
function findBestPath2() {
   let queue = [{ node: '@', dist: 0, visited: [] }];
   let distance = {};
   let checked = {};
   while (queue.length > 0) {
      const { node, dist, visited } = queue.shift();
      const vjoin = visited.map(id).join('');

      if (checked[vjoin]) {
         log('Skip', node, dist, vjoin);
         continue;
      }
      checked[vjoin] = true;

      distance[node] = distance[node] || {};
      // if (distance[node][vjoin.length]) {
      //    if (distance[node][vjoin.length].dist < dist) {
      //       continue;
      //    }
      // }

      // log('', vjoin, dist, visited);
      if (test(visited)) {
         log('--->', node, dist, visited);
      }

      // distance[node][vjoin.length] = { dist, visited };

      let distances = nodes[node].distances;
      for (next in distances) {
         if (next === node || visited.includes(next)) {
            continue;
         }

         if (isKey(next)) {
            // if (test(visited)) {
               // log(next);
               // log(distances[next].doors, distances[next].doors.includes(door => !visited.includes(door.lower())));
            // }

            if (distances[next].doors.filter(door => !visited.includes(door.toLowerCase())).length === 0) {
               let copy = visited.map(id).concat([next]);
               let obj = {
                  node: next,
                  dist: dist + distances[next].dist,
                  visited: copy,
               };

               if (copy.length > 1 && test(copy.slice(0, copy.length - 1))) {
                  log('Queueing', obj, distances[next].doors, visited);
               }
               queue.push(obj);
            }
         }
      }

      if (isDone(visited)) {
         return { distance, dist, visited };
      }

      queue.sort((a, b) => {
         // if (a.visited.length === b.visited.length) {
            return a.dist - b.dist;
         // }
         // return a.visited.length - b.visited.length;
      });
   }
}

// let t = 0;
// arr.forEach((v, i) => {
//    if (v === 'm') { return; }
//    t += (nodes[v].distances[arr[i + 1]].dist)
// });
// log(t);

// log(
   // findBestPath()
// );
const res = findBestPath();

// arr.forEach((v, i) => {
//    log(`To get to ${v} in ${i} steps`)
//    log(res.distance[v][i])
// });
log(`Part 1: `, res.dist, res.visited.join());
