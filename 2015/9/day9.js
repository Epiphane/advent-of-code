const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

let dists = {};

lines.forEach(line => {
    parts = line.split(' ');
    dists[parts[0]] = dists[parts[0]] || {};
    dists[parts[2]] = dists[parts[2]] || {};
    dists[parts[0]][parts[2]] = parseInt(parts[4]);
    dists[parts[2]][parts[0]] = parseInt(parts[4]);
});

function Permute(arr) {
    if (arr.length === 1) return [arr];
    let res = [];
    for (let i = 0; i < arr.length; i ++) {
        let perms = Permute(arr.slice(0, i).concat(arr.slice(i + 1)));
        perms.forEach(perm => perm.unshift(arr[i]));
        res = res.concat(perms);
    }
    return res;
}

let cities = [];
for (let city in dists) { cities.push(city); }

// console.log(cities);
let options = Permute(cities);

let mindist = 0;
options.forEach(option => {
    let dist = 0;
    for (let i = 0; i < option.length - 1; i ++) {
        dist += dists[option[i]][option[i + 1]];
    }
    mindist = Math.max(dist, mindist)
});

console.log(mindist);
