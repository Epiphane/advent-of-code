const fs = require('fs');

let file = 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split(', ');

const N = 0;
const E = 1;
const S = 2;
const W = 3;

let dir = N;
let pos = { x: 0, y: 0 };

visited = [];

visited[0] = [];
visited[0][0] = true;

function move(dir, amt) {
   while (amt-- > 0) {
      pos.x += dir.x;
      pos.y += dir.y;

      visited[pos.x] = visited[pos.x] || [];
      if (visited[pos.x][pos.y]) {
         console.log(pos.x + pos.y);
      }
      visited[pos.x][pos.y] = true;
   }
}

input.forEach(cmd => {
   if (cmd[0] === 'R') {
      dir = (dir + 1) % 4;
   }
   else {
      dir --;
      if (dir < 0) { dir = W; }
   }

   const dist = parseInt(cmd.substr(1), 10);
   switch (dir) {
      case N:
         move({ x: 0, y: 1 }, dist);
         break;
      case E:
         move({ y: 0, x: 1 }, dist);
         break;
      case S:
         move({ x: 0, y: -1 }, dist);
         break;
      case W:
         move({ y: 0, x: -1 }, dist);
         break;
   }
});
