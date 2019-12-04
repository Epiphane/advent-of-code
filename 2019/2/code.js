const fs = require('fs');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split(',').map(i => parseInt(i));

function program(input) {
   input = input.map(i => i);
   let i = 0;

   while (input[i] !== 99) {
      let opcode = input[i++];

      if (opcode === 1) {
         let src1 = input[i++];
         let src2 = input[i++];
         let dst = input[i++];

         input[dst] = input[src1] + input[src2];
      }
      else if (opcode === 2) {
         let src1 = input[i++];
         let src2 = input[i++];
         let dst = input[i++];

         input[dst] = input[src1] * input[src2];
      }
      else {
         console.log('bad op', i, opcode)
      }
   }

   return input[0];
}

function test(input, x, y) {
   input = input.map(i => i)
   input[1] = x;
   input[2] = y;

   return program(input);
}

for (let n = 0; n <= 99; n ++) {
   for (let v = 0; v <= 99; v ++) {
      if (test(input, n, v) === 19690720) {
         console.log(100 * n + v);
      }
   }
}
