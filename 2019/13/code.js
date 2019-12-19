const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine } = require('../intcode/machine');

(async function play() {
   let file = process.argv[2] || 'input';
   let input = fs.readFileSync(file + '.txt').toString().trim()
      .split(',')
      .map(i => parseInt(i))

   const log = console.log;

   const machine = new Machine(input);
   const stdout = machine.stdout;
   const stdin = machine.stdin;

   let ball = 0;
   let paddle = 0;
   let map = [];
   let score = 0;
   function readMap() {
      while (!stdout.empty()) {
         const x = stdout.read();
         const y = stdout.read();
         const id = stdout.read();

         if (x === -1 && y === 0) {
            score = id;
            continue;
         }

         map[y] = map[y] || [];
         map[y][x] = id;

         if (id === 4) { ball = x; }
         if (id === 3) { paddle = x; }
      }
   }

   function print() {
      console.log(map.map(row => row.map(id => {
         if (id === 0) return '  ';
         if (id === 1) return '##';
         if (id === 2) return 'xx';
         if (id === 3) return '--';
         if (id === 4) return '()';
      }).join('')).join('\n') + `\nScore: ${score}`)
   }

   function sleep(ms){
      return new Promise(resolve=>{
         setTimeout(resolve,ms)
      })
   }

   while (!machine.paused) {
      machine.step();
   }

   readMap();
   print();
   stdin.submit(-1)

   let turn = 0;
   while (map.filter(row => row.filter(id => id === 2).length > 0).length > 0 && !machine.exited) {
      do {
         machine.step();
      }
      while (!machine.paused && !machine.exited);

      readMap();
      print();

      turn++;
      // Use to skip closer to the end of the game if you want
      // if (turn > 1500) {
      await sleep(20)
      // }

      if (paddle < ball) {
         stdin.submit(1)
      }
      else if (ball < paddle) {
         stdin.submit(-1)
      }
      else {
         stdin.submit(0)
      }
   }

   print();
})();
