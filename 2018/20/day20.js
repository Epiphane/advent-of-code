const fs = require('fs');

function main(inputFile) {
   console.log('\n----- Running ' + inputFile + ' -----')
   let input = fs.readFileSync(inputFile + '.txt').toString().trim();

   const LinkedList = require('../linkedlist');
   const { MakeRow, MakeGrid } = require('../makegrid');

   console.time();
   
   const N = 0;
   const E = 1;
   const W = 2;
   const S = 3;

   const DIR = { N, E, W, S };

   let grid = [];
   let minx = 0;
   let miny = 0;
   let maxx = 0;
   let maxy = 0;

   function GetRoom(x, y, dist = 0) {
      if (!grid[y]) {
         grid[y] = [];
      }

      if (!grid[y][x]) {
         grid[y][x] = {
            x, y,
            dist: dist,
            door: [0, 0, 0, 0]
         };
      }

      if (dist >= 0 && grid[y][x].dist > dist) {
         grid[y][x].dist = dist;
      }

      if (x < minx) { minx = x; }
      if (y < miny) { miny = y; }
      if (x > maxx) { maxx = x; }
      if (y > maxy) { maxy = y; }
      return grid[y][x];
   }

   function PrintState(state) {
      let result = [];
      for (let y = miny; y <= maxy; y ++) {
         let above = [];
         let mid = [];
         for (let x = minx; x <= maxx; x ++) {
            let room = GetRoom(x, y, -1);
            above.push('#');
            above.push(room.door[N] === 1 ? ' ' : '#');
            // above.push('#');
            mid.push(room.door[W] === 1 ? ' ' : '#');
            mid.push((x === 0 && y === 0) ? 'X' : '.');
            // mid.push(room.door[E] === 1 ? ' ' : '#');
         }
         result.push(above);
         result.push(mid);
      }
      return result.map(row => row.join('')).join('\n');
   }

   // let myN = 5000000;
   function Parse(input, i, x, y, prefix = '') {
      let room = GetRoom(x, y, -1);
      let inBlock = false;
      while (input[i] !== '$') {
         // if (i > myN) return i;
         let dir = input[i++];
         switch (dir) {
            case 'N':
               // console.log(prefix + 'Move N');
               room.door[N] = 1;
               room = GetRoom(x, --y, room.dist + 1);
               room.door[S] = 1;
               break;
            case 'E':
               // console.log(prefix + 'Move E');
               room.door[E] = 1;
               room = GetRoom(++x, y, room.dist + 1);
               room.door[W] = 1;
               break;
            case 'W':
               // console.log(prefix + 'Move W');
               room.door[W] = 1;
               room = GetRoom(--x, y, room.dist + 1);
               room.door[E] = 1;
               break;
            case 'S':
               // console.log(prefix + 'Move S');
               room.door[S] = 1;
               room = GetRoom(x, ++y, room.dist + 1);
               room.door[N] = 1;
               break;
            case '(':
               // console.log(prefix + 'branch:')
               inBlock = true;
               i = Parse(input, i, x, y, prefix + '  ');
               break;
            case '|':
               if (!inBlock) { return i - 1; }
               else {
                  // console.log(prefix + 'continue:')
                  i = Parse(input, i, x, y, prefix + '  ');
               }
               break;
            case ')':
               if (!inBlock) { return i - 1; }
               else {
                  // console.log(prefix + 'close');
                  inBlock = false;
               }
         }
      }
      return i;
   }

   Parse(input, 1, 0, 0);

   // console.log(PrintState(grid));
   // console.log();

   let maxdist = 0;
   let nrooms = 0;
   for (let y = miny; y <= maxy; y ++) {
      for (let x = minx; x <= maxx; x ++) {
         let room = GetRoom(x, y, -1);
         if (room.dist >= 0) {
            if (room.dist > maxdist) {
               maxdist = room.dist;
            }
            if (room.dist >= 999) {
               nrooms ++;
            }
         }
      }
   }

   console.log(nrooms);

   console.timeEnd();
}

main('sample');
main('input');