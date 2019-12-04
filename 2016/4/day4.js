const fs = require('fs');

let file = 'input';
let finput = fs.readFileSync(file + '.txt');

let lines = finput.toString().trim().split('\n');

let sum = 0;

const A = 'a'.charCodeAt(0);
const Z = 'z'.charCodeAt(0);
const _0 = '0'.charCodeAt(0);
const _9 = '9'.charCodeAt(0);

lines.forEach(line => {
   let freq = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map(l => [l, 0]);
   let csum = [];
   let summing = false;

   let id = 0;

   for (let i = 0; i < line.length; i ++) {
      const char = line.charCodeAt(i);

      if (summing && csum.length < 5) {
         csum.push(line[i]);
      }
      else if (char >= A && char <= Z) {
         freq[char - A][1] ++;
      }
      else if (id === 0 && char >= _0 && char <= _9) {
         id = parseInt(line.substr(i));
      }
      else if (line[i] === '[') {
         summing = true;
      }
   }

   freq.sort((a, b) => {
      return b[1] - a[1];
   })

   // if (
   //    csum[0] === freq[0][0] &&
   //    csum[1] === freq[1][0] &&
   //    csum[2] === freq[2][0] &&
   //    csum[3] === freq[3][0] &&
   //    csum[4] === freq[4][0]
   //    ) {
   //    sum += id;
   // }

   // console.log(freq, id, csum);
   let result = '';

   for (let i = 0; i < line.length; i ++) {
      let c = line.charCodeAt(i);
      if (c >= A && c <= Z) {
         c -= A;
         c += id;
         c %= 26;
         result += String.fromCharCode(c + A);
      }
      else {
         result += ' '
      }
   }

   if (result.indexOf('north') >= 0)
   console.log(result, id);
});

console.log(sum);
