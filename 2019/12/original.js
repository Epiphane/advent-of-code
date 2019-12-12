const fs = require('fs');
let md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute } = require('../utils');
const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');

let file = process.argv[2] || 'input';
let fileinput = fs.readFileSync(file + '.txt').toString().trim();

function lcm_two_numbers(x, y) {
   if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false;
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
}

function gcd_two_numbers(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

const log = console.log;

let moons = [
   { x: 3, y: 3, z: 0, dx: 0, dy: 0, dz: 0 },
   { x: 4, y: -16, z: 2, dx: 0, dy: 0, dz: 0 },
   { x: -10, y: -6, z: 5, dx: 0, dy: 0, dz: 0 },
   { x: -3, y: 0, z:-13, dx: 0, dy: 0, dz: 0 },
]

moons = [
   { x: -1, y: 0, z: 2, dx: 0, dy: 0, dz: 0 },
   { x: 2, y: -10, z: -7, dx: 0, dy: 0, dz: 0 },
   { x: 4, y: -8, z: 8, dx: 0, dy: 0, dz: 0 },
   { x: 3, y: 5, z:-1, dx: 0, dy: 0, dz: 0 },
]

// moons = [
//    { x: -8, y: -10, z: 0, dx: 0, dy: 0, dz: 0 },
//    { x: 5, y: 5, z: 10, dx: 0, dy: 0, dz: 0 },
//    // { x: 2, y: -7, z: 3, dx: 0, dy: 0, dz: 0 },
//    // { x: 9, y: -8, z:-3, dx: 0, dy: 0, dz: 0 },
// ]

function period(a, b) {
   // let moons = [
   //    { x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0 },
   //    { x: 0, y: 0, z: dist, dx: 0, dy: 0, dz: 0 },
   // ]

   let moons = [
         { x: a.x, y: a.y, z: a.z, dx: 0, dy: 0, dz: 0 },
         { x: b.x, y: b.y, z: b.z, dx: 0, dy: 0, dz: 0 },
   ]

   function pot(moon) {
      return Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
   }

   function kin(moon) {
      return Math.abs(moon.dx) + Math.abs(moon.dy) + Math.abs(moon.dz);
   }

   function energy(moon) {
      return pot(moon) * kin(moon);
   }

   md5 = (e) => e

   function state(moons, i) {
      let magic = `${moons[0].x},${moons[0].y},${moons[0].z},`
      magic += `${moons[1].x},${moons[1].y},${moons[1].z},`
      if (i) return md5(magic);
      // magic += `${moons[2].x},${moons[2].y},${moons[2].z},`
      // magic += `${moons[3].x},${moons[3].y},${moons[3].z},`
      magic += `${moons[0].dx},${moons[0].dy},${moons[0].dz},`
      magic += `${moons[1].dx},${moons[1].dy},${moons[1].dz},`
      // magic += `${moons[2].dx},${moons[2].dy},${moons[2].dz},`
      // magic += `${moons[3].dx},${moons[3].dy},${moons[3].dz},`

      return md5(magic);
   }

   const initial = state(moons);
   for (let step = 0; ; step ++) {
      for (let i = 0; i < moons.length; i ++) {
         let moon = moons[i];

         for (let j = 0; j < moons.length; j ++) {
            if (i === j) continue;

            if (moons[j].x < moon.x) {
               moon.dx --;
            } else if (moons[j].x > moon.x) {
               moon.dx ++;
            }

            if (moons[j].y < moon.y) {
               moon.dy --;
            } else if (moons[j].y > moon.y) {
               moon.dy ++;
            }

            if (moons[j].z < moon.z) {
               moon.dz --;
            } else if (moons[j].z > moon.z) {
               moon.dz ++;
            }
         }
      }

      for (let i = 0; i < moons.length; i ++) {
         let moon = moons[i];
         moon.x += moon.dx;
         moon.y += moon.dy;
         moon.z += moon.dz;
      }

      let magic = state(moons);
      if (magic === initial) {
         return step;
      }
   }
}


// for (let _x = 0; _x < 20; _x ++) {
//    moons = [
//       { x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0 },
//       { x: 0, y: 0, z: _x, dx: 0, dy: 0, dz: 0 },
//    ]
//    // console.log(_x, period(_x));

//    function pot(moon) {
//       return Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
//    }

//    function kin(moon) {
//       return Math.abs(moon.dx) + Math.abs(moon.dy) + Math.abs(moon.dz);
//    }

//    function energy(moon) {
//       return pot(moon) * kin(moon);
//    }

//    md5 = (e) => e

//    function state(moons, i) {
//       let magic = `${moons[0].x},${moons[0].y},${moons[0].z},`
//       magic += `${moons[1].x},${moons[1].y},${moons[1].z},`
//       if (i) return md5(magic);
//       // magic += `${moons[2].x},${moons[2].y},${moons[2].z},`
//       // magic += `${moons[3].x},${moons[3].y},${moons[3].z},`
//       magic += `${moons[0].dx},${moons[0].dy},${moons[0].dz},`
//       magic += `${moons[1].dx},${moons[1].dy},${moons[1].dz},`
//       // magic += `${moons[2].dx},${moons[2].dy},${moons[2].dz},`
//       // magic += `${moons[3].dx},${moons[3].dy},${moons[3].dz},`

//       return md5(magic);
//    }

//    const initial = state(moons);
//    const initial_ = state(moons, true);

//    const magics = {};

//    const STEPS = 1000;
//    for (let step = 0; ; step ++) {
//       for (let i = 0; i < moons.length; i ++) {
//          let moon = moons[i];

//          for (let j = 0; j < moons.length; j ++) {
//             if (i === j) continue;

//             if (moons[j].x < moon.x) {
//                moon.dx --;
//             } else if (moons[j].x > moon.x) {
//                moon.dx ++;
//             }

//             if (moons[j].y < moon.y) {
//                moon.dy --;
//             } else if (moons[j].y > moon.y) {
//                moon.dy ++;
//             }

//             if (moons[j].z < moon.z) {
//                moon.dz --;
//             } else if (moons[j].z > moon.z) {
//                moon.dz ++;
//             }
//          }
//       }

//       for (let i = 0; i < moons.length; i ++) {
//          let moon = moons[i];
//          moon.x += moon.dx;
//          moon.y += moon.dy;
//          moon.z += moon.dz;
//       }

//       // if (step % 1000000 === 0)
//       // console.log(`${step} => ${moons[0].x}`.padEnd(20) + `(${moons[0].dx})`);
//       let magic = state(moons, true);
//       if (magic === initial_) {
//          // console.log(`mOon 0 at ${step}`);
//          magic = state(moons);
//          // console.log(magic);
//          if (magic === initial) {
//             // console.log(`-`, step);
//             // console.log(`${moons[0].dx}\t${moons[0].dy}\t${moons[0].dz}`);
//             break;
//          }
//       }

//       // if (step > 100) {
//       //    log('end');
//       //    break;
//       // }
//    }

//    // console.log(energy(moons[0]))
//    // console.log(energy(moons[1]))
//    // console.log(energy(moons[2]))
//    // console.log(energy(moons[3]))

//    // console.log(energy(moons[0]) + energy(moons[1]) + energy(moons[2]) + energy(moons[3]))

// };

moons = [
   { x: 3, y: 3, z: 0, dx: 0, dy: 0, dz: 0 },
   { x: 4, y: -16, z: 2, dx: 0, dy: 0, dz: 0 },
   { x: -10, y: -6, z: 5, dx: 0, dy: 0, dz: 0 },
   { x: -3, y: 0, z:-13, dx: 0, dy: 0, dz: 0 },
]

moons = [
   { x: -1, y: 0, z: 2, dx: 0, dy: 0, dz: 0 },
   { x: 2, y: -10, z: -7, dx: 0, dy: 0, dz: 0 },
   { x: 4, y: -8, z: 8, dx: 0, dy: 0, dz: 0 },
   { x: 3, y: 5, z:-1, dx: 0, dy: 0, dz: 0 },
]

// moons = [
//    { x: -8, y: -10, z: 0, dx: 0, dy: 0, dz: 0 },
//    { x: 5, y: 5, z: 10, dx: 0, dy: 0, dz: 0 },
//    // { x: 2, y: -7, z: 3, dx: 0, dy: 0, dz: 0 },
//    // { x: 9, y: -8, z:-3, dx: 0, dy: 0, dz: 0 },
// ]


let tot = 1;
let periods = [];
for (let i = 0; i < moons.length; i ++) {
   let moon = moons[i];

   for (let j = 0; j < moons.length; j ++) {
      if (i === j) continue;
      console.log('compare', i, j);

      // let per = period(moon.x - moons[j].x);
      // console.log(per);
      // tot *= per;
      // if (periods.indexOf(per) < 0) periods.push(per);

      // per = period(moon.y - moons[j].y);
      // console.log(per);
      // tot *= per;
      // if (periods.indexOf(per) < 0) periods.push(per);

      // per = period(moon.z - moons[j].z);
      // console.log(per);
      // tot *= per;
      // if (periods.indexOf(per) < 0) periods.push(per);
      ;

      let per = period(moon, moons[j]);
      console.log(per);
      tot *= per;
      if (periods.indexOf(per) < 0) periods.push(per);
   }
}

console.log(tot);

console.log(periods);

console.log('Moon 1 and 2: ' + period(moons[0], moons[1]));













moons = [
   { x: 3, y: 3, z: 0, dx: 0, dy: 0, dz: 0 },
   { x: 4, y: -16, z: 2, dx: 0, dy: 0, dz: 0 },
   { x: -10, y: -6, z: 5, dx: 0, dy: 0, dz: 0 },
   { x: -3, y: 0, z:-13, dx: 0, dy: 0, dz: 0 },
]

// moons = [
//    { x: -1, y: 0, z: 2, dx: 0, dy: 0, dz: 0 },
//    { x: 2, y: -10, z: -7, dx: 0, dy: 0, dz: 0 },
//    { x: 4, y: -8, z: 8, dx: 0, dy: 0, dz: 0 },
//    { x: 3, y: 5, z:-1, dx: 0, dy: 0, dz: 0 },
// ]

// moons = [
//    { x: -8, y: -10, z: 0, dx: 0, dy: 0, dz: 0 },
//    { x: 5, y: 5, z: 10, dx: 0, dy: 0, dz: 0 },
//    { x: 2, y: -7, z: 3, dx: 0, dy: 0, dz: 0 },
//    { x: 9, y: -8, z:-3, dx: 0, dy: 0, dz: 0 },
// ]

md5 = (e) => e

function state(moons, i) {
   let magic = `${moons[0].x},${moons[0].y},${moons[0].z},`
   magic += `${moons[1].x},${moons[1].y},${moons[1].z},`
   magic += `${moons[2].x},${moons[2].y},${moons[2].z},`
   magic += `${moons[3].x},${moons[3].y},${moons[3].z},`
   magic += `${moons[0].dx},${moons[0].dy},${moons[0].dz},`
   magic += `${moons[1].dx},${moons[1].dy},${moons[1].dz},`
   magic += `${moons[2].dx},${moons[2].dy},${moons[2].dz},`
   magic += `${moons[3].dx},${moons[3].dy},${moons[3].dz},`

   return md5(magic);
}

const initial = state(moons);
for (let step = 0; ; step ++) {
   for (let i = 0; i < moons.length; i ++) {
      let moon = moons[i];

      for (let j = 0; j < moons.length; j ++) {
         if (i === j) continue;

         if (moons[j].x < moon.x) {
            moon.dx --;
         } else if (moons[j].x > moon.x) {
            moon.dx ++;
         }

         // if (moons[j].y < moon.y) {
         //    moon.dy --;
         // } else if (moons[j].y > moon.y) {
         //    moon.dy ++;
         // }

         // if (moons[j].z < moon.z) {
         //    moon.dz --;
         // } else if (moons[j].z > moon.z) {
         //    moon.dz ++;
         // }
      }
   }

   for (let i = 0; i < moons.length; i ++) {
      let moon = moons[i];
      moon.x += moon.dx;
      moon.y += moon.dy;
      moon.z += moon.dz;
   }

   magic = state(moons);
   if (magic === initial) {
      console.log(step + 1);
      // console.log(`${moons[0].dx}\t${moons[0].dy}\t${moons[0].dz}`);
      break;
   }
}

console.log(lcm_two_numbers(lcm_two_numbers(231614,286332), 22958))

// 17,27,43
// 18,28,44
// 2*9, 4*
