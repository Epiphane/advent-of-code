const md5 = require('./md5');

let input = 'iwrupvqb';

for (let i = 778000000; ; i++) {
   let begin = md5(input + i).substr(0, 5);
   if (begin === '000000') {
      console.log(i);
   }
   if (i % 1000000 === 0) { console.log('.' + i); }
}