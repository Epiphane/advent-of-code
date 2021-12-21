import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, addAll } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line.trim());
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let spot = [7, 8];
let p1 = 8
let p2 = 9;

let score = [0, 0];
let p1s = 0;
let p2s = 0;

let next = 99;
let nRolls = 0;
function roll() {
    nRolls++;
    next = (next + 1) % 100;
    return next + 1;
}

let turn = 0;

let scoreMap = [
    new Map(0),
    new Map(0),
];
scoreMap[0].set(0, 0, 1);

let states = {};

function encode(spots: [number, number], score: [number, number], turn: number) {
    return [...spots, ...score, turn].join(',');
}

function decode(state: string) {
    const [sp0, sp1, sc0, sc1, turn] = state.split(',').map(makeInt);
    return {
        spots: [sp0, sp1],
        score: [sc0, sc1],
        turn,
    }
}

const initial = encode([0, 0], [0, 0], 0);
let queue = [decode(initial)];
states[initial] = 1;

const results = {} as { [key: string]: [number, number] };

const options = [
    1 + 1 + 1,
    1 + 1 + 2,
    1 + 1 + 3,
    1 + 2 + 1,
    1 + 2 + 2,
    1 + 2 + 3,
    1 + 3 + 1,
    1 + 3 + 2,
    1 + 3 + 3,

    2 + 1 + 1,
    2 + 1 + 2,
    2 + 1 + 3,
    2 + 2 + 1,
    2 + 2 + 2,
    2 + 2 + 3,
    2 + 3 + 1,
    2 + 3 + 2,
    2 + 3 + 3,

    3 + 1 + 1,
    3 + 1 + 2,
    3 + 1 + 3,
    3 + 2 + 1,
    3 + 2 + 2,
    3 + 2 + 3,
    3 + 3 + 1,
    3 + 3 + 2,
    3 + 3 + 3,
]
const counts = range(10).map(n => options.filter(i => i === n).length);
// console.log(counts);

let it = 0;
function Test(spots: [number, number], score: [number, number], turn: number) {
    const encoded = encode(spots, score, turn);

    if (results[encoded]) {
        return results[encoded];
    }

    if (score[0] >= 21) {
        return results[encoded] = [1, 0];
    }
    if (score[1] >= 21) {
        return results[encoded] = [0, 1];
    }

    const result = [0, 0];
    counts.forEach((times, value) => {
        if (times === 0) return;

        let newSpots = [...spots] as [number, number];
        let newScore = [...score] as [number, number];
        newSpots[turn] = (newSpots[turn] + value) % 10;
        newScore[turn] += (newSpots[turn] + 1);
        if (it++ % 1000 === 0) console.log(value, times, spots, newSpots, score, newScore, turn);

        const subresult = Test(newSpots, newScore, 1 - turn);
        result[0] += times * subresult[0];
        result[1] += times * subresult[1];
    })

    return results[encoded] = result as [number, number];
}

const output = Test([7, 8], [0, 0], 0);
console.log(output);
console.log(Math.min(...output))
console.log(results['7,8,0,0,0']);

/*
while (queue.length) {
    // const {spots, score, turn} = queue.shift();

    // // 1
    // const v1Spots = [...spots];
    // const v1Scores = [...score];
    // spots[turn] = (sp)

    const { x, y, turn } = queue.shift();
    const nGames = scoreMap[turn].get(x, y);

    // 1
    const options = [
        1 + 1 + 1,
        1 + 1 + 2,
        1 + 1 + 3,
        1 + 2 + 1,
        1 + 2 + 2,
        1 + 2 + 3,
        1 + 3 + 1,
        1 + 3 + 2,
        1 + 3 + 3,

        2 + 1 + 1,
        2 + 1 + 2,
        2 + 1 + 3,
        2 + 2 + 1,
        2 + 2 + 2,
        2 + 2 + 3,
        2 + 3 + 1,
        2 + 3 + 2,
        2 + 3 + 3,

        3 + 1 + 1,
        3 + 1 + 2,
        3 + 1 + 3,
        3 + 2 + 1,
        3 + 2 + 2,
        3 + 2 + 3,
        3 + 3 + 1,
        3 + 3 + 2,
        3 + 3 + 3,
    ]
    const counts = range(10).map(n => options.filter(i => i === n).length);
    counts.forEach((value, times) => {
        const encoded = `${}`

        if (turn === 0) {
            let newSpot =
                scoreMap.set(x + value, y)
        }
    })
}

function takeTurn() {
    let rolls = [
        roll(),
        roll(),
        roll(),
    ];

    let add = rolls.reduce(addAll, 0);
    let nextSpot = spot[turn] + add;
    nextSpot = nextSpot % 10;
    spot[turn] = nextSpot;
    score[turn] += (nextSpot + 1);

    // console.log(turn, rolls, nextSpot + 1, score[turn]);
    // if (nRolls > 10) return false;
    if (score[turn] >= 1000) {
        console.log(score[1 - turn]);
        console.log(nRolls);
        console.log(score[1 - turn] * nRolls);
        return false;
    }

    turn = 1 - turn;
    return true;
}

while (takeTurn()) { }

*/
