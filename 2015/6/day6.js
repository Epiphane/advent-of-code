const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

let lights = [];
for (let i = 0; i < 1000; i ++) {
    let row = [];
    for (let j = 0; j < 1000; j ++) {
        row.push(0);
    }
    lights.push(row);
}

lines.forEach(line => {
    let action = line.substr(0, 7);
    let parts = line.substr(8).split(' ');
    let start = parts[0].split(',').map(i => parseInt(i));
    let end = parts[2].split(',').map(i => parseInt(i));

    for (let i = start[0]; i <= end[0]; i ++) {
        for (let j = start[1]; j <= end[1]; j ++) {
            if (action === 'turn on') {
                lights[i][j] ++;
            }
            if (action === 'turn of') {
                if (lights[i][j] -- <= 0) lights[i][j] = 0;
            }
            if (action === 'toggle ') {
                lights[i][j] += 2;
            }
        }
    }
})

// console.log(lights.map(r => r.map(i => i ? '*' : ' ').join('')).join('\n'));

console.log(util.count(lights, row => util.count(row, e => e)));