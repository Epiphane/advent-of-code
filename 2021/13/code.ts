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

const paper = new Map('.');

asGroups[0].forEach(line => {
    const [x, y] = line.split(',').map(makeInt);
    paper.set(x, y, '#');
})

const folds = []
asGroups[1].forEach(line => {
    const axis = line[11];
    const val = parseInt(line.substr(13));
    folds.push({ axis, val });
})

function foldX(val: number) {
    for (let x = val; x < paper.max.x; x++) {
        let d = (x - val);
        let destX = val - d;

        for (let y = paper.min.y; y < paper.max.y; y++) {
            if (paper.get(x, y) === '#') {
                paper.set(destX, y, paper.get(x, y));
                paper.set(x, y, '.');
            }
        }
    }
    paper.max.x = val;
}


function foldY(val: number) {
    for (let y = val; y < paper.max.y; y++) {
        let d = (y - val);
        let destY = val - d;

        for (let x = paper.min.x; x < paper.max.x; x++) {
            if (paper.get(x, y) === '#') {
                print(x, y, 'goes to', x, destY);
                paper.set(x, destY, paper.get(x, y));
                paper.set(x, y, '.');
            }
        }
    }
    paper.max.y = val;
}

function fold({ axis, val }) {
    if (axis === 'x') {
        foldX(val);
    }
    else {
        foldY(val);
    }
}



// print(paper.print());
folds.forEach(f => {
    fold(f);
    print()
})
// fold(folds[0]);

print(paper.reduce((p, v) => p + (v === '#' ? 1 : 0), 0));
print(paper.print());
