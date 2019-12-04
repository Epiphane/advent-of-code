const fs = require('fs');

let file = process.argv[2] || 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

let bots = [];

lines.forEach(line => {
   let give = line.match(/value ([0-9]+) goes to bot ([0-9]+)/);
   let rule = line.match(/bot ([0-9]+) gives low to (bot|output) ([0-9]+) and high to (bot|output) ([0-9]+)/);
   if (give) {
      let b = parseInt(give[2]);
      bots[b] = bots[b] || {id: b, values: []};
      bots[b].values.push(parseInt(give[1]));
   }
   else if (rule) {
      let b = parseInt(rule[1]);
      let low = parseInt(rule[3]);
      let hi = parseInt(rule[5]);
      bots[b] = bots[b] || {id: b, values: []};

      if (rule[2] === 'output') {
         low *= -1;
         low --;
      }
      if (rule[4] === 'output') {
         hi *= -1;
         hi --;
      }
      bots[low] = bots[low] || {id: low, values: []};
      bots[hi] = bots[hi] || {id: hi, values: []};

      bots[b].low = low;
      bots[b].hi = hi;
   }
   else {
      console.log(line)
   }
});

function act(bots, id) {
   let bot = bots[id];
   if (bot.values.length !== 2 || id < 0) return false;

   bot.values.sort((a, b) => a - b);

   if (bot.values[0] === 17 && bot.values[1] === 61) {
      console.log('done', bot);
      // done = true;
   }

   console.log(bot, '\t', bots[bot.low], '\t', bots[bot.hi]);
   bots[bot.low].values.push(bot.values[0]);
   act(bots, bot.low);
   bots[bot.hi].values.push(bot.values[1]);
   act(bots, bot.hi);
   bot.values = [];
   return true;
}

let done = false;
let step = true;
// while (!done && step) {
   console.log('-------');
   step = false;
   bots.filter(bot => bot.values.length >= 2).forEach(bot => act(bots, bot.id));
   // bots.filter(bot => bot.values.length >= 2).forEach(bot => {
   //    bot.values.sort();

   //    if (bot.values[0] === 17 && bot.values[1] === 61) {
   //       console.log('done', bot);
   //       // done = true;
   //    }

   //    bots[bot.low].values.push(bot.values[0]);
   //    bots[bot.hi].values.push(bot.values[1]);
   //    console.log(bot, bots[bot.low], bots[bot.hi]);
   //    bot.values = [];
   //    step = true;
   // });
// }

console.log(bots)

console.log(bots[-1].values[0] * bots[-2].values[0] * bots[-3].values[0])
