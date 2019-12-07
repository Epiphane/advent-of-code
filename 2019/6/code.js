const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split('\r\n').map(i => i.split(')'));

const log = console.log;
const print = console.log;



let orbits = {};
let orbitedBy = {};

input.forEach(group => {
   orbits[group[1]] = orbits[group[1]] || [];
   orbitedBy[group[0]] = orbitedBy[group[0]] || [];

   orbits[group[1]].push(group[0]);
   orbitedBy[group[0]].push(group[1]);
});

console.log(orbitedBy['M4P'])

for (let center in orbitedBy) {
   if (!orbits[center]) {
      console.log(center);
   }
}

let visited = { COM: true };
let t = ['COM'];

let norbits = { COM: 0 };
let answer = 0;

// while (t.length > 0) {
//    let front = t[0];
//    t.shift();

//    if (!orbitedBy[front]) {
//       continue;
//    }

//    orbitedBy[front].forEach(y => {
//       log(`${y} orbits ${front}`)
//       if (!visited[y]) {
//          t.push(y);
//          visited[y] = true;
//       }
//       norbits[y] = norbits[y] || 0;
//       norbits[y] += norbits[front] + 1;
//    });
// }

// for (let i in norbits) {
//    answer += norbits[i];
// }

// log(answer);


// for (let i in orbits) {
//    log(orbits[i])
// }

let dist = { YMQ: 0 };

let pos = 'YMQ';

while (pos != 'COM') {
   let prev = pos;
   pos = orbits[pos][0];
   dist[pos] = dist[prev] + 1;
}

let sandist = 0;
pos = orbits['SAN'][0];
while (!dist[pos]) {
   pos = orbits[pos][0];
   sandist ++;
}

console.log(dist);
console.log(pos, sandist, dist[pos]);
