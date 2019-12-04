const fs = require('fs');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split('\n').map(i => parseInt(i));

function fuel(mass) {
   let f = Math.max(Math.floor(mass / 3) - 2, 0);
   if (f <= 0) { return 0; }
   return f + fuel(f);
}

console.log(input.reduce((prev, value) => prev + fuel(value), 0));
