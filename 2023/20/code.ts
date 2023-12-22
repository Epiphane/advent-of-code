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

let lines = raw.split('\n').map(line => line);
let numbers = raw.split('\n').map(line => parseInt(line));
let groups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let map = MapFromInput('.');
let numberMap = MapFromInput(0, makeInt)

let totalHigh = 0;
let totalLow = 0;
let tots = [0, 0];

let modules = [];
let modNamed = {}
for (let line of lines) {
    if (!line) continue;
    // const [_] = line.match(/(.*)/);
    let [a, b] = line.split(' -> ')
    a = a.trim()
    b = b.trim()

    let module = {};
    if (a[0] === '%') {
        a = a.substring(1)
        module = {
            name: a,
            state: 0,
            type: 'F',
            dest: []
        }
    }
    else if (a[0] === '&') {
        a = a.substring(1)
        module = {
            name: a,
            state: 0,
            mem: {},
            type: 'C',
            dest: []
        }
    }
    else {
        module = {
            name: a,
            state: 0,
            type: 'B',
            dest: []
        }
    }

    module.dest = b.split(', ');
    modules.push(module);
    modNamed[a] = module
}

modules.forEach(({ name, dest }) => {
    dest.forEach(nm => {
        let node = modNamed[nm]
        if (node && node.type === 'C') {
            node.mem[name] = 0;
        }
    })
})

// print(modNamed)

let s = '';
for (let thing of modNamed.keys()) {
    if (['F', 'C'].includes(modNamed[thing].type)) {
        let len = 2;
        if (modNamed[thing].type === 'C') {
            len = modNamed[thing].mem.keys().length;
        }
        s += '|' + thing.padEnd(len);
    }
}
// print('         ', s)
print('      ', s)

let last = {}
let lastInt = {};
let N = 3790;
function push(i) {
    let stack = [['broadcaster', 0, 'button']];
    let numLows = 0;
    let all = modNamed.keys().map(() => '  ');
    while (stack.length) {
        let [name, hi, prev] = stack.shift();
        if (name === 'rx' && !hi) {
            numLows++;
        }
        tots[hi]++;
        // print(tots);

        let module = modNamed[name];
        // print(name, hi, prev, module);
        let s = `${prev.substring(0, 2)} ${hi}-> ${name}`
        //print(`${prev} ${hi}-> ${name}`)
        // print(name, module);
        // if (!module) print(name, modNamed)
        if (module) {
            switch (module.type) {
                case 'B':
                    module.dest.forEach(nm => {
                        stack.push([nm, hi, name])
                    })
                    break;
                case 'F':
                    if (!hi) {
                        module.state = 1 - module.state;
                        let ndx = (modNamed.keys().indexOf(name) - 1);
                        all[ndx] = `${module.state ? '1 ' : '_ '}`
                        module.dest.forEach(nm => {
                            stack.push([nm, module.state, name])
                        })
                        // if (i === 0) print(name, module.dest.filter(nm => modNamed[nm] && modNamed[nm].type === 'C'))
                    }
                    break;
                case 'C':
                    module.state = 1;
                    module.mem[prev] = hi;
                    for (let thing of module.mem.keys()) {
                        // let ndx = (modNamed.keys().indexOf(thing) - 1) * 3;
                        // all = all.substring(0, ndx + 2) + ` ` + all.substring(ndx + 3)
                        if (!module.mem[thing]) {
                            module.state = 0;
                        }
                    }
                    let ndx = (modNamed.keys().indexOf(name) - 1);
                    all[ndx] = module.mem.keys().map(key => module.mem[key] ? '1' : ' ').join('').padEnd(2) // `${module.state ? '1 ' : '_ '}`
                    if (['pb', 'nl', 'rr', 'dj'].includes(name) && module.state) {
                        lastInt[name] = i - last[name];
                        // print(lastInt, name, i, i % lastInt[name]);
                        last[name] = i;
                    }
                    module.dest.forEach(nm => {
                        stack.push([nm, module.state ? 0 : 1, name])
                    })
                    break;
            }
        }
    }

    // print(numLows);
    // N = 0;
    if (i >= N && i < N + 20) {
        print((i + 1).toString().padEnd(6), '|' + all.join('|'))
    }
    return numLows === 1;
}

// print(0b111111111111)

// print(modNamed.keys());
let i = 0;
for (; ; i++) {
    if (push(i)) {
        break;
    }

    // if (i % 10000 === 9999) {
    if (i >= N && i < N + 20) {
        // print(i);
        let s = '';
        let s2 = '';
        for (let thing of modNamed.keys()) {
            if (thing === 'broadcaster') continue;
            // if (modNamed[thing].type === 'F') {
            if (modNamed[thing].type === 'F') {
                s += modNamed[thing].state === 1 ? '|1 ' : '|  ';
            }
            else {
                s += '|' + modNamed[thing].mem.keys().map(key => modNamed[thing].mem[key] ? '1' : ' ').join('').padEnd(2)
            }
            s2 = modNamed[thing].state + s2;
            // }
        }
        print((i + 1).toString().padEnd(6), s);//, parseInt(s2, 2).toString(16));
        // print('dc', modNamed['dc'])
        // print('vp', modNamed['vp'])
        // print('rv', modNamed['rv'])
        // print('cq', modNamed['cq'])
    }
}

print(`Total:`, tots[0] * tots[1]);
print(i + 1);
