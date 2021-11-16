const fs = require('fs');
const util = require('../../util');

let input = '1321131112';
let num = input;

for (let i = 0; i < 50; i ++) {
    let parts = [];
    for (let c = 0; c < num.length;) {
        let ch = num[c++];
        let count = 1;
        while (c < num.length && num[c] === ch) {
            count ++;
            c ++;
        }
        parts.push(count.toString());
        parts.push(ch);
    }
    num = parts.join('');
}

console.log(num.length);