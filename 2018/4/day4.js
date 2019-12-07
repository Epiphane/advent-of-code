const fs = require('fs');

lines = fs.readFileSync('input4.txt').toString().trim().split('\n').sort();

let guards = [];
let guard = null;
let asleep = 0;

lines.forEach((line) => {
   const year = parseInt(line.substr(1, 4));
   const month = parseInt(line.substr(6, 2));
   const day = parseInt(line.substr(9, 2));
   const hour = parseInt(line.substr(12, 2));
   const min = parseInt(line.substr(15, 2));
   const message = line.substr(19);

   if (message === 'falls asleep') {
      asleep = min;
   }
   else if (message === 'wakes up') {
      guard.slept += min - asleep;
      while (asleep < min) {
         guard.times[asleep++]++;
      }
   }
   else {
      let words = message.split(' ');
      num = parseInt(words[1].substr(1));
      if (!guards[num]) {
         guards[num] = {
            num: num,
            slept: 0,
            times: (new Array(60)).fill(0),
         };
      }
      guard = guards[num];
   }
});

guards.sort((g1, g2) => g2.slept - g1.slept);

max = 0;
maxmin = 0;
guards.forEach(guard => {
   guard.times.forEach((val, index) => {
      if (val > max) {
         max = val;
         maxmin = index;
         console.log('Guard ' + guard.num + ' slept ' + max + ' times on ' + maxmin);
      }
   });
});
