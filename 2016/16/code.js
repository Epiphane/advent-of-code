const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../../utils');
const log = console.log;
const print = console.log;
const prompt = require('readline-sync').question;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

let initial = lines[0];
print(initial);

let len = 35651584;
let a = initial.split('').map(i => +i);
while (a.length < len) {
    let b = a.map(i => 1 - i).reverse();
    a = a.concat([0]).concat(b);
}

function checksum(string) {
    let result = '';
    result = '';
    for (let i = 0; i < string.length; i += 2) {
        if (string[i] === string[i + 1]) {
            result += '1';
        }
        else {
            result += '0';
        }
    }
    if (result.length % 2 === 0) {
        result = checksum(result);
    }
    return result;
}

print(checksum(a.slice(0, len)))
