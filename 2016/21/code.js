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

let comp = [];

function swapPosition(letters, x, y) {
    // let t = letters[x];
    // letters[x] = letters[y];
    // letters[y] = t;

    return letters.map((l, i) => {
        if (i === x) return letters[y];
        if (i === y) return letters[x];
        return l;
    })
}

function swapPositionInv(letters, x, y) { return swapPosition(letters, x, y); }

function swapLetter(letters, x, y) {
    // for (let i = 0; i < letters.length; i++) {
    //     if (letters[i] === x) { letters[i] = y;}
    //     if (letters[i] === y) { letters[i] = x;}
    // }

    return letters.map(l => {
        if (l === x) return y;
        else if (l === y) return x;
        return l;
    });
}

function swapLetterInv(letters, x, y) { return swapLetter(letters, x, y); }

function rotateLeft(letters, x) {
    return letters.slice(x).concat(letters.slice(0, x));
}

function rotateLeftInv(letters, x) { return rotateRight(letters, x); }

function rotateRight(letters, x) {
    return letters.slice(letters.length - x).concat(letters.slice(0, letters.length - x));
}

function rotateRightInv(letters, x) { return rotateLeft(letters, x); }

function rotatePosition(letters, x) {
    let i = letters.join('').indexOf(x);
    if (i >= 4) i++;
    i++;
    return rotateRight(letters, i)
}

function rotatePositionInv(letters, x) {
    for (let i = 0; i < letters.length; i++) {
        let unscramble = rotateLeft(letters, i);
        let rescramble = rotatePosition(unscramble, x);
        if (rescramble.join('') === letters.join('')) {
            return unscramble;
        }
    }
}

function reverse(letters, x, y) {
    y++
    return letters.slice(0, x).concat(letters.slice(x, y).reverse()).concat(letters.slice(y));
}

function reverseInv(letters, x, y) { return reverse(letters, x, y); }

function move(letters, x, y) {
    let l = letters[x];
    letters.splice(x, 1);
    letters.splice(y, 0, l);
    return letters;
}

function moveInv(letters, x, y) { return move(letters, y, x); }

let letters = 'abcdefgh'.split('');
input.forEach(line => {
    let swapPos = line.match(/swap position ([0-9]+) with position ([0-9]+)/);
    let swapLet = line.match(/swap letter ([a-zA-Z]+) with letter ([a-zA-Z]+)/);
    let rotLeft = line.match(/rotate left ([0-9]+) step/);
    let rotRight = line.match(/rotate right ([0-9]+) step/);
    let rotPos = line.match(/rotate based on position of letter ([a-zA-Z]+)/);
    let rev = line.match(/reverse positions ([0-9]+) through ([0-9]+)/);
    let mov = line.match(/move position ([0-9]+) to position ([0-9]+)/);
    if (swapPos) {
        letters = swapPosition(letters, +swapPos[1], +swapPos[2]);
    }
    if (swapLet) {
        letters = swapLetter(letters, swapLet[1], swapLet[2]);
    }
    if (rotLeft) {
        letters = rotateLeft(letters, +rotLeft[1]);
    }
    if (rotRight) {
        letters = rotateRight(letters, +rotRight[1]);
    }
    if (rotPos) {
        letters = rotatePosition(letters, rotPos[1]);
    }
    if (rev) {
        letters = reverse(letters, +rev[1], +rev[2]);
    }
    if (mov) {
        letters = move(letters, +mov[1], +mov[2]);
    }
})

print('Part 1', letters.join(''))

letters = 'fbgdceah'.split('');
input.reverse().forEach(line => {
    let swapPos = line.match(/swap position ([0-9]+) with position ([0-9]+)/);
    let swapLet = line.match(/swap letter ([a-zA-Z]+) with letter ([a-zA-Z]+)/);
    let rotLeft = line.match(/rotate left ([0-9]+) step/);
    let rotRight = line.match(/rotate right ([0-9]+) step/);
    let rotPos = line.match(/rotate based on position of letter ([a-zA-Z]+)/);
    let rev = line.match(/reverse positions ([0-9]+) through ([0-9]+)/);
    let mov = line.match(/move position ([0-9]+) to position ([0-9]+)/);
    if (swapPos) {
        letters = swapPositionInv(letters, +swapPos[1], +swapPos[2]);
    }
    if (swapLet) {
        letters = swapLetterInv(letters, swapLet[1], swapLet[2]);
    }
    if (rotLeft) {
        letters = rotateLeftInv(letters, +rotLeft[1]);
    }
    if (rotRight) {
        letters = rotateRightInv(letters, +rotRight[1]);
    }
    if (rotPos) {
        letters = rotatePositionInv(letters, rotPos[1]);
    }
    if (rev) {
        letters = reverseInv(letters, +rev[1], +rev[2]);
    }
    if (mov) {
        letters = moveInv(letters, +mov[1], +mov[2]);
    }
})

print('Part 2', letters.join(''))
