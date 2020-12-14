import fs from 'fs';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())

let part1 = [];
let part2 = [];
let mask = '';

lines.forEach(line => {
    let match = line.match(/mask = (.*)/);
    if (match) {
        mask = match[1];
    }
    else {
        match = line.match(/mem\[([0-9]+)\] = ([0-9]+)/);
        let loc = +match[1];

        let bin = (+match[2]).toString(2).padStart(mask.length, '0');
        part1[loc] = mask.split('').map((l, i) => {
            if (l === 'X') {
                return bin[i];
            }
            else return l;
        }).join('');

        let locStr = loc.toString(2).padStart(mask.length, '0');
        let newLocStr = mask.split('').map((l, i) => {
            if (l === '0') return locStr[i];
            if (l === '1') return '1';
            return 'X';
        }).join('');

        let locations = [newLocStr];
        let fullLocs = [];
        while (locations.length > 0) {
            let location = locations.shift();
            let index = location.indexOf('X');
            if (index === -1) {
                fullLocs.push(location);
            }
            else {
                locations.push(`${location.substr(0, index)}0${location.substr(index + 1)}`);
                locations.push(`${location.substr(0, index)}1${location.substr(index + 1)}`);
            }
        }

        fullLocs.forEach(l => {
            part2[parseInt(l, 2)] = (+match[2]).toString(2)
        });
    }
});

let res = 0;
for (let k in part1) {
    res += parseInt(part1[k], 2)
}
print(`Part 1: ${res}`);

res = 0;
for (let k in part2) {
    res += parseInt(part2[k], 2)
}
print(`Part 2: ${res}`);
