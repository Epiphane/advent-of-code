const fs = require('fs');

let file = process.argv[2] || 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

let mapping = {i: 1};
let titles = [];
let floors = [];

class Grouping {
   constructor() {
      this.chips = [];
      this.generators = [];
   }

   print(prefix) {
      let contents = Array.apply(null, new Array(titles.length * 2 + 1)).map(e => '   ');

      this.chips.forEach(chip => {
         contents[titles.indexOf(chip) * 2 + 1] = chip + 'M';
      });
      this.generators.forEach(generator => {
         contents[titles.indexOf(generator) * 2] = generator + 'G';
      });

      return prefix + contents.join('  |  ');
   }

   isSafe() {
      if (this.generators.length === 0) {
         return true;
      }

      for (let i = 0; i < this.chips.length; ++i) {
         const chip = this.chips[i];
         if (this.generators.indexOf(chip) < 0) {
            return false;
         }
      }

      return true;
   }
}

lines.forEach((line, f) => {
   let generators = [...line.matchAll(/([a-z]+) generator/g)];
   let microchips = [...line.matchAll(/([a-z]+)-compatible microchip/g)];

   let floor = new Grouping();

   generators.forEach(m => {
      let id = m[1][0].toUpperCase() + m[1][1];
      floor.generators.push(id);
      if (!mapping[id]) {
         mapping[id] = mapping.i ++;
         titles.push(id);
      }
   });

   microchips.forEach(m => {
      let id = m[1][0].toUpperCase() + m[1][1];
      if (!mapping[id]) {
         mapping[id] = mapping.i ++;
         titles.push(id);
      }
      floor.chips.push(id);
   });

   floors.push(floor);
});

let current = 0;
function printState() {
   console.log('       |      ' + titles.join('      |       '))
   console.log(floors.map((_, i) => {
      i = floors.length - i - 1;
      let pre = ' ';
      if (current === i) {
         pre = 'E';
      }
      return floors[i].print(`F${i + 1} | ${pre} | `)
   }).join('\n'));
}

function done() {
   const top = floors[floors.length - 1];
   return top.chips.length === titles.length &&
      top.generators.length === titles.length;
}

printState();

while (!done()) {
   let currentFloor = floors[current];
   if (current === 0) {
      // Move something up.

   }

   printState();
   break;
}
