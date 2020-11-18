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

let map = new Map('.');
let input = 'yjdafjpo';
// input = 'abc';

let cache = {};
function fn(hash) {
    if (cache[hash]) {
    }
    else {
        cache[hash] = md5(hash)
    }
    return cache[hash];
}

let n = 0;
let i = 0;

let pending = {};
while (n < 64) {
    let hash = md5(`${input}${i}`);

    for (let x = 0; x < 2016; x++) {
        hash = md5(hash);
    }

    let c = 0;
    let repeat;
    let found = false;
    for (let c_ = 0; c_ < hash.length; c_++) {
        if (hash[c_] === repeat) {
            c++;

            if (c === 2 && (!pending[repeat] || !pending[repeat].includes(i)) && !found) {
                pending[repeat] = pending[repeat] || [];
                pending[repeat].push(i);
                found = true;
                // print(i, hash, repeat);
            }

            if (c === 4) {
                pending[repeat].forEach(index => {
                    if (index !== i && index + 1000 >= i) {
                        n++;
                        print(n, index, i);
                    }
                })
                pending[repeat] = [i];
            }
        }
        else {
            c = 0;
        }

        repeat = hash[c_];
    }
    i++;

    if (i % 1000 === 0) {
        print(i);
    }
}
