// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, max } from '../../utils';
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

let registers = {};
let max_ = 0;
asLines.forEach(line => {
    let [first, op, second, _, cond1, cond2, cond3] = line.split(' ');
    let reg = first;
    let r1 = cond1;
    let r2 = cond3;
    registers[reg] = registers[reg] || 0;
    registers[r1] = registers[r1] || 0;
    print(reg, r1, r2);

    let pass = false;
    switch (cond2) {
        case '>':
            pass = registers[r1] > makeInt(r2);
            break;
        case '<':
            pass = registers[r1] < makeInt(r2);
            break;
        case '>=':
            pass = registers[r1] >= makeInt(r2);
            break;
        case '<=':
            pass = registers[r1] <= makeInt(r2);
            break;
        case '==':
            pass = registers[r1] == makeInt(r2);
            break;
        case '!=':
            pass = registers[r1] != makeInt(r2);
            break;
    }

    if (pass) {
        switch (op) {
            case 'inc':
                registers[reg] += parseInt(second);
                break;
            case 'dec':
                registers[reg] -= parseInt(second);
                break;
        }
    }

    max_ = Math.max(registers[reg], max_);
})

print(Math.max(...registers.values()));
print(max_);
