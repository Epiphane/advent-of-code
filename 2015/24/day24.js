const fs = require('fs');

let inputFile = 'input';
let input = fs.readFileSync(inputFile + '.txt').toString().trim().split('\n').map(l => l.trim());
