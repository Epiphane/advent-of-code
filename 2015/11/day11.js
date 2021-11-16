const fs = require('fs');
const util = require('../../util');

let input = 'cqjxjnds';

function Valid(pw) {
    // Passwords must include one increasing straight of at least three letters,
    //    like abc, bcd, cde, and so on, up to xyz. They cannot skip letters;
    //    abd doesn't count.
    // Passwords may not contain the letters i, o, or l, as these letters can
    //    be mistaken for other characters and are therefore confusing.
    // Passwords must contain at least two different, non-overlapping pairs of
    //    letters, like aa, bb, or zz.
    let straight = [pw.charCodeAt(0)];
    let hasStraight = false;
    let prev = 0;
    let pairs = 0;

    for (let i = 0; i < pw.length; i ++) {
        let ch = pw[i];
        let val = pw.charCodeAt(i);
        if (straight[straight.length - 1] + 1 === val) {
            straight.push(val);
            if (straight.length >= 3) { hasStraight = true; }
        }
        else {
            straight = [val]
        }

        if (val === prev) {
            pairs ++;
            prev = 0;
        }
        else {
            prev = val;
        }

        if (ch === 'i' || ch === 'o' || ch === 'l') { return false; }
    }

    return hasStraight && pairs >= 2;
}

function Increment(pw) {
    let letters = pw.split('');
    for (let i = letters.length - 1; i >= 0; i --) {
        if (letters[i] !== 'z') {
            letters[i] = String.fromCharCode(letters[i].charCodeAt(0) + 1);
            if (letters[i] === 'o') letters[i] = 'p';
            if (letters[i] === 'i') letters[i] = 'j';
            if (letters[i] === 'l') letters[i] = 'm';
            return letters.join('');
        }
        else {
            letters[i] = 'a';
        }
    }
    console.error('err');
}

let a = 0;
pw = Increment(input);
pw = Increment('cqjxxyzz');
while (!Valid(pw)) {
    pw = Increment(pw);
    if ((a++ % 100 === 0)) console.log(pw);
}
console.log('Done! ')
console.log(pw);
