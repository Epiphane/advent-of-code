const fs = require('fs');
const { Map } = require('../../map');
const { id } = require('../utils');
const log = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString();

let lines = raw.split('\n').map(line => line.trimRight())
let map = new Map(' ');

lines.forEach((line, y) => {
   line.split('').forEach((val, x) => {
      map.set(x - 2, y - 2, val);
   });
});

let min = { x: 0, y: 0 },
    max = { x: map.max.x - 2, y: map.max.y - 2 },
    innerMin = { ...max },
    innerMax = { ...min };

map.forEachInCol(Math.floor((min.x + max.x) / 2), (val, _, y) => {
   if (y < min.x || y > max.y) {
      return;
   }

   if (val !== '.' && val !== '#') {
      innerMin.y = Math.min(innerMin.y, y - 1);
      innerMax.y = Math.max(innerMax.y, y + 1);
   }
});

map.forEachInRow(Math.floor((min.y + max.y) / 2), (val, x, _) => {
   if (x < min.x || x > max.x) {
      return;
   }

   if (val !== '.' && val !== '#') {
      innerMin.x = Math.min(innerMin.x, x - 1);
      innerMax.x = Math.max(innerMax.x, x + 1);
   }
});

// Locate portals.
let portals = {};
for (let x = min.x - 1; x <= max.x + 1; x ++) {
   for (let y = min.y - 1; y <= max.y + 1; y ++) {
      if (
         x !== min.x - 1 &&
         x !== max.x + 1 &&
         x !== innerMin.x + 1 &&
         x !== innerMax.x - 1 &&
         y !== min.y - 1 &&
         y !== max.y + 1 &&
         y !== innerMin.y + 1 &&
         y !== innerMax.y - 1
      ) {
         continue;
      }

      const val = map.get(x, y);
      if (val === ' ' || val === '.' || val === '#') {
         continue;
      }

      let portal, z, tile;
      if (x === min.x - 1 || x === innerMax.x - 1) {
         portal = `${map.get(x - 1, y)}${map.get(x, y)}`;
         tile = { x: x + 1, y };
         if (x === min.x - 1) { z = -1; }
         else { z = 1; }
         map.set(x - 1, y, ' ');
      }
      else if (x === max.x + 1 || x === innerMin.x + 1) {
         portal = `${map.get(x, y)}${map.get(x + 1, y)}`;
         tile = { x: x - 1, y };
         if (x === max.x + 1) { z = -1; }
         else { z = 1; }
         map.set(x + 1, y, ' ');
      }
      else if (y === min.y - 1 || y === innerMax.y - 1) {
         portal = `${map.get(x, y - 1)}${map.get(x, y)}`;
         tile = { x, y: y + 1 };
         if (y === min.y - 1) { z = -1; }
         else { z = 1; }
         map.set(x, y - 1, ' ');
      }
      else if (y === max.y + 1 || y === innerMin.y + 1) {
         portal = `${map.get(x, y)}${map.get(x, y + 1)}`;
         tile = { x, y: y - 1 };
         if (y === max.y + 1) { z = -1; }
         else { z = 1; }
         map.set(x, y + 1, ' ');
      }
      else {
         log(x, y, '????');
      }

      if (portal) {
         portals[portal] = portals[portal] || [];
         portals[portal].push({ x, y, z, tile });
         map.set(x, y, 'O');
      }
   }
}

for (let portal in portals) {
   if (portals[portal].length === 1) {
      continue;
   }

   portals[portal].forEach(({ x, y, z }, i) => {
      let { tile } = portals[portal][1 - i];
      map.set(x, y, { x: tile.x, y: tile.y, z });
   });
}

function findPath(start, end, useZ) {
   let queue = [{ x: start.x, y: start.y, z: 0, dist: 0 }];
   let explored = [new Map(-1)];

   while (queue.length > 0) {
      let { x, y, dist, z, ports } = queue.shift();

      if (x === end.x && y === end.y && z === 0) {
         return dist;
      }

      if (!explored[z]) { explored[z] = new Map(-1); }
      if (explored[z].get(x, y) >= 0 && explored[z].get(x, y) < dist) {
         continue;
      }
      explored[z].set(x, y, dist);

      let check = (x, y, z) => {
         let tile = map.get(x, y);
         if (tile === '#' || tile === ' ') {
            return;
         }
         if (typeof(tile) === 'object') {
            if (z === 0 && tile.z < 0) {
               return;
            }

            x = tile.x;
            y = tile.y;
            if (useZ) {
               z += tile.z;
            }

            tile = map.get(x, y);
         }

         if (tile === '.' || tile === 'O') {
            queue.push({ x, y, z, dist: dist + 1 });
         }
         else {
            log(x, y, tile);
         }
      }

      check(x - 1, y, z);
      check(x + 1, y, z);
      check(x, y - 1, z);
      check(x, y + 1, z);

      queue.sort((a, b) => {
         if (a.z === b.z) {
            return a.dist - b.dist;
         }
         return a.z - b.z;
      });
   }
}

log(`Part 1: ${findPath(portals['AA'][0].tile, portals['ZZ'][0].tile, false)}`);
log(`Part 2: ${findPath(portals['AA'][0].tile, portals['ZZ'][0].tile, true)}`);
