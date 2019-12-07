const fs = require('fs');

let inputFile = 'input';
let input = fs.readFileSync(inputFile + '.txt').toString();
let lines = input.split('\n');

let ops = {};

ops.addr = function(registers, a, b, c) {
   registers[c] = registers[a] + registers[b];
}

ops.addi = function(registers, a, b, c) {
   registers[c] = registers[a] + b;
}

ops.mulr = function(registers, a, b, c) {
   registers[c] = registers[a] * registers[b];
}

ops.muli = function(registers, a, b, c) {
   registers[c] = registers[a] * b;
}

ops.banr = function(registers, a, b, c) {
   registers[c] = registers[a] & registers[b];
}

ops.bani = function(registers, a, b, c) {
   registers[c] = registers[a] & b;
}

ops.borr = function(registers, a, b, c) {
   registers[c] = registers[a] | registers[b];
}

ops.bori = function(registers, a, b, c) {
   registers[c] = registers[a] | b;
}

ops.setr = function(registers, a, _, c) {
   registers[c] = registers[a];
}

ops.seti = function(registers, a, _, c) {
   registers[c] = a;
}

ops.gtir = function(registers, a, b, c) {
   registers[c] = a > registers[b] ? 1 : 0;
}

ops.gtri = function(registers, a, b, c) {
   registers[c] = registers[a] > b ? 1 : 0;
}

ops.gtrr = function(registers, a, b, c) {
   registers[c] = registers[a] > registers[b] ? 1 : 0;
}

ops.eqir = function(registers, a, b, c) {
   registers[c] = a === registers[b] ? 1 : 0;
}

ops.eqri = function(registers, a, b, c) {
   registers[c] = registers[a] === b ? 1 : 0;
}

ops.eqrr = function(registers, a, b, c) {
   registers[c] = registers[a] === registers[b] ? 1 : 0;
}

let ip = parseInt(lines[0].substr(4));
lines.shift();
let i = 0;
let res = [];
let reg0 = 0;
let state = {
   registers: [reg0, 0, 0, 0, 0, 0],
   instr: 0,
   ip: ip
};

// console.log(reg0);
while (false && state.instr >= 0 && state.instr < lines.length) {
   state.registers[state.ip] = state.instr;
   let line = lines[state.instr].trim();
   let parts = line.split(' ');
   let input = 'ip=' + state.instr + '\t[' + state.registers.join(', ') + '] ';
   ops[parts[0]](state.registers, parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3]));
   state.instr = state.registers[state.ip];
   state.instr ++;
   // if (i++ % 1000000 === 0) {
      // console.log(input + '\t' + parts.join(' ') + '\t[' + state.registers.join(', ') + '] ');
   // }

   i++;
   if (state.instr === 28) {
      // console.log(input + '\t' + parts.join(' ') + '\t[' + state.registers.join(', ') + '] ');
      let bin = state.registers[5].toString(2);
      if (bin.length === 24) {
         console.log(bin + '\t(' + state.registers[5] + ') after ran ' + i)
      }
      break;
      // let answer = state.registers[5];
      // if (!res[answer] || res[answer] < i) {
      //    res[answer] = i;
      //    console.log(answer, i);
      // }
      // break;
   }

   if ((['4', '5'].indexOf(parts[3]) >= 0) && state.instr >= 6) {
      console.log(input + '\t' + parts.join(' ') + '\t[' + state.registers.join(', ') + '] ');
   }
   if (i++ > 10) {
      // console.log(reg0 + ' goes infinite');
      // break;
   }
}

let reg5 = 0;
let claimed = [];
for (;;) {
   let reg4 = reg5 | 65536; // 6
   reg5 = 13159625;
   for (let done = false; !done;) {
      reg3 = reg4 & 255; // 8
      // console.log(reg3, reg4);
      reg5 += reg3;
      // console.log('addr', reg5);
      reg5 &= 16777215;
      // console.log('bani', reg5);
      reg5 *= 65899;
      // console.log('multi', reg5);
      reg5 &= 16777215;
      // console.log('bani', reg5);
      if (reg4 < 256) {
         // console.log(5, reg5);
         done = true;
         if (claimed[reg5]) {
         }
         else {
            claimed[reg5] = true;
            console.log(reg5);
         }
         // return;
      }
      else {
         let reg3 = 0;
         
         let reg2;
         while (true) {
            reg2 = reg3 + 1; // 18
            reg2 *= 256;
            if (reg2 <= reg4) {
               reg3 ++;
            }
            else {
               break;
            }
         };
         // console.log('setr', reg4, reg3);
         reg4 = reg3;
      }
   }
}

// console.log(state);