const fs = require('fs');

function main(inputFile) {
   console.log('\n----- Running ' + inputFile + ' -----')
   let input = fs.readFileSync(inputFile + '.txt').toString();
   let lines = input.split('\n');

   const LinkedList = require('../linkedlist');
   const { MakeRow, MakeGrid } = require('../makegrid');

   console.time();

   let state = MakeGrid(lines[0].length, lines.length, (x, y) => {
      lines[y][x];
   });

   function Iterate(state) {
      let newState = MakeGrid(state[0].length, state.length, (x, y) => state[y][x]);
      newState.done = false;

      newState.done = true;
      return newState;
   }

   function PrintState(state) {
      return state.map(row => row.join('')).join('\n');
   }

   function Score(state) {
   }

   state.done = false;
   while (!state.done) {
      state = Iterate(state);
   }

   console.log(PrintState(state));
   console.log(Score(state));

   console.timeEnd();
}

main('sample');
main('input');