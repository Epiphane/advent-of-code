import * as fs from 'fs';
import { range } from '../../utils';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

function intersect(string: string, include: string) {
    return string.split('').filter(l => include.includes(l)).join('');
}

let part1 = 0;
let part2 = 0;
asLines.forEach(line => {
    const [seed, output] = line
        .split(' ')
        .map(word => word.split('').sort().join(''))
        .join(' ')
        .split(' | ')
        .map(side => side.split(' '));

    const ofLength = range(8)
        .map(length => seed.filter(word => word.length === length));

    const lookup: string[] = range(10).map(() => '');
    lookup[1] = ofLength[2][0];
    lookup[4] = ofLength[4][0];
    lookup[7] = ofLength[3][0];
    lookup[8] = ofLength[7][0];
    part1 += output.filter(word => lookup.indexOf(word) >= 0).length;

    // 3 matches 1
    lookup[3] = ofLength[5].filter(word => intersect(word, lookup[1]) === lookup[1])[0];

    // 2 only has 2 sides in common with 4
    lookup[2] = ofLength[5].filter(word => intersect(word, lookup[4]).length === 2)[0];

    // 5 is the last one
    lookup[5] = ofLength[5].filter(word => word !== lookup[2] && word !== lookup[3])[0];

    // 9 matches 4
    lookup[9] = ofLength[6].filter(word => intersect(word, lookup[4]) === lookup[4])[0];

    // 6 does NOT match 1
    lookup[6] = ofLength[6].filter(word => intersect(word, lookup[1]) !== lookup[1])[0];

    // 0 is the last one
    lookup[0] = ofLength[6].filter(word => word !== lookup[6] && word !== lookup[9])[0];

    part2 += output
        .map(word => lookup.indexOf(word))
        .reduce((prev, val) => prev * 10 + val, 0);
})

console.log(`Part 1:`, part1);
console.log(`Part 2:`, part2);
