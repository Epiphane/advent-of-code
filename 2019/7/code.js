const fs = require('fs');
const file = process.argv[2] || 'input';
const input = fs.readFileSync(file + '.txt').toString().trim().split(',').map(i => parseInt(i));
const log = console.log;

process.env.DEBUG = true;

const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');
const { permute } = require('../utils');

function runSystem(phaseSettings) {
   const channels = new Array(5).fill(null).map(() => new Channel);

   const machines = [
      new Machine(input, channels[0], channels[1], 'A'),
      new Machine(input, channels[1], channels[2], 'B'),
      new Machine(input, channels[2], channels[3], 'C'),
      new Machine(input, channels[3], channels[4], 'D'),
      new Machine(input, channels[4], channels[0], 'E'),
   ];

   channels[0].submit(phaseSettings[0]);
   channels[0].submit(0);

   channels[1].submit(phaseSettings[1]);
   channels[2].submit(phaseSettings[2]);
   channels[3].submit(phaseSettings[3]);
   channels[4].submit(phaseSettings[4]);

   let executor = 0;
   while (!machines[4].exited) {
      let currentMachine = machines[executor];

      if (currentMachine.exited) {
         log(`Unexpected exit? current: ${executor}`);
         return;
      }

      log(currentMachine.ip, Array.prototype.slice.call(currentMachine, currentMachine.ip, currentMachine.ip + 4));
      currentMachine.step();

      if (currentMachine.exited || currentMachine.paused) {
         executor = (executor + 1) % 5;
         break;
      }
   }

   return channels[0].read();
};

// log(permute([5, 6, 7, 8, 9]).reduce((prev, order) => Math.max(prev, runSystem(order)), 0));

runSystem([5, 6, 7, 8, 9]);
