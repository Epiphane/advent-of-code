import fs from 'fs';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())

let passwords = [];
lines.forEach(line => {
    let match = line.match(/([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)/)

    passwords.push({
        low: +match[1],
        high: +match[2],
        letter: match[3],
        text: match[4]
    });
});

print(`Part 1: ${passwords.reduce((last, password) => {
    let c = 0;
    for (let i = 0; i < password.text.length; ++i) {
        if (password.text[i] === password.letter) {
            c++;
        }
    }

    return last + (c >= password.low && c <= password.high);
}, 0)}`);

print(`Part 2: ${passwords.reduce((last, password) => {
    if (
        password.text[password.low - 1] === password.letter ^
        password.text[password.high - 1] === password.letter
    ) {
        return last + 1;
    }

    return last;
}, 0)}`);
