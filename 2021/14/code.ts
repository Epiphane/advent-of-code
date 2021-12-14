import * as fs from 'fs';
let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));

const replacements = {} as { [key: string]: string[] };
asGroups[1].forEach(line => {
    const [match, insert] = line.split(' -> ');
    replacements[match] = [
        match[0] + insert,
        insert + match[1],
    ];
});

class Polymer {
    pairs: { [key: string]: number };

    constructor(initial?: string) {
        this.pairs = {};
        if (initial) {
            for (let i = 0; i < initial.length; i++) {
                const a = initial[i];
                const b = initial[i + 1] ?? '_';
                const key = `${a}${b}`;
                this.pairs[key] = (this.pairs[key] ?? 0) + 1;
            }
        }
    }

    add(pair: string, amount: number) {
        this.pairs[pair] = (this.pairs[pair] ?? 0) + amount;
    }

    iterate() {
        const next = new Polymer();

        for (const pair in this.pairs) {
            const count = this.pairs[pair];
            const replacement = replacements[pair];

            if (replacement) {
                replacement.forEach(pair => next.add(pair, count));
            }
            else {
                next.add(pair, count);
            }
        }

        return next;
    }

    score() {
        const freq = new Map<string, number>();
        for (const pair in this.pairs) {
            const letter = pair[0];
            freq[letter] = (freq[letter] || 0) + this.pairs[pair];
        }

        return Math.max(...Object.values(freq)) - Math.min(...Object.values(freq))
    }
};

let polymer = new Polymer(asGroups[0][0]);

for (let i = 0; i < 10; i++) {
    polymer = polymer.iterate();
}

console.log(`Part 1`, polymer.score());

for (let i = 0; i < 30; i++) {
    polymer = polymer.iterate();
}

console.log(`Part 2`, polymer.score());
