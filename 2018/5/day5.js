const fs = require('fs');

polymer = fs.readFileSync('input5.txt').toString().trim();

const diff = Math.abs('A'.charCodeAt(0) - 'a'.charCodeAt(0));
const react = (polymer) => {
   let i = 0;
   while (i < polymer.length - 1) {
      if (Math.abs(polymer.charCodeAt(i) - polymer.charCodeAt(i + 1)) == diff) {
         polymer = polymer.substr(0, i) + polymer.substr(i + 2);
         i -= 2;
      }
      i ++;
      if (i < 0) { i = 0; }
   }

   return polymer.length;
}

min = 10000000;
for (let ch = 'A'.charCodeAt(0); ch <= 'Z'.charCodeAt(0); ch ++) {
   let len = react(polymer.replace(RegExp('[' + String.fromCharCode(ch) + String.fromCharCode(ch).toLowerCase() + ']', 'g'), ''));
   if (len < min) {
      console.log(ch);
      min = len;
      console.log(min);
   }
}