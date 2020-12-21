import fs from "fs";
import md5 from "../../md5.js";
import { Map } from "../../map.js";
import { permute, gcd, lcm } from "../../utils.js";
import { question } from "readline-sync";

const log = console.log;
const print = console.log;

let file = process.argv[2] || "input";
let raw = fs
  .readFileSync(file + ".txt")
  .toString()
  .trim();

let lines = raw.split("\n").map((line) => line.trim());
let input = lines;

//let map = new Map(".");
let tiles = {};

let tile = new Map(".");
let tnum = 0;
let ts = 0;
for (let y = 0; y < lines.length; y++) {
  const line = lines[y];

  if (!line) {
    tiles[tnum] = tile;
    tile = new Map(".");
  }

  for (let x = 0; x < line.length; x++) {
    let match = line.match(/Tile ([0-9]+):/);
    if (match) {
      tnum = +match[1];
      ts = y + 1;
    } else {
      const val = line[x];
      // console.log(x, y - ts);
      tile.set(x, y - ts, val);
    }
  }
}

tiles[tnum] = tile;

function calculate(tile) {
  if (!tile.get) {
    console.trace();
  }
  let scores = ["", "", "", ""];
  for (let x = 0; x < 10; x++) {
    scores[0] += tile.get(x, 0) === "#" ? "1" : "0";
    scores[1] += tile.get(9, x) === "#" ? "1" : "0";
    scores[2] = (tile.get(x, 9) === "#" ? "1" : "0") + scores[2];
    scores[3] = (tile.get(0, x) === "#" ? "1" : "0") + scores[3];
  }

  return scores;
}

function bestScores(tile) {
  let scores = calculate(tile);

  let s = [];
  s[0] = Math.max(
    parseInt(scores[0], 2),
    parseInt(scores[0].split("").reverse().join(""), 2)
  );
  s[1] = Math.max(
    parseInt(scores[1], 2),
    parseInt(scores[1].split("").reverse().join(""), 2)
  );
  s[2] = Math.max(
    parseInt(scores[2], 2),
    parseInt(scores[2].split("").reverse().join(""), 2)
  );
  s[3] = Math.max(
    parseInt(scores[3], 2),
    parseInt(scores[3].split("").reverse().join(""), 2)
  );

  return s.map((i) => i.toString(2));
}

let count = {};
let shapes = {};
for (let id in tiles) {
  const tile = tiles[id];
  let s = bestScores(tile);

  shapes[id] = s;
  s.forEach((i) => {
    count[i] = count[i] || [];
    count[i].push(id);
  });
}

let map = new Map(".");

let tids = [];
let best = -1;
for (let id in shapes) {
  let shape = shapes[id];

  let m = shape.map((i) => count[i]).filter((i) => i.length === 1);
  tids.push(id);

  if (best < 0 && m.length === 2) {
    best = id;
  }
}

function flip(tile) {
  return tile.map((_, x, y) => tile.get(9 - x, y));
}

function rot(tile) {
  return tile.map((_, x, y) => {
    let nx = 9 - y;
    let ny = x;

    return tile.get(nx, ny);
  });
}

let poss = [];
let m = [];
let ids = [];
for (let i = 0; i < 12; i++) {
  let r = [];
  for (let j = 0; j < 12; j++) {
    r.push(0);
  }
  m.push(r);
  ids.push(r.map(() => 0));
  poss.push(r.map(() => 0));
}

// print(best);
print(tiles[best].print());
let t1sc = bestScores(tiles[best]);
while (count[t1sc[1]].length === 1 || count[t1sc[2]].length === 1) {
  print("rotate");
  tiles[best] = rot(tiles[best]);
  t1sc = bestScores(tiles[best]);
}
print(t1sc);
print(tiles[best].print());

tids.splice(tids.indexOf(best), 1);

// print(count["1101111101"]);

poss[0][0] = [best];
let opts = [{ x: 0, y: 0 }];

while (opts.length > 0) {
  let { x, y } = opts.shift();
}

m[0][0] = tiles[best];
ids[0][0] = best;
for (let i = 0; i < 12; i++) {
  for (let j = 0; j < 12; j++) {
    if (i === 0 && j === 0) continue;
    print("-----------------------------");
    print("fitting ", i, j);

    for (let k = 0; k < tids.length; k++) {
      let id = tids[k];
      let nTile = tiles[id];
      let mybest = bestScores(nTile);
      //   if (mybest.filter((i) => i === "1101111101").length > 0) {
      //     print(id);
      //   } else {
      //     continue;
      //   }

      let sflip = false;
      let above = false;
      if (i > 0) {
        mybest.forEach((score, side) => {
          let oshape = bestScores(m[i - 1][j]);
          if (oshape[2] === score) {
            above = 4 - side;
            // if (above === 4) above = 0;
          }
        });

        if (above === false) {
          continue;
        }
      }

      let left = false;
      if (j > 0) {
        mybest.forEach((score, side) => {
          let oshape = bestScores(m[i][j - 1]);
          if (oshape[1] === score) {
            print("match", oshape[1].toString(2), score.toString(2));
            left = 3 - side;
          }
        });

        if (!left) {
          continue;
        }
      }

      print(id, k, above, left);

      if (above !== false && left !== false) {
        print(hi);
      }

      print("!!!!!!!!!!!!!");
      print(tiles[id].print());
      for (let xx = 0; xx < left; xx++) {
        print("rot");
        tiles[id] = rot(tiles[id]);
      }
      //   print(tiles[id].print());
      let myScore = calculate(tiles[id]);

      if (j > 0) {
        let left = m[i][j - 1];
        let lScore = calculate(left);
        print("left:", lScore);
        print(left.print());
        if (lScore[1] !== myScore[3]) {
          print("flippin");
          tiles[id] = flip(tiles[id]);
          tiles[id] = rot(tiles[id]);
          tiles[id] = rot(tiles[id]);
          myScore = calculate(tiles[id]);
        }
      }
      if (i > 0) {
        let top = m[i - 1][j];
        let tScore = calculate(top);
        print("top:", tScore);
        print(top.print());
        if (tScore[2] !== myScore[0]) {
          print("flippin 2");
          tiles[id] = flip(tiles[id]);
          myScore = calculate(tiles[id]);
        }
      }
      print("final:", myScore);
      print(tiles[id].print());

      ids[i][j] = id;
      m[i][j] = tiles[id];
      tids.splice(tids.indexOf(id), 1);
    }

    if (!ids[i][j]) {
      print("uh oh", i, j);
      print(ids[0]);
      print(m[i][j - 1].print());
      let bs = bestScores(m[i][j - 1]);
      print(bs, bs[1], count[bs[1]]);
      a = 100;
    }
    // i = j = 12;
  }
}
