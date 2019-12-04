const fs = require('fs');

let inputFile = 'input';
let input = fs.readFileSync(inputFile + '.txt').toString().trim().split('\n').map(l => l.trim());

let state = {
   i: 0,
   r: [1, 0],//, 0, 0, 0, 0],
   c: 0,
}

function hlf(state, r) {
   state.r[r] = Math.floor(state.r[r] / 2);
   state.i ++;
}

function tpl(state, r) {
   state.r[r] *= 3;
   state.i ++;
}

function inc(state, r) {
   state.r[r] ++;
   state.i ++;
}

function jmp(state, offset) {
   state.i += offset;
}

function jie(state, r, offset) {
   if (state.r[r] % 2 === 0) {
      jmp(state, offset);
   }
   else {
      state.i ++;
   }
}

function jio(state, r, offset) {
   if (state.r[r] === 1) {
      jmp(state, offset);
   }
   else {
      state.i ++;
   }
}

function run(state, instructions) {
   while (state.i >= 0 && state.i < instructions.length) {
      const instr = instructions[state.i];
      const command = instr.substr(0, 3);
      const reg = instr.charCodeAt(4) - 'a'.charCodeAt(0);

      const pi = state.i;
      switch (command) {
         case 'hlf':
            hlf(state, reg);
            break;
         case 'tpl':
            tpl(state, reg);
            break;
         case 'inc':
            inc(state, reg);
            break;
         case 'jmp':
            jmp(state, parseInt(instr.substr(4)));
            break;
         case 'jie':
            jie(state, reg, parseInt(instr.substr(7)));
            break;
         case 'jio':
            jio(state, reg, parseInt(instr.substr(7)));
            break;
      }
      if ((state.c++) % 100 === 0) console.log(`${pi}\t| ${instr}\t| ${state.r[0]} ${state.r[1]} -> ${state.i}`);
   }

   return state;
}

console.log(run(state, input));
