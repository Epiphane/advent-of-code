const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm, id } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine, DefaultIntcodeMachine } = require('../intcode/machine');
const log = console.log;
const prompt = require('readline-sync').question;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString();

let lines = raw.split('\n')
let input = lines;

let map = new Map('_');
let orig = new Map('_');

let portals = [];

let X1 = 29;
let Y1 = 29;
let X2 = 79;
let Y2 = 85;
let X3 = 107;
let Y3 = 113;

if (file === 'test') {
   X1 = 9;
   X2 = 35;
   X3 = 43;
   Y1 = 9;
   Y2 = 27;
   Y3 = 35;
}

let start = false;
let end = false;
for (let x = 0; x < lines[2].length; x ++) {
   for (let y = 0; y < lines.length; y ++) {
      let val = lines[y][x]
      map.set(x, y, val);
      orig.set(x, y, val);

      if (val === ' ') continue;
      if (!val) continue;
      if (val === '\r') continue;

      let portal = '';
      if (x === 1) {
         portal = lines[y][x-1] + val;
      }
      else if (x === X1 && y >= Y1 && y <= Y2) {
         portal = `${val}${lines[y][x+1]}`;
      }
      else if (x === X2 && y >= Y1 && y <= Y2) {
         portal = lines[y][x-1] + val;
      }
      else if (x === X3) {
         portal = val + lines[y][x+1];
      }
      else if (y === 1) {
         portal = lines[y - 1][x] + val;
      }
      else if (y === Y1 && x >= X1 && x <= X2) {
         portal = val + lines[y + 1][x];
      }
      else if (y === Y2 && x >= X1 && x <= X2) {
         portal = lines[y - 1][x] + val;
      }
      else if (y === Y3) {
         portal = val + lines[y + 1][x];
      }

      if (!!portal && portal.trim().length > 0) {
         log('portal', portal);
         if (!portals.includes(portal)) {
            portals.push(portal);
         }

         let pIndex = portals.indexOf(portal);
         map.set(x, y, pIndex);
         orig.set(x, y, pIndex);

         if (portal === 'AA') {
            start = { x: x - 2, y };
         }
         if (portal === 'ZZ') {
            end = { x, y: y + 2 };
         }
      }
   }
}

log(portals);

log(start);
log(end);

portals.forEach((portal, i) => {
   if (portal === 'AA' || portal === 'ZZ') return;
   let sides = [];

   map.forEach((val, x, y) => {
      if (val === i) { sides.push({x, y}); }
   });

   let x1 = sides[0].x;
   let y1 = sides[0].y;
   let x2 = sides[1].x;
   let y2 = sides[1].y;
   let dl1 = 0;
   let dl2 = 0;

   const K = 1;
   if (x1 === 1 || x1 === X2) {
      if (x1 === 1) { dl1 = -1; }
      else { dl1 = 1; }
      x1 += K;
   }
   else if (x1 === X1 || x1 === X3) {
      if (x1 === X1) { dl1 = 1; }
      else { dl1 = -1; }
      x1 -= K;
   }
   else if (y1 === 1 || y1 === Y2) {
      if (y1 === 1) { dl1 = -1; }
      else { dl1 = 1; }
      y1 += K;
   }
   else if (y1 === Y1 || y1 === Y3) {
      if (y1 === Y1) { dl1 = 1; }
      else { dl1 = -1; }
      y1 -= K;
   }
   if (x2 === 1 || x2 === X2) {
      if (x2 === 1) { dl2 = -1; }
      else { dl2 = 1; }
      x2 += K;
   }
   else if (x2 === X1 || x2 === X3) {
      if (x2 === X1) { dl2 = 1; }
      else { dl2 = -1; }
      x2 -= K;
   }
   else if (y2 === 1 || y2 === Y2) {
      if (y2 === 1) { dl2 = -1; }
      else { dl2 = 1; }
      y2 += K;
   }
   else if (y2 === Y1 || y2 === Y3) {
      if (y2 === Y1) { dl2 = 1; }
      else { dl2 = -1; }
      y2 -= K;
   }
   else {
      log('wat', x1, x2, y1, y2);
   }

   // dl1 = dl2 = 0;

   map.set(sides[0].x, sides[0].y, { x: x2, y: y2, dl: dl1 });
   map.set(sides[1].x, sides[1].y, { x: x1, y: y1, dl: dl2 });
   // log(x1, y1, map.get(x1, y1))
   // log(x2, y2, map.get(x2, y2))
})

let explored = [
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
   new Map(-10),
];
let queue = [{ x: start.x, y: start.y, dist: 0, level: 0, ports: [] }];
let done = false;
while (queue.length > 0 && !done) {
   let top = queue.shift();

   let { x, y, dist, level, ports } = top;
   // log(x, '\t', y, dist, level);

   if (!explored[level]) {
      log('missing level', level);
      return;
   }
   if (explored[level].get(x, y) >= 0 && explored[level].get(x, y) < dist + 100) {
      continue;
   }
   explored[level].set(x, y, dist + 100);

   let check = (x, y, level) => {
      let obj = map.get(x, y);
      if (obj === '#') return;
      let ports_ = ports.map(id);
      if (typeof(obj) === 'object') {
         // Portal
         if (level === 0 && obj.dl < 0) { return; }
         ports_.push({ x, y, level, dist, v: portals[orig.get(x, y)], nl: level + obj.dl })
         x = obj.x;
         y = obj.y;
         level += obj.dl;
         obj = map.get(x, y);

         queue.push({ x, y, level, dist: dist + 1, ports: ports_ });
         return;
      }
      // if (x === end.x && y === end.y) {
      //    log(dist, level)
      // }
      if (obj === '.') {
         queue.push({ x, y, level, dist: dist + 1, ports: ports_ });
      }
      else if (portals[obj] === 'AA') {
      }
      else if (portals[obj] === 'ZZ') {
         if (level === 0) {
            log(dist, 'steps', ports);
            done = true;
         }
      }
      else {
         // log('?', x, y, obj, portals[obj]);
         return;
      }
   }

   check(x - 1, y, level);
   check(x + 1, y, level);
   check(x, y - 1, level);
   check(x, y + 1, level);

   queue.sort((a, b) => {
      if (a.level === b.level) {
         return a.dist - b.dist;
      }
      return a.level - b.level;
   })
   // log(queue.slice(0, 5));
}

// log(map.print())
log(explored[0].print(' ').replace(/-10/g, '    '));
// log('-----------')
// log(explored[1].print(' ').replace(/-10/g, '   '));
