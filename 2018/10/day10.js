const fs = require('fs');

lines = fs.readFileSync('input10.txt').toString().trim().split('\n');

console.time();

let minX = 10000;
let minY = 10000;
let maxX = -10000;
let maxY = -10000;

const makePoint = (line) => {
   line = line.substr('position=<'.length);
   let position = line.substr(0, line.indexOf('>')).split(',');
   let px = parseInt(position[0].trim());
   let py = parseInt(position[1].trim());
   line = line.substr(line.indexOf('velocity') + 'velocity=<'.length);
   let velocity = line.substr(0, line.indexOf('>')).split(',');
   let vx = parseInt(velocity[0].trim());
   let vy = parseInt(velocity[1].trim());

   if (px < minX) { minX = px; }
   if (py < minY) { minY = py; }
   if (px > maxX) { maxX = px; }
   if (py > maxY) { maxY = py; }

   return {
      position: { x: px, y: py },
      velocity: { x: vx, y: vy }
   };
}

const points = lines.map(makePoint);

const PAD = 0;
function draw() {
   let output = [];
   for (let i = minY - PAD; i <= maxY + PAD; i ++) {
      let row = [];
      for (let j = minX - PAD; j <= maxX + PAD; j ++) {
         row.push('.');
      }
      output.push(row);
   }

   points.forEach(point => {
      output[point.position.y - minY + PAD][point.position.x - minX + PAD] = '#';
   });

   console.log(output.map(row => row.join('')).join('\n'));
}

function iterate(s) {
   minX = 10000;
   minY = 10000;
   maxX = -10000;
   maxY = -10000;
   points.forEach(point => {
      point.position.x += point.velocity.x;
      point.position.y += point.velocity.y;
      
      if (point.position.x < minX) { minX = point.position.x; }
      if (point.position.y < minY) { minY = point.position.y; }
      if (point.position.x > maxX) { maxX = point.position.x; }
      if (point.position.y > maxY) { maxY = point.position.y; }
   });

   // console.log(maxY - minY);
   if (maxY - minY < 50) {
      console.log('\nAfter ' + s + ' seconds:');
      draw();
   }
}

if (maxY - minY < 50) {
   draw();
}
for (let s = 0; s < 15000; s ++) {
   // console.log('\nAfter ' + s + ' seconds:');
   iterate(s);
}

console.timeEnd();