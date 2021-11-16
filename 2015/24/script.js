const fs = require('fs');
const util = require('../../util');

let format = /(.*)/;

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let points = lines.map((line, id) => {
        let match = line.match(format).slice(1);
        // let parts = line.split(',').map(i => parseInt(i));
        return match;
    }).filter(el => el);

    let answer;

    console.log(answer);
};

main('input.txt');
