const fs = require('fs');

let file = 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

function test(str, begin, end) {
   for (let i = begin; i < end - 3; i ++) {
      if (str[i] === str[i + 3] &&
         str[i + 1] === str[i + 2] &&
         str[i] !== str[i + 1]) {
            return true;
         }
   }

   return false;
}

// lines = [
//    'abba[mnop]qrst',
//    'abcd[bddb]xyyx',
//    'aaaa[qwer]tyui',
//    'ioxxoj[asdfgh]zxcvbn'
// ];

console.log(lines.filter(line => {
   let parts = line.replace(/\[/g, ']').split(']');

   for (let i = 0; i < parts.length; i += 2) {
      const part = parts[i];

      for (let c = 0; c < part.length - 2; c ++) {
         let A = part[c];
         let B = part[c + 1];
         if (A !== B && A === part[c + 2]) {

            for (let j = 1; j < parts.length; j += 2) {
               const p2 = parts[j];

               for (let c = 0; c < p2.length - 2; c ++) {
                  if (p2[c] === B && p2[c + 2] === B && p2[c + 1] === A) {
                     return true;
                  }
               }
            }

         }
      }
   }


   // for (let i = 1; i < parts.length; i += 2) {
   //    if (test(parts[i], 0, parts[i].length)) {
   //       // console.log(`fail ${i}, ${parts[i]}`);
   //       return false;
   //    }
   // }

   // return false;
}).length)
