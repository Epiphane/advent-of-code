// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
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

let total = 0;

let entries = {};
let files = {};

let path = '/';
let listing = false;
const makeDir = (parent, path) => {
    return { path, children: [], parent, size: -1 };
}
const makeFile = (parent, path, size) => {
    return { path, children: [], parent, size };
}
function getSize(file) {
    if (file.size >= 0) return file.size;
    return file.children.reduce((prev, f) => prev + getSize(f), 0);
}
let cursor = makeDir(null, '/');
const top = cursor
let dirs = [];
asLines.forEach(line => {
    if (line[0] === '$') {
        const [_, cm, pt] = line.split(' ');
        switch (cm) {
            case 'cd':
                if (pt === '/') {
                    cursor = top;
                }
                else if (pt === '..') {
                    cursor = cursor.parent;
                }
                else {
                    path += pt;
                    cursor = cursor.children.find(c => c.path === pt);
                }
                break;
            case 'ls':
                break;
        }
    }
    else {
        let words = line.split(' ');
        if (words[0] === 'dir') {
            // dir
            let dn = words[1]
            const d = makeDir(cursor, dn);
            cursor.children.push(d);
            dirs.push(d);
        }
        else {
            let sz = parseInt(words[0]);
            // total += sz;
            let name = words[1];
            cursor.children.push(makeFile(cursor, name, sz));
        }
    }
})

total = 0;

dirs.forEach(dir => {
    const s = getSize(dir);
    if (s <= 100000) {
        total += s;
        // print(dir, s);
    }
})
print(total);

dirs.forEach(d => {
    d.size = getSize(d);
})

let best = 10000000000;

let used = getSize(top);
let unused = 70000000 - used;

dirs.forEach(dir => {
    if (unused + dir.size >= 30000000) {
        best = Math.min(dir.size, best);
        print(dir.size);
    }
})
print(unused);
print(best, unused + best);

// print(top);
// print(dirs[0]);
// print(getSize(dirs[0]));
