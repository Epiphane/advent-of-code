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

let total = 0;

let map = new Map(0);

let gears = {};
asLines.forEach((line, y) => {
    for (let i = 0; i < line.length; i++) {
        let partNum = 0;
        let subst = line.substring(i);
        let asNum = parseInt(subst);
        let gear = null;
        if (asNum && line[i] != '-') {
            if (asNum > 99) {
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (v === '*') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                        gear = { x: x2, y: y2 };
                    }
                })
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (v === '*') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                        gear = { x: x2, y: y2 };
                    }
                })
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (v === '*') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                        gear = { x: x2, y: y2 };
                    }
                })
            }
            else if (asNum > 9) {
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (v === '*') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                        gear = { x: x2, y: y2 };
                    }
                })
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (v === '*') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                        gear = { x: x2, y: y2 };
                    }
                })
            }
            else
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (v === '*') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                        gear = { x: x2, y: y2 };
                    }
                })
        }

        // if (partNum) print(partNum);
        if (gear) {
            let key = `${gear.x}|${gear.y}`;
            gears[key] = gears[key] || [];
            gears[key].push(partNum)
        }
        // total += partNum;
    }
})

for (let key in gears) {
    if (gears[key].length == 2) {
        print(gears[key])
        total += gears[key][0] * gears[key][1]
    }
}

print(total);
