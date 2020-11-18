const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../../utils');
const log = console.log;
const print = console.log;
const prompt = require('readline-sync').question;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let dist = new Map(1000000);

const N = 1364;
const X = 31;
const Y = 39;

function isWall(x, y) {
    let sum = x * x + 3 * x + 2 * x * y + y + y * y + N;
    return sum.toString(2).split('').reduce((r, i) => r += i === '1' ? 1 : 0, 0) % 2 === 1;
}

let stack = [{ x: 1, y: 1, l: 0, d: X + Y }];
dist.set(1, 1, 0);

while (stack.length > 0) {
    let { x, y, l, d } = stack.shift();

    // if (x === X && y === Y) {
    //     print(l);
    //     // break;
    // }
    l++;

    // if (l === 52) break;

    if (x > 0 && !isWall(x - 1, y) && dist.get(x - 1, y) > l) {
        dist.set(x - 1, y, l);
        stack.push({ x: x - 1, y, l });//, d: Math.abs(x - X) + Math.abs(y - Y) });
    }
    if (y > 0 && !isWall(x, y - 1) && dist.get(x, y - 1) > l) {
        dist.set(x, y - 1, l);
        stack.push({ x, y: y - 1, l });//, d: Math.abs(x - X) + Math.abs(y - Y) });
    }
    if (!isWall(x + 1, y) && dist.get(x + 1, y) > l) {
        dist.set(x + 1, y, l);
        stack.push({ x: x + 1, y, l });//, d: Math.abs(x - X) + Math.abs(y - Y) });
    }
    if (!isWall(x, y + 1) && dist.get(x, y + 1) > l) {
        dist.set(x, y + 1, l);
        stack.push({ x, y: y + 1, l });//, d: Math.abs(x - X) + Math.abs(y - Y) });
    }

    // stack.sort((a, b) => {
    //     return (a.l + a.d) - (b.l + b.d);
    // })
}


let s = 0;
dist.forEach((v, x, y) => {
    if (isWall(x, y)) return;
    // print(x, y, v, isWall(x, y));
    if (v <= 50 && !isWall(x, y)) {
        s++;
    }
})
// print(dist.print('  '))
print(s)
