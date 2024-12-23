const fs = require('fs');
const md5 = require('../../md5');
const { Map } = require('../../map');
const { MakeGrid, MakeRow } = require('../../makegrid');
const { permute, gcd, lcm } = require('../utils');
const { Channel } = require('../intcode/channel');
const { Machine, DefaultIntcodeMachine } = require('../intcode/machine');
const log = console.log;
const prompt = require('readline-sync').question;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

let machine = DefaultIntcodeMachine();
const { stdin, stdout } = machine;

// Get initial output
machine.run();
