// @ts-nocheck

import * as fs from 'fs';
const print = console.log;
let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line);

const Numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
function Solve(part1: boolean) {
    return asLines.reduce((prev, line) => {
        let digits = [];

        line.split('').forEach((l, i) => {
            let intVal = parseInt(l);
            if (intVal) {
                digits.push(intVal);
            }

            if (!part1) {
                Numbers.forEach((name, val) => {
                    if (line.substring(i).startsWith(name)) {
                        digits.push(val);
                    }
                });
            }
        });

        return prev + (parseInt(`${digits[0]}${digits[digits.length - 1]}`));
    }, 0);
}

print(`Part 1: ${Solve(true)}`);
print(`Part 2: ${Solve(false)}`);
