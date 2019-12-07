const fs = require('fs');

const file = 'sample4';

const input = fs.readFileSync(file + '.txt').toString();
let lines = input.split('\n');

const LinkedList = require('../linkedlist');
const { MakeRow, MakeGrid } = require('../makegrid');

console.time();

let deaths = 1;
let elfattack = 16;
let done = false;
for (elfattack = 3; !done; elfattack ++) {
   done = doItAll(elfattack, false);
}

doItAll(3, true);


function doItAll(elfattack, canlose) {
   let units = [];
   nelves = 0;
   lose = false;

   let grid = MakeGrid(lines[0].length, lines.length, (x, y) => {
      let letter = lines[y][x];

      if (letter === 'E' || letter === 'G') {
         if (letter === 'E') nelves ++;
         units.push({
            id: units.length,
            elf: letter === 'E',
            x: x,
            y: y,
            attack: letter === 'E' ? elfattack : 3,
            hp: 200
         });
         letter = '.';
      }

      return letter;
   });

   let closest = (unit, enemies) => {
      let distances = MakeGrid(grid[0].length, grid.length, (x, y) => {
         if (grid[y][x] === '#') { return -1; }
         else return 100000000;
      });

      // Flood fill
      let queue = enemies.map(enemy => { return { x: enemy.x, y: enemy.y, dist: 0 } });
      queue.forEach(q => distances[q.y][q.x] = 0);
      while (queue.length > 0) {
         let next = queue[0];
         queue.shift();
         
         let doThing = (x, y) => {
            if (!units.find(u => u.x === x && u.y === y && u.hp > 0)) {
               if (distances[y] && distances[y][x] && distances[y][x] > next.dist + 1) {
                  distances[y][x] = next.dist + 1;
                  queue.push({ x, y, dist: next.dist + 1 });
               }
            }
         }

         doThing(next.x - 1, next.y);
         doThing(next.x + 1, next.y);
         doThing(next.x, next.y - 1);
         doThing(next.x, next.y + 1);
      }

      let adjacent = [];
      const maybePush = (x, y) => {
         if (distances[y] && distances[y][x] && distances[y][x] >= 0 && distances[y][x] < 100000000) {
            adjacent.push({ x, y, distance: distances[y][x] });
         }
      }

      maybePush(unit.x - 1, unit.y);
      maybePush(unit.x + 1, unit.y);
      maybePush(unit.x, unit.y - 1);
      maybePush(unit.x, unit.y + 1);

      return adjacent.sort((s1, s2) => {
         if (s1.distance !== s2.distance) return s1.distance - s2.distance;
         if (s1.y !== s2.y) return s1.y - s2.y;
         return s1.x - s2.x;
      });
   }

   let rounds = 0;
   let running = true;
   let endedon = -1;
   function iterate() {
      units = units.sort((u1, u2) => {
         if (u1.y === u2.y) { return u1.x - u2.x; }
         else return u1.y - u2.y;
      });

      units.forEach((unit, _i) => {
         if (!running) {
            return;
         }
         // console.log(unit.x, unit.y);
         // console.log('Unit ' + _i + ' now');
         if (unit.hp <= 0) {
            if (unit.elf) lose = true;
            return;
         }

         let tryAttack = () => {
            let enemiesInReach = units.filter(other => {
               return other.elf !== unit.elf && 
                     other.hp > 0 &&
                     Math.abs(other.x - unit.x) + Math.abs(other.y - unit.y) === 1
            });

            if (enemiesInReach.length > 0) {
               // console.log (' -- attack')
               enemiesInReach.sort((e1, e2) => {
                  if (e1.hp !== e2.hp) { return e1.hp - e2.hp; }
                  if (e1.y !== e2.y) { return e1.y - e2.y; }
                  return e1.x - e2.x;
               });
               // console.log(_i, enemiesInReach);
               console.log(unit.id+' whacks '+enemiesInReach[0].id+' for '+unit.attack)
               enemiesInReach[0].hp -= unit.attack;
               return true;
            }
            return false;
         }

         let attacked = tryAttack();
         
         if (!attacked) {
            // console.log (' -- move')
            // Move
            enemies = units.filter(other => other.elf != unit.elf && other.hp > 0);
            if (enemies.length === 0) {
               running = false;
               endedon = _i;
               // console.log('ending on ' + _i);
               return;
            }
            let next = closest(unit, enemies);

            if (next.length === 0) return;

            if (next.length > 1 && next[0].distance === next[1].distance) {
               console.log('cant decide', next);
            }

            unit.x = next[0].x;
            unit.y = next[0].y;
            tryAttack();
         }

      });

      if (!!units.find(unit => unit.hp <= 0)) {
         console.log('die ' + units.find(unit => unit.hp <= 0).id + ' (round ' + rounds + ')');
         console.log(units);
      }

      // console.log(endedon);
      if (endedon < 0)// || endedon === 0)//units.length - 1)
         rounds ++;
      units = units.filter(unit => unit.hp > 0);

      // let species = 0;
      // if (!!units.find(u => !!u.elf)) species ++;
      // if (!!units.find(u => !u.elf)) species ++;
      // running = species > 1;
   }

   function printState() {
      let state = grid.print().split('\n').map(r => r.split(''));
      units.forEach(unit => {
         // console.log(unit);
         state[unit.y][unit.x] = unit.elf ? 'E' : 'G';
      });
      return state.map(r => r.join('')).join('\n');
   }

   console.log(printState());
   while (running && (!lose || canlose)) {
      iterate();
      console.log('round', rounds);
      // console.log('\nAfter ' + rounds + ' rounds');
      console.log(printState());
      console.log(units);
   }

   let totalHP = 0;
   units.forEach(unit => totalHP += unit.hp)

   console.log('\n\nelf attack ', elfattack)
   // console.log(printState());
   console.log(units);
   console.log(units.length);
   // console.log('ended on ',endedon,'/',units.length);
   console.log('round: ' + rounds);
   console.log('total hp: ' + totalHP)
   console.log('answer ' + totalHP * rounds);
   deaths = nelves - units.filter(u => u.elf).length;
   return deaths === 0;
}

console.timeEnd();