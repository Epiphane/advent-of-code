import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
// import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm, mode } from '../../utils';
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
let asNumberMap = MapFromInput(0, s => parseInt(s))

class Disk {
    constructor(
        public name: string,
        public weight: number,
    ) { }

    public above: Disk[] = [];

    getWeight() {
        return this.weight + this.above.reduce((prev, d) => prev + d.getWeight(), 0);
    }

    isBalanced() {
        const weights = this.above.map(d => d.getWeight());
        return weights.every(v => v === weights[0]);
    }

    balance() {
        if (this.above.every(disk => disk.isBalanced())) {
            if (!this.isBalanced()) {
                const weights = this.above.map(d => d.getWeight());
                const expected = mode(weights);
                const bad = this.above.filter(disk => disk.getWeight() !== expected)[0];

                return [bad.name, expected - (bad.getWeight() - bad.weight)];
            }
        }
        else {
            return this.above.map(disk => disk.balance()).filter(v => !!v)[0];
        }
    }
}

const disks = {} as { [key: string]: Disk };

asLines.forEach(line => {
    const [name, weight] = line.split(' ');

    const disk = new Disk(name, parseInt(weight.substr(1)));
    disks[name] = disk
})

asLines.forEach(line => {
    const [name] = line.split(' ');
    const parts = line.split(' -> ');

    const disk = disks[name];
    if (parts.length > 1) {
        parts[1].split(', ').forEach(p => {
            disk.above.push(disks[p]);
        })
    }
})

let bottom: string;
for (const name in disks) {
    let isBottom = true;
    for (const name2 in disks) {
        if (disks[name2].above.includes(disks[name])) {
            isBottom = false;
        }
    }

    if (isBottom) {
        bottom = name;
    }
}

console.log(`Part 1:`, bottom);

const [name, weight] = disks[bottom].balance();
console.log(`Part 2: ${weight}`);
