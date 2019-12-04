const fs = require('fs');

let file = 'input';
let finput = fs.readFileSync(file + '.txt');

let lines = finput.toString().trim().split('\n').map(line => line.split(' ').map(n => parseInt(n, 10)));
let triangles = [];

for (let row = 0; row < lines.length; row += 3) {
   for (let col = 0; col < 3; col ++) {
      triangles.push([
         lines[row][col],
         lines[row + 1][col],
         lines[row + 2][col]
      ]);
   }
}

let possible = 0;

triangles.forEach(sides => {
   if (sides[0] + sides[1] <= sides[2]) {
      return;
   }
   if (sides[2] + sides[1] <= sides[0]) {
      return;
   }
   if (sides[0] + sides[2] <= sides[1]) {
      return;
   }
   possible ++;
});

console.log(possible);
