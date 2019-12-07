const fs = require('fs');

let file = 'input';
let input = fs.readFileSync(file + '.txt').toString();
let lines = input.split('\n');

const { MakeGrid } = require('../makegrid');

// ['sample', 'sample2', 'sample3', 'sample4', 'sample5', 'input'].forEach(file => {
//    console.log('\n\nInput: ' + file);
//    input = fs.readFileSync(file + '.txt').toString();
//    lines = input.split('\n');

//    function tryGame(elfattack) {
//       // console.log('\nTrying elf attack: ' + elfattack);
//       PlayGame(elfattack, false, (won) => {
//          if (!won) {
//             tryGame(elfattack + 1);
//          }
//          else {
//             console.log('Won with elf attack: ' + elfattack)
//          }
//       });
//    }

//    tryGame(4);
// });

// console.log();
// PlayGame(3, true, (won) => {
//    console.log('Expect: 239010');
// });
PlayGame(16, false, (won) => {}, 1)

function PlayGame(elfattack, canLoseElves, oncomplete, delay = 0) {
   let game = GenerateGame(lines, elfattack);
   if (delay > 0) { console.log(PrintGame(game)); }

   function go() {
      while (!game.done) {
         DoRound(game);
      
         if (!game.done && delay > 0) {
            console.log('\nAfter ' + game.roundsComplete + ' rounds:');
            console.log(PrintGame(game));
         }

         if (game.units.filter(u => u.elf).length < game.elves && !canLoseElves) {
            oncomplete(false);
            return;
         }

         if (delay > 0) {
            setTimeout(go, delay);
            return;
         }
      }
      
      console.log('Rounds complete: ' + game.roundsComplete);
      
      let health = 0;
      game.units.forEach(unit => health += unit.hp);
      console.log('Total health: ' + health);
      console.log('Result: ' + health * game.roundsComplete);
      oncomplete(true);
   }

   go();
}

function GenerateGame(lines, elfattack) {
   let units = [];
   let elves = 0;
   let grid = MakeGrid(lines[0].length, lines.length, (x, y) => {
      let letter = lines[y][x];

      if (letter === 'E' || letter === 'G') {
         let elf = (letter === 'E');

         if (elf) {
            elves ++;
         }

         units.push({
            id: units.length,
            elf: elf,
            x: x,
            y: y,
            attack: (elf ? elfattack : 3),
            hp: 200,
            dead: false,
         });
         letter = '.';
      }

      return letter === '.';
   });

   return {
      grid,
      units,
      elves,
      roundsComplete: 0,
      done: false,
   };
}

function PrintGame(game) {
   let basic = game.grid.map(row => row.map(el => el ? '.' : '#'));
   game.units.forEach(unit => {
      basic[unit.y][unit.x] = unit.elf ? 'E' : 'G';
   });
   let lines = basic.map(r => r.join(''));
   let healths = lines.map(() => []);

   game.units.sort(ReadingOrder);
   game.units.forEach(unit => {
      healths[unit.y].push((unit.elf ? '(' + unit.id + ')E(' : '(' + unit.id + ')G(') + unit.hp + ')');
   });

   return lines.map((line, i) => {
      return line + '   ' + healths[i].join(', ');
   }).join('\n');
}

function ReadingOrder(unit1, unit2) {
   if (unit1.y !== unit2.y) return unit1.y - unit2.y;
   return unit1.x - unit2.x;
}

function DoRound(game) {
   game.units.sort(ReadingOrder);

   for (let i = 0; i < game.units.length && !game.done; i ++) {
      if (!game.units[i].dead) {
         TakeTurn(game, game.units[i]);
      }

      if (!game.done && i === game.units.length - 1) {
         game.roundsComplete ++;
      }
   }

   game.units = game.units.filter(unit => !unit.dead);
}

// returns whether attack was made
function TryAttack(game, unit, enemies) {
   let enemiesInReach = enemies.filter(other => {
      return Math.abs(other.x - unit.x) + Math.abs(other.y - unit.y) === 1
   });

   if (enemiesInReach.length > 0) {
      enemiesInReach.sort((e1, e2) => {
         if (e1.hp !== e2.hp) { return e1.hp - e2.hp; }
         return ReadingOrder(e1, e2);
      });
      // console.log(unit.id, 'attacking', enemiesInReach[0].id);
      enemiesInReach[0].hp -= unit.attack;
      if (enemiesInReach[0].hp <= 0) {
         enemiesInReach[0].dead = true;
         // console.log(enemiesInReach[0].id + ' died in round ' + game.roundsComplete);
      }
      return true;
   }
   return false;
}

