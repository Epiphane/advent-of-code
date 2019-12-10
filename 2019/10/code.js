const fs = require('fs');
const { MakeGrid } = require('../../makegrid');
const { gcd } = require('../utils');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim()
   .split('\n').map(line => line.trim().split(''))

let grid = MakeGrid(input[0].length, input.length, (x, y) => input[y][x] === '#');

// Part 1
let best = { x: 0, y: 0, visible: 0, asteroids: [] };
grid.map((x, y, val) => {
   if (!val) { return; }

   let asteroids = [];
   let visible = [];
   grid.map((x2, y2, other) => {
      if (!other) { return; }
      if (x === x2 && y === y2) { return; }

      let dx = (x2 - x);
      let dy = (y2 - y);

      // Get smallest whole number movement
      if (dx !== 0 && dy !== 0) {
         let denom = gcd(dx, dy);
         dx /= denom;
         dy /= denom;
      } else if (dx !== 0) {
         dx = Math.sign(dx);
      } else {
         dy = Math.sign(dy);
      }

      let pos = { x: x + dx, y: y + dy };
      let asteroid = { x: x2, y: y2, dx, dy, angle: Math.atan2(dx, dy), blockers: 0 };
      while (pos.x !== x2 || pos.y !== y2) {
         if (grid.get(pos.x, pos.y)) {
            asteroid.blockers++;
         }

         pos.x += dx;
         pos.y += dy;
      }

      if (asteroid.blockers === 0) {
         visible.push({ x: x2, y: y2 });
      }
      asteroids.push(asteroid);
   })

   if (visible.length > best.visible) {
      best = { x, y, visible: visible.length, asteroids };
   }
})

console.log(`Best location: <${best.x},${best.y}> can see ${best.visible} asteroids`)

// Part 2
best.asteroids.sort((a, b) => {
   if (b.blockers === a.blockers) {
      return b.angle - a.angle;
   }
   return a.blockers - b.blockers;
});

console.log(`200th asteroid: <${best.asteroids[199].x},${best.asteroids[199].y}>`);
