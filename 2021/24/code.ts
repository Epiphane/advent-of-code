import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range } from '../../utils';
import { question } from 'readline-sync';
import { Interpreter } from '../../interpreter';
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

let input = [];
let inputter = () => input.shift();

class MyInterp extends Interpreter {
    w = 0;
    x = 0;
    y = 0;
    z = 0;

    inp(a) {
        this[a] = inputter();
    }

    add(a, b) {
        if (typeof (b) === 'string') {
            b = this[b];
        }
        this[a] += b
    }

    mul(a, b) {
        if (typeof (b) === 'string') {
            b = this[b];
        }
        this[a] *= b
    }

    div(a, b) {
        if (typeof (b) === 'string') {
            b = this[b];
        }
        this[a] = Math.floor(this[a] / b)
    }

    mod(a, b) {
        if (typeof (b) === 'string') {
            b = this[b];
        }
        this[a] = this[a] % b
    }

    eql(a, b) {
        if (typeof (b) === 'string') {
            b = this[b];
        }
        this[a] = (this[a] === b) ? 1 : 0;
    }
}


function test(input: number[]) {
    let x = 0;
    let z = 0;

    z = input[0] + 6

    z *= 26
    z = input[1] + 11

    z *= 26
    z = input[2] + 5

    z *= 26
    z = input[3] + 6

    z *= 26
    z = input[4] + 8

    // z = (((((input[0] + 6) * 26
    //     + input[1] + 11) * 26
    //     + input[2] + 5) * 26
    //     + input[3] + 6) * 26
    //     + input[4] + 8)

    if (input[4] + 7 !== input[5]) {
        z *= 26
        z += input[5] + 14
    }

    // x = z % 26 - 1
    // z = Math.floor(z / 26)

    // if (x !== input[5]) {
    //     z *= 26
    //     z += (input[5] + 14)
    // }

    // input[6]

    z *= 26
    z += (input[6] + 9)

    x = z % 26 - 16
    z = Math.floor(z / 26)

    if (x !== input[7]) {
        z *= 26
        z += (input[7] + 4)
    }

    // input[8]

    x = z % 26 - 8
    z = Math.floor(z / 26)

    if (x !== input[8]) {
        z *= 26
        z += (input[8] + 7)
    }



    // input[9]

    z *= 26
    z += input[9] + 13

    // input[10]

    x = z % 26 - 16
    z = Math.floor(z / 26)

    if (x !== input[10]) {
        z *= 26
        z += (input[10] + 11)
    }

    // input[11]

    x = z % 26 - 13
    z = Math.floor(z / 26)

    if (x !== input[11]) {
        z *= 26
        z += (input[11] + 11)
    }

    // input[12]

    x = z % 26 - 6
    z = Math.floor(z / 26)

    if (x !== input[12]) {
        z *= 26
        z += (input[12] + 6) * x
    }


    // input[13]

    x = z % 26 - 6
    z = Math.floor(z / 26)

    if (x !== input[13]) {
        z *= 26
        z += (input[13] + 1)
    }


    return z === 0;

}

let best = 0;
let i_ = 0;
range(9).forEach(i1 => {
    range(9).forEach(i2 => {
        range(9).forEach(i3 => {
            range(9).forEach(i4 => {
                range(9).forEach(i5 => {
                    range(9).forEach(i6 => {
                        range(9).forEach(i7 => {
                            range(9).forEach(i8 => {
                                range(9).forEach(i9 => {
                                    range(9).forEach(i10 => {
                                        range(9).forEach(i11 => {
                                            range(9).forEach(i12 => {
                                                range(9).forEach(i13 => {
                                                    range(9).forEach(i14 => {
                                                        const me = [
                                                            9 - i14,
                                                            9 - i13,
                                                            9 - i12,
                                                            9 - i11,
                                                            9 - i10,
                                                            9 - i9,
                                                            9 - i8,
                                                            9 - i7,
                                                            9 - i6,
                                                            9 - i5,
                                                            9 - i4,
                                                            9 - i3,
                                                            9 - i2,
                                                            9 - i1,
                                                        ]
                                                        input = [...me] as number[]


                                                        // const interp = new MyInterp();
                                                        // interp.run();
                                                        if (i_++ % 10000 === 0) console.log(me.join(''));
                                                        if (test(input)) {
                                                            // if (interp.z === 0) {
                                                            console.log(me.join(''));
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})