function GetDistances(game, point) {
   let distances = MakeGrid(game.grid[0].length, game.grid.length, (x, y) => {
      if (!game.grid[y][x]) { return -1; }
      else return 100000000;
   });

   // Flood fill
   let queue = [{ x: point.x, y: point.y, dist: 0 }];
   queue.forEach(q => distances[q.y][q.x] = 0);
   while (queue.length > 0) {
      let next = queue[0];
      queue.shift();
      
      let doThing = (x, y) => {
         if (!game.units.find(u => u.x === x && u.y === y && !u.dead)) {
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

   return distances;
}

function ClosestSpaces(game, unit, enemies) {
   let distances = GetDistances(game, unit);

   let candidates = [];
   function maybeAdd(x, y) {
      if (game.grid[y] && game.grid[y][x] && distances[y][x] < 100000000) {
         candidates.push({
            x,
            y,
            dist: distances[y][x]
         });
      }
   }

   enemies.forEach(enemy => {
      maybeAdd(enemy.x - 1, enemy.y);
      maybeAdd(enemy.x + 1, enemy.y);
      maybeAdd(enemy.x, enemy.y - 1);
      maybeAdd(enemy.x, enemy.y + 1);
   });

   candidates.sort((c1, c2) => {
      if (c1.dist !== c2.dist) { return c1.dist - c2.dist; }
      return ReadingOrder(c1, c2);
   });

   if (candidates.length === 0) {
      return candidates;
   }

   let distFromChosenSquare = GetDistances(game, candidates[0]);

   playerCandidates = [];
   function maybeAddPlayer(x, y) {
      if (game.grid[y] && game.grid[y][x] && distFromChosenSquare[y][x] < 100000000) {
         playerCandidates.push({
            x,
            y,
            dist: distFromChosenSquare[y][x]
         });
      }
   }

   maybeAddPlayer(unit.x - 1, unit.y);
   maybeAddPlayer(unit.x + 1, unit.y);
   maybeAddPlayer(unit.x, unit.y - 1);
   maybeAddPlayer(unit.x, unit.y + 1);

   if (unit.id === 7) {
      console.log(distFromChosenSquare.map(row => {
         return row.map(dist => {
            if (dist < 0) return '#';
            if (dist === 100000000) return '.';
            return dist;
         }).join('\t')
      }).join('\n'));
   }

   return playerCandidates.sort((c1, c2) => {
      if (c1.dist !== c2.dist) { return c1.dist - c2.dist; }
      return ReadingOrder(c1, c2);
   });

   // let distances = MakeGrid(game.grid[0].length, game.grid.length, (x, y) => {
   //    if (!game.grid[y][x]) { return -1; }
   //    else return 100000000;
   // });

   // // Flood fill
   // let queue = enemies.map(enemy => { return { x: enemy.x, y: enemy.y, dist: 0 } });
   // queue.forEach(q => distances[q.y][q.x] = 0);
   // while (queue.length > 0) {
   //    let next = queue[0];
   //    queue.shift();
      
   //    let doThing = (x, y) => {
   //       if (!game.units.find(u => u.x === x && u.y === y && !u.dead)) {
   //          if (distances[y] && distances[y][x] && distances[y][x] > next.dist + 1) {
   //             distances[y][x] = next.dist + 1;
   //             queue.push({ x, y, dist: next.dist + 1 });
   //          }
   //       }
   //    }

   //    doThing(next.x - 1, next.y);
   //    doThing(next.x + 1, next.y);
   //    doThing(next.x, next.y - 1);
   //    doThing(next.x, next.y + 1);
   // }

   // let adjacent = [];
   // const maybePush = (x, y) => {
   //    if (distances[y] && distances[y][x] && distances[y][x] >= 0 && distances[y][x] < 100000000) {
   //       adjacent.push({ x, y, distance: distances[y][x] });
   //    }
   // }

   // maybePush(unit.x - 1, unit.y);
   // maybePush(unit.x + 1, unit.y);
   // maybePush(unit.x, unit.y - 1);
   // maybePush(unit.x, unit.y + 1);

   // return adjacent.sort((s1, s2) => {
   //    if (s1.distance !== s2.distance) return s1.distance - s2.distance;
   //    if (s1.y !== s2.y) return s1.y - s2.y;
   //    return s1.x - s2.x;
   // });
}

function TakeTurn(game, unit) {
   let enemies = game.units.filter(other => other.elf !== unit.elf && !other.dead);

   if (enemies.length === 0) {
      game.done = true;
      return;
   }

   let attacked = TryAttack(game, unit, enemies);
   
   if (!attacked) {
      // Move
      let next = ClosestSpaces(game, unit, enemies);
      if (next.length === 0) { return; }

      // console.log(unit.id, 'moving to', next[0]);
      unit.x = next[0].x;
      unit.y = next[0].y;

      TryAttack(game, unit, enemies);
   }
}