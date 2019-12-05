const fs = require('fs');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split(',').map(i => parseInt(i));

function program(input) {
   input = input.map(i => i);
   let i = 0;

   while (input[i] !== 99) {
      // let param = Math.floor(input[i] / 100);
      // let opcode = input[i++] % 100;
      // let operation = ('' + input[i++]).split('').map(i => +i).reverse();
      // let opcode = '' + operation[1] + operation[0];

      let operation = input[i++];
      let opcode = operation % 100;
      operationdiv = Math.floor(operation / 100);
      let types = ('0000000' + operationdiv).split('').map(i => +i).reverse();
      console.log('op i=', i - 1, opcode);

      if (opcode === 1) {
         let src1 = input[i++];
         let src2 = input[i++];
         let dst = input[i++];
         // console.log(src1, src2, dst, types);

         if (!types[0]) { src1 = input[src1]; }
         if (!types[1]) { src2 = input[src2]; }

         if (!types[2]) {
         input[dst] = src1 + src2;
         // console.log('add', dst, src1, src2, input[dst]);
         }
         else{ console.log('idk2', i); return; }
      }
      else if (opcode === 2) {
         let src1 = input[i++];
         let src2 = input[i++];
         let dst = input[i++];

         if (!types[0]) { src1 = input[src1]; }
         if (!types[1]) { src2 = input[src2]; }

         if (!types[2]) {
         input[dst] = src1 * src2;
         }
         else{ console.log('idk', i); return; }
      }
      else if (opcode === 3) {
         let src = input[i++];
         // console.log(input[src]);
         input[src] = 5;
         // console.log(input[src], src)
         // return;
      }
      else if (opcode === 4) {
         console.log('op 4');
         let src = input[i++];
         console.log(input[src]);
      }
      else if (opcode === 5) {
         let src1 = input[i++];
         let src2 = input[i++];

         if (!types[0]) { src1 = input[src1]; }
         if (!types[1]) { src2 = input[src2]; }

         if (src1 !== 0) {
            i = src2;
         }
      }
      else if (opcode === 6) {
         let src1 = input[i++];
         let src2 = input[i++];

         if (!types[0]) { src1 = input[src1]; }
         if (!types[1]) { src2 = input[src2]; }

         if (src1 === 0) {
            i = src2;
         }
      }
      else if (opcode === 7) {
         let src1 = input[i++];
         let src2 = input[i++];
         let dst = input[i++];

         if (!types[0]) { src1 = input[src1]; }
         if (!types[1]) { src2 = input[src2]; }

         input[dst] = (src1 < src2) ? 1 : 0;
      }
      else if (opcode === 8) {
         let src1 = input[i++];
         let src2 = input[i++];
         let dst = input[i++];

         if (!types[0]) { src1 = input[src1]; }
         if (!types[1]) { src2 = input[src2]; }

         console.log(src1, src2, dst)
         input[dst] = (src1 === src2) ? 1 : 0;
      }
      else {
         console.log('bad op', i - 1, opcode)
         return;
      }
   }

   return input[0];
}

console.log(program(input));
