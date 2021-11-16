const fs = require('fs');
const util = require('../../util');

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let expected = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1,
    };

    let sues = lines.map((line, id) => {
        let num = parseInt(line.substr('Sue '.length));
        let parts = line.substr(line.indexOf(':') + 2).split(', ');

        for (let i = 0; i < parts.length; i ++) {
            let keyval = parts[i].split(': ');
            let key = keyval[0];
            let val = parseInt(keyval[1]);

            switch (key) {
                case 'cats':
                case 'trees':
                    if (expected[key] >= val) {
                        return null;
                    }
                    break;
                case 'pomeranians':
                case 'goldfish':
                    if (expected[key] <= val) {
                        return null;
                    }
                    break;
                default:
                    if (expected[key] !== val) {
                        return null;
                    }
            }
        }

        return num;
    }).filter(el => el);

    let answer = sues;

    console.log(answer);
};

main('input.txt');
