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

let asLines = raw.split('\n').map(line => line.trimEnd());
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let stones = asLines.map(line => line.split('@').map(word => word.split(', ').map(makeInt)))

function intersect([[x1, y1, z1], [dx1, dy1, dz1]], [[x2, y2, z2], [dx2, dy2, dz2]]) {
    let t1 = (dx2 * (y2 - y1) + dy2 * (x1 - x2)) / (dy1 * dx2 - dx1 * dy2);
    let t2 = (dx1 * (y1 - y2) + dy1 * (x2 - x1)) / (dy2 * dx1 - dx2 * dy1);

    return [t1, t2, x1 + t1 * dx1, y1 + t1 * dy1];
}

let MIN = file === 'test' ? 7 : 200000000000000;
let MAX = file === 'test' ? 27 : 400000000000000;

// print(`Part 1:`, stones.reduce((prev, current, i) =>
//     prev + stones.reduce((prev, stone, j) => {
//         if (j <= i) return prev;
//         let [t1, t2, x, y] = intersect(current, stone);
//         if (t1 >= 0 && t2 >= 0 && x >= MIN && x <= MAX && y >= MIN && y <= MAX) {
//             return prev + 1;
//         }
//         return prev;
//     }, 0), 0))

import { init } from 'z3-solver';

(async () => {
    const { Context } = await init();
    const { Solver, Int, And } = new Context('main');

    const x = Int.const('x');
    const y = Int.const('y');
    const z = Int.const('z');
    const dx = Int.const('dx');
    const dy = Int.const('dy');
    const dz = Int.const('dz');

    const solver = new Solver();

    stones.slice(0, 3).forEach(([[_x_, _y_, _z_], [_dx_, _dy_, _dz_]], i) => {
        let x_ = Int.const('x_' + i);
        let y_ = Int.const('y_' + i);
        let z_ = Int.const('z_' + i);
        let dx_ = Int.const('dx_' + i);
        let dy_ = Int.const('dy_' + i);
        let dz_ = Int.const('dz_' + i);
        let t_ = Int.const('t_' + i);

        solver.add(x_.eq(_x_));
        solver.add(y_.eq(_y_));
        solver.add(z_.eq(_z_));
        solver.add(dx_.eq(_dx_));
        solver.add(dy_.eq(_dy_));
        solver.add(dz_.eq(_dz_));

        solver.add(t_.ge(0));                                 // t >= 0
        solver.add(x.add(t_.mul(dx)).eq(x_.add(t_.mul(dx_)))) // x + t * dx = _x_ + t * _dx_
        solver.add(y.add(t_.mul(dy)).eq(y_.add(t_.mul(dy_)))) // y + t * dy = _y_ + t * _dy_
        solver.add(z.add(t_.mul(dz)).eq(z_.add(t_.mul(dz_)))) // z + t * dz = _z_ + t * _dz_
    })

    await solver.check();

    const model = solver.model();
    print(model.get(x).value() +
        model.get(y).value() +
        model.get(z).value())
})();
