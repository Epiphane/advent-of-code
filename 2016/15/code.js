const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../../utils');
const log = console.log;
const print = console.log;
const prompt = require('readline-sync').question;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

let disks = [];
lines.forEach(line => {
    let matches = [...line.matchAll(/Disc #([0-9]+) has ([0-9]+) positions; at time=([0-9]+), it is at position ([0-9]+)./g)][0];
    disks.push({
        positions: +matches[2],
        initial: +matches[4]
    });
});

print(disks);

let t = 0;
while (true) {
    let good = true;
    for (let dt = 0; dt < disks.length; dt++) {
        let disk = disks[dt];
        let time = t + dt + 1;
        let pos = (disk.initial + time) % disk.positions;
        if (pos !== 0) {
            good = false;
        }
    }

    if (good) {
        print(t);
        break;
    }

    t++;
}
