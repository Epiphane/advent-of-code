const fs = require('fs');

let file = 'input';
let input = fs.readFileSync(file + '.txt').toString();
let lines = input.split('\n');

const LinkedList = require('../linkedlist');
const { MakeRow, MakeGrid } = require('../makegrid');

console.time();

const N = 50;

let state = MakeGrid(N, N, (x, y) => {
   return lines[y][x];
});

function iterate(state) {
   let newState = MakeGrid(state[0].length, state.length, (x, y) => state[y][x]);
   for (let x = 0; x < N; x ++) {
      for (let y = 0; y < N; y ++) {
         let open = 0;
         let trees = 0;
         let lumberyards = 0;
         for (let dx = -1; dx <= 1; dx ++) {
            for (let dy = -1; dy <= 1; dy ++) {
               if (dx === 0 && dy === 0) continue;
               if (x + dx < 0 || x + dx >= N) continue;
               if (y + dy < 0 || y + dy >= N) continue;

               switch (state[y + dy][x + dx]) {
                  case '.':
                     open ++;
                     break;
                  case '|':
                     trees ++;
                     break;
                  case '#':
                     lumberyards ++;
                     break;
               }
            }
         }

         newState[y][x] = state[y][x];
         switch (state[y][x]) {
         case '.':
            if (trees >= 3) {
               newState[y][x] = '|';
            }
            break;
         case '|':
            if (lumberyards >= 3) {
               newState[y][x] = '#';
            }
            break;
         case '#':
            if (trees === 0 || lumberyards === 0) {
               newState[y][x] = '.';
            }
            break;
         }
      }
   }

   return newState;
}

function PrintState(state) {
   return state.map(row => row.join('')).join('\n');
}

function Score(state) {
   let trees = 0;
   let lumberyards = 0;
   state.forEach(row => {
      row.forEach(space => {
         if (space === '|') { trees ++; }
         if (space === '#') { lumberyards ++; }
      });
   })

   return trees * lumberyards;
}

let minutes = 0;
while (minutes++ < 1000000000 ) {
   // console.log('\n\n' + PrintState(state));
   state = iterate(state);
   if (minutes % 1000 === 0) {
      // console.log('\n\n' + PrintState(state));
      console.log(minutes); 
      console.log('Score: ' + Score(state))
   }
}

console.log(PrintState(state));
console.log(Score(state));

console.timeEnd();