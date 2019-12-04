const fs = require('fs');

let file = process.argv[2] || 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n').map(line => line.split(','));


let map = [[0]];
let intersections = [];

let n = 0;
let pos = [0, 0];
lines[0].forEach(instr => {
   let dir = instr[0];
   let num = parseInt(instr.substr(1));

   let d = [0, 0];
   if (dir === 'U') {
      d = [0, 1];
   } else if (dir === 'D') {
      d = [0, -1];
   } else if (dir === 'L') {
      d = [-1, 0];
   } else if (dir === 'R') {
      d = [1, 0];
   }

   for (let i = 0; i < num; i ++) {
      pos[0] += d[0];
      pos[1] += d[1];

      map[pos[0]] = map[pos[0]] || [];
      if (!map[pos[0]][pos[1]]) {
         map[pos[0]][pos[1]] = n;
      }

      n ++;
   }
});

n = 0;
pos = [0, 0];
lines[1].forEach(instr => {
   let dir = instr[0];
   let num = parseInt(instr.substr(1));

   let d = [0, 0];
   if (dir === 'U') {
      d = [0, 1];
   } else if (dir === 'D') {
      d = [0, -1];
   } else if (dir === 'L') {
      d = [-1, 0];
   } else if (dir === 'R') {
      d = [1, 0];
   }

   for (let i = 0; i < num; i ++) {
      pos[0] += d[0];
      pos[1] += d[1];

      map[pos[0]] = map[pos[0]] || [];
      if (map[pos[0]][pos[1]] > 0) {
         console.log(pos);
         intersections.push([map[pos[0]][pos[1]], n]);
      }
      n ++;
   }
});

let answer = 10000000000;
intersections.forEach(i => {
   let dist = Math.abs(i[0]) + Math.abs(i[1]);
   console.log(i, dist);
   if (dist < answer) {
      answer = dist;
   }
})

console.log(answer);
