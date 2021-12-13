import * as fs from 'fs';
import { Map } from '../../map';
import { addAll, makeInt } from '../../utils';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));

const paper = new Map(0);
asGroups[0].forEach(line => {
    const [x, y] = line.split(',').map(makeInt);
    paper.set(x, y, 1);
});

function foldX(value: number) {
    for (let x = value; x < paper.max.x; x++) {
        for (let y = paper.min.y; y < paper.max.y; y++) {
            if (paper.has(x, y)) {
                let destX = value - (x - value);
                paper.set(destX, y, paper.get(x, y));
            }
        }
    }
    paper.max.x = value;
}

function foldY(value: number) {
    for (let y = value; y < paper.max.y; y++) {
        for (let x = paper.min.x; x < paper.max.x; x++) {
            if (paper.has(x, y)) {
                let destY = value - (y - value);
                paper.set(x, destY, paper.get(x, y));
            }
        }
    }
    paper.max.y = value;
}

function fold(axis: string, value: number) {
    if (axis === 'x') {
        foldX(value);
    }
    else {
        foldY(value);
    }
}

asGroups[1].forEach((line, i) => {
    const [_, axis, value] = line.match(/fold along (.)=(\d+)/);

    fold(axis, parseInt(value));

    if (i === 0) {
        console.log(`Part 1`, paper.reduce(addAll, 0));
    }
})

console.log(paper.map(i => i ? '##' : '  ').print());
