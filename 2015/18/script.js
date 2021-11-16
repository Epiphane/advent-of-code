const fs = require('fs');
const util = require('../../util');

let format = /(.*)/;

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let grid = lines.map((line, id) => {
        return line.split('').map(i => i === '#');
    });

    grid[0][0] = true;
    grid[99][0] = true;
    grid[99][99] = true;
    grid[0][99] = true;

    function Iterate(state) {
        return state.map((row, y) => row.map((el, x) => {
            if (y === 0 || y === state.length - 1) {
                if (x === 0 || x === row.length - 1) {
                    return true;
                }
            }

            let score = 0;
            for (let dx = -1; dx <= 1; dx ++) {
                if (x + dx < 0 || x + dx >= row.length) continue;
                for (let dy = -1; dy <= 1; dy ++) {
                    if (y + dy < 0 || y + dy >= state.length) continue;
                    if (dx === 0 && dy === 0) continue;

                    score += state[y + dy][x + dx] ? 1 : 0;
                }
            }

            if (el && (score === 2 || score === 3)) {
                return true;
            }
            else if (!el && score === 3) {
                return true;
            }
            return false;
        }));
    }

    for (let i = 0; i < 100; i ++) {
        grid = Iterate(grid);
    }

    let answer = grid.reduce((acc, row) => {
        return acc + row.reduce((acc, el) => acc + (el ? 1 : 0), 0);
    }, 0);

    console.log(answer);
};

main('input.txt');
