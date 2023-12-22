// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
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

let trench = new Map(0);

let caps = [];
let rows = [];

function calcPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
        var addX = vertices[i].x + 1;
        var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y + 1;
        var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
        var subY = vertices[i].y;

        total += (addX * addY * 0.5);
        total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}

let rowRanges = [];
let vertices = []
let pos = { x: 0, y: 0 };
let min = 0; let max = 0;
// vertices.push({ x: 0, y: 0 })
let i = 0;
for (let line of asLines) {

    let [a, b, c] = line.split(' ')
    // print(a, b, c);

    let len = parseInt(c.substring(0, 5), 16);
    // print(len)


    let dir = [RIGHT, DOWN, LEFT, UP][+c[5]];
    // dir = { R: RIGHT, D: DOWN, L: LEFT, U: UP }[a];
    // len = +b;
    // print(dir);
    // switch (a) {
    //     case 'U': dir = UP; break;
    //     case 'D': dir = DOWN; break;
    //     case 'L': dir = LEFT; break;
    //     case 'R': dir = RIGHT; break;
    // }

    // let npos = { ...pos };
    // for (let i = 0; i < len; i++) {
    //     trench.set(npos.x, npos.y, '#');
    //     npos.x += dir.x;
    //     npos.y += dir.y;
    // }



    let start = { ...pos };
    pos.x += dir.x * len;
    pos.y += dir.y * len;
    // let end = pos;

    // let area = (Math.max(0, end.x, start.x) - Math.min(0, end.x, start.x)) *
    //     (Math.max(0, end.y, start.y) - Math.min(0, end.y, start.y)) / 2
    // print(start, end, area);
    // total += area;
    // vertices.push({ x: pos.x, y: pos.y })

    caps[pos.y] = caps[pos.y] || [];
    caps[pos.y].push(pos.x/*, dir*/);

    if (!rows.includes(pos.y)) {
        rows.push(pos.y);
    }

    if ([LEFT, RIGHT].includes(dir)) {
        rowRanges[pos.y] = rowRanges[pos.y] || [];
        rowRanges[pos.y].push([start.x, pos.x].sort((a, b) => a - b));
        rowRanges[pos.y] = rowRanges[pos.y].sort(([a], [b]) => a - b)
    }

    // min = Math.min(pos.y, min);
    // max = Math.max(pos.y, max);
    // print(a, b, { x: pos.x, y: pos.y });

    // print(dir, len)
}

// let lag = new Map(0);
// for (let j = trench.min.y; j < trench.max.y; j++) {
//     let inside = false;
//     for (let i = trench.min.x; i < trench.max.x; i++) {
//         if (trench.get(i, j) !== 0 && trench.get(i, j - 1)) {
//             inside = !inside;
//             lag.set(i, j, 1);
//         }

//         if (inside || trench.get(i, j) !== 0) {
//             // total++;
//             lag.set(i, j, 1);
//         }
//     }
// }

// print(lag.map(i => [' ', '#'][i]).print())
// for (let y = lag.min.y; y < lag.max.y; y++) {
//     let tot = 0;
//     lag.forEachInRow(y, val => tot += val)
//     // if ([-158, -159, -160].includes(y))
//     print(y, tot);
//     total += tot;
// }
// // print(lag.reduce(addAll, 0));
// print(total);
// total = 0;

// print(rowRanges);

rows = rows.sort((a, b) => a - b);
let ranges = [];
let lastRow = rows[0];
let lastAmt = 0;
let vis = new Map('.');
// for (let row = rows[0]; row <= rows[rows.length - 1]; row++) {
for (let row of rows) {
    if (!rows.includes(row)) {
        // print(row, lastAmt);
        continue;
    }
    // if (ranges.length === 0) {
    //     ranges = rowRanges[row];
    //     print(row, ranges);
    //     continue;
    // }
    total += (+row - lastRow) * lastAmt;
    // range((+row - lastRow)).forEach((r) => if print(lastAmt))
    // print((+row - lastRow), row, lastRow, lastAmt, (row - lastRow) * lastAmt)
    lastRow = +row + 1;

    let points = [];
    rowRanges[row].forEach((range) => points = points.concat(range));
    ranges.forEach((range) => points = points.concat(range));
    points = points.sort((a, b) => a - b);
    // print(rowRanges[row], ranges, points);

    let myRanges = ranges.concat(rowRanges[row]).sort(([a, a2], [b, b2]) => {
        if (a === b) return a2 - b2;
        return a - b
    });

    let curs = myRanges[0][0];
    let myAmt = 0;
    myRanges.forEach(([st, en]) => {
        if (curs < st) curs = st;
        if (curs > en) return;
        // for (let k = curs; k <= en; k++) {
        //     vis.set(k, row, '#');
        // }
        myAmt += en - curs + 1;
        curs = en + 1;
        // print('e', en, curs);
    })
    // if ([-158, -159, -160].includes(row))
    print(row, myAmt);
    // print(myAmt)
    total += myAmt;

    ranges = [];
    lastAmt = 0;
    for (let i = 0; i < points.length; i++) {
        let st = i++;
        if (points[st] === points[i]) {
            continue;
        }
        // print('+', [points[i], points[i + 1]])
        while (i < points.length - 1 && points[i] === points[i + 1]) {
            i += 2;
        }
        ranges.push([points[st], points[i]])
        lastAmt += (points[i] - points[st] + 1);
    }
    // print(points);
    // print(lastAmt);

    // lastRow = row + 1;

    // total += lastAmt;

    // print(row, ranges, points);
}

