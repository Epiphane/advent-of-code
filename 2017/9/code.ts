// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
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

const group = (parent) => { return { score: parent + 1, groups: [], garbage: [] } };
const garbo = () => { return { garbo: true, val: '' } };

let groups = [];
let top = group(-1);
let groupStack = [top];
let ignore = false;
let total = 0;
raw.split('').forEach(l => {
    let curGrp = groupStack[groupStack.length - 1];
    if (curGrp.garbo) {
        if (ignore) {
            ignore = false;
            return;
        }

        if (l === '>') {
            groupStack.pop();
        }
        else if (l === '!') {
            ignore = true;
        }
        else {
            curGrp.val += l;
            total++;
        }
    }
    else {
        if (l === '{') {
            let newGrp = group(curGrp.score);
            curGrp.groups.push(newGrp);
            groupStack.push(newGrp);
        }
        else if (l === '}') {
            groupStack.pop();
        }
        else if (l === '<') {
            let newGrp = garbo();
            curGrp.garbage.push(newGrp);
            groupStack.push(newGrp);
            ignore = false;
        }
    }
});

function score(top) {
    let result = top.score;
    top.groups.forEach(grp => result += score(grp));
    return result;
}

print(score(top));
print(total)
