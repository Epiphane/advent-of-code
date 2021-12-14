import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, makeInt, range } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

// let template = asGroups[0][0];

const replacers = {} as { [key: string]: string[] };
const rules = asGroups[1].map(line => {
    const [match, insert] = line.split(' -> ');
    // return { match, insert };

    replacers[match] = [
        match[0] + insert,
        insert + match[1],
    ];
});

// let lastfreq = {};
// template.split('').forEach(l => {
//     lastfreq[l] = (lastfreq[l] || 0) + 1;
// })

// // idk wtf


// let last = 1;
// function apply(template) {
//     let next = '';

//     let changed = 0;
//     for (let i = 0; i < template.length; i++) {
//         const f = template[i];
//         const n = template[i + 1];

//         if (!n) {
//             next += f;
//             break;
//         }

//         const r = rules.filter(rule => rule[0] === f + n);

//         if (r.length > 0) {
//             next += f + r[0][1];
//             changed++;
//         }
//         else {
//             next += f;
//         }
//     }
//     let freq = {};
//     next.split('').forEach(l => {
//         freq[l] = (freq[l] || 0) + 1;
//     })

//     let min = Infinity;
//     let max = -Infinity;
//     let minL = '';
//     let maxL = '';

//     // let dfreq = {};
//     for (let i in freq) {
//         min = Math.min(freq[i], min);
//         max = Math.max(freq[i], max);

//         if (freq[i] === min) minL = i;
//         if (freq[i] === max) maxL = i;
//     }

//     // console.log(maxL, minL, freq['O']);

//     // lastfreq = freq;
//     // console.log(dfreq);

//     // console.log(freq);
//     // console.log(max - min);
//     // console.log(((max - min) / last))
//     last = max - min;

//     // look for repeats
//     let repeats = [];
//     let len
//     for (len = 128; len > 1 && repeats.length === 0; len--) {
//         let sub = next.substr(0, len);

//         for (let start = 1; start < next.length;) {
//             let subst = next.substr(start);
//             // console.log(sub, subst);
//             const match = subst.indexOf(sub);
//             if (match < 0) {
//                 break;
//             }

//             repeats.push(match);
//             start = match + len;
//         }
//     }

//     console.log(len, repeats, next.length);

//     // console.log('insert', changed)
//     return next;
// }

// for (let i = 0; i < 10; i++) {
//     template = apply(template);
//     console.log(i, template.length);

//     // break;
//     // console.log(i, template.substr(0, 20));
//     console.log(template);
// }

// print(template);


// let freq = {};
// template.split('').forEach(l => {
//     freq[l] = (freq[l] || 0) + 1;
// })

// let min = Infinity;
// let max = -Infinity;

// for (let i in freq) {
//     min = Math.min(freq[i], min);
//     max = Math.max(freq[i], max);
//     break;
// }

// console.log(freq);
// console.log(max - min);

// console.log('CNNFBPHSK');
// console.log(apply('CNNFBPHSK'));
// console.log(apply(apply('CNNFBPHSK')));

let template = {};

for (let i = 0; i < asLines[0].length; i++) {
    let cur = asLines[0][i];
    let next = asLines[0][i + 1];

    if (!next) {
        next = '_';
    }

    template[`${cur}${next}`] = (template[`${cur}${next}`] || 0) + 1;
}

function iterate(template) {
    let next = {};

    for (let pair in template) {
        const amt = template[pair];

        if (replacers[pair]) {
            replacers[pair].forEach(p => {
                next[p] = (next[p] || 0) + amt;
            });
        }
        else {
            next[pair] = amt;
        }
    }

    return next;
}

function score(template) {
    let freq = {} as { [key: string]: number };

    for (let i in template) {
        // console.log(i[0]);
        freq[i[0]] = (freq[i[0]] || 0) + template[i];
    }

    // console.log(template);
    // print(Object.values(freq));
    // console.log(freq);

    return Math.max(...Object.values(freq)) - Math.min(...Object.values(freq))
}

// console.log(iterate(template));

// print(scoretemplate));
for (let i = 0; i < 40; i++) {
    template = iterate(template);
}
// iterate();

print(score(template));
