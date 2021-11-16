const fs = require('fs');
const util = require('../../util');

let format = /(.*)/;

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let capacities = lines.map((line, id) => {
        return parseInt(line);
    }).filter(el => el);

    // capacities = [20, 15, 10, 5, 5];

    let answer = 0;

    const MAX = 150;

    let min = Infinity;
    let count = 0;
    function Combos(used, i, prefix = '') {
        let current = used.reduce((acc, el) => acc + capacities[el], 0);

        let without = (i < capacities.length) ? Combos(used, i + 1, prefix + '  ') : 0;

        if (current + capacities[i] === MAX) {
            // console.log(min, used.length);
            if (min > used.length + 1) {
                min = used.length + 1;
                count = 1;
                console.log('new min: ', min, used.map(e => capacities[e]), capacities[i]);
            }
            else if (used.length + 1 === min) {
                count ++;
                console.log(used.map(e => capacities[e]), capacities[i]);
            }
            return without + 1;
        }
        else if (current + capacities[i] < MAX && i < capacities.length) {
            return without + Combos(used.concat([i]), i + 1, prefix + '  ');
        }
        else {
            return without;
        }
    }

    console.log(Combos([], 0));
    console.log(min, count);
};

main('input.txt');
