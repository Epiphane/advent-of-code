const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split('\r\n').map(i => i.split(' '));

const log = console.log;
const print = console.log;

let regs = [0, 0, 1, 0];
let ip = 0;
while (ip < input.length) {
   let cmd = input[ip++];
   // console.log(cmd, regs);

   let reg1 = ['a', 'b', 'c', 'd'].indexOf(cmd[1]);
   let reg2 = ['a', 'b', 'c', 'd'].indexOf(cmd[2]);
   switch (cmd[0]) {
      case 'cpy':
         if (reg1 >= 0) {
            regs[reg2] = regs[reg1];
         }
         else {
            regs[reg2] = +cmd[1];
         }
         break;
      case 'inc':
         regs[reg1]++;
         break;
      case 'dec':
         regs[reg1]--;
         break;
      case 'jnz':
         if (reg1 >= 0) {
            if (regs[reg1] !== 0) { ip += +cmd[2] - 1; }
         }
         else if (+cmd[1] !== 0) {
            ip += +cmd[2] - 1;
         }
         break;
   }
}

log(regs);
