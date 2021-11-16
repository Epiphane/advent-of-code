const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim();

let inputJSON = JSON.parse(input);

function GetVal(obj) {
    let res = 0;
    let red = false;
    if (typeof(obj) === 'number') return obj;
    else if (typeof(obj) !== 'object') return 0;
    else if (obj.length) {
        res = obj.reduce((acc, el) => acc + GetVal(el), 0);
        return res;
    }
    else {
        res = Object.keys(obj).reduce((acc, k) => {
            if (obj[k] === 'red') red = true;
            return acc + GetVal(obj[k])
        }, 0);
        return red ? 0 : res;
    }
}

console.log(GetVal(inputJSON));
