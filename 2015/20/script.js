const fs = require('fs');
const util = require('../../util');

function main() {
    let input = 33100000;

    let answer;

    for (let i = 1; !answer; i++) {
        let presents = 0;
        for (let f = 1; f < Math.sqrt(i); f++) {
            if (i % f === 0) {
                if (f * 50 >= i) {
                    presents += 11 * f;
                }
                if ((i / f) * 50 >= i) {
                    presents += 11 * (i / f);
                }
            }

            if (presents >= input) {
                answer = i;
                break;
            }
        }
    }

    console.log(answer);
};

main();
