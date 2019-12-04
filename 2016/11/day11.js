const fs = require('fs');

let file = process.argv[2] || 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');

let mapping = {i: 1};
let titles = [];
let floors = [];

lines.forEach((line, f) => {
   let generators = [...line.matchAll(/([a-z]+) generator/g)];
   let microchips = [...line.matchAll(/([a-z]+)-compatible microchip/g)];

   let contents = Array.apply(null, new Array(11)).map(e => '   ');

   generators.forEach(m => {
      let id = m[1][0].toUpperCase() + m[1][1];
      if (!mapping[id]) {
         mapping[id] = mapping.i ++;
         titles.push(id);
      }

      contents[mapping[id] * 2] = id + 'G';
   })

   microchips.forEach(m => {
      let id = m[1][0].toUpperCase() + m[1][1];
      if (!mapping[id]) {
         mapping[id] = mapping.i ++;
         titles.push(id);
      }

      contents[mapping[id] * 2 + 1] = id + 'M';
   })

      // ...generators.map(m => m[1][0].toUpperCase() + m[1][1] + 'G'),
      // ...microchips.map(m => m[1][0].toUpperCase() + m[1][1] + 'M'),
   // ];

   floors.push(contents);
});

console.log('        |       ' + titles.join('      |       '))
console.log(floors.map((floor, i) =>
   `${floors.length - i}: ` + floors[floors.length - i - 1].slice(1).join('  |  ')
).join('\n'));
