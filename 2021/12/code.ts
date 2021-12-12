import * as fs from 'fs';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

const paths = {} as { [key: string]: string[] };

asLines.forEach(line => {
    const [from, to] = line.split('-');
    paths[from] = (paths[from] || []).concat(to);
    paths[to] = (paths[to] || []).concat(from);
})

function isBig(name: string) {
    return name === name.toUpperCase();
}

function hasRepeat(path: string[]) {
    for (let i = 0; i < path.length; i++) {
        if (isBig(path[i])) {
            continue;
        }

        for (let j = i + 1; j < path.length; j++) {
            if (path[i] === path[j]) {
                return true;
            }
        }
    }

    return false;
}

function countPaths(part1: boolean, current: string[]) {
    const last = current[current.length - 1];
    const possible = paths[last];

    if (last === 'end') {
        return 1;
    }

    const alreadyHasRepeat = hasRepeat(current);
    return possible.reduce((prev, dest) => {
        if (dest === 'start') {
            // Don't go back to the beginning
            return prev;
        }

        if (!isBig(dest)) {
            const existing = current.filter(loc => loc === dest).length;
            const allowed = (alreadyHasRepeat || part1) ? 1 : 2;
            if (existing + 1 > allowed) {
                // Can't go here again
                return prev;
            }
        }

        return prev + countPaths(part1, current.concat(dest));
    }, 0);
}

console.log(`Part 1:`, countPaths(true, ['start']));
console.log(`Part 2:`, countPaths(false, ['start']));
