// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, id } from '../../utils';
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

let nodes = [];
let conns = {};
let allconns = [];
print('graph G {')
for (let line of asLines) {
    const [[a], b] = line.split(': ').map(i => i.trimEnd().split(' '));

    conns[a] = conns[a] || [];
    if (!nodes.includes(a)) nodes.push(a);
    b.forEach(b_ => {
        conns[b_] = conns[b_] || [];
        conns[a].push(b_);
        conns[b_].push(a);
        allconns.push([a, b_])

        if (!nodes.includes(b_)) nodes.push(b_)

        print(`${a} -- ${b_}`)
        // print(`${b_} -> ${a}`)
    })
}
print('}')

// nodes = ['1', '2', '3', '4', '5', '6', '7', '8']
// allconns = [
//     ['1', '2'],
//     ['1', '3'],
//     ['1', '4'],
//     ['1', '7'],
//     ['2', '3'],
//     ['2', '4'],
//     ['3', '4'],
//     ['4', '5'],
//     ['5', '6'],
//     ['5', '7'],
//     ['5', '8'],
//     ['6', '7'],
//     ['6', '8'],
//     ['7', '8']
// ];

// for (let key of conns.keys()) {
//     // print(key);
//     if (conns[key].length === 2) {
//         print(key, conns[key], conns[key].length);
//     }
// }

function isConnected(skips) {
    let vis = {};
    vis[nodes[0]] = true;
    let stk = [nodes[0]];
    let vcount = 1;
    let disallow = [];
    while (stk.length) {
        let node = stk.shift();

        if (vcount >= nodes.length) {
            return true;
        }

        for (let other of conns[node]) {
            let cut = skips.find(([a, b]) => (a === node && b === other) || (b === node && a === other))
            if (cut) {
                disallow.push(other);
                continue;
            }

            if (disallow.includes(other)) {
                return true;
            }

            if (vis[other]) continue;

            vis[other] = true;
            vcount++;
            stk.push(other);
        }
    }

    // print(vis, vcount);

    return vcount;
}

let NN = [['hfx', 'pzl'], ['bvb', 'cmg'], ['nvd', 'jqt']];
if (file !== 'test') {
    NN = [['tqn', 'tvf'], ['krx', 'lmg'], ['tnr', 'vzb']];
}
let X = isConnected(NN);
print(X * (nodes.length - X))

// let done = false;
// allconns.forEach((a, i) => {
//     if (!done) print(i);
//     allconns.forEach((b, j) => {
//         if (j <= i) return;
//         if (!done) print(i, j)
//         allconns.forEach((c, k) => {
//             if (k <= j) return;

//             let cn = isConnected([a, b, c])
//             if (cn !== true && cn !== nodes.length) {
//                 print(a, b, c, cn)
//                 print(cn * (nodes.length - cn));
//                 done = true;
//             }
//         })
//     })
// })

// print(nodes.length);
// print(nodes);

// print(nodes.length, allconns.length);
// allconns.forEach(([a, b]) => {
//     print(nodes.indexOf(a), nodes.indexOf(b), 1)
// })
// return;

const Conns = conns;
const Nodes = nodes;
const Allconns = [...allconns];

function mincut2() {
    let conns = {};
    for (let c in Conns) {
        conns[c] = [...Conns[c]];
    }

    let nodes = [...Nodes];
    let allconns = [...Allconns];
    let alias = {};
    for (let c in Conns) {
        alias[c] = c;
    }

    let remain = allconns;
    let nnodes = nodes.length;

    while (nnodes > 6) {
        // print(remain);
        let [a, b] = remain[Math.floor(Math.random() * remain.length)];

        // if (alias[a] === alias[b]) continue;

        alias[alias[b]] = alias[alias[a]];
        remain = remain.filter(([a, b]) => alias[a] !== alias[b])
        nnodes--;
    }

    // print(nodes, conns, allconns);
    return remain;
}

let mc = [];
do {
    mc = mincut2();
    // if (mc.length < 50) 
    // print(mc.length);
} while (mc.length > 6)

print(mc.sort());


// let isGraph = ([i, j, k]) => {
//     let visited = {};

//     let q = []
//     let x = 0;
//     while ([i, j, k].includes(x)) x++;
//     q.push(nodes[x]);

//     while (q.length) {
//         let node = q.shift();

//         conns[node].forEach(other => {
//             if (visited[other]) return;

//             visited[other] = true;
//             q.push(other);
//         })
//     }

//     return [visited.keys().length === nodes.length - 3, visited.keys().length];
// }

// range(asLines.length).forEach(i => {
// range(asLines.length).forEach(j => {
//     if (j <= i) return;
// range(asLines.length).forEach(k => {
//     if (k <= j) return;

//     if (!isGraph)
// })
// })
// })






// print(total);
