import { Point } from "./point";
import { id } from "./utils";

export class Map<T> {
  contents: T[][] = [];
  min?: Point;
  max?: Point;

  constructor(
    public defaultValue?: T,
    min?: number | Point,
    max?: number | Point
  ) {
    if (typeof (min) === 'number') {
      this.min = new Point(min, min);
    }
    else if (typeof (min) === 'object') {
      this.min = min;
    }

    if (typeof (max) === 'number') {
      this.max = new Point(max, max);
    }
    else if (typeof (max) === 'object') {
      this.max = max;
    }
  }

  copy() {
    const result = new Map<T>(this.defaultValue, this.min, this.max);
    this.map((v, x, y) => result.set(x, y, v));
    return result;
  }

  contains(x: Point | number, y: number) {
    if (typeof (x) === 'object') {
      return this.contains(x.x, x.y);
    }

    return x >= this.min.x &&
      x < this.max.x &&
      y >= this.min.y &&
      y < this.max.y;
  }

  has(x: Point | number, y: number) {
    if (typeof (x) === 'object') {
      return this.has(x.x, x.y);
    }

    return this.contents[y] && this.contents[y].hasOwnProperty(x);
  }

  get(x: Point | number, y: number) {
    if (typeof (x) === 'object') {
      return this.get(x.x, x.y);
    }

    if (!this.has(x, y)) {
      return this.defaultValue;
    }

    return this.contents[y][x];
  }

  set(x: Point | number, y: number, value: T) {
    if (typeof (x) === 'object') {
      return this.set(x.x, x.y, y as any as T);
    }

    if (!this.min || !this.max) {
      this.min = new Point(x, y);
      this.max = new Point(x + 1, y + 1);
    }

    this.contents[y] = this.contents[y] || [];
    this.contents[y][x] = value;

    if (x < this.min.x) {
      this.min.x = x;
    }
    if (y < this.min.y) {
      this.min.y = y;
    }
    if (x + 1 > this.max.x) {
      this.max.x = x + 1;
    }
    if (y + 1 > this.max.y) {
      this.max.y = y + 1;
    }
  }

  map<U>(
    callback: (value: T, x: number, y: number) => U,
    excludeUndefined = false
  ) {
    let result = new Map<U>();
    if (!this.min || !this.max) {
      return result;
    }

    for (let y = this.min.y; y < this.max.y; ++y) {
      if (excludeUndefined && !this.contents[y]) {
        continue;
      }

      for (let x = this.min.x; x < this.max.x; ++x) {
        if (excludeUndefined && !this.contents[y].hasOwnProperty(x)) {
          continue;
        }

        result.set(x, y, callback(this.get(x, y), x, y));
      }
    }

    return result;
  }

  print(colDelimiter = "", rowDelimiter = "\n", pad = true) {
    if (!this.min || !this.max) {
      return "";
    }

    let maxSize = 0;
    let rows = [];
    for (let y = this.min.y; y < this.max.y; ++y) {
      let row = [];
      for (let x = this.min.x; x < this.max.x; ++x) {
        let val = "";
        // if (this.has(x, y)) {
        val = `${this.get(x, y)}`;
        maxSize = Math.max(maxSize, val.length);
        // }
        row.push(val);
      }
      rows.push(row);
    }
    return rows
      .map((row) => row.map((val) => val.padEnd(maxSize + (pad ? 1 : 0))).join(colDelimiter))
      .join(rowDelimiter);
  }

  clip(minX: number, minY: number, width?: number, height?: number) {
    const result = new Map<T>(this.defaultValue);

    for (let y = minY; y < minY + height; ++y) {
      for (let x = minX; x < minX + width; ++x) {
        result.set(x, y, this.get(x, y));
      }
    }

    return result;
  }

  forEach(
    callback: (value: T, x: number, y: number) => void,
    includeUndefined = false
  ) {
    if (!this.min || !this.max) {
      return;
    }

    for (let y = this.min.y; y < this.max.y; ++y) {
      if (!this.contents[y] && !includeUndefined) {
        continue;
      }

      for (let x = this.min.x; x < this.max.x; ++x) {
        if ((!this.contents[y] || !this.contents[y].hasOwnProperty(x)) && !includeUndefined) {
          continue;
        }

        callback(this.get(x, y), x, y);
      }
    }
  }

