const fs = require('fs');
const md5 = require('../../md5');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute } = require('../utils');
const Channel = require('../intcode/channel');
const Machine = require('../intcode/machine');

let file = process.argv[2] || 'input';
let input = fs.readFileSync(file + '.txt').toString().trim()
   .split('\n').map(line =>
      line.trim()
   .split(',')
   .map(i => parseInt(i))
   )

const log = console.log;
