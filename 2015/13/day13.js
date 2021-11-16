const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

let map = {Me:{}};

lines.forEach(line => {
    let match = line.match(/(.*) would (.*) ([0-9]+) happiness units by sitting next to (.*)./);

    map[match[1]] = map[match[1]] || {};
    map[match[1]][match[4]] = parseInt(match[3]);
    if (match[2] === 'lose') { map[match[1]][match[4]] *= -1; }
})

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

let names = ['Me'];
for (let name in map) {
    names.push(name);
    map['Me'][name] = 0;
    map[name]['Me'] = 0;
}
let options = Permute(names);

let mindist = 0;
let best = [];
options.forEach(option => {
    option.unshift(option[option.length - 1]);
    option.push(option[1]);
    let dist = 0;//map[option[option.length - 1]][option[0]] + map[option[0]][option[option.length - 1]];
    for (let i = 1; i < option.length - 1; i ++) {
        dist += map[option[i]][option[i + 1]];
        dist += map[option[i]][option[i - 1]];
    }
    mindist = Math.max(dist, mindist);
    if (mindist === dist) { best = option }
});

console.log(best);
console.log(mindist);