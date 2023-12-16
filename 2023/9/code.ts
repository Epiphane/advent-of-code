// @ts-nocheck

import * as fs from 'fs';
import '../../utils';

const file = process.argv[2] || 'input';
const raw = fs.readFileSync(file + '.txt').toString().trim();
const asLines = raw.split('\n').map(line => line);

let [part1, part2] = asLines.reduce(([rTotal, lTotal], line) => {
    let sequences = [line.split(' ').map(n => +n)];

    while (sequences.end().some(i => i !== 0)) {
        let prev = sequences.end();
        let next = prev.slice(1).map((val, i) => val - prev[i]);
        sequences.push(next);
    }

    let left = 0;
    let right = 0;
    while (sequences.length) {
        let seq = sequences.pop();

        right = seq.end() + right;
        left = seq[0] - left;
    }

    return [rTotal + right, lTotal + left];
}, [0, 0])

console.log(`Part 1: ${part1}`)
console.log(`Part 2: ${part2}`)
