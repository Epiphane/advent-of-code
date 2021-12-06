import { Point } from "./map";

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

export const id = (i) => i;

export function Manhattan(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
