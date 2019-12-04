const fs = require('fs');

let file = 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

freqs = [];

let A = 'a'.charCodeAt(0);

for (let i = 0; i < 8; i ++) {
   let arr = [];
   for (let j = 0; j < 26; j ++) {
      arr.push(0);
   }
   freqs.push(arr);
}

lines.forEach(line => {
   for (let i = 0; i < 8; i ++) {
      freqs[i][line.charCodeAt(i) - A] ++;
   }
})

let password = [];
for (let i = 0; i < 8; i ++) {
   let m = 0;
   for (let j = 0; j < 26; j ++) {
      if (freqs[i][j] > 0 && freqs[i][j] < freqs[i][m]) { m = j; }
   }
   password.push(String.fromCharCode(A + m));
}

console.log(password.join(''));
