import * as fs from 'fs';
import { Map, MapFromInput, MapFromString } from '../../map';
import { permute, gcd, lcm, makeInt, range } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');

const algorithm = asGroups[0][0].split('');
asMap = MapFromString(asGroups[1].join('\n'));

let allLit = false;
function apply(img: Map<string>) {
    const image = new Map(img.defaultValue === '#' ? '.' : '#');
    for (let x = img.min.x - 1; x < img.max.x + 1; x++) {
        for (let y = img.min.y - 1; y < img.max.y + 1; y++) {
            let str = [
                img.get(x - 1, y - 1),
                img.get(x, y - 1),
                img.get(x + 1, y - 1),
                img.get(x - 1, y),
                img.get(x, y),
                img.get(x + 1, y),
                img.get(x - 1, y + 1),
                img.get(x, y + 1),
                img.get(x + 1, y + 1),
            ];
            const strin = str.map(v => v === '#' ? 1 : 0).join('');
            const num = parseInt(strin, 2);

            const alg = algorithm[num];
            image.set(x, y, alg);
        }
    }

    allLit = !allLit;
    return image;
}

range(50).forEach((i) => {
    console.log(i);
    asMap = apply(asMap);
});

console.log(asMap.reduce((prev, i) => prev + (i === '#' ? 1 : 0), 0));
