import * as fs from 'fs';
import { makeInt } from '../../utils';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
const initialFish = raw.split(',').map(makeInt);

function simulate(days: number) {
    const fishByAge = new Array(9).fill(0);
    initialFish.forEach(age => fishByAge[age]++);

    for (let t = 0; t < days; t++) {
        const nBirthing = fishByAge[0];

        for (let i = 0; i < 8; i++) {
            fishByAge[i] = fishByAge[i + 1];
        }

        fishByAge[6] += nBirthing;
        fishByAge[8] = nBirthing;
    }

    return fishByAge;
}

console.log(`Part 1`, simulate(80).reduce((prev, i) => prev + i, 0))
console.log(`Part 2`, simulate(256).reduce((prev, i) => prev + i, 0))
