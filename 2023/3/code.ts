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

let asLines = fs.readFileSync(file + '.txt').toString().split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let map = new Map(0);

asLines.forEach((line, y) => {
    for (let i = 0; i < line.length; i++) {
        let partNum = 0;
        let subst = line.substring(i);
        let asNum = parseInt(subst);
        if (asNum && line[i] != '-') {
            if (asNum > 99) {
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (isNaN(parseInt(v)) && v !== '.') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                    }
                })
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (isNaN(parseInt(v)) && v !== '.') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                    }
                })
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (isNaN(parseInt(v)) && v !== '.') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                    }
                })
            }
            else if (asNum > 9) {
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (isNaN(parseInt(v)) && v !== '.') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                    }
                })
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (isNaN(parseInt(v)) && v !== '.') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                    }
                })
            }
            else
                asMap.forNeighbors(i++, y, (v, x2, y2) => {
                    if (isNaN(parseInt(v)) && v !== '.') {
                        if (partNum == 0) print(asNum, v);
                        partNum = asNum;
                    }
                })
        }

        // if (partNum) print(partNum);
        total += partNum;
    }
})

print(total);
