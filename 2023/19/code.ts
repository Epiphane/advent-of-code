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

let Turn = (dir: number, amount: number) => {
    dir += amount;
    while (dir < 0) dir += 4;
    while (dir > 3) dir -= 4;
    return dir;
}

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line);
let nums = raw.split('\n').map(line => parseInt(line));
let groups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let map = MapFromInput('.');
let numberMap = MapFromInput(0, makeInt)

const DIRS = [UP, RIGHT, DOWN, LEFT];
let total = 0;

let flows = {};

for (let line of groups[0]) {
    let [_, name, flow] = line.match(/(.*)\{(.*)\}/);
    flow = flow.split(',');
    // print(name, flow)
    flows[name] = flow;
}

function processer(obj) {
    let { x, m, a, s } = obj;
    let flow = 'in';
    while (true) {
        print(flow);
        if (flow === 'A') {
            return x + m + a + s;
        }
        if (flow === 'R') {
            return 0;
        }

        let rules = flows[flow];
        P(rules);
        for (let rule of rules) {
            let split = rule.split(':');
            if (split.length === 1) {
                flow = rule;
                break;
            }
            else {
                let op = split[0][1];
                if (op === '<') {
                    let varr = split[0][0];
                    if (obj[varr] < +split[0].substring(2)) {
                        flow = split[1];
                        break;
                    }
                }
                else {
                    let varr = split[0][0];
                    if (obj[varr] > +split[0].substring(2)) {
                        flow = split[1];
                        break;
                    }
                }
            }
        }
    }

    total += score;
}

// for (let line of groups[1]) {
//     if (!line) continue;
//     let [_, x, m, a, s] = line.match(/\{x=(.*),m=(.*),a=(.*),s=(.*)\}/).map(makeInt);;
//     let obj = { x, m, a, s };

//     let score = 0;
//     let done = false;
//     let val = processer(obj)
//     total += val;
//     print(obj, val);;
// }

// function combine([s1, e1], [s2, e2]) {
//     let all = [s1, e1, s2, e2].sort();
//     if (all[1] === all[2]) 
// }

let makeRuleRange = (flow, { x, m, a, s }, t) => {
    print(t, flow, x, m, a, s);
    if (flow === 'A') {
        return (x[1] - x[0] + 1) * (m[1] - m[0] + 1) * (a[1] - a[0] + 1) * (s[1] - s[0] + 1);
    }
    if (flow === 'R') {
        return 0;
    }

    let newOne = { x, m, a, s };
    let tot = 0;
    print(t, flows[flow])
    for (let rule of flows[flow]) {
        // if (rule === 'A') {
        //     print('sgiisdaigdskjhggsad')
        //     return tot + (newOne.x[1] - newOne.x[0]) * (newOne.m[1] - newOne.m[0]) * (newOne.a[1] - newOne.a[0]) * (newOne.s[1] - newOne.s[0]);
        // }
        // if (rule === 'R') {
        //     print('sgiisdaigdskjhggsad')
        //     return tot;
        // }

        let split = rule.split(':');
        if (split.length === 1) {
            return tot + makeRuleRange(rule, { x, m, a, s }, t + '    ');
        }

        let op = split[0][1];
        let varr = split[0][0];
        if (op === '<') {
            let oldOne = { x: [...newOne.x], m: [...newOne.m], a: [...newOne.a], s: [...newOne.s] };
            oldOne[varr][1] = +split[0].substring(2) - 1
            if (oldOne[varr][1] > oldOne[varr][0]) {
                tot += makeRuleRange(split[1], oldOne, t + '    ');
                newOne[varr][0] = +split[0].substring(2);
                print(t, '   ', tot, `x=${newOne.x.join('-')},m=${newOne.m.join('-')},a=${newOne.a.join('-')},s=${newOne.s.join('-')}`);
            }
        }
        else {
            let oldOne = { x: [...newOne.x], m: [...newOne.m], a: [...newOne.a], s: [...newOne.s] };
            oldOne[varr][0] = +split[0].substring(2) + 1
            if (oldOne[varr][1] > oldOne[varr][0]) {
                tot += makeRuleRange(split[1], oldOne, t + '    ');
                newOne[varr][1] = +split[0].substring(2);
                print(t, '   ', tot, `x=${newOne.x.join('-')},m=${newOne.m.join('-')},a=${newOne.a.join('-')},s=${newOne.s.join('-')}`);
            }
        }

    }

    return tot;
}

let makeRange = (rule, { x, m, a, s }) => {
    if (flow === 'A') {
        return (x[1] - x[0]) * (m[1] - m[0]) * (a[1] - a[0]) * (s[1] - s[0]);
    }
    if (flow === 'R') {
        return 0;
    }

    let rules = flows[flow];
    P(rules);

    for (let rule of rules) {
        let split = rule.split(':');
        if (split.length === 1) {
            flow = rule;
            break;
        }
        else {
            let op = split[0][1];
            if (op === '<') {
                let varr = split[0][0];
                if (obj[varr] < +split[0].substring(2)) {
                    flow = split[1];
                    break;
                }
            }
            else {
                let varr = split[0][0];
                if (obj[varr] > +split[0].substring(2)) {
                    flow = split[1];
                    break;
                }
            }
        }
    }
}

print(makeRuleRange('in', {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000]
}, ''));
