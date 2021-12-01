import * as fs from "fs";
import { Map } from "../../map";
import { Manhattan } from "../../utils";

function coord(N) {
  let ring = 1;
  let start = Math.pow(2 * ring - 3, 2) + 1;
  let end = Math.pow(2 * ring - 1, 2);
  while (end < N) {
    ring++;
    start = Math.pow(2 * ring - 3, 2) + 1;
    end = Math.pow(2 * ring - 1, 2);
  }

  let pos = N - start;
  let len = 2 * (ring - 1);
  if (pos < len) {
    return {
      x: ring - 1,
      y: -(N - (start + ring - 2)),
    };
  } else if (pos < 2 * len) {
    return {
      x: -(N - (start + len + ring - 2)),
      y: -(ring - 1),
    };
  } else if (pos < 3 * len) {
    return {
      x: -(ring - 1),
      y: -(start + 2 * len + ring - 2 - N),
    };
  } else if (pos < 4 * len) {
    return {
      x: -(start + 3 * len + ring - 2 - N),
      y: ring - 1,
    };
  }
}

const N = 265149;
console.log(`Part 1: ${Manhattan(coord(N), { x: 0, y: 0 })}`);

// Part 2
let vals = new Map(0);
vals.set(0, 0, 1);
for (let i = 2; ; i++) {
  const { x, y } = coord(i);
  let val =
    vals.get(x - 1, y) +
    vals.get(x, y - 1) +
    vals.get(x + 1, y) +
    vals.get(x, y + 1) +
    vals.get(x - 1, y - 1) +
    vals.get(x + 1, y - 1) +
    vals.get(x + 1, y + 1) +
    vals.get(x - 1, y + 1);
  vals.set(x, y, val);
  if (val > N) {
    console.log(`Part 2: ${val}`);
    break;
  }
}

console.log(vals.print("|"));
