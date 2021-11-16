const fs = require('fs');
const util = require('../../util');

let format = /(.*): capacity (-?[0-9]+), durability (-?[0-9]+), flavor (-?[0-9]+), texture (-?[0-9]+), calories (-?[0-9]+)/;

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let ingredients = lines.map((line, id) => {
        let match = line.match(format).slice(1);
        return {
            name: match[0],
            capacity: parseInt(match[1]),
            durability: parseInt(match[2]),
            flavor: parseInt(match[3]),
            texture: parseInt(match[4]),
            calories: parseInt(match[5])
        };
    }).filter(el => el);

    let answer = 0;

    for (let i = 0; i <= 100; i ++) {
        for (let j = 0; i + j <= 100; j ++) {
            for (let k = 0; i + j + k <= 100; k ++) {
                let amounts = [i, j, k, 100 - (i + j + k)];
                let score = ingredients.map((ing, i) => {
                    return [
                        ing.capacity * amounts[i],
                        ing.durability * amounts[i],
                        ing.flavor * amounts[i],
                        ing.texture * amounts[i],
                        ing.calories * amounts[i],
                    ];
                }).reduce((acc, el) => {
                    return [
                        acc[0] + el[0],
                        acc[1] + el[1],
                        acc[2] + el[2],
                        acc[3] + el[3],
                        acc[4] + el[4],
                    ];
                }, [0, 0, 0, 0, 0]).map((i, ndx) => {
                    if (ndx === 4) return i === 500 ? 1 : 0;
                    else return Math.max(i, 0)
                }).reduce((acc, el) => {
                    return acc * el;
                }, 1);
                if (score > answer) {
                    answer = score;
                }
            }
        }
    }

    console.log(ingredients);

    console.log(answer);
};

main('input.txt');
