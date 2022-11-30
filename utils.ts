import { Point } from "./point";

export const makeInt = (number: string) => parseInt(number);

export function permute<T>(input: T[] | number) {
  if (typeof input === "number") {
    return permute(Array.from({ length: input }, (_, i) => i));
  }

  let result = [];

  const permuteInternal = (arr: T[], prefix: T[] = []) => {
    if (arr.length === 0) {
      result.push(prefix);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permuteInternal(curr.slice(), prefix.concat(next));
      }
    }
  };

  permuteInternal(input);
  return result;
}

export function lcm(x: number, y: number) {
  return !x || !y ? 0 : Math.abs((x * y) / gcd(x, y));
}

export function gcd(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function mode(list: number[]) {
  let frequency: number[] = [];
  let candidate = list[0];
  list.forEach(v => {
    frequency[v] = frequency[v] || 0;
    frequency[v]++;

    if (frequency[v] > frequency[candidate]) {
      candidate = v;
    }
  });

  return candidate;
}

Object.defineProperty(Object.prototype, 'keys', {
  value: function () {
    const result = [];
    for (const key in this) {
      result.push(key);
    }
    return result;
  }
});
Object.defineProperty(Object.prototype, 'values', {
  value: function () {
    const result = [];
    for (const key in this) {
      result.push(this[key]);
    }
    return result;
  }
});
Object.defineProperty(Array.prototype, 'end', {
  value: function () {
    return this[this.length - 1];
  }
});

export const id = (i: any) => i;
export const deepCopy = (el: any) => {
  if (Array.isArray(el)) {
    return el.map(deepCopy);
  }
  if (typeof (el) === 'object') {
    const result = {};
    for (let k in el) {
      if (el.hasOwnProperty(k)) {
        result[k] = deepCopy(el[k]);
      }
    }
  }
  return el;
}

export function Manhattan(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) + Math.abs(p1.z - p2.y);
}

export function range(n: number) {
  return Array.from(new Array(n), (_, k) => k);
}

export const ascending = (a: number, b: number) => a - b;
export const descending = (a: number, b: number) => b - a;
export const addAll = (prev: number, val: number) => prev + val;
export const multiplyAll = (prev: number, val: number) => prev * val;

export function BinarySearch<T>(list: T[], element: T, heuristic: (keyof T) | ((el: T) => number)) {
  if (typeof (heuristic) !== 'function') {
    const key = heuristic;
    heuristic = (el: T) => (el as any)[key];
  }
  let bot = 0;
  let top = list.length;
  while (top - bot > 1) {
    let ndx = Math.floor((top + bot) / 2);
    if (heuristic(element) < heuristic(list[ndx])) {
      top = ndx;
    }
    else {
      bot = ndx;
    }
  }

  return bot;
}

export function BinaryInsert<T>(list: T[], element: T, heuristic: (keyof T) | ((el: T) => number)) {
  const position = BinarySearch(list, element, heuristic);
  list.splice(position, 0, element);
}
