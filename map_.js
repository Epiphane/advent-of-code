class Map {
  constructor(defaultValue) {
    this.contents = [];
    this.min = false;
    this.max = false;

    this.defaultValue = defaultValue;
  }

  empty() {
    return this.min === false;
  }

  has(x, y) {
    return this.contents[y] && this.contents[y].hasOwnProperty(x);
  }

  get(x, y) {
    if (!this.has(x, y)) {
      return this.defaultValue;
    }

    return this.contents[y][x];
  }

  set(x, y, value) {
    if (this.empty()) {
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

  map(callback, excludeUndefined) {
    let result = new Map(this.defaultValue);
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

  print(xJoiner, yJoiner) {
    xJoiner = xJoiner || "";
    yJoiner = yJoiner || "\n";

    let maxSize = 0;
    let rows = [];
    for (let y = this.min.y; y < this.max.y; ++y) {
      let row = [];
      for (let x = this.min.x; x < this.max.x; ++x) {
        let val = "";
        if (this.has(x, y)) {
          val = this.get(x, y);
          maxSize = Math.max(maxSize, `${val}`.length);
        }
        row.push(val);
      }
      rows.push(row);
    }
    return rows
      .map((row) => row.map((val) => `${val}`.padEnd(maxSize)).join(xJoiner))
      .join(yJoiner);
  }

  forEach(callback, includeUndefined) {
    for (let y = this.min.y; y < this.max.y; ++y) {
      // if (!this.contents[y] && !includeUndefined) {
      //    continue;
      // }

      for (let x = this.min.x; x < this.max.x; ++x) {
        callback(this.get(x, y), x, y);
      }
    }
  }

  forEachInCol(x, callback, includeUndefined) {
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

  forEachInRow(y, callback, includeUndefined) {
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

  reduce(callback, initial, includeUndefined) {
    let result = initial;
    this.forEach((val, x, y) => {
      result = callback(result, val, x, y);
    }, includeUndefined);

    return result;
  }
}

function MakeMap(
  width = 1,
  height = 1,
  generator = () => null,
  defaultElement = null
) {
  let map = new Map(defaultElement);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      map.set(x, y, generator(x, y));
    }
  }

  return map;
}

function MapFromString(input, translator, defaultElement) {
  translator = translator || ((val) => val);
  let map = new Map(defaultElement);

  input
    .split("\n")
    .forEach((line, y) => {
      line.split("").map((val, x) => {
        if (val === "\r") {
          return;
        }
        map.set(x, y, translator(val));
      });
    });
  return map;
}

function MapFromInput(translator, defaultElement) {
  return MapFromString(
    require("fs")
      .readFileSync((process.argv[2] || "input") + ".txt")
      .toString()
      .trim(),
    translator,
    defaultElement
  )
}

module.exports = {
  Map,
  MapFromString,
  MapFromInput,
  MakeMap,
};
