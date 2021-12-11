import * as fs from 'fs';
import { ascending } from '../../utils';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

function syntaxScore(line: string) {
    const stack: string[] = [];
    for (let i = 0; i < line.length; i++) {
        const letter = line[i];
        switch (letter) {
            case '(':
            case '[':
            case '{':
            case '<':
                stack.push(letter);
                break;
            case ')':
                if (stack.pop() !== '(') return 3;
                break;
            case ']':
                if (stack.pop() !== '[') return 57;
                break;
            case '}':
                if (stack.pop() !== '{') return 1197;
                break;
            case '>':
                if (stack.pop() !== '<') return 25137;
                break;
        }
    }

    return 0;
}

console.log(`Part 1`, asLines.reduce((prev, line) => prev + syntaxScore(line), 0));

function incompleteScore(line: string) {
    const stack: string[] = [];
    for (let i = 0; i < line.length; i++) {
        const letter = line[i];
        switch (letter) {
            case '(':
            case '[':
            case '{':
            case '<':
                stack.push(letter);
                break;
            case ')':
                if (stack.pop() !== '(') return 0;
                break;
            case ']':
                if (stack.pop() !== '[') return 0;
                break;
            case '}':
                if (stack.pop() !== '{') return 0;
                break;
            case '>':
                if (stack.pop() !== '<') return 0;
                break;
        }
    }

    const values = {
        '(': 1,
        '[': 2,
        '{': 3,
        '<': 4,
    };

    return stack.reverse().reduce((prev, letter) => 5 * prev + values[letter], 0);
}

const incompletes = asLines.map(incompleteScore).filter(val => val !== 0).sort(ascending);
console.log(`Part 2`, incompletes[incompletes.length / 2 | 0]);
