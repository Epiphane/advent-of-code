const fs = require('fs');

let file = 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

const { MakeRow, MakeGrid } = require('../../makegrid');

var grid = MakeGrid(50, 6, (x, y) => {
   return ' ';
});

function rect(grid, a, b) {
   for (let i = 0; i < a; i ++) {
      for (let j = 0; j < b; j ++) {
         grid.set(i, j, '#');
      }
   }
}

function rotateRow(grid, y, count) {
   let rotated = [];

   grid[y].forEach((element, i) => {
      i = (i + count) % grid[y].length;
      rotated[i] = element;
   });

   grid[y] = rotated;
}

function rotateCol(grid, x, count) {
   let rotated = [];

   for (let i = 0; i < grid.length; i ++) {
      rotated[(i + count) % grid.length] = grid.get(x, i);
   }

   rotated.forEach((val, y) => {
      grid.set(x, y, val);
   })
}

// console.log(grid[0].print())
lines.forEach(line => {
   let parts = line.split(' ');

   if (parts[0] === 'rect') {
      let dim = parts[1].split('x');

      rect(grid, parseInt(dim[0]), parseInt(dim[1]));
   }
   else if (parts[1] === 'column') {
      rotateCol(grid, parseInt(parts[2].substr(2)), parseInt(parts[4]));
   }
   else if (parts[1] === 'row') {
      rotateRow(grid, parseInt(parts[2].substr(2)), parseInt(parts[4]));
   }
})

console.log(grid.print())

// let sum = 0;
// grid.map((x, y, v) => sum += v );
// console.log(sum)

// console.log(grid.reduce((prev, row) => prev + row.reduce((prev, val) => prev + val)))
