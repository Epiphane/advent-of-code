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

const seeds = [];
asGroups[0][0].split(': ')[1].split(' ').forEach((value, i) => {
    if (i % 2 === 0) {
        seeds.push({ start: +value });
    }
    else {
        const seed = seeds[seeds.length - 1]
        seed.end = seed.start + +value;
    }
})

const mappings = asGroups.slice(1).map(group =>
    group.slice(1)
        .map(line => line.split(' ').map(makeInt))
        .map(([destStart, srcStart, length]) => ({
            start: srcStart,
            end: srcStart + length,
            offset: destStart - srcStart
        }))
        .sort((a, b) => a.start - b.start));

let current = seeds;
for (const mapping of mappings) {
    const next = [];

    current.forEach(({ start, end }) => {
        mapping.forEach(({ start: mapStart, end: mapEnd, offset }) => {
            if (start >= end) return;
            if (start > mapEnd) return;
            if (end < mapStart) {
                next.push({ start, end });
                return;
            }

            const intersect = {
                start: Math.max(start, mapStart),
                end: Math.min(end, mapEnd)
            };
            next.push({
                start: intersect.start + offset,
                end: intersect.end + offset
            });
            start = intersect.end;
        })
    })

    current = next;
}

print(current.reduce((prev, i) => Math.min(prev, i.start), Infinity))
