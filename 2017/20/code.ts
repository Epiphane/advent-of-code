// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const UP = new Point(0, -1);
const DOWN = new Point(0, 1);
const LEFT = new Point(-1, 0);
const RIGHT = new Point(1, 0);

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let particles = []
asLines.forEach(line => {
    const [_, x, y, z, dx, dy, dz, ax, ay, az] = line.match(/p=<(.*),(.*),(.*)>, v=<(.*),(.*),(.*)>, a=<(.*),(.*),(.*)>/).map(makeInt)
    particles.push({ x, y, z, dx, dy, dz, ax, ay, az })
})

for (let i = 0; i < 1000; i++) {
    let claim = {};
    let np = [];
    particles.forEach((p, n) => {
        p.dx += p.ax;
        p.dy += p.ay;
        p.dz += p.az;
        p.x += p.dx;
        p.y += p.dy;
        p.z += p.dz;

        if (!claim[`${p.x},${p.y},${p.z}`]) {
            claim[`${p.x},${p.y},${p.z}`] = p;
        }
        else {
            claim[`${p.x},${p.y},${p.z}`] = true
            print('kill ' + `${p.x},${p.y},${p.z}`)
        }
    });

    claim.values().forEach(p => {
        if (p != true) {
            np.push(p);
            // print(p);
        }
    })

    // print(particles.best(({ x, y, z }) => -(Math.abs(x) + Math.abs(y) + Math.abs(z))));
    print(np.length);
    particles = np;
    // print(particles.map(({ x, dx, ax }) => { x, dx, ax }));
}
