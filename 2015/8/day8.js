const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

console.log(util.count(lines, line => {
    return 2 + util.count(line.split(''), c => c === '\\' || c === '"')

    let mem = 0;
    line = line.substr(1, line.length - 2);

    for (let c = 0; c < line.length; c ++) {
        if (line[c] === '\\') {
            switch (line[++c]) {
            case '\\': 
            case '"': 
                break;
            case 'x':
                c += 2;
                break;
            default: 
                console.log(line);
                break;
            }
        }
        mem ++;
    }

    return 2 + line.length - mem;
}))