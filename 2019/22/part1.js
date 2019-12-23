const fs = require('fs');
const log = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())

let deck = [];
for (let i = 0; i < 10007; i ++) {
   deck.push(i);
}

lines.forEach(line => {
   let deal = line.match(/deal with increment ([0-9]+)/);
   let cut = line.match(/cut (-?[0-9]+)/);
   if (line === 'deal into new stack') {
      deck.reverse();
   }
   if (cut) {
      let level = +cut[1];
      if (level >= 0) {
         deck = deck.slice(level).concat(deck.slice(0, level));
      }
      else {
         deck = deck.slice(level).concat(deck.slice(0, deck.length + level));
      }
   }
   if (deal) {
      let inc = +deal[1];
      let next = [];
      let dest = 0;
      deck.forEach((card, i) => {
         next[dest] = card;
         dest = (dest + inc) % deck.length;
      })
      deck = next;
   }
})

deck.forEach((card, i) => { if (card === 2019) log(i) })
