const { lcm } = require('../utils');
const log = console.log;

// Input
let makeInput = () => [
   { x: 3, y: 3, z: 0, dx: 0, dy: 0, dz: 0 },
   { x: 4, y: -16, z: 2, dx: 0, dy: 0, dz: 0 },
   { x: -10, y: -6, z: 5, dx: 0, dy: 0, dz: 0 },
   { x: -3, y: 0, z:-13, dx: 0, dy: 0, dz: 0 },
]

// Example 1
// makeInput = () => [
//    { x: -1, y: 0, z: 2, dx: 0, dy: 0, dz: 0 },
//    { x: 2, y: -10, z: -7, dx: 0, dy: 0, dz: 0 },
//    { x: 4, y: -8, z: 8, dx: 0, dy: 0, dz: 0 },
//    { x: 3, y: 5, z:-1, dx: 0, dy: 0, dz: 0 },
// ]

// Example 2
// makeInput = () => [
//    { x: -8, y: -10, z: 0, dx: 0, dy: 0, dz: 0 },
//    { x: 5, y: 5, z: 10, dx: 0, dy: 0, dz: 0 },
//    // { x: 2, y: -7, z: 3, dx: 0, dy: 0, dz: 0 },
//    // { x: 9, y: -8, z:-3, dx: 0, dy: 0, dz: 0 },
// ]

function pot(moon) {
   return Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
}

function kin(moon) {
   return Math.abs(moon.dx) + Math.abs(moon.dy) + Math.abs(moon.dz);
}

function energy(moon) {
   return pot(moon) * kin(moon);
}

function simulate(moons, simulateX, simulateY, simulateZ) {
   moons.forEach((moon, i) => {
      moons.forEach((other, j) => {
         if (i === j) return;

         if (simulateX !== false) {
            if (other.x < moon.x) {
               moon.dx --;
            } else if (other.x > moon.x) {
               moon.dx ++;
            }
         }

         if (simulateY !== false) {
            if (other.y < moon.y) {
               moon.dy --;
            } else if (other.y > moon.y) {
               moon.dy ++;
            }
         }

         if (simulateZ !== false) {
            if (other.z < moon.z) {
               moon.dz --;
            } else if (other.z > moon.z) {
               moon.dz ++;
            }
         }
      });
   });

   moons.forEach(moon => {
      moon.x += moon.dx;
      moon.y += moon.dy;
      moon.z += moon.dz;
   });
}

// ------------------
// |     Part 1     |
// ------------------
let moons = makeInput();
for (let step = 0; step < 1000; ++step) {
   simulate(moons);
}

log(`Part 1: ${moons.reduce((prev, moon) => energy(moon) + prev, 0)}`);

// ------------------
// |     Part 2     |
// ------------------
const initial = makeInput();

function isInitial(moons) {
   for (let i = 0; i < moons.length; ++i) {
      const moon = moons[i];
      const base = initial[i];

      if (
         moon.x !== base.x ||
         moon.y !== base.y ||
         moon.z !== base.z ||
         moon.dx !== base.dx ||
         moon.dy !== base.dy ||
         moon.dz !== base.dz
      ) {
         return false;
      }
   }
   return true;
}

function period(simulateX, simulateY, simulateZ) {
   let moons = makeInput();

   let steps = 0;
   do {
      simulate(moons, simulateX, simulateY, simulateZ);
      steps++;
   }
   while (!isInitial(moons));

   return steps;
}

let periods = [
   period(true, false, false),
   period(false, true, false),
   period(false, false, true)
]

log(`Part 2: ${lcm(lcm(periods[0], periods[1]), periods[2])}`);
