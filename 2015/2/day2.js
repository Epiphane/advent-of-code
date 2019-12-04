const fs = require('fs');

let inputFile = 'input';
let input = fs.readFileSync(inputFile + '.txt').toString().trim();
let lines = input.split('\n');

let total = 0;
lines.forEach(line => {
   let parts = line.split('x').map(i => parseInt(i));
   parts.sort((a, b) => a - b);
   total += 2 * (parts[0] + parts[1]);
   total += (parts[0] * parts[1] * parts[2]);
})

console.log(total);