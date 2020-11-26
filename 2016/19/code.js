import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

const log = console.log;
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let input = 3012210;
// input = 5;

let elves = { id: 1 };
elves.next = elves;
elves.prev = elves;

let cursor = elves;
let across;
for (let i = 2; i <= input; ++i) {
    let newelf = { id: i, prev: cursor, next: elves };
    elves.prev = newelf;
    cursor.next = newelf;
    cursor = newelf;

    if (i === Math.floor(input / 2) + 1) {
        across = cursor;
    }
}

let remain = input;
while (across.next !== across) {
    // print('delete', across.id);
    across.next.prev = across.prev;
    across.prev.next = across.next;

    if (across === elves) {
        elves = across.next;
    }

    across = across.next;

    if (remain-- % 2 === 1) {
        across = across.next;
    }
}

let curs = elves;
do {
    print(curs.id);
    curs = curs.next;
} while (curs !== elves);

/*
let current = 1;
let left = [];
let right = [];
for (let i = 2; i <= input; ++i) {
    if (i > Math.ceil(input / 2)) {
        right.push(i);
    }
    else {
        left.push(i);
    }
}
// print(current);
// print(left);
// print(right);

while (left.length + right.length > 0) {
    left.pop();
    right.push(current);
    left.push(right.shift());
    current = left.shift();

    if (right.length > left.length) {
        left.push(right.shift());
    }

    if ((left.length + right.length) % 100 === 0)
        print(left.length + right.length);

    // print(current);
    // print(left);
    // print(right);
}

print(current);
*/



/*
let elves = [];
let targets = [];
let skips = [];
let remaining = input;

for (let i = 0; i < input; ++i) {
    elves.push(1);
    targets.push(i);
    skips.push(0);
}

let i = 0;

while (elves.filter(i => i > 0).length > 1) {
    for (let e = 0; e < elves.length; e++) {
        if (elves[e] === 0) continue;

        let half = Math.floor(remaining / 2);
        // let x = e;
        // while (steps > 0) {
        //     x++;
        //     if (x >= elves.length) x -= elves.length;
        //     if (elves[x] !== 0) steps--;
        // }

        let guess = half;
        let dest = e;
        let elvesBetween;
        do {
            dest += guess;
            if (dest >= elves.length) {
                dest -= elves.length;
                elvesBetween = remaining - ((e - skips[e]) - (dest - skips[dest]));
            }
            else {
                elvesBetween = (dest - skips[dest]) - (e - skips[e]);
            }

            guess = half - elvesBetween;
        } while (elvesBetween != half);

        // elves[e] += elves[x];
        elves[dest] = 0;
        for (let d = dest; d < elves.length; d++) {
            skips[d]++;
        }

        remaining--;

        // do {
        //     targets[e]++;

        //     while (targets[e] >= elves.length) targets[e] -= elves.length;
        // } while (elves[targets[e]] === 0)
        // elves[e] += elves[targets[e]];
        // elves[targets[e]] = 0;

        // while (elves[targets[e]] === 0) {
        //     targets[e]++;
        // }
        // print(elves);

        // for (let x = e + 1; x !== e; x++) {
        //     if (elves[x] > 0) {
        //         elves[e] += elves[x];
        //         elves[x] = 0;
        //         break;
        //     }

        //     if (x >= elves.length) x = -1;
        // }

        // let right = e;
        // let left = e;
        // while (true) {
        //     do {
        //         right--;
        //         while (right < 0) right += elves.length;
        //     } while (elves[right] === 0);
        //     if (right === left) {
        //         elves[e] += elves[right];
        //         elves[right] = 0;
        //         break;
        //     }
        //     do {
        //         left++;
        //         while (left >= elves.length) left -= elves.length;
        //     } while (elves[left] === 0);

        //     if (right === left) {
        //         elves[e] += elves[right];
        //         elves[right] = 0;
        //         break;
        //     }
        // }

        if (++i % 100 === 0)
            print(e);
    }
}

// print(elves);

elves.forEach((v, i) => { if (v > 0) print(i + 1); })
*/
