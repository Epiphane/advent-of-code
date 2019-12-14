const fs = require('fs');

let file = process.argv[2] || 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim()
   .split('\n').map(line => line.trim());

const log = console.log;

// Prep
let recipes = {};

lines.forEach(line => {
   let parts = line.split(' => ');

   let components = parts[0].split(', ').map(piece => {
      let p = piece.split(' ');
      let amt = +p[0];
      let type = p[1];

      return { amt, type };
   });
   let result = parts[1].split(' ');

   recipes[result[1]] = {
      amt: +result[0],
      components
   };
});

// dist tracks the maximum number of steps removed from FUEL
// a particular material is. We cannot figure out how many of
// material X is required until we've figured out how many of
// the materials it contributes to are needed.
let dist = {};
let queue = [{ type: 'FUEL', dist: 0 }];
while (queue.length > 0) {
   let top = queue.shift();
   let type = top.type;
   dist[type] = top.dist;

   if (recipes[type]) {
      recipes[type].components.forEach(ingredient => {
         queue.push({
            type: ingredient.type,
            dist: top.dist + 1,
         });
      });
   }
}

function oreRequired(fuel) {
   queue = [{ type: 'FUEL', amt: fuel }];
   while (queue.length > 0) {
      const { type, amt } = queue.shift();

      if (type === 'ORE') {
         return amt;
      }

      const batches = Math.ceil(amt / recipes[type].amt);
      recipes[type].components.forEach(comp => {
         let exists = false;
         const needed = batches * comp.amt;
         queue.forEach(item => {
            if (item.type === comp.type) {
               item.amt += needed;
               exists = true;
            }
         })
         if (!exists) {
            queue.push({ type: comp.type, amt: needed });
         }
      });

      queue.sort((a, b) => {
         return dist[a.type] - dist[b.type];
      });
   }
   return 0;
}

// Part 1
log(`Part 1: ${oreRequired(1)} ORE required`);

// Part 2
const TRILLION = 1000000000000;
function search(min, max) {
   if (max - min === 1) return min;
   let curr = Math.floor((min + max) / 2);
   if (oreRequired(curr) < TRILLION) {
      return search(curr, max);
   }
   else {
      return search(min, curr);
   }
}

log(`Part 2: ${search(0, 182892753)} FUEL can be made`);
