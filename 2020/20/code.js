import fs from "fs";
import md5 from "../../md5.js";
import { Map, MapFromString } from "../../map.js";
import { permute, gcd, lcm } from "../../utils.js";
import { question } from "readline-sync";

const log = console.log;
const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let groups = raw.split(/\r?\n\r?\n/).map((line) =>
  line.trim().split('\n').map(line =>
    line.trim()));

//let map = new Map(".");
let tiles = {};

groups.forEach(group => {
  let match = group.shift().match(/Tile ([0-9]+):/);
  let tileId = parseInt(match[1]);

  let tile = tiles[tileId] = new Map(".");
  group.forEach((line, y) =>
    line.split('').forEach((val, x) =>
      tile.set(x, y, val)));
})

function calculate(tile) {
  if (!tile.get) {
    tile = tiles[tile];
  }
  let scores = ["", "", "", ""];
  for (let x = 0; x < 10; x++) {
    scores[0] += tile.get(x, 0) === "#" ? "1" : "0";
    scores[1] += tile.get(9, x) === "#" ? "1" : "0";
    scores[2] = (tile.get(x, 9) === "#" ? "1" : "0") + scores[2];
    scores[3] = (tile.get(0, x) === "#" ? "1" : "0") + scores[3];
  }

  return scores.map(s => parseInt(s));
}

function flip(tile) {
  return tile.map((_, x, y) => tile.get(tile.max.x - 1 - x, y));
}

function rot(tile) {
  return tile.map((_, x, y) => {
    let nx = tile.max.x - 1 - y;
    let ny = x;

    return tile.get(nx, ny);
  });
}

function showArray(arr) {
  return arr.map(row => row.map(i => i || '[__]').join(' ')).join('\n');
}

let count = {};
for (let id in tiles) {
  const addToCount = (val) => {
    count[val] = count[val] || [];
    count[val].push(id);
  };

  calculate(tiles[id]).forEach(addToCount);
  calculate(flip(tiles[id])).forEach(addToCount);
}

let tileIds = Object.keys(tiles);
let corners = tileIds.filter(id =>
  calculate(tiles[id]).filter(shape =>
    count[shape].length === 1).length === 2
)

print(`Part 1:`, corners.reduce((prev, i) => prev * i, 1))

// Part 2
let SIZE = Math.sqrt(tileIds.length);
let ids = [...new Array(SIZE)].map(() =>
  [...new Array(SIZE)].fill(0));
let possibilities = [...new Array(SIZE)].map(() =>
  [...new Array(SIZE)].map(() => null));

{
  const topLeft = ids[0][0] = corners[0];
  let neighbors = calculate(topLeft).map(score => count[score].filter(id => id !== topLeft));
  let rots = 0;
  while (neighbors[0].length || neighbors[3].length) {
    neighbors.push(neighbors.shift());
    tiles[topLeft] = rot(tiles[topLeft]);

    if (++rots === 4) {
      let t = neighbors[1];
      neighbors[1] = neighbors[3];
      neighbors[3] = t;
      tiles[topLeft] = flip(tiles[topLeft]);
      tiles[topLeft] = rot(tiles[topLeft]);
      tiles[topLeft] = rot(tiles[topLeft]);
    }
  }

  possibilities[0][1] = neighbors[1];
  possibilities[1][0] = neighbors[2];
}

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    if (x === 0 && y === 0) continue;

    let poss = possibilities[y][x];
    if (!poss || poss.length !== 1) {
      print(x, y, poss);
      a = 100;
    }

    let tileId = ids[y][x] = poss[0];
    let neighbors = calculate(tileId).map(score =>
      count[score].filter(id => id !== tileId));
    let rots = 0;
    if (x > 0) {
      while (neighbors[3][0] !== ids[y][x - 1]) {
        neighbors.push(neighbors.shift());
        tiles[tileId] = rot(tiles[tileId]);
      }

      let s1 = calculate(tileId);
      let s2 = calculate(ids[y][x - 1]);

      if (s1[3] === s2[1]) {
        tiles[tileId] = flip(tiles[tileId]);
        tiles[tileId] = rot(tiles[tileId]);
        tiles[tileId] = rot(tiles[tileId]);
      }
    }
    else {
      while (neighbors[0][0] !== ids[y - 1][x]) {
        neighbors.push(neighbors.shift());
        tiles[tileId] = rot(tiles[tileId]);
      }

      let s1 = calculate(tileId);
      let s2 = calculate(ids[y - 1][x]);

      if (s1[0] === s2[2]) {
        tiles[tileId] = flip(tiles[tileId]);
      }
    }
    neighbors = calculate(tileId).map(score =>
      count[score].filter(id => id !== tileId));

    if (y > 0) {
      possibilities[y - 1][x] = neighbors[0];
    }
    if (x < SIZE - 1) {
      possibilities[y][x + 1] = neighbors[1];
    }
    if (y < SIZE - 1) {
      possibilities[y + 1][x] = neighbors[2];
    }
    if (x > 0) {
      possibilities[y][x - 1] = neighbors[3];
    }
  }
}

let map = new Map(' ');

ids.forEach((row, y_) => {
  row.forEach((id, x_) => {
    tiles[id].forEach((val, x, y) => {
      if (x === 0 || y === 0 || x === tiles[id].max.x - 1 || y === tiles[id].max.y - 1) {
        return;
      }
      map.set(
        x - 1 + x_ * (tiles[id].max.x - 2),
        y - 1 + y_ * (tiles[id].max.y - 2),
        val
      );
    });
  });
});

const creature = MapFromString(`                  #
#    ##    ##    ###
 #  #  #  #  #  #   `);

// print(map.print());

let hasCreatures = false;
let rots = 0;
while (!hasCreatures) {
  for (let y_ = 0; y_ < map.max.y - creature.max.y; y_++) {
    for (let x_ = 0; x_ < map.max.x - creature.max.x; x_++) {
      let match = true;
      for (let j = 0; match && j < creature.max.y; j++) {
        for (let i = 0; match && i < creature.max.x; i++) {
          let x = x_ + i;
          let y = y_ + j;

          if (creature.get(i, j) === '#') {
            match = map.get(x, y) === '#';
          }
        }
      }

      if (match) {
        hasCreatures = true;

        for (let j = 0; match && j < creature.max.y; j++) {
          for (let i = 0; match && i < creature.max.x; i++) {
            let x = x_ + i;
            let y = y_ + j;

            if (creature.get(i, j) === '#') {
              map.set(x, y, 'O');
            }
          }
        }
      }
    }
  }

  map = rot(map);
  if (++rots === 4) {
    map = flip(map);
  }
}

print(`Part 2:`, map.reduce((prev, val) => prev + (val === '#' ? 1 : 0), 0));
