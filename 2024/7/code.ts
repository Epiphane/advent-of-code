// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
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

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

function* extractNumbers(matches: RegExpStringIterator) {
    for (let match of matches) {
        let result = [];
        for (let key in match) {
            result[key] = match[key];
            if (!isNaN(+result[key])) {
                result[key] = +result[key];
            }
        }
        yield result;
    }
}

function rec(goal, nums) {
    if (nums.length === 1) {
        return goal === nums[0] ? `${nums[0]}` : false;
    }

    // *
    let res;
    if ((goal / nums[nums.length - 1]) % 1 === 0) {
        res = rec(goal / nums[nums.length - 1], nums.slice(0, nums.length - 1))
        if (res) {
            return `${res} * ${nums[nums.length - 1]}`;
        }
    }
    // /
    // res = rec(goal * nums[nums.length - 1], nums.slice(0, nums.length - 1))
    // if (res) {
    //     return `${nums[nums.length - 1]} / ${res}`;
    // }
    // -
    // res = rec(goal + nums[nums.length - 1], nums.slice(0, nums.length - 1))
    // if (res) {
    //     return `${nums[nums.length - 1]} - ${res}`;
    // }
    // +
    res = rec(goal - nums[nums.length - 1], nums.slice(0, nums.length - 1))
    if (res) {
        return `${res} + ${nums[nums.length - 1]}`;
    }

    let gs = `${goal}`
    let ns = `${nums[nums.length - 1]}`;
    let pow = Math.pow(10, ns.length);
    if (goal % pow === nums[nums.length - 1]) {
        if (!(gs.indexOf(ns) === gs.length - ns.length)) {
            print(goal, nums, gs, ns);
        }

        // print(gs, ns, +gs.slice(0, gs.length - ns.length))
        res = rec(Math.floor(goal / pow), nums.slice(0, nums.length - 1))
        if (res) {
            return `${res} || ${nums[nums.length - 1]}`;
        }
    }

    return false;
}

function test(num, ps) {
    let r = rec(num, ps)
    if (r) {
        // if (r.indexOf('||') >= 0) print(num, '=', r);
        return ps.reduce(addAll, 0);
    }
    else {
        // print(num, ps.join(' '))
    }

    return 0;
}

let map = new Map(0);
let hands = [];
for (let line of asLines) {
    const matches = line.matchAll(/(\d+): (.*)/g);
    const iterator = extractNumbers(matches);
    for (let [text, n1, nall] of iterator) {
        let nums = nall.split(' ').map(i => +i)
        if (test(n1, nums)) {
            total += n1;
        }
    }
}


// 72710526658335
print(total);
