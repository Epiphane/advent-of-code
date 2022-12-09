import * as fs from 'fs';
const print = console.log;
let file = process.argv[2] || 'input';

const directories: Entry[] = [];
class Entry {
    fileSize?: number;
    children: Entry[] = [];

    constructor(
        public readonly parent: Entry,
        public readonly name: string,
        size?: number
    ) {
        if (size) {
            this.fileSize = size;
        }
        else {
            directories.push(this);
        }
    }

    get size() {
        if (this.fileSize) {
            return this.fileSize;
        }

        return this.children.reduce(
            (prev, child) => prev + child.size, 0
        );
    }
}

const root = new Entry(null, '/');

let cursor = root;
fs.readFileSync(file + '.txt').toString()
    .trim()
    .split('\n')
    .map(line => line.trim().split(' '))
    .forEach(words => {
        if (words[0] === '$') {
            if (words[1] === 'cd') {
                switch (words[2]) {
                    case '/':
                        cursor = root;
                        break;
                    case '..':
                        cursor = cursor.parent;
                        break;
                    default:
                        cursor = cursor.children.find(child => child.name === words[2]);
                        break;
                }
            }
        }
        else {
            if (words[0] === 'dir') {
                cursor.children.push(new Entry(cursor, words[1]));
            }
            else {
                cursor.children.push(new Entry(cursor, words[1], parseInt(words[0])));
            }
        }
    });

print(directories
    .filter(dir => dir.size <= 100000)
    .map(dir => [dir.name, dir.size]))

print(`Part 1:`, directories
    .filter(dir => dir.size <= 100000)
    .map(dir => dir.size)
    .reduce((prev, dir) => prev + dir.size, 0));

const unused = 70000000 - root.size;
const needed = 30000000;
print(`Part 2:`, Math.min(...directories
    .filter(dir => unused + dir.size >= needed)
    .map(dir => dir.size)));
