const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');
const log = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let machine = new Machine(raw);
