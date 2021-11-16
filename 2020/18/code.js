import fs from 'fs';

const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

function compute(expr) {
    if (typeof(expr) === 'number') {
        return expr;
    }
    if (expr.indexOf(' ') < 0 && expr.indexOf('(') < 0) {
        return +expr;
    }

    let words = [];
    let runner = '';

    let depth = 0;
    expr.split('').forEach(l => {
        if (l === ' ') {
            if (depth === 0) {
                words.push(runner);
                runner = '';
            }
            else {
                runner += l;
            }
        }
        else if (l === '(') {
            if (depth++ > 0) {
                runner += l;
            }
        }
        else if (l === ')') {
            if (--depth > 0) {
                runner += l;
            }
        }
        else {
            runner += l;
        }
    });

    words.push(runner);

    print(expr, words);
    for (let i = 1; i < words.length; i += 2) {
        let op = words[i];
        // let other = compute(words[i+1]);

        if (op === '+') {
            print(words);
            print(words[i-1]);
            print(words[i+1]);
            let left = compute(words[i - 1]);
            let right = compute(words[i + 1]);
            words.splice(i - 1, 3, left + right);
            i -= 2;
        }
    }

    print(expr, words);
    for (let i = 1; i < words.length; i += 2) {
        let op = words[i];
        // let other = compute(words[i+1]);

        if (op === '*') {
            let left = compute(words[i - 1]);
            let right = compute(words[i + 1]);
            words.splice(i - 1, 3, left * right);
            i -= 2;
        }
    }

    // let result = compute(words[0])
    // for (let i = 1; i < words.length; i += 2) {
    //     let op = words[i];
    //     let other = compute(words[i+1]);

    //     switch (op) {
    //         case '*':
    //             result *= other;
    //             break;
    //         case '+':
    //             result += other;
    //             break;
    //     }
    // }

    print(expr, words);
    return compute(words[0]);
}

let lines = raw.split('\n').map(line => line.trim())

print(lines.reduce((prev, line) => prev + compute(line), 0));
