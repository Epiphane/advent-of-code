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

function fall(bricks, stopAtOne) {
    let fell = [];

    bricks.forEach((brick) => {
        let { id, min, max } = brick;
        let good = true;
        let ifell = false;
        while (brick.min.z > 1) {
            brick.min.z--;
            brick.max.z--;
            bricks.forEach(other => {
                if (other.id === id) return;
                if (collide(other, brick)) {
                    good = false;
                    brick.above.push(other.id);
                }
            });

            if (!good) {
                brick.min.z++;
                brick.max.z++;
                break;
            }
            else {
                ifell = true;
            }

            if (stopAtOne)
                break;
        }

        if (ifell && !fell.includes(id)) {
            fell.push(id);
        }
    });

    return [bricks, fell];
}

while (true) {
    let [nb, fell] = fall(bricks);
    bricks = nb;
    if (fell.length === 0) break;
}

let part1 = 0;
let part2 = 0;

bricks.forEach(brick => {
    let copy = bricks.map(({ id, above }) => ({ id, above }));

    let supported = copy.filter(({ id, above }) => {
        if (id === brick.id) return false;
        if (above.includes(brick.id) && above.length === 1) return true;
    })

    /*
    let newbricks = bricks.filter(other => other.id !== brick.id).map(({ id, min, max, above }) => {
        return { id, min: min.copy(), max: max.copy(), above: [...above] }
    })

    let [nb, fell] = fall(newbricks, true);
    newbricks = nb;

    total += fell.length;
    */

    if (supported.length === 0) {
        part1++;
    }
    else {
        // supported.forEach
    }

    // if (supported.length === 0) total++
})


print(total);
