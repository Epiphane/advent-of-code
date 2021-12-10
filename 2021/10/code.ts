import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, makeInt, range, ascending } from '../../utils';
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

console.log(asLines.reduce((prev, line) => {
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const letter = line[i];

        if (letter === '[') {
            stack.push(letter);
        }
        else if (letter === '{') {
            stack.push(letter);

        }
        else if (letter === '<') {
            stack.push(letter);

        }
        else if (letter === '(') {
            stack.push(letter);

        }

        else if (letter === ')') {
            const l = stack.pop();
            if (l !== '(') {
                return prev + 3;
            }
        }
        else if (letter === ']') {
            const l = stack.pop();
            if (l !== '[') {
                return prev + 57;
            }
        }
        else if (letter === '}') {
            const l = stack.pop();
            if (l !== '{') {
                return prev + 1197;
            }
        }
        else if (letter === '>') {
            const l = stack.pop();
            if (l !== '<') {
                return prev + 25137;
            }
        }
    }

    return prev;
}, 0))

const good = asLines.filter((line) => {
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const letter = line[i];

        if (letter === '[') {
            stack.push(letter);
        }
        else if (letter === '{') {
            stack.push(letter);

        }
        else if (letter === '<') {
            stack.push(letter);

        }
        else if (letter === '(') {
            stack.push(letter);

        }

        else if (letter === ')') {
            const l = stack.pop();
            if (l !== '(') {
                return false;
            }
        }
        else if (letter === ']') {
            const l = stack.pop();
            if (l !== '[') {
                return false;
            }
        }
        else if (letter === '}') {
            const l = stack.pop();
            if (l !== '{') {
                return false;
            }
        }
        else if (letter === '>') {
            const l = stack.pop();
            if (l !== '<') {
                return false;
            }
        }
    }

    return true;
});

const scores = good.map(line => {
    const stack = [];
    for (let i = 0; i < line.length; i++) {
        const letter = line[i];

        if (letter === '[') {
            stack.push(letter);
        }
        else if (letter === '{') {
            stack.push(letter);

        }
        else if (letter === '<') {
            stack.push(letter);

        }
        else if (letter === '(') {
            stack.push(letter);

        }

        else if (letter === ')') {
            const l = stack.pop();
            if (l !== '(') {
                return false;
            }
        }
        else if (letter === ']') {
            const l = stack.pop();
            if (l !== '[') {
                return false;
            }
        }
        else if (letter === '}') {
            const l = stack.pop();
            if (l !== '{') {
                return false;
            }
        }
        else if (letter === '>') {
            const l = stack.pop();
            if (l !== '<') {
                return false;
            }
        }
    }

    let score = 0;
    let completer = stack.reverse();

    completer.forEach(l => {
        switch (l) {
            case '[':
                score = score * 5 + 2;
                break;
            case '(':
                score = score * 5 + 1;
                break;
            case '{':
                score = score * 5 + 3;
                break;
            case '<':
                score = score * 5 + 4;
                break;
        }
    })

    return score;
})

const asc = scores.sort(ascending);
console.log(asc);
console.log(asc.length);
console.log(asc[Math.floor(asc.length / 2)]);
