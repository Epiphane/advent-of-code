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

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');
let foods = [];
let ingredients = {};
let allergens = {};
let allIng = [];

lines.forEach((line, y) => {
    if (!line) {
        mode++;
        return;
    }

    let parts = line.split(' (');

    let obj = {
        ing: parts[0].split(' '),
        allergens: parts[1] ? parts[1].substr(9).split('').filter(i => i !== ')').join('').split(', ') : [],
    };

    obj.allergens.forEach(i => {
        if (allergens[i]) {
            // console.log(allergens[i], obj.ing);
            allergens[i].poss = allergens[i].poss.filter(a => obj.ing.indexOf(a) >= 0)
        }
        else {
            allergens[i] = { poss: obj.ing.map(a => a) };
        }
    })

    obj.ing.forEach(i => {
        ingredients[i] = {};
    })

    foods.push(obj);
});

// print(foods[0]);
// print(allergens);

let ALLERG = [];
let INGRED = [];

let res = 0;
let res2 = 0;
let good = [];
for (let k in ingredients) {
    let alone = true;
    INGRED.push(k);
    for (let a in allergens) {
        if (allergens[a].poss.indexOf(k) >= 0) {
            alone = false;
        }
    }

    res += alone ? 1 : 0;
    if (alone) good.push(k);
}

for (let k in allergens) {
    ALLERG.push(k);
}

// print(res, INGRED);
// print(good);

res = 0;
good.forEach(g => {
    let g_ = false;
    foods.forEach(food => {
        if (g_) return;
        if (food.ing.indexOf(g) >= 0) res++;
    })
})
// print(res);

ALLERG = ALLERG.sort((a, b) => a.localeCompare(b));
// print(ALLERG.length);

let bad = INGRED.filter(i => good.indexOf(i) < 0).map(i => {
    let counts = ALLERG.map(() => 0);

    foods.forEach(food => {
        if (food.ing.indexOf(i) < 0) {
            food.allergens.forEach(k => {
                counts[ALLERG.indexOf(k)] = counts[ALLERG.indexOf(k)] || 0;
                counts[ALLERG.indexOf(k)]++;
            })
        }
    })

    return { ing: i, counts };
});

// print(bad);

let answer = [];

while (bad.length > 0) {
    let r = bad.filter(it => it.counts.filter(i => i === 0).length === 1)[0];

    print(r);
    let al = r.counts.indexOf(0);
    answer[al] = r.ing;

    bad = bad.filter(i => i.ing !== r.ing);

    bad.forEach(it => {
        it.counts = it.counts.map((i, n) => n === al ? 100 : i)
    })
    print(answer, al, bad);
}

print(answer.join());
