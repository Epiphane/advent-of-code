// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map3D } from '../../map3d';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, id } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

let total = 0;

class MyInterpreter extends Interpreter {
    constructor(instrs: string[]) {
        super(instrs);
    }
}

let program = new MyInterpreter(asLines);

let cache = {};
function makeBest(t, state) {
    if (t === 0) {
        return state.nGeo;
    }

    let { ore, clay, obs1, obs2, geo1, geo2, nOre, nClay, nObs, nGeo, nOreR, nClayR, nObsR, nGeoR } = state;
    let json = JSON.stringify([t, state]);
    if (cache[json]) {
        return cache[json];
    }

    nOre += nOreR;
    nClay += nClayR;
    nObs += nObsR;
    nGeo += nGeoR;

    let newState = { ore, clay, obs1, obs2, geo1, geo2, nOre, nClay, nObs, nGeo, nOreR, nClayR, nObsR, nGeoR };

    let best = makeBest(t - 1, { ...newState });
    let maybe = (output) => best = Math.max(best, output);

    if (nOre >= ore) {
        maybe(makeBest(t - 1, {
            ...newState,
            nOre: nOre - ore,
            nOreR: nOreR + 1,
        }));
    }

    if (nOre > clay) {
        maybe(makeBest(t - 1, {
            ...newState,
            nOre: nOre - clay,
            nClayR: nClayR + 1,
        }));
    }

    if (nOre > obs1 && nClay > obs2) {
        maybe(makeBest(t - 1, {
            ...newState,
            nOre: nOre - obs1,
            nClay: nClay - obs2,
            nObsR: nObsR + 1,
        }));
    }

    if (nOre > geo1 && nObs > geo2) {
        maybe(makeBest(t - 1, {
            ...newState,
            nOre: nOre - geo1,
            nObs: nObs - geo2,
            nGeoR: nGeoR + 1,
        }));
    }

    // print(json, best);
    return cache[json] = best;
}

function runBlueprint(t, { ore, clay, obs1, obs2, geo1, geo2 }) {
    cache = {};
    let nOre = 0;
    let nClay = 0;
    let nObs = 0;
    let nGeo = 0;

    let nOreR = 1;
    let nClayR = 0;
    let nObsR = 0;
    let nGeoR = 0;

    return makeBest(t, {
        ore, clay, obs1, obs2, geo1, geo2, nOre, nClay, nObs, nGeo, nOreR, nClayR, nObsR, nGeoR
    })

    return nGeo;
}

function key({ time, resources, robots }) {
    return `${robots.join('|')}|${resources.join('|')}`
}

function heuristic({ time, resources, robots }) {
    return robots[0] + robots[1] * 5 + robots[2] * 25 + robots[3] * 125 + time * 150;
    return robots.reduce((prev, r) => prev * 5 + r, 0)
    // return resources[3] + (robots[3] + time / 2) * time;
}

