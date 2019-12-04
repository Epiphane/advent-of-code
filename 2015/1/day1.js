const fs = require('fs');

let inputFile = 'input';
let input = fs.readFileSync(inputFile + '.txt').toString().trim().split('');

let floor = 0;
input.forEach((l, i) => {
   if (l === ')') floor --;
   if (l === '(') floor ++;
   if (floor === -1) { console.log(i); }
})
console.log(floor);