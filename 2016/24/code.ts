import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, s => parseInt(s))

let start;
let destinations = [];
asMap.forEach((val, x, y) => {
    const asInt = parseInt(val);
    if (isNaN(asInt)) {
        return;
    }
    destinations[asInt] = { x, y };
})

function distFrom(startNdx: number, endNdx: number) {
    const start = { ...destinations[startNdx] };
    const dest = { ...destinations[endNdx] };
    let queue = [{
        pos: { ...start },
        steps: 0,
        manhattan: Math.abs(dest.x - start.x) + Math.abs(dest.y - start.y)
    }];

    let best = asMap.map(() => -1);

    while (queue.length) {
        const { pos: { x, y }, steps, manhattan } = queue.shift();
        if (x === dest.x && y === dest.y) {
            return steps;
        }

        if (asMap.get(x - 1, y) !== '#') {
            const manhattan = Math.abs(dest.x - (x - 1)) + Math.abs(dest.y - y)

            if (best.get(x - 1, y) > manhattan + steps + 1 || best.get(x - 1, y) < 0) {
                best.set(x - 1, y, manhattan + steps + 1);
                queue.push({
                    pos: { x: x - 1, y },
                    steps: steps + 1,
                    manhattan,
                })
            }
        }
        if (asMap.get(x, y - 1) !== '#') {
            const manhattan = Math.abs(dest.x - (x)) + Math.abs(dest.y - (y - 1));

            if (best.get(x, y - 1) > manhattan + steps + 1 || best.get(x, y - 1) < 0) {
                best.set(x, y - 1, manhattan + steps + 1);
                queue.push({
                    pos: { x, y: y - 1 },
                    steps: steps + 1,
                    manhattan,
                })
            }
        }
        if (asMap.get(x + 1, y) !== '#') {
            const manhattan = Math.abs(dest.x - (x + 1)) + Math.abs(dest.y - (y));
            if (best.get(x + 1, y) > manhattan + steps + 1 || best.get(x + 1, y) < 0) {
                best.set(x + 1, y, manhattan + steps + 1);
                queue.push({
                    pos: { x: x + 1, y },
                    steps: steps + 1,
                    manhattan,
                })
            }
        }
        if (asMap.get(x, y + 1) !== '#') {
            const manhattan = Math.abs(dest.x - (x)) + Math.abs(dest.y - (y + 1));
            if (best.get(x, y + 1) > manhattan + steps + 1 || best.get(x, y + 1) < 0) {
                best.set(x, y + 1, manhattan + steps + 1);
                queue.push({
                    pos: { x, y: y + 1 },
                    steps: steps + 1,
                    manhattan,
                })
            }
        }

        queue.sort((a, b) => {
            return (a.manhattan + a.steps) - (b.manhattan + b.steps);
        });
    }
}

let best;
permute(destinations.length - 1).forEach((order, _i) => {
    order.forEach((v, i) => order[i] = v + 1)
    order.unshift(0);
    order.push(0);

    let score = distFrom(0, order[0]);
    for (let i = 0; i < order.length - 1; i++) {
        score += distFrom(order[i], order[i + 1]);
        if (best && score >= best) {
            return;
        }
    }

    best = score;
    print(best)
});

print('best', best)

// .forEach(order => {
//     print(order);
// })

// print(distFrom(0, 1));
