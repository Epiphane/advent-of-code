import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, addAll } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asNumberMap = MapFromInput(0, makeInt)

// let cuboids = [];

// range(101).forEach(x => {
//     x -= 50
//     const rx = [];
//     range(101).forEach(y => {
//         y -= 50;
//         const ry =[];
//          range(101).forEach(z => {
//             z -= 50;
//             ry[z] = 0;
//         })
//         rx[y] = ry;
//     })
//     cuboids[x] = rx;
// });

// cuboids = range(101).map(() => range(101).map(() => range(101).map(() => 0)))

let cuboids = {};

type Block = {
    on: boolean;
    min: Point;
    max: Point;
}

let blocks = [] as Block[];

function loggy(block: Block) {
    return `${block.on ? 'on' : 'off'} {${block.min.x},${block.min.y},${block.min.z}} {${block.max.x - 1},${block.max.y - 1},${block.max.z - 1}}`;
}

asLines.forEach(line => {
    const [dir, splits] = line.split(' ');
    const [xs, ys, zs] = splits.split(',').map(p => {
        return p.substring(2).split('..').map(makeInt);
    })

    const min = new Point(xs[0], ys[0], zs[0]);
    const max = new Point(xs[1] + 1, ys[1] + 1, zs[1] + 1);

    console.log('\n\n\n\n\n\n\n');
    console.log(dir, min, max);

    const newb = {
        on: dir === 'on', min, max
    };

    // if (!newb.on) console.log(blocks.map(loggy).join('\n'));

    // Split up overlaps
    for (let index = 0; index < blocks.length; index++) {
        const element = blocks[index];

        // if (!newb.on) console.log('compare', index, loggy(element), 'to', loggy(newb));
        if (element.max.x < min.x ||
            element.min.x > max.x ||
            element.max.y < min.y ||
            element.min.y > max.y ||
            element.max.z < min.z ||
            element.min.z > max.z) {
            // console.log('  outta there');
            continue;
        }

        // Split in half
        if (min.x < element.max.x && min.x > element.min.x) {
            let newMin = new Point(min.x, element.min.y, element.min.z);
            let newMax = new Point(element.max.x, element.max.y, element.max.z);
            element.max.x = min.x;

            blocks.push({
                on: element.on,
                min: newMin,
                max: newMax,
            });
            // if (!newb.on) console.log(index, 's1\n', loggy(element), '\n', loggy(blocks[blocks.length - 1]));
        }
        if (max.x >= element.min.x && max.x < element.max.x) {
            let newMin = new Point(element.min.x, element.min.y, element.min.z);
            let newMax = new Point(max.x, element.max.y, element.max.z);
            element.min.x = max.x;

            blocks.push({
                on: element.on,
                min: newMin,
                max: newMax,
            });
            // if (!newb.on) console.log(index, 's2\n', loggy(element), '\n', loggy(blocks[blocks.length - 1]));
        }

        // Split y
        if (min.y < element.max.y && min.y > element.min.y) {
            let newMin = new Point(element.min.x, min.y, element.min.z);
            let newMax = new Point(element.max.x, element.max.y, element.max.z);
            element.max.y = min.y;

            blocks.push({
                on: element.on,
                min: newMin,
                max: newMax,
            });
            // if (!newb.on) console.log(index, 's3\n', loggy(element), '\n', loggy(blocks[blocks.length - 1]));
        }
        if (max.y > element.min.y && max.y < element.max.y) {
            let newMin = new Point(element.min.x, element.min.y, element.min.z);
            let newMax = new Point(element.max.x, max.y, element.max.z);
            element.min.y = max.y;

            blocks.push({
                on: element.on,
                min: newMin,
                max: newMax,
            });
            // if (!newb.on) console.log(index, 's4\n', loggy(element), '\n', loggy(blocks[blocks.length - 1]));
        }

        // Split z
        if (min.z < element.max.z && min.z > element.min.z) {
            let newMin = new Point(element.min.x, element.min.y, min.z);
            let newMax = new Point(element.max.x, element.max.y, element.max.z);
            element.max.z = min.z;

            blocks.push({
                on: element.on,
                min: newMin,
                max: newMax,
            });
            // if (!newb.on) console.log(index, 's5\n', loggy(element), '\n', loggy(blocks[blocks.length - 1]));
        }
        if (max.z > element.min.z && max.z < element.max.z) {
            let newMin = new Point(element.min.x, element.min.y, element.min.z);
            let newMax = new Point(element.max.x, element.max.y, max.z);
            element.min.z = max.z;

            blocks.push({
                on: element.on,
                min: newMin,
                max: newMax,
            });
            // if (!newb.on) console.log(index, 's6\n', loggy(element), '\n', loggy(blocks[blocks.length - 1]));
        }

        if (max.x >= element.max.x &&
            max.y >= element.max.y &&
            max.z >= element.max.z &&
            min.x <= element.min.x &&
            min.y <= element.min.y &&
            min.z <= element.min.z) {
            // if (!newb.on) console.log('removing', element, 'cuz', min, max);
            blocks.splice(index--, 1);
        }
    }

    blocks.push(newb);
})

// let result = 0;

// for (let i = 0; i < blocks.length; i++) {
//     const block = blocks[i];

//     for (let j = 0; j < i; j++) {
//         const other = blocks[j];

//         if (!other.on) {
//             continue;
//         }

//         if (other.max.x < block.min.x ||
//             other.max.y < block.min.y ||
//             other.max.z < block.min.z ||
//             block.max.x < other.min.x ||
//             block.max.y < other.min.y ||
//             block.max.z < other.min.z) {
//             continue;
//         }

//         const minOverlap = new Point(
//             Math.min(block.max.x, other.max.x),
//             Math.min(block.max.y, other.max.y),
//             Math.min(block.max.z, other.max.z),
//         );
//         const maxOverlap = new Point(
//             Math.max(block.min.x, other.min.x),
//             Math.max(block.min.y, other.min.y),
//             Math.max(block.min.z, other.min.z),
//         );


//     }
// }

let result = 0;

console.log()
console.log(blocks.map(loggy).join('\n'));

// console.log(blocks);
blocks.sort((b1, b2) => {
    if (b1.min.x !== b2.min.x) return b1.min.x - b2.min.x;
    if (b1.min.y !== b2.min.y) return b1.min.y - b2.min.y;
    if (b1.min.z !== b2.min.z) return b1.min.z - b2.min.z;
    if (b1.max.x !== b2.max.x) return b1.max.x - b2.max.x;
    if (b1.max.y !== b2.max.y) return b1.max.y - b2.max.y;
    if (b1.max.z !== b2.max.z) return b1.max.z - b2.max.z;
})

blocks.forEach((block, i) => {
    console.log(i, block.on, block.min, block.max, (block.max.x - block.min.x) * (block.max.y - block.min.y) * (block.max.z - block.min.z))
    if (block.on) {
        result += (block.max.x - block.min.x) * (block.max.y - block.min.y) * (block.max.z - block.min.z);
    }
})

// for (let i in cuboids) {
//     result += cuboids[i];
// }

console.log(result);


// console.log(cuboids.reduce((prev, rx) => prev + rx.reduce((p2, ry) => p2 + ry.reduce(addAll, 0), 0), 0));
