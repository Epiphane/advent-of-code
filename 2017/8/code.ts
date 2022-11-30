// @ts-nocheck

import * as fs from 'fs';
import '../../utils';

const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

type Registers = Map<string, number>;
const registers: Registers = {};

const Operations = {
    '>': (reg: string, val: number) => (registers[reg] || 0) > val,
    '>=': (reg: string, val: number) => (registers[reg] || 0) >= val,
    '<': (reg: string, val: number) => (registers[reg] || 0) < val,
    '<=': (reg: string, val: number) => (registers[reg] || 0) <= val,
    '==': (reg: string, val: number) => (registers[reg] || 0) == val,
    '!=': (reg: string, val: number) => (registers[reg] || 0) != val,
};

let totalMax = 0;
asLines.forEach(line => {
    let [result, condition] = line.split(' if ');
    let [reg, op, val] = condition.split(' ');
    if (Operations[op](reg, parseInt(val))) {
        let [reg, op, val] = result.split(' ');
        registers[reg] = registers[reg] || 0;

        if (op === 'inc') {
            registers[reg] += parseInt(val);
        }
        else {
            registers[reg] -= parseInt(val);
        }

        totalMax = Math.max(totalMax, registers[reg]);
    }
})

print(`Part 1: ${Math.max(...registers.values())}`);
print(`Part 2: ${totalMax}`);
