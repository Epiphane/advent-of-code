const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim().split(',').map(i => parseInt(i));

const log = console.log;
const print = console.log;
