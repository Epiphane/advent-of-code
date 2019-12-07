const fs = require('fs');

// depth: 10689
// target: 11,722
let depth = 10689;
let t = [11, 722];
// depth = 510
// t = [10, 10];

function main(inputFile) {
   console.log('\n----- Running ' + inputFile + ' -----')

   const LinkedList = require('../linkedlist');
   const { MakeRow, MakeGrid } = require('../makegrid');

   console.time();

   const ROCKY = 0;
   const WET = 1;
   const NARROW = 2;
   
   let indexes = [];
   let erosion = [];
   let risks = [];

   function GeoIndex(x, y) {
      indexes[y] = indexes[y] || [];
      if (x === 0 && y === 0) return indexes[y][x] = 0;
      if (x === t[0] && y === t[1]) return indexes[y][x] = 0;
      if (y === 0) return indexes[y][x] = x * 16807;
      if (x === 0) return indexes[y][x] = y * 48271;
      return indexes[y][x] = (Erosion(x-1, y) * Erosion(x, y-1));
   }

   function Erosion(x, y) {
      erosion[y] = erosion[y] || [];
      if (typeof(erosion[y][x]) !== 'undefined') {
         return erosion[y][x];
      }
      return erosion[y][x] = (GeoIndex(x, y) + depth) % 20183;
   }

   function Risk(x, y) {
      if (x < 0 || y < 0) return -1;
      risks[y] = risks[y] || [];
      let index = Erosion(x, y) % 3;
      if (index === 0) return risks[y][x] = ROCKY;
      if (index === 1) return risks[y][x] = WET;
      if (index === 2) return risks[y][x] = NARROW;
   }
   
   for (let y = 0; y <= t[1]; y ++) {
      risks[y] = [];
      for (let x = 0; x <= t[0]; x ++) {
         Risk(x, y);
      }
   }

   let risk = 0;
   console.log(risks.map((row, y) => row.map((e, x) => {
      if (x === 0 && y === 0) return 'M';
      if (x === t[0] && y === t[1]) return 'T';
      if (e === ROCKY) return '.';
      if (e === WET) return '=';
      if (e === NARROW) return '|';
      return '?';
   }).join('')).join('\n'));
   risks.forEach((row, x) => {
      row.forEach((val, y) => {
         risk += val;
      });
   });

   console.log(risk);
   console.log();
   
   const N = 0;
   const E = 1;
   const W = 2;
   const S = 3;

   const GEAR = 0;
   const TORCH = 1;
   const NONE = 2;
   let good = [];
   good[ROCKY] = [true, true, false];
   good[WET] = [true, false, true];
   good[NARROW] = [false, true, true];

   let BIG = 100000000;
   let makeBest = (x, y) => {
      return {
         dist: Math.abs(x - t[0]) + Math.abs(y - t[1]),
         times: [BIG, BIG, BIG],
         risk: Risk(x, y),
      }
   }
   let bests = [
      [
         makeBest(0, 0)
      ]
   ];
   bests[0][0].times[TORCH] = 0;

   let queue = [{x: 0, y: 0}];
   while (queue.length) {
      let loc = queue[0];
      queue.shift();
      let x = loc.x;
      let y = loc.y;

      let current = bests[y][x];

      if (x === t[0] && y === t[1]) {
         console.log(x, y, current);
         break;
      }
      
      let min = Math.min.apply(null, current.times);
      [GEAR, TORCH, NONE].forEach(tool => {
         if (good[current.risk][tool] && current.times[tool] > min + 7) {
            current.times[tool] = min + 7;
         }
      });
      // console.log(x, y, current, min);

      [
         {x: -1, y: 0},
         {x: 1, y: 0},
         {y: -1, x: 0},
         {y: 1, x: 0}
      ].forEach(move => {
         let nx = x + move.x;
         let ny = y + move.y;
         if (nx < 0 || ny < 0) return;
         bests[ny] = bests[ny] || [];
         bests[ny][nx] = bests[ny][nx] || makeBest(nx, ny);
         
         let improvement = false;
         let next = bests[ny][nx];
         [GEAR, TORCH, NONE].forEach(tool => {
            if (!good[current.risk][tool]) { return; }
            if (!good[next.risk][tool]) { return; }
            if (next.times[tool] > current.times[tool] + 1) {
               next.times[tool] = current.times[tool] + 1;
               improvement = true;
            }
         })
         if (improvement) {
            queue.push({ x: nx, y: ny });
         }
      });

      queue.sort((a, b) => {
         a = bests[a.y][a.x];
         b = bests[b.y][b.x];
         return (Math.min.apply(null, a.times) + a.dist) - 
            (Math.min.apply(null, b.times) + b.dist);
      })
   }

   // console.log(bests.map((row, y) => {
   //    return y + ':  ' + row.map(elem => {
   //       return elem.times.map(t => {
   //          if (t === BIG) return '_';
   //          else return t;
   //       }).join('|') + ' ' + (Math.min.apply(null, elem.times) + elem.dist).toString()
   //    }).join('  ');
   // }).join('\n\n'))
   // console.log(bests[10][10]);

   // let bests = [];
   // bests.get = (x, y) => {
   //    bests[y] = bests[y] || [];
   //    return bests[y][x] = (bests[y][x] || { time: 1000000000, tool: '' });
   // }
   // let queue = [{x: 0, y: 0, time: 0, dist: t[0] + t[1], tool: 'torch'}];
   // while (queue.length) {
   //    let current = queue[0];
   //    queue.shift();
   //    let best = bests.get(current.x, current.y);
   //    if (best.tool === current.tool && best) {
   //       continue;
   //    }
   //    if (timeHere > current.time) {
   //       best[current.y][current.y] = current.time;
   //    }
   //    console.log(current);
   //    if (current.dist === 0) {
   //       console.log(current);
   //    }

   //    let options = [
   //       [current.x, current.y-1, Risk(current.x, current.y-1)],
   //       [current.x, current.y+1, Risk(current.x, current.y+1)],
   //       [current.x-1, current.y, Risk(current.x-1, current.y)],
   //       [current.x+1, current.y, Risk(current.x+1, current.y)]
   //    ];
   //    options.forEach(option => {
   //       if (option[2] < 0) { return; }
   //       switch (option[2]) {
   //          case ROCKY:
   //             if (current.tool === 'torch' || current.tool === 'gear') {
   //                queue.push({
   //                   x: option[0],
   //                   y: option[1],
   //                   time: current.time + 1,
   //                   dist: Math.abs(t[0] - option[0]) + Math.abs(t[1] - option[1]),
   //                   tool: current.tool,
   //                })
   //             }
   //             break;
   //          case WET:
   //             if (current.tool === 'neither' || current.tool === 'gear') {
   //                queue.push({
   //                   x: option[0],
   //                   y: option[1],
   //                   time: current.time + 1,
   //                   dist: Math.abs(t[0] - option[0]) + Math.abs(t[1] - option[1]),
   //                   tool: current.tool,
   //                })
   //             }
   //             break
   //          case NARROW:
   //             if (current.tool === 'neither' || current.tool === 'torch') {
   //                queue.push({
   //                   x: option[0],
   //                   y: option[1],
   //                   time: current.time + 1,
   //                   dist: Math.abs(t[0] - option[0]) + Math.abs(t[1] - option[1]),
   //                   tool: current.tool,
   //                })
   //             }
   //             break;
   //       }
   //    });
   //    ['gear', 'torch', 'neither'].forEach(tool => {
   //       if (tool === current.tool) return;
   //       queue.push({
   //          x: current.x,
   //          y: current.y,
   //          time: current.time + 7,
   //          dist: current.dist,
   //          tool: tool,
   //       })
   //    });

   //    queue.sort((o1, o2) => {
   //       if (o1.time === o2.time) return o1.dist - o2.dist;
   //       return o1.time - o2.time;
   //    });
   // }

   console.timeEnd();
}

main('input');