// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput, MapFromString } from '../../map';
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

let map = MapFromString(asGroups[0].join('\n'));
let moves = asGroups[1].join('').split('');

function p1(moves) {
    let map = MapFromString(asGroups[0].join('\n'));

    let robo = new Point(0, 0);
    map.forEach((v, x, y) => {
        if (v === '@') {
            robo = new Point(x, y);
            map.set(x, y, '.');
        }
    })

    print(robo);
    for (let move of moves) {
        let dir = UP;
        switch (move) {
            case '>':
                dir = RIGHT;
                break;
            case 'v':
                dir = DOWN;
                break;
            case '^':
                dir = UP;
                break;
            case '<':
                dir = LEFT;
                break;
        }

        let skip = dir;
        let next = map.get(robo.add(skip));
        let push = false;
        // print(dir, next);
        while (next === 'O') {
            push = true;
            skip = skip.add(dir);
            next = map.get(robo.add(skip))
        }

        if (next === '#') {
            continue;
        }
        else if (push) {
            map.set(robo.add(skip), 'O');
            map.set(robo.add(dir), '.');
            robo = robo.add(dir);
        }
        else {
            robo = robo.add(dir);
        }

        // print(map.map((v, x, y) => {
        //     if (x === robo.x && y === robo.y) return '@';
        //     return v;
        // }).print());
        // print();
    }

    // print(map.print());
    return map.reduce((p, v, x, y) => {
        if (v !== 'O') { return p; }
        return p + (100 * y) + x
    }, 0);
}
function p2(moves) {
    let map = MapFromString(asGroups[0].join('\n'));
    let newMap = new Map('.');
    map.forEach((v, x, y) => {
        newMap.set(x * 2, y, v)
        newMap.set(x * 2 + 1, y, v)
        if (v === 'O') {
            newMap.set(x * 2, y, '[')
            newMap.set(x * 2 + 1, y, ']')
        }
        else if (v === '@') {
            newMap.set(x * 2, y, '@')
            newMap.set(x * 2 + 1, y, '.')
        }
    })

    map = newMap;
    // print(newMap.print());
    // return;

    let robo = new Point(0, 0);
    map.forEach((v, x, y) => {
        if (v === '@') {
            robo = new Point(x, y);
            map.set(x, y, '.');
        }
    })

    for (let move of moves) {

        // print(map.map((v, x, y) => {
        //     if (x === robo.x && y === robo.y) return '@';
        //     return v;
        // }).print(''));
        // print();
        print(move)
        let dir = UP;
        let ra = RIGHT;
        switch (move) {
            case '>':
                dir = RIGHT;
                ra = DOWN;
                break;
            case 'v':
                dir = DOWN;
                break;
            case '^':
                dir = UP;
                break;
            case '<':
                dir = LEFT;
                ra = DOWN;
                break;
        }

        let next = map.get(robo.add(dir));
        // let push = false;
        // while (next === 'O') {
        //     push = true;
        //     skip = skip.add(dir);
        //     next = map.get(robo.add(skip))
        // }

        if (next === '#') {
            continue;
        }
        else if (next === '.') {
            robo = robo.add(dir);
        }
        else if (dir.y === 0) {
            let skip = dir;
            let next = map.get(robo.add(skip));
            let push = false;
            while (next === '[' || next === ']') {
                push = true;
                skip = skip.add(dir);
                next = map.get(robo.add(skip))
                print(skip);
            }

            if (next === '#') {
                continue;
            }
            else {
                print(skip, robo, dir.x)
                for (let x = robo.add(skip).x; x !== robo.x; x -= dir.x) {
                    map.set(x, robo.y, map.get(x - dir.x, robo.y));
                }
                robo = robo.add(dir);
            }
        }
        else {
            let pushable = (p) => {
                let next = map.get(p);
                if (next === '[') {
                    return pushable(p.add(dir)) && pushable(p.add(dir).add(new Point(1, 0)))
                }
                else if (next === ']') {
                    return pushable(p.add(dir)) && pushable(p.add(dir).add(new Point(-1, 0)))
                }
                else if (next === '#') {
                    return false;
                }
                else if (next === '.') {
                    return true;
                }
            };

            print('push')
            if (!pushable(robo.add(dir))) {
                print('push')
                continue;
            }
            else {
                print('push')
                let push = (p) => {
                    let next = map.get(p);
                    if (next === '[') {
                        push(p.add(dir));
                        push(p.add(dir).add(new Point(1, 0)));
                        map.set(p.add(dir), '[')
                        map.set(p.add(dir).add(new Point(1, 0)), ']')
                        map.set(p, '.')
                        map.set(p.add(new Point(1, 0)), '.')
                    }
                    else if (next === ']') {
                        push(p.add(dir));
                        push(p.add(dir).add(new Point(-1, 0)));
                        map.set(p.add(dir), ']')
                        map.set(p.add(dir).add(new Point(-1, 0)), '[')
                        map.set(p, '.')
                        map.set(p.add(new Point(-1, 0)), '.')
                    }
                    else if (next === '#') {
                        print('dswlfiugkdqwsegoiu')
                    }
                    else if (next === '.') {
                        return;
                    }
                }

                push(robo.add(dir));
                robo = robo.add(dir);
            }
        }

        /*
        else if (push) {
            map.set(robo.add(skip), 'O');
            map.set(robo.add(dir), '.');
            robo = robo.add(dir);
        }
        else {
            robo = robo.add(dir);
        }
            */

        // print(map.map((v, x, y) => {
        //     if (x === robo.x && y === robo.y) return '@';
        //     return v;
        // }).print());
        // print();
    }

    // print(map.print());
    return map.reduce((p, v, x, y) => {
        if (v !== '[') { return p; }
        return p + (100 * y) + x
    }, 0);
}

total = p2(moves);
print(total);
