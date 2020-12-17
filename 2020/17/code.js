import fs from "fs";
import md5 from "../../md5.js";
import { Map } from "../../map.js";
import { MakeGrid, MakeRow } from "../../makegrid.js";
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

let map = new Map(".");
let groups = [];
let g = [];

let miny = 0;
let maxy = 1;
let minx = 0;
let maxx = 1;

lines.forEach((line, y) => {
  g.push(line);
  if (!line) {
    print("No input");
    if (g.length > 0) {
      groups.push(g);
      g = [];
    }
    return;
  }

  line.split("").forEach((val, x) => {
    map.set(x, y, val);
  });
});
let maps = [[map]];

minx = map.min.x - 1;
maxx = map.max.x + 1;
miny = map.min.y - 1;
maxy = map.max.y + 1;
let minz = 0;
let maxz = 1;
let minw = 0;
let maxw = 1;

function cycle() {
  let maps2 = [];

  minz--;
  maxz++;
  minw--;
  maxw++;
  miny--;
  maxy++;
  minx--;
  maxx++;
  for (let w = minw; w <= maxw; w++) {
    maps[w] = maps[w] || [];
    let map2 = (maps2[w] = []);

    for (let z = minz; z <= maxz; z++) {
      maps[w][z] = maps[w][z] || new Map(".");
      let mmap2 = (map2[z] = new Map("."));

      for (let y = miny; y <= maxy; y++) {
        for (let x = minx; x <= maxx; x++) {
          let val = maps[w][z].get(x, y) || ".";

          let active = 0;
          // if (val === "#") print("----", val, x, y, z);
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              for (let dk = -1; dk <= 1; dk++) {
                for (let dw = -1; dw <= 1; dw++) {
                  let i = x + di;
                  let j = y + dj;
                  let k = z + dk;
                  let ww = w + dw;
                  //   if (Math.abs(i + j + k - (x + y + z)) !== 1) continue;
                  if (di === 0 && dj === 0 && dk === 0 && dw === 0) continue;

                  //   if (x === 2 && y === 1 && z === 0 && w === 0) {
                  //     print(i, j, k, ww);
                  //   }

                  if (
                    maps[ww] &&
                    maps[ww][k] &&
                    maps[ww][k].get(i, j) === "#"
                  ) {
                    active++;

                    // if (x === 2 && y === 1 && z === 0 && w === 0) {
                    //   print(i, j, k, ww);
                    // }
                  }
                }
              }
            }
          }

          // if (z === -1 && x === 0 && y === 0) {
          //   print("hi", active);
          // }

          // if (val === "#") print("---->", active);
          if (val === "#") {
            if (active === 3 || active === 2) {
              val = "#";
            } else {
              val = ".";
            }
          } else {
            if (active === 3) {
              val = "#";
            }
          }

          if (x === 2 && y === 1 && z === 0 && w === 0) {
            print(val, active);
          }

          mmap2.set(x, y, val);
        }
      }
    }
  }

  maps = maps2;
}

// print(maps[0].print());
// result();
// cycle();

// result();
// cycle();

// print(maps[-1][-1].print());
// print();
// print(maps[0][-1].print());
// print();
// print(maps[1][-1].print());
// print();
// print(maps[-1][0].print());
// print();
print(maps[0][0].print());
// print();

if (true) {
  result();
  cycle();
  result();
  cycle();
  result();
  cycle();
  result();
  cycle();
  result();
  cycle();
  result();
  cycle();
  result();
}

// print(maps);
// for (let i = 0; i < 6; i++) {
//   print(maps[0].print());
//   cycle();
//   print();
// }

// print(maps[0].print());
// print(
//   map.reduce((prev, val) => {
//     return prev + (val === "#" ? 1 : 0);
//   }, 0)
// );

function result() {
  let res = 0;
  for (let w = minw; w <= maxw; w++) {
    if (!maps[w]) continue;
    for (let z = minz; z <= maxz; z++) {
      if (!maps[w][z]) continue;
      let r = maps[w][z].reduce((prev, val) => {
        return prev + (val === "#" ? 1 : 0);
      }, 0);
      // if (r !== 0) print(z, r);
      res += r;
    }
  }

  print(res);
}
