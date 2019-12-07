const fs = require('fs');

let file = 'input';
let input = fs.readFileSync(file + '.txt').toString();
let lines = input.split('\n');

const LinkedList = require('../linkedlist');
const { MakeRow, MakeGrid } = require('../makegrid');

console.time();

let grid = [];
let inf = [];
let minx = 500;
let miny = 150;
let maxx = 500;
let maxy = 0;

lines.forEach(line => {
   let parts = line.split(', ');
   let coord = parts[0][0];
   let value = parts[0].substr(2);

   let x, y;

   if (coord === 'x') {
      x = [parseInt(value)];
   }
   else if (coord === 'y') {
      y = [parseInt(value)];
   }
   else console.log('what', line);

   coord = parts[1][0];
   let bounds = parts[1].substr(2).split('..');
   if (bounds.length === 1) {
      if (coord === 'x') { x = [parseInt(bounds[0])]; }
      else if (coord === 'y') { y = [parseInt(bounds[0])]; }
   }
   else {
      let low = parseInt(bounds[0]);
      let high = parseInt(bounds[1]);

      let arr = [];
      for (let v = low; v <= high; v ++) {
         arr.push(v);
      }
      if (coord === 'x') { x = arr; }
      else if (coord === 'y') { y = arr; }
   }

   x.forEach(xval => {
      if (xval < minx) { minx = xval; }
      if (xval > maxx) { maxx = xval; }
      y.forEach(yval => {
         if (yval < miny) { miny = yval; }
         if (yval > maxy) { maxy = yval; }

         if (!grid[yval]) {
            grid[yval] = [];
         }

         grid[yval][xval] = 1;
         
         if (!inf[yval]) {
            inf[yval] = [];
         }

         inf[yval][xval] = false;
      });
   });
});
// console.log(miny);
// console.log(maxy);

minx --;
maxx ++;
function PrintGrid(grid) {
   let result = [];
   for (let i = miny; i <= maxy; i ++) {
      let row = [];
      for (let j = minx; j <= maxx; j ++) {
         if (!grid[i] || !grid[i][j]) { row.push(' '); }
         else if (grid[i][j] === 1) row.push('#');
         else if (grid[i][j] === 2) row.push('~');
         else if (grid[i][j] === 3) row.push('|');
         else row.push('X');
      }
      result.push(row);
   }
   result[0][500 - minx] = '+';
   return result.map(r => r.join('')).join('\n');
}

let foundNew = false;
grid.watered = 0;
grid.retained = 0;
let tree = { x: 500, y: 0 };
let cursor = tree;

function IsOpen(grid, x, y) {
   return !grid[y] || !grid[y][x];// || (grid[y][x] === 3);
}

// Create a column
let a = 0;
// const N = 96147;
// const N = 86843;
const str = (new Array(275)).join('-');
function MakeWater1(grid, x, y) {
   if (y > maxy) return true;
   if (!grid[y]) grid[y] = [];
   if (grid[y][x] === 2) return false;
   if (grid[y][x] === 3) return true;
   if (y >= miny && y <= maxy) grid.watered ++;
   if (!!grid[y][x]) console.log(x, y, grid[y][x]);
   grid[y][x] = 3;

   let flowing = true;
   if (grid[y + 1] && grid[y + 1][x] === 3) {
      return true;
   }
   if (IsOpen(grid, x, y + 1)) {
      flowing = MakeWater1(grid, x, y + 1);
   }
   else {
      flowing = false;
   }

   if (!flowing) {
      if (IsOpen(grid, x - 1, y)) {
         if (MakeWater1(grid, x - 1, y)) {
            flowing = true;
         }
      }
      
      if (IsOpen(grid, x + 1, y)) {
         if (MakeWater1(grid, x + 1, y)) {
            flowing = true;
         }
      }

      // Make em flow
      if (flowing) {
         for (let neighborx = x + 1; grid[y][neighborx] === 2; neighborx ++) {
            grid[y][neighborx] = 3;
         }
         for (let neighborx = x - 1; grid[y][neighborx] === 2; neighborx --) {
            grid[y][neighborx] = 3;
         }
      }
   }

   if (!flowing) {
      grid[y][x] = 2;
      grid.retained ++;
   }
   return flowing;
}

function MakeWater(grid, x, y, dir = 0) {
   if (y > maxy) return 2;
   if (!grid[y]) grid[y] = [];
   if (!inf[y]) inf[y] = [];

   if (inf[y][x]) return 2;

   switch (grid[y][x]) {
      case 1: // #
         return 0;
      case 2: // ~
         if (dir <= 0 && MakeWater(grid, x - 1, y, -1)) {
            return 1;
         }
         else if (dir >= 0 && MakeWater(grid, x + 1, y, 1)) {
            return 1;
         }
         else {
            grid[y][x] = 2;
            return 0;
         }
      case 3: // |
         // if (dir !== 0) return false;
         
         // if (grid[y + 1] && grid[y + 1][x] === 1) {
         //    grid[y][x] = 2;
         // }
         
         let _inf = false;
         let res = MakeWater(grid, x, y + 1);
         if (res === 2) return 2;
         if (res === 1) return 1;

         if (dir <= 0) {
            let res = MakeWater(grid, x - 1, y, -1);
            if (res === 2) _inf = true;
            if (res === 1) return 1;
         }
         if (dir >= 0) {
            let res = MakeWater(grid, x + 1, y, 1);
            if (res === 2) return 2;
            if (res === 1) return 1;
         }
         
         if (_inf) {
            inf[y][x] = true;
            return 2;
         }

         if (!inf[y][x]) {
            grid[y][x] = 2;
            return 0;
         }
      case 0: // .
      default: // .
         grid.watered ++;
         grid[y][x] = 3;
         return 1;
   }
}

// let res = true;
// while (res && a++ < 100000) {
//    res = (MakeWater(grid, 500, 1) === 1);
//    // console.log(PrintGrid(grid));
//    if ((a++) % 1000 === 0) { console.log(a); }
// }

MakeWater1(grid, 500, 1)

fs.writeFileSync('output.txt', PrintGrid(grid));
console.log(grid.retained);

console.timeEnd();