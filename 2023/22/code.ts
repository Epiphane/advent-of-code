// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const P = print;
const UP = new Point(0, -1);
const DOWN = new Point(0, 1);
const LEFT = new Point(-1, 0);
const RIGHT = new Point(1, 0);
const DIRS = [UP, RIGHT, DOWN, LEFT];

let Turn = (dir: number, amount: number) => {
    dir += amount;
    while (dir < 0) dir += 4;
    while (dir > 3) dir -= 4;
    return dir;
}

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let Lines = raw.split('\n').map(line => line);
let Numbers = raw.split('\n').map(line => parseInt(line));
let Groups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let NumberMap = MapFromInput(0, makeInt)

let total = 0;

let bricks = [];

for (let line of Lines) {
    let [[a, b, c], [x, y, z]] = line.split('~').map(i => i.split(',').map(i => +i))
    bricks.push({
        id: bricks.length,
        min: new Point(a, b, c),
        max: new Point(x, y, z),
        above: []
    });
}

function collide(brick1, brick2) {
    if (brick1.max.x < brick2.min.x ||
        brick1.max.y < brick2.min.y ||
        brick1.max.z < brick2.min.z ||
        brick2.max.x < brick1.min.x ||
        brick2.max.y < brick1.min.y ||
        brick2.max.z < brick1.min.z) {
        return false;
    }

    return true;
}

bricks.sort((a, b) => a.min.z - b.min.z);

function fall(bricks) {
    let fell = [];

    let newbricks = [];

    let newBricks = bricks.map((brick) => {
        let { id, min, max } = brick;
        let newbrick = { id, min: min.copy(), max: max.copy(), above: [] };
        let good = true;
        let ifell = false;
        while (newbrick.min.z > 1) {
            newbrick.min.z--;
            newbrick.max.z--;
            bricks.forEach(other => {
                if (other.id === id) return;
                if (collide(other, newbrick)) {
                    good = false;
                    newbrick.above.push(other.id);
                }
            });

            if (!good) {
                newbrick.min.z++;
                newbrick.max.z++;
                break;
            }
            else {
                ifell = true;
            }
        }

        if (ifell && !fell.includes(id)) {
            fell.push(id);
        }

        return newbrick;
    })

    return [newBricks, fell];
}

while (true) {
    let [nb, fell] = fall(bricks);
    bricks = nb;
    if (fell.length === 0) break;
}

bricks.forEach(brick => {
    let supported = bricks.filter(other => {
        if (other.id === brick.id) return false;
        if (other.above.includes(brick.id) && other.above.length === 1) return true;
    })

    let newbricks = bricks.filter(other => other.id !== brick.id);

    let allfell = [];
    while (true) {
        let [nb, fell] = fall(newbricks);
        newbricks = nb;
        if (fell.length === 0) break;
        fell.forEach(f => {
            if (!allfell.includes(f)) allfell.push(f);
        })
    }

    print(brick.id, 'makes', allfell.length, 'fall')
    total += allfell.length;

    // if (supported.length === 0) total++
})


print(total);