function take2(time, costs) {
    let i = 0;
    let resources = [0, 0, 0, 0];
    let robots = [1, 0, 0, 0];

    let stack = [{ time, resources, robots, history: [], stage: 0 }];
    let bestResources = [];

    let stackEntry = {};
    const maybeAdd = (state, reason, debug) => {
        let key = state.robots.join(',');
        bestResources[state.time] = bestResources[state.time] || {};

        let good = true;
        if (bestResources[state.time].hasOwnProperty(key)) {
            bestResources[state.time][key].forEach((exists) => {
                if (exists.every((val, i) => val >= state.resources[i])) {
                    good = false;
                }
            })
        }
        else {
            bestResources[state.time][key] = [];
        }

        if (good) {
            bestResources[state.time][key].push([...state.resources]);
            state.history = state.history.map(id);
            state.history.push(reason);

            if (debug) {
                print(state);
            }
            stack.push(state);
        }

        // let key2 = `${state.time} | state.robots.join(',')`;
        // if (stackEntry.hasOwnProperty(key2)) {
        //     let other = stackEntry[key2];
        //     if ()
        // }
    }

    const maxOreCost = Math.max(costs[0], costs[1], costs[2][0], costs[3][0]);

    let best = 0;
    while (stack.length) {
        let { time, resources, robots, history, stage } = stack.shift();

        if (robots[3] === 0) {
            if (time <= 8) {

                // if (i++ === 0)
                // if (history.join('').indexOf('clay') >= 0) 
                // print('death', { time, resources, robots, history }, resources[3], costs[3][1]);
                // continue;
            }
        }
        // if (robots[2] === 0 && time <= 7) {
        //     continue;
        // }
        // if (robots[0] > 7)
        //     continue;
        // if (resources[0] > Math.max(7, time) * Math.max(costs[0], costs[1], costs[2][0], costs[3][0]))
        //     continue;
        // if (resources[1] > Math.max(7, time) * costs[2][1])
        //     continue;

        let needed = [
            '_',
            '_',
            '_',
            '_',
            'ore',
            '_',
            '_',
            'clay',
            '_',
            'clay',
            '_',
            'clay',
            '_',
            'clay',
            'obs',
            'obs',
            '_',
            'obs',
            'obs',
            'ore',
            'obs',
            'geo',
            'obs',
            'geo',
            'obs',
            'obs',
            'geo',
            'geo',
            'obs',
            'geo',
        ]

        let debug = true;
        history.forEach((h, i) => debug &= h === needed[i])
        // needed.forEach((thing, i) => history &= (thing[i] === history[i]));

        // let debug = (31 - time) === needed.length && history.join('').indexOf(needed.join('')) === 0;

        let found = true;
        let key = robots.join(',');
        if (bestResources[time]) {
            found = false;
            bestResources[time][key].forEach((exists) => {
                // let exists = bestResources[time][key] as number[];
                if (exists.every((val, i) => val === resources[i])) {
                    // if (!found && debug) {
                    //     print('skipping', key, exists, resources, robots, history.join(''));
                    // }
                    found = true;
                    // if (debug) {
                    //     print('skipping', key, exists, resources, robots, history.join(''));
                    // }
                    // continue;
                }

            });
        }
        if (!found) {
            if (!found && debug) {
                print(`skipping. bestResources[${time}][${key}] = `, bestResources[time][key]);//exists, resources, robots, history.join(''));
            }
            continue;
        }

        if (i++ % 1000 === 0) {
            // print([time, resources, robots]);
        }

        if (time === 0) {
            if (resources[3] > best) {
                // print({ time, resources, robots, history });
                best = resources[3];
            }
            // print('ret');
            return resources[3];
            continue;
        }

        time--;

        const canBuild = [
            resources[0] >= costs[0] && robots[0] < maxOreCost,
            resources[0] >= costs[1] && robots[1] < costs[2][1],
            resources[0] >= costs[2][0] && resources[1] >= costs[2][1] && robots[2] < costs[3][1],
            resources[0] >= costs[3][0] && resources[2] >= costs[3][1],
        ];

        if (debug) {
            print('Considering', time, resources, robots, canBuild, history.join(','))
        }
        range(4).forEach(i => resources[i] += robots[i]);

        if (resources[0] > time * maxOreCost) {
            resources[0] = time * maxOreCost;
        }

        if (canBuild[3]) {
            let rsc = [...resources];
            let robo = [...robots];
            rsc[0] -= costs[3][0];
            rsc[2] -= costs[3][1];
            robo[3]++;

            maybeAdd({ resources: rsc, robots: robo, time, history, stage: 2 }, 'geo', debug);
        }

        if (canBuild[2]) {
            let rsc = [...resources];
            let robo = [...robots];
            rsc[0] -= costs[2][0];
            rsc[1] -= costs[2][1];
            robo[2]++;

            maybeAdd({ resources: rsc, robots: robo, time, history, stage: 2 }, 'obs', debug);
        }

        if (canBuild[1]) {
            let rsc = [...resources];
            let robo = [...robots];
            rsc[0] -= costs[1];
            robo[1]++;

            maybeAdd({ resources: rsc, robots: robo, time, history, stage: 1 }, 'clay', debug);
        }

        if (canBuild[0]) {
            let rsc = [...resources];
            let robo = [...robots];
            rsc[0] -= costs[0];
            robo[0]++;

            // if (time === 20) {
            //     print('THIS ONE HERE BOSS');
            //     print({ resources: rsc, robots: robo, time, history, stage: 0 });
            // }

            maybeAdd({ resources: rsc, robots: robo, time, history, stage: 0 }, 'ore', debug);
        }

        maybeAdd({ resources: [...resources], robots, time, history, stage }, '_', debug);

        stack.sort((a, b) => {
            let aRobo = a.robots.map(i => i + a.time);
            let bRobo = b.robots.map(i => i + b.time);
            let aResc = a.resources.map(i => i + 3 * a.time);
            let bResc = b.resources.map(i => i + 3 * b.time);

            for (let i = 3; i >= 0; i--) {
                if (aResc[i] !== bResc[i]) {
                    return bResc[i] - aResc[i];
                }

                if (aRobo[i] !== bRobo[i]) {
                    return bRobo[i] - aRobo[i];
                }
            }

            return b.time - a.time;
        });

        // let filtered = stack.filter(({ history }) => history.slice(0, 4).join('') === '__ore_ore')
        // if (filtered.length > 0) {
        //     print(filtered.map(({ robots, resources, time, history }) => { return { t: time, robots: robots.join(','), resources: resources.join(','), history: history.join(',') }; }));
        // }

        // print(stack);
        // break;
    }

    return best;
}

total = 1
asLines.forEach((line, i) => {
    const [_, bp, ore, clay, obs1, obs2, geo1, geo2] = line.match(/Blueprint ([0-9]+): Each ore robot costs ([0-9]+) ore. Each clay robot costs ([0-9]+) ore. Each obsidian robot costs ([0-9]+) ore and ([0-9]+) clay. Each geode robot costs ([0-9]+) ore and ([0-9]+) obsidian./).map(makeInt);

    if (bp < 3) return;
    if (bp > 3) return;

    // print(take3Internal(4, [ore, clay, [obs1, obs2], [geo1, geo2]], [4, 25, 7, 2], [1, 4, 2, 1]))
    // let bpScore = take3(24, [ore, clay, [obs1, obs2], [geo1, geo2]]);

    print([ore, clay, [obs1, obs2], [geo1, geo2]]);
    let bpScore = take2(32, [ore, clay, [obs1, obs2], [geo1, geo2]]);
    print(bp, bpScore);
    total *= bpScore;
    // print(bp, bpScore);
    // total += bpScore * bp;
})

print(total);