// print(vis.print());
print(total);

/*
// print(vertices);
// print(rows);

let lastRow = rows[0];
let lastNum = 0;
let ranges = [];
let first = true;
let rep = new Map('.');

print(caps);

for (let row = 0; row < 10; row++) {
    // for (let row of rows) {
    // let row = rows[row];
    // if (row) {
    total *= lastNum * (row - lastRow);
    // print(row);

    let rowcaps = caps[row];
    if (rowcaps) {
        rowcaps = rowcaps.sort((a, b) => a - b);
        print(row, rowcaps);
        // print(row, rowcaps);

        if (first) {
            for (let i in rowcaps) {
                if ((i % 2) === 0) continue;
                ranges.push([rowcaps[i - 1], rowcaps[i]]);
            }
            first = false;
        }
        else {

            lastNum = 0;
            let lastX;
            for (let i in rowcaps) {
                if ((i % 2) === 0) continue;
                let newRange = [rowcaps[i - 1], rowcaps[i]];

                let newRanges = [];
                for (let r in ranges) {
                    let [s, e] = ranges[r];
                    if (e < newRange[0] || s > newRange[1]) {
                        newRanges.push([s, e]);
                        continue;
                    }

                    let pts = [s, e, newRange[0], newRange[1]].sort();
                    print(pts);
                    // if (pts[1] === pts[2]) {}
                    if (pts[1] !== pts[0]) newRanges.push([pts[0], pts[1]]);
                    if (pts[3] !== pts[2]) newRanges.push([pts[2], pts[3]]);

                    // if (newRange[0] > newRange[1]) {
                    //     newRanges.push([s, e]);
                    //     continue;
                    // }

                    // let [s, e] = ranges[r];
                    // if (e < newRange[0] || s > newRange[1]) {
                    //     newRanges.push([s, e]);
                    //     continue;
                    // }
                    // if (s < newRange[0]) {
                    //     newRanges.push([s, newRange[0] - 1]);
                    //     newRange[0] = e + 1;
                    // }
                    // if (newRange[0] > newRange[1]) continue;
                    // if (e > newRange[1]) {
                    //     newRanges.push([newRange[1] + 1, e]);
                    // }
                    // if (s === newRange[0]) {
                    //     ranges[r][0] = newRange[1] + 1;
                    //     newRange[0] = newRange[1];
                    // }
                    // else if (s > newRange[0] && s <= newRange[1]) {
                    //     ranges[r][0] = newRange[1] + 1;
                    //     newRange[1] = s - 1;
                    // }
                    // else if (e === newRange[1]) {
                    //     ranges[r][1] = newRange[0] - 1;
                    //     newRange[0] = newRange[1];
                    // }
                    // else if (e >= newRange[0] && e < newRange[1]) {
                    //     ranges[r][1] = newRange[0] - 1;
                    //     newRange[0] = e + 1;
                    // }
                }

                // if (newRange[1] <= newRange[0]) continue;
                // ranges.push(newRange);
                // ranges = ranges.filter(r => r[1] >= r[0])
                ranges = newRanges.sort(([a], [b]) => a - b)
            }
        }
        // print(row, rowcaps, ranges);
    }

    print(row, ranges);
    ranges.forEach(([s, e]) => {
        for (let i = s; i <= e; i++) {
            rep.set(i, row, '#');
        }
    })

    // rowcaps.forEach(([x, dir], i) => {
    //     if ([LEFT, RIGHT].includes(dir)) {
    //         lastX = x;
    //     }
    //     else {
    //         lastNum += lastX 
    //     }
    // });


}

print(rep.print())




// print(calcPolygonArea([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]))
// print(calcPolygonArea(vertices))
*/
