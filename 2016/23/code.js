import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split('\n').map(i => i.trim().split(' '));

const log = console.log;
const print = console.log;

let regs = [12, 0, 0, 0];
let ip = 0;
while (ip < input.length) {
    let cmd = input[ip++];
    // print(ip);
    // console.log(cmd, regs);

    let reg1 = ['a', 'b', 'c', 'd'].indexOf(cmd[1]);
    let reg2 = ['a', 'b', 'c', 'd'].indexOf(cmd[2]);
    switch (cmd[0]) {
        case 'cpy':
            if (reg2 < 0) {
                print(cmd, 'skip')
            }
            else {
                if (reg1 >= 0) {
                    regs[reg2] = regs[reg1];
                }
                else {
                    regs[reg2] = +cmd[1];
                }
            }
            // print(cmd, `copy ${reg1 >= 0 ? regs[reg1] : +cmd[1]} to ${reg2}`)
            break;
        case 'inc':
            regs[reg1]++;
            break;
        case 'dec':
            regs[reg1]--;
            break;
        case 'jnz':
            let amt;
            if (reg2 >= 0) {
                amt = regs[reg2]
            }
            else {
                amt = +cmd[2];
            }

            if (reg1 >= 0) {
                if (regs[reg1] !== 0) {
                    ip += amt - 1;
                }
            }
            else if (+cmd[1] !== 0) {
                ip += amt - 1;
            }
            break;
        case 'tgl':
            let off = regs[reg1];
            let i = ip - 1 + off;

            // print(i, input.length);
            if (i <= input.length - 1) {
                if (input[i][0] === 'inc') {
                    input[i][0] = 'dec';
                }
                else if (input[i].length === 2) {
                    input[i][0] = 'inc';
                }
                else if (input[i][0] === 'jnz') {
                    input[i][0] = 'cpy';
                }
                else if (input[i].length === 3) {
                    input[i][0] = 'jnz';
                }
            }
            break;

        default:
            print('ah', cmd);
            ip = input.length + 1000;
    }
}

log(regs);
