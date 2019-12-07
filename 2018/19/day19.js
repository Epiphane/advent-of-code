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

let state = {
   registers: [1, 0, 0, 0, 0, 0],
   instr: 0,
   ip: 0
};

state.ip = parseInt(lines[0].substr(4));
lines.shift();
let i = 0;
while (state.instr >= 0 && state.instr < lines.length) {
   state.registers[state.ip] = state.instr;
   let line = lines[state.instr].trim();
   let parts = line.split(' ');
   let input = 'ip=' + state.instr + '\t[' + state.registers.join(', ') + '] ';
   ops[parts[0]](state.registers, parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3]));
   state.instr = state.registers[state.ip];
   state.instr ++;
   if (i++ % 1000000 === 0) {
      console.log(input + '\t' + parts.join(' ') + '\t[' + state.registers.join(', ') + '] ');
   }
}

console.log(state);