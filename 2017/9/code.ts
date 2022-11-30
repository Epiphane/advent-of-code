// @ts-nocheck

import * as fs from 'fs';
import '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

class Group {
    score = 0;
    children: Group[] = [];

    constructor(public readonly parent: Group) {
        if (parent) {
            this.score = parent.score + 1;
        }
    }

    getScore() {
        return this.children.reduce((prev, child) => prev + child.getScore(), this.score);
    }

    countGarbage() {
        return this.children.reduce((prev, child) => prev + child.countGarbage(), 0);
    }
}

class Garbage extends Group {
    size = 0;

    getScore() {
        return 0;
    }

    countGarbage() {
        return this.size;
    }
}

const base = new Group(null);

let ignore = false;
let current = base;
for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (current instanceof Garbage) {
        if (ignore) {
            ignore = false;
        }
        else if (char === '>') {
            current = current.parent;
        }
        else if (char === '!') {
            ignore = true;
        }
        else {
            current.size++;
        }
    }
    else {
        if (char === '{') {
            const child = new Group(current);
            current.children.push(child);
            current = child;
        }
        else if (char === '}') {
            current = current.parent;
        }
        else if (char === '<') {
            const child = new Garbage(current);
            current.children.push(child);
            current = child;
        }
    }
}

print(`Part 1: ${base.getScore()}`);
print(`Part 2: ${base.countGarbage()}`);