  forAdjacent(
    cx: number,
    cy: number,
    callback: (value: T, x: number, y: number) => void,
    dist = 1,
    diagonal = false
  ) {
    /*
    if (typeof (cx) === 'object') {
      this.forAdjacent(
        cx.x,
        cx.y,
        cy as any as (value: T, x: number, y: number) => void),
        callback as any as number,
        dist as any as boolean
      );
    }
      */

    if (diagonal) {
      this.forNeighbors(cx, cy, callback, dist);
    }
    else {
      for (let d = 1; d <= dist; d++) {
        if (this.contains(cx - d, cy)) {
          callback(this.get(cx - d, cy), cx - d, cy);
        }

        if (this.contains(cx + d, cy)) {
          callback(this.get(cx + d, cy), cx + d, cy);
        }

        if (this.contains(cx, cy - d)) {
          callback(this.get(cx, cy - d), cx, cy - d);
        }

        if (this.contains(cx, cy + d)) {
          callback(this.get(cx, cy + d), cx, cy + d);
        }
      }
    }
  }

  forNeighbors(
    cx: number,
    cy: number,
    callback: (value: T, x: number, y: number) => void,
    dist = 1,
  ) {
    for (let dx = -dist; dx <= dist; dx++) {
      for (let dy = -dist; dy <= dist; dy++) {
        if (dx === 0 && dy === 0) continue;

        const x = cx + dx;
        const y = cy + dy;
        if (this.contains(x, y)) {
          callback(this.get(x, y), x, y);
        }
      }
    }
  }

  forEachInCol(
    x: number,
    callback: (value: T, x: number, y: number) => void,
    includeUndefined = false
  ) {
    if (!this.min || !this.max) {
      return;
    }

    for (let y = this.min.y; y < this.max.y; ++y) {
      if (!this.contents[y] && !includeUndefined) {
        continue;
      }

      if (!this.contents[y].hasOwnProperty(x) && !includeUndefined) {
        continue;
      }

      callback(this.get(x, y), x, y);
    }
  }

  forEachInRow(
    y: number,
    callback: (value: T, x: number, y: number) => void,
    includeUndefined = false
  ) {
    if (!this.min || !this.max) {
      return;
    }

    if (!this.contents[y] && !includeUndefined) {
      return;
    }

    for (let x = this.min.x; x < this.max.x; ++x) {
      if (!this.contents[y].hasOwnProperty(x) && !includeUndefined) {
        continue;
      }

      callback(this.get(x, y), x, y);
    }
  }

  reduce<U>(
    callback: (current: U, value: T, x: number, y: number) => U,
    initial: U,
    excludeUndefined?: boolean
  ) {
    let result = initial;
    this.forEach((val, x, y) => {
      result = callback(result, val, x, y);
    }, excludeUndefined);

    return result;
  }

  search(
    callback: (value: T, x: number, y: number) => boolean
  ) {

  }
}

export function MakeMap<T>(
  width = 1,
  height = 1,
  generator: (x: number, y: number) => T | undefined = () => undefined,
  defaultElement?: T
) {
  let map = new Map(defaultElement);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      map.set(x, y, generator(x, y));
    }
  }

  return map;
}

export function MapFromString<T>(
  input: string,
  defaultElement?: T,
  translator: (char: string) => T = id
) {
  let map = new Map(defaultElement);

  input.split("\n").forEach((line, y) => {
    line.split("").map((val, x) => {
      if (val === "\r") {
        return;
      }
      map.set(x, y, translator(val));
    });
  });
  return map;
}

export function MapFromInput<T>(
  defaultElement?: T,
  translator?: (char: string) => T
) {
  return MapFromString(
    require("fs")
      .readFileSync((process.argv[2] || "input") + ".txt")
      .toString()
      .trimEnd(),
    defaultElement,
    translator
  );
}
