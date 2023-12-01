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

function makeDec(snafu) {
    let val = 0;
    for (let i = 0; i < snafu.length; i++) {
        let l = snafu[snafu.length - i - 1];
        let base = Math.pow(5, i);
        switch (l) {
            case '2':
                val += base * 2;
                break;
            case '1':
                val += base;
                break;
            case '0':
                break;
            case '-':
                val -= base;
                break;
            case '=':
                val -= 2 * base;
                break;
        }
    }

    return val;
}

function makeSnafu(dec) {
    let five = dec.toString(5);
    let snafu = '';

    let digits = five.split('').map(makeInt);
    let newf = digits.map(i => i);
    newf = [];
    let carry = false;;
    digits.reverse().forEach((dig, i) => {
        if (carry) {
            dig++;
            carry = false;
        }

        if (dig === 4) {
            carry = true;
            newf.unshift('-');
        }
        else if (dig === 3) {
            carry = true;
            newf.unshift('=');
        }
        else if (dig === 5) {
            carry = true;
            newf.unshift('0');
        }
        else {
            newf.unshift(`${dig}`);
        }
    })

    if (carry) {
        newf.unshift('1');
    }

    print(newf);

    return newf.join('');
}

// print(makeSnafu(15));
print(makeSnafu(12345));
print(makeSnafu(314159265));

asLines.forEach(line => {
    total += makeDec(line);
})

print(makeSnafu(total));
