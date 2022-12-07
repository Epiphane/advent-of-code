// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode } from '../../utils';
import { getRawInput, question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;
print(Interpreter);

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

let sendies = [0, 0];
class MyInterpreter extends Interpreter {
    paused = false;
    sends = 0;

    constructor(instrs, public id, public input, public output) {
        super(instrs);

        this.registers = {};
        this.registers['p'] = id;
    }

    getNum(x) {
        let parsed = parseInt(x);
        if (isNaN(parsed)) {
            parsed = this.registers[x] || 0;
        }
        return parsed;
    }

    snd(x) {
        this.output.push(this.getNum(x));
        this.sends++;
        sendies[this.id]++;

        // print(this.id, 'sends', this.output.length);
    }

    rcv(x) {
        if (this.input.length > 0) {
            this.registers[x] = this.input.shift();
            this.paused = false;
            // print(this.id, 'receives', this.registers[x]);
        }
        else {
            this.paused = true;
        }
    }

    stop() {
        return this.complete() || this.paused;
    }

    jgz(x, y) {
        if (x === 'a' && y === 3) {
            if (this.getNum(x) <= 0) {
                print(this.id);
                throw this.steps;
            }
        }
        if (this.getNum(x) > 0) {
            this.pc--;
            let jump = this.getNum(y);
            // if (jump > 0) jump--;
            this.pc += jump;
        }
    }

    set(x, y) {
        this.registers[x] = this.getNum(y);
        // if (isNaN(this.registers[x])) {
        // throw 'wah';
        // }
    }

    add(x, y) {
        // print(x, y, this.registers, this.getNum(y));
        this.registers[x] += this.getNum(y);
        // if (isNaN(this.registers[x])) {
        // throw 'wah';
        // }
    }

    mul(x, y) {
        this.registers[x] *= this.getNum(y);
        // if (isNaN(this.registers[x])) {
        // throw 'wah';
        // }
    }

    mod(x, y) {
        this.registers[x] %= this.getNum(y);
        // if (isNaN(this.registers[x])) {
        // throw 'wah';
        // }
    }

    // step() {
    //     super.step();
    // }

    run() {
        this.paused = false;
        super.run();
    }
}

let aOut = [];
let bOut = [];
const programA = new MyInterpreter(asLines, 0, bOut, aOut);
const programB = new MyInterpreter(asLines, 1, aOut, bOut);

print(programA.registers);
print(programB.registers);
while (true) {//!programA.stop() || !programB.stop()) {
    let s1 = programA.steps + programB.steps;
    programA.run();
    programB.run();
    let s2 = programA.steps + programB.steps;

    // print(s1, s2, '->', s2 === s1);
    if (bOut.length % 99 === 0) print(sendies, aOut.length, bOut.length);

    if (s2 === s1) {
        break;
    }

    // while (!programA.stop() || !programB.stop()) {
    //     programA.step();
    //     programB.step();
    //     // print(aOut.length, bOut.length);
    //     // print(sendies);
    // }
}

print(programA.sends);
print(programB.sends);
// print(programA.registers);
// print(programB.registers);
print(sendies);
print(programA.registers);
print(programB.registers);
