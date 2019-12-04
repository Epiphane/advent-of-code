const fs = require('fs');

let file = 'input';
let finput = fs.readFileSync(file + '.txt');
// finput = `ULL\nRRDDD\nLURDL\nUUUUD`;

let input = finput.toString().trim().split('\n').map(l => l.split(''));

let pos = 5;

input.forEach(line => {
   line.forEach(dir => {
      switch (dir) {
      case 'U':
         if (pos === 3) { pos = 1; }
         else if (pos === 6) { pos = 2; }
         else if (pos === 7) { pos = 3; }
         else if (pos === 8) { pos = 4; }
         else if (pos === 'A') { pos = 6; }
         else if (pos === 'B') { pos = 7; }
         else if (pos === 'C') { pos = 8; }
         else if (pos === 'D') { pos = 'B'; }
         break;
      case 'L':
         if (pos === 3) { pos = 2; }
         else if (pos === 4) { pos = 3; }
         else if (pos === 6) { pos = 5; }
         else if (pos === 7) { pos = 6; }
         else if (pos === 8) { pos = 7; }
         else if (pos === 9) { pos = 8; }
         else if (pos === 'B') { pos = 'A'; }
         else if (pos === 'C') { pos = 'B'; }
         break;
      case 'D':
         if (pos === 1) { pos = 3; }
         else if (pos === 2) { pos = 6; }
         else if (pos === 3) { pos = 7; }
         else if (pos === 4) { pos = 8; }
         else if (pos === 6) { pos = 'A'; }
         else if (pos === 7) { pos = 'B'; }
         else if (pos === 8) { pos = 'C'; }
         else if (pos === 'B') { pos = 'D'; }
         break;
      case 'R':
         if (pos === 2) { pos = 3; }
         else if (pos === 3) { pos = 4; }
         else if (pos === 5) { pos = 6; }
         else if (pos === 6) { pos = 7; }
         else if (pos === 7) { pos = 8; }
         else if (pos === 8) { pos = 9; }
         else if (pos === 'A') { pos = 'B'; }
         else if (pos === 'B') { pos = 'C'; }
         break;
      }

   });

   console.log(pos);
});
