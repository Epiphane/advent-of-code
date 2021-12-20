import { id } from "./utils";

export interface Point {
  x: number;
  y: number;
}

export class Map<T> {
  contents: T[][] = [];
  min?: Point;
  max?: Point;

  constructor(public readonly defaultValue?: T) { }

  contains(x: number, y: number) {
    return x >= this.min.x &&
      x < this.max.x &&
      y >= this.min.y &&
      y < this.max.y;
  }

  has(x: number, y: number) {
    return this.contents[y] && this.contents[y].hasOwnProperty(x);
  }

  get(x: number, y: number) {
    if (!this.has(x, y)) {
      return this.defaultValue;
    }

    return this.contents[y][x];
  }

  set(x: number, y: number, value: T) {
    if (!this.min || !this.max) {
      this.min = { x, y };
      this.max = { x: x + 1, y: y + 1 };
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

  print(colDelimiter = "", rowDelimiter = "\n") {
    if (!this.min || !this.max) {
      return "";
    }

    let maxSize = 0;
    let rows = [];
    for (let y = this.min.y; y < this.max.y; ++y) {
      let row = [];
      for (let x = this.min.x; x < this.max.x; ++x) {
        let val = "";
        if (this.has(x, y)) {
          val = `${this.get(x, y)}`;
          maxSize = Math.max(maxSize, val.length);
        }
        row.push(val);
      }
      rows.push(row);
    }
    return rows
      .map((row) => row.map((val) => val.padEnd(maxSize)).join(colDelimiter))
      .join(rowDelimiter);
  }

  clip(minX, minY, maxX, maxY) {
    const result = new Map<T>(this.defaultValue);


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
        if (!this.contents[y].hasOwnProperty(x) && !includeUndefined) {
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
    diagonal = false
  ) {
    if (diagonal) {
      this.forNeighbors(cx, cy, callback, 1);
    }
    else {
      if (this.contains(cx - 1, cy)) {
        callback(this.get(cx - 1, cy), cx - 1, cy);
      }

      if (this.contains(cx + 1, cy)) {
        callback(this.get(cx + 1, cy), cx + 1, cy);
      }

      if (this.contains(cx, cy - 1)) {
        callback(this.get(cx, cy - 1), cx, cy - 1);
      }

      if (this.contains(cx, cy + 1)) {
        callback(this.get(cx, cy + 1), cx, cy + 1);
      }
    }
  }

  forNeighbors(
    cx: number,
    cy: number,
    callack: (value: T, x: number, y: number) => void,
    dist = 1,
  ) {
    for (let dx = -dist; dx <= dist; dx++) {
      for (let dy = -dist; dy <= dist; dy++) {
        if (dx === 0 && dy === 0) continue;

        const x = cx + dx;
        const y = cy + dy;
        if (this.contains(x, y)) {
          callack(this.get(x, y), x, y);
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
      .trim(),
    defaultElement,
    translator
  );
}
