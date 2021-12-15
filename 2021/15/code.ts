import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, makeInt, range } from '../../utils';
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
let asNumberMap = MapFromInput(0, makeInt)

const newmap = new Map(0);
asNumberMap.forEach((val, x, y) => {
    for (let dx = 0; dx < 5; dx++) {
        for (let dy = 0; dy < 5; dy++) {
            let nv = (val + dx + dy);
            while (nv > 9) {
                nv -= 9;
            }
            newmap.set(x + asNumberMap.max.x * dx, y + asNumberMap.max.y * dy, nv)
        }
    }
})

// asNumberMap = newmap;

function getDist(x, y) {
    return Math.abs(x - asNumberMap.max.x) + Math.abs(y - asNumberMap.max.y)
}

let queue = [{
    x: 0,
    y: 0,
    risk: 0,
    dist: getDist(0, 0),
    hasUL: false,
}];

let best = new Map(Infinity);

console.log(asNumberMap.max.x);
while (queue.length) {
    let {
        x, y, risk, dist, hasUL
    } = queue.shift();

    if (x === asNumberMap.max.x - 1 && y === asNumberMap.max.y - 1) {
        console.log(x, y, risk, hasUL);
        break;
    }

    if (best.get(x, y) < risk) {
        continue;
    }

    best.set(x, y, risk);

    if (x > 0) {
        const nr = best.get(x - 1, y);
        const dr = asNumberMap.get(x - 1, y);
        if (nr > risk + dr) {
            best.set(x - 1, y, risk + dr)
            queue.push({ x: x - 1, y, risk: risk + dr, dist: getDist(x - 1, y), hasUL: true })
        }
    }

    if (y > 0) {
        const nr = best.get(x, y - 1);
        const dr = asNumberMap.get(x, y - 1);
        if (nr > risk + dr) {
            best.set(x, y - 1, risk + dr)
            queue.push({ x: x, y: y - 1, risk: risk + dr, dist: getDist(x, y - 1), hasUL: true })
        }
    }

    if (x + 1 < asNumberMap.max.x) {
        const nr = best.get(x + 1, y);
        const dr = asNumberMap.get(x + 1, y);
        if (nr > risk + dr) {
            best.set(x + 1, y, risk + dr)
            queue.push({ x: x + 1, y, risk: risk + dr, dist: getDist(x + 1, y), hasUL })
        }
    }

    if (y + 1 < asNumberMap.max.y) {
        const nr = best.get(x, y + 1);
        const dr = asNumberMap.get(x, y + 1);
        if (nr > risk + dr) {
            best.set(x, y + 1, risk + dr)
            queue.push({ x: x, y: y + 1, risk: risk + dr, dist: getDist(x, y + 1), hasUL })
        }
    }

    queue.sort((a, b) => {
        if (a.risk === b.risk) {
            return a.dist - b.dist;
        }
        return (a.risk - b.risk)
    })


    // print(queue.length);
}

// print(asNumberMap.print());
