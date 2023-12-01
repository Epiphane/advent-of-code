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

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

class MyInterpreter extends Interpreter {
    constructor(instrs: string[]) {
        super(instrs);
    }
}

let program = new MyInterpreter(asLines);

let monkeys = {};
asLines.forEach(line => {
    let words = line.split(' ');
    let monkey = words[0].split(':')[0];

    let n = parseInt(words[1]);
    if (isNaN(n)) {
        let first = words[1];
        let op = words[2];
        let sec = words[3];
        monkeys[monkey] = { first, op, sec };
    }
    else {
        monkeys[monkey] = { num: n };
    }
})

// print(monkeys);

monkeys['root'].op = '=';

function doMonkey(m) {
    let monkey = monkeys[m];
    // print(m, monkey);
    if (monkey.num) {
        return monkey.num;
    }

    switch (monkey.op) {
        case '-':
            return doMonkey(monkey.first) - doMonkey(monkey.sec);
        case '+':
            return doMonkey(monkey.first) + doMonkey(monkey.sec);
        case '*':
            return doMonkey(monkey.first) * doMonkey(monkey.sec);
        case '/':
            return doMonkey(monkey.first) / doMonkey(monkey.sec);
        case '=':
            return doMonkey(monkey.first) === doMonkey(monkey.sec);
    }
}

function hasHumn(m) {
    if (m === 'humn') return true;

    let monkey = monkeys[m];
    // print(m, monkey);
    if (monkey.num) {
        return false;
    }

    return hasHumn(monkey.first) || hasHumn(monkey.sec);
}

function solveHumn(m, val) {
    print(m, val);
    if (m === 'humn') return val;

    let monkey = monkeys[m];
    if (monkey.num) {
        return false;
    }

    let f = hasHumn(monkey.first);
    let s = hasHumn(monkey.sec);
    let vv = f ? doMonkey(monkey.sec) : doMonkey(monkey.first);

    let needed;
    if (f) {
        switch (monkey.op) {
            case '-':
                needed = val + vv;
                break;
            case '+':
                needed = val - vv;
                break;
            case '*':
                needed = val / vv;
                break;
            case '/':
                needed = val * vv;
                break;
        }
    }
    else {
        switch (monkey.op) {
            case '-':
                needed = vv - val;
                break;
            case '+':
                needed = val - vv;
                break;
            case '*':
                needed = val / vv;
                break;
            case '/':
                needed = vv / val;
                break;
        }
    }

    // print('need', val, vv, needed, val - vv)
    return solveHumn(f ? monkey.first : monkey.sec, needed)
}

function solveRoot(m) {
    let monk = monkeys[m];

    let f = hasHumn(monk.first);
    let s = hasHumn(monk.sec);
    return f ? solveHumn(monk.first, doMonkey(monk.sec)) : solveHumn(monk.sec, doMonkey(monk.first));
}

// range(100000000).forEach(i => {
//     monkeys['humn'].num = i;
//     if (doMonkey('root')) {
//         print(i);
//     }
// });

print(solveRoot('root'));

// print(total);
