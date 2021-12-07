import * as fs from 'fs';
import { makeInt, range } from '../../utils';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

const positions = raw.split(',').map(makeInt);

console.log(`Part 1:`, Math.min(
    ...range(Math.max(...positions)).map(dest =>
        positions.reduce(
            (prev, pos) => prev + Math.abs(pos - dest),
            0
        )
    )
));
console.log(`Part 2:`, Math.min(
    ...range(Math.max(...positions)).map(dest =>
        positions.reduce(
            (prev, pos) => prev + Math.abs(pos - dest) * (Math.abs(pos - dest) + 1) / 2,
            0
        )
    )
));
