const fs = require('fs');

const input = fs.readFileSync('input12.txt').toString().trim();
let lines = input.split('\n');

console.time();

let state = {
   state: lines[0].substr(15).split('').map(v => v === '#'),
   left: 0,
   right: lines[0].substr(15).split('').length
};

lines = lines.slice(2);
lines.sort();
const rules = lines.map(line => {
   return {
      in: line.substr(0, 5).split('').map(v => v === '#'),
      out: line[9] === '#'
   }
});

const toNumber = (arr, start, end) => {
   let num = 0;
   for (let i = start; i < end; i ++) {
      if (!!arr[i]) {
         num += Math.pow(2, i - start);
      }
   }
   return num;
}

let rulemap = [];
rules.forEach(rule => {
   let num = toNumber(rule.in, 0, rule.in.length);
   rulemap[num] = rule.out;
})

function iterate(state) {
   let newstate = [];
   let newleft = state.left - 2;
   let newright = state.right + 2;

   for (let i = newleft; i <= newright; i ++) {
      // console.log(i - 2, i + 2);
      // console.log(toNumber(state.state, i - 2, i + 3), !!rulemap[toNumber(state.state, i - 2, i + 3)]);
      newstate[i] = !!rulemap[toNumber(state.state, i - 2, i + 3)];
      // let matched = false;
      // for (let rule = 0; rule < rules.length && !matched; rule ++) {
      //    matched = true;
      //    for (let k = 0; k < 5; k ++) {
      //       if (!!state.state[i + k - 2] !== !!rules[rule].in[k]) {
      //          matched = false;
      //          break;
      //       }
      //    }
      //    if (matched) {
      //       // console.log(rules[rule]);
      //       newstate[i] = rules[rule].out;
      //    }
      // }
      // console.log(i);
   }

   while (!newstate[newleft]) {
      newleft ++;
   }
   
   while (!newstate[newright]) {
      newright --;
   }

   return { state: newstate, left: newleft, right: newright };
}

states = [state];

const out = (state) => {
   return state.state.map(v => v ? '#' : '.').join('');
   let output = '';
   for (let i = -20; i <= 120; i ++) {
      if (!!state.state[i]) {
         output += '#';
      }
      else {
         output += '.';
      }
   }
   return output;
}

const printTotal = (state) => {
   let total = 0;
   // console.log(state);
   for (let i = state.left; i <= state.right; i ++) {
      if (!!state.state[i]) {
         total += i;
      }
   }
   // console.log(state.left, state.right);
console.log(total);
}

console.log('0: ' + out(state));// state.state.map(v => v ? '#' : '.').join(''));
for (let gen = 1; gen <= 50000000000; gen ++) {
   let nstate = iterate(state);
   let diff = false;
   
   state = nstate;
   if ((gen % 10000) === 0) {
      console.log(gen + ': ' +  out(state));//state.state.map(v => v ? '#' : '.').join(''));
      printTotal(state);
   }
}

printTotal(state);

console.timeEnd();