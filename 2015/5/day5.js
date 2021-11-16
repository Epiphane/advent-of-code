const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

// It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
// It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.

console.log(util.count(lines, line => {
    let dupes = 0;
    let dubs = 0;
    for (let i = 0; i < line.length - 2; i ++) {
        if (dupes === 0) {
            let sub = line.substr(i, 2);
            if (line.substr(i + 2).indexOf(sub) >= 0) {dupes ++;}
        }

        if (line[i] === line[i + 2]) { dubs ++; }
    }

    return dupes && dubs;
}))