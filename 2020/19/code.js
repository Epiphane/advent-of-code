import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

const log = console.log;
const print =
//() => {};
console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

let rules = [];

let words = false;
let msg = [];
lines.forEach((line, y) => {
    if (!words) {
    if (!line) {
        words = true;
        return;
    }
    let p = line.split(':');

    let r = +p[0];

    let crit = p[1].trim();
    if (crit[0] === '"') {
        rules[r] = {letter: crit[1]};
    rules[r].num = r;
    return;
    }

    let other = crit.split(' | ');
    rules[r] = other.map(rule => {
        return rule.split(' ').map(i => +i);
    })
    rules[r].num = r;
}
else msg.push(line);
});

print(rules[8]);
print(rules[11]);
// rules[8] = [[42], [42, 8]];
// rules[8].num = 8;
// rules[11] = [[42, 31], [42, 11, 31]];
// rules[11].num = 11;

rules[0] = [[42, 42, 31]];
rules[0].num = 0;

let arr = [42];
let arr2 = [42, 31];
for (let i = 0; i < 1000; i++) {
    arr.push(42);
    // rules[8].push(arr.map(i => i));
    arr2.unshift(42);
    arr2.push(31);
    // rules[11].push(arr2.map(i => i));

    // rules[0].push(arr.concat(arr2).map(i => i));
}

arr = [42];
for (let i = 0; i < 5; i++) {
    let arr2 = [42, 31];
    for (let j = 0; j < 5; j++) {

        rules[0].push(arr.concat(arr2).map(i => i));
        arr2.unshift(42);
        arr2.push(31);
    }
    arr.push(42);
}

// print(rules[0]);
// print(rules[0][1]);
// log(rules[8][0]);

function satisfy(msg, rule, s) {
    s = s || [];
    // print();
    // print('->', s.length, rule.num, msg, rule);
    // print(msg, rule);
    if (rule.letter) {
        // print('<-', s.length, rule.num, (msg[0] === rule.letter ? `  ${msg} ${rule.num}  good` : `  ${msg} ${rule.num}  bad`));
        return {good: msg[0] === rule.letter, i: 1};
    }

    let bindex = -1;
    let working = null;
    rule.forEach(r => {
        // if (bindex >= 0) return;
        // print(msg, 'consider', r);
        // if (r[0] === 42 && r[1] === 8 && s.length > 5000) return;
        // if (r[0] === 42 && r[1] === 11 && r[2] === 31 && s.length > 5000) return;
        // if (s.length > 100 && [8, 11].indexOf(num) >= 0) return;

        let index = 0;
        let gg = true;

        r.forEach(num => {
            if (!gg) return;
            // if (num === 8) {
                // print(msg.substr(index));
            // }

            let {good, i} = satisfy(msg.substr(index), rules[num], s.concat([num]));

            // if (num === 42) {
                // print(42, good, i);
            // }
            if (!good) {gg = false;}
            else {
                // print('num', num)
                index += i;
            }
        });

        if (gg && index > bindex) {
            // print('**', s.length, rule.num, 'satisfied', r);
            bindex = index;
            working = r;
        }
    });

    // print({
    //     good: bindex >= 0,
    //     i: bindex
    // });
        // print('<-', s.length, rule.num, bindex >= 0 ? `  ${msg} ${rule.num}  good` : `  ${msg} ${rule.num}  bad`, working);
    return {
        working,
        good: bindex >= 0,
        i: bindex
    };
}

// print(satisfy('babbbbaabbbbbabbbbbbaabaaabaaa', rules[0]));

let valid = msg.filter(m => {
    // print('----', m);
    // print(m);
    let {i, good, working} = satisfy(m, rules[0]);
    // print(m, i, good);
    // if (good && i === m.length) log(working);
    return good && i === m.length;
})

// log(valid);
log(valid.length);
// log(msg.length);

// print(satisfy('bbabbbbaabaabba', rules[0]))
// print(satisfy('aaabbbbbbaaaaba', [[42]]))
