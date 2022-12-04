// @ts-nocheck

import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

let mapping = {};
let entries = [];

const delimiter = ' ';

let sacks = [];

let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

let badge = 0;
let n = 0;
let common = {};
asLines.forEach((line, ll) => {

    let mid = line.length / 2;
    let half1 = line.substring(0, mid).split('');
    let half2 = line.substring(mid).split('');
    if (line.length % 2 === 1) {
        print(line, line.length, mid);
    }

    let n = ll % 3;
    if (n === 0) {
        line.split('').forEach(l => {
            common[l] = true;
        })
    }
    else {
        for (let l in common) {
            if (line.indexOf(l) < 0) {
                common[l] = false;
            }
        }
    }

    let broken;
    let common2 = [];
    let tt = 0;
    letters.forEach((l, pri) => {
        if (half1.indexOf(l) >= 0 && half2.indexOf(l) >= 0) {
            common2.push(pri + 1);
            // print(half1[half1.indexOf(l)], half2[half2.indexOf(l)], pri + 1);
            // print(l, pri + 1);
            tt++;
            broken = l;
            // total += pri + 1;
        }
    })

    // if (common2.length !== 1)
    //     print(common2);

    // let c = broken.charCodeAt(0);
    // if (c >= 'a'.charCodeAt(0)) {
    //     total += c - 'a'.charCodeAt(0) + 1;
    // }
    // else {
    //     total += c - 'A'.charCodeAt(0) + 27;
    // }

    if (n === 2) {
        let allCommon = {};
        for (let l in common) {
            if (common[l]) {
                allCommon[l] = true
                total += letters.indexOf(l) + 1;
                print(letters.indexOf(l) + 1);
            }
        }
        common = {};
    }

    // total += common.reduce(addAll, 0);
})






print(total);
