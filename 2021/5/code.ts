import * as fs from 'fs';
import { Map } from '../../map';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

const lines: Line[] = [];
asLines.forEach(line => {
    const parts = line.split(' -> ');
    const [x1, y1] = parts[0].split(',').map(i => parseInt(i));
    const [x2, y2] = parts[1].split(',').map(i => parseInt(i));

    lines.push({
        x1,
        y1,
        x2,
        y2,
    });
});

function frequency(lines: Line[]) {
    const count = new Map(0);

    lines.forEach(({ x1, x2, y1, y2 }) => {
        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);
        const len = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));

        let x = x1;
        let y = y1;
        for (let t = 0; t <= len; t++) {
            count.set(x, y, count.get(x, y) + 1);

            x += dx;
            y += dy;
        }
    });

    return count;
}

const accumulator = (prev, count) => prev + (count > 1 ? 1 : 0);

console.log(`Part 1`, frequency(
    lines.filter(({ x1, x2, y1, y2 }) => {
        return x1 === x2 || y1 === y2
    })
).reduce(accumulator, 0))
console.log(`Part 2`, frequency(lines).reduce(accumulator, 0))
