// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, id } from '../../utils';
import { question } from 'readline-sync';
import { Point } from '../../point';
const md5 = require('../../md5');
const print = console.log;
const P = print;
const UP = new Point(0, -1);
const DOWN = new Point(0, 1);
const LEFT = new Point(-1, 0);
const RIGHT = new Point(1, 0);
const DIRS = [UP, RIGHT, DOWN, LEFT];

let Turn = (dir: number, amount: number) => {
    dir += amount;
    while (dir < 0) dir += 4;
    while (dir > 3) dir -= 4;
    return dir;
}

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

let start, end;
asMap.forEach((v, x, y) => {
    if (v === '.') {
        if (y === 0) {
            start = { x, y };
        }
        else if (y === asMap.max.y - 1) {
            end = { x, y: y };
        }
    }
})

function insert(arr, el) {
    let comp = (a, b) => {
        if (a.x === b.x) return a.y - b.y;
        return a.x - b.x;
    };

    let bottom = 0;
    let top = arr.length - 1;
    while (bottom < top) {
        let testI = Math.floor((bottom + top) / 2)
        let test = arr[testI]
        if (comp(el, test) > 0) {
            bottom = testI + 1;
        }
        else {
            top = testI - 1;
        }
    }

    arr.splice(bottom, 0, el);
}

let stack = [{ ...start, history: [start] }];
let dists = new Map(0);
let cache = {};
while (stack.length && false) {
    let { x, y, history } = stack.shift();
    asMap.forAdjacent(x, y, (v, nx, ny) => {
        if (history.find((other) => other.x === nx && other.y === ny)) {
            return;
        }

        // for (let { x, y } of history) {
        //     if (x === nx && y === ny) {
        //         print(dupe);
        //     }
        // }

        let nhistory = [...history];
        insert(nhistory, { x: nx, y: ny })
        switch (v) {
            case '#':
                return;
            case '.':
                break;
            // case '>':
            //     if (nx + 1 === x) return;
            //     nhistory.push({ x: nx + 1, y: ny });
            //     break;
            // case 'v':
            //     if (ny + 1 === y) return;
            //     nhistory.push({ x: nx, y: ny + 1 });
            //     break;
            // case '<':
            //     if (nx - 1 === x) return;
            //     nhistory.push({ x: nx - 1, y: ny });
            //     break;
            // case '^':
            //     if (ny - 1 === y) return;
            //     nhistory.push({ x: nx, y: ny - 1 });
            //     break;
        }

        if (dists.get(nx, ny).length > nhistory.length) {
            return;
        }

        let key = nhistory.map(i => i).map(({ x, y }) => `${x}|${y}`).join(',');
        cache[nhistory.length] = cache[nhistory.length] || {}
        if (cache[nhistory.length][key]) {
            return;
        }

        cache[nhistory.length][key] = true;

        dists.set(nx, ny, nhistory)
        stack.push({ x: nx, y: ny, history: nhistory })
    });
    if (total++ % 10000 === 0) print(stack.length);

    // stack.sort((a, b) => b.history.length - a.history.length)
}

let cache2 = {};

let portals = {};

function ma2x(point, history, psteps, rec) {
    let { x, y } = point;
    let best = 0;
    if (x === end.x && y === end.y) return best;

    let sx = x, sy = y;

    let steps = psteps;
    let portalKey = `${sx},${sy}`;
    if (portals[portalKey]) {
        let { x: ex, y: ey, steps: esteps } = portals[portalKey];
        x = ex;
        y = ey;
        steps += esteps + 1;
        history.set(x, y, true);
    }

    let ssteps = 0;
    let branch = false;
    let nhistory = [];
    let opts = [];
    while (!branch) {
        opts = [];
        asMap.forAdjacent(x, y, (v, nx, ny) => {
            if (v === '#') return;
            if (history.get(nx, ny)) {
                return;
            }

            opts.push({ x: nx, y: ny });
        });

        if (portalKey === '4,5') print(opts);

        if (opts.length === 1) {
            // nhistory.push(opts[0])
            history.set(opts[0].x, opts[0].y, true)
            x = opts[0].x;
            y = opts[0].y;
            ssteps++;
            steps++;
        }
        else {
            break;
        }
    }

    if (x === end.x && y === end.y) {
        return steps;
    }

    if (opts.length === 0) {
        return 0;
    }

    if (!portals[portalKey] && ssteps > 0) {
        print('add portal', x, y, ssteps, opts);
        portals[portalKey] = {
            x, y, steps: ssteps
        }
    }

    // if (total++ % 1000 === 1) print(rec, x, y, steps, psteps, opts);
    opts.forEach(({ x, y }) => {
        let nhist = history.copy();
        nhist.set(x, y, true);
        best = Math.max(best, max({ x, y }, nhist, steps + 1, rec + 1))
    })

    return best;
}

let bb = 0;

function max({ x, y }, map, steps, log) {
    let portalKey = `${x},${y}`;

    if (portals[portalKey]) {
        let { x: ex, y: ey, steps: esteps } = portals[portalKey];
        log.push(`${x},${y} => ${ex},${ey} (${esteps} steps)`)
        x = ex;
        y = ey;
        steps += esteps;
        if (map.get(x, y)) {
            return 0;
        }

        map.set(x, y, true);
    }

    let startX = x;
    let startY = y;
    let prevX = x;
    let prevY = y;
    let ssteps = 0;
    let opts = [];
    while (true) {
        opts = [];
        asMap.forAdjacent(x, y, (v, nx, ny) => {
            if (v === '#') return;
            if (map.get(nx, ny)) {
                return;
            }

            opts.push({ x: nx, y: ny });
        });

        if (opts.length === 1) {
            map.set(opts[0].x, opts[0].y, true)
            prevX = x;
            prevY = y;
            x = opts[0].x;
            y = opts[0].y;
            ssteps++;
            steps++;
        }
        else {
            break;
        }
    }

    if (ssteps > 0) {
        log.push(`force to ${x},${y} (${ssteps} steps)`)
    }
    if (x === end.x && y === end.y) {
        print('ended! steps', bb = Math.max(bb, steps), log)
        return [steps, log];
    }

    if (opts.length === 0) {
        return [0, log];
    }

    if (!portals[portalKey] && ssteps > 0) {
        // print('add portal', x, y, ssteps, opts);
        portals[portalKey] = {
            x: prevX, y: prevY, steps: ssteps - 1
        }

        print('a add portal', portalKey, portals[portalKey]);
        portals[`${prevX},${prevY}`] = {
            x: startX, y: startY, steps: ssteps - 1
        }
        print('b add portal', `${prevX},${prevY}`, portals[`${prevX},${prevY}`]);
    }

    let best = 0;
    let besthist;
    // if (total++ % 1000 === 0)
    // print(log.length, x, y, steps, opts, portals.keys().length);
    opts.forEach(({ x, y }) => {
        let nhist = map.copy();
        nhist.set(x, y, true);
        let [nbest, hist] = max({ x, y }, nhist, steps + 1, [...log]);
        if (nbest > best) {
            best = nbest;
            besthist = hist;
        }
    })

    return [best, besthist];
}


let nodes = {};
let visited = new Map(false);

// let stack = [{...start, prevX: start.x, prevY: start.y}];
// while (stack.length) {
//     let {x, y, prevX, prevY} = stack;

//     while (true) {
//     let opts = []
//     asMap.forAdjacent(x, y, (v, nx, ny) => {
//         if (v === '#') return;
//         opts.push({ x: nx, y: ny });
//     });

//     if (opts.length === 2) {

//     }
// }
// }

function fill(from, { x, y }) {
    let key = `${from.x},${from.y}`;
    if (!nodes[key]) {
        nodes[key] = []
    }

    visited.set(x, y, true);

    let len = 1;
    let opts = []
    while (true) {
        opts = []
        asMap.forAdjacent(x, y, (v, nx, ny) => {
            if (v === '#') return;
            if (visited.get(nx, ny)) return;
            opts.push({ x: nx, y: ny });
        });

        if (opts.length === 1) {
            x = opts[0].x
            y = opts[0].y
            len++;
            visited.set(x, y, true);
        }
        else {
            break;
        }
    }

    let okey = `${x},${y}`;
    if (!nodes[okey]) {
        nodes[okey] = []
    }

    nodes[okey].push([key, len])
    nodes[key].push([okey, len])
    // print(x, y, len);

    opts.forEach((opt) => {
        fill({ x, y }, opt)
    })
}

visited.set(start.x, start.y, true);
fill(start, { x: start.x, y: 1 });

print(nodes);

function part2(steps, node, hist) {
    let best = 0;

    if (node === `${end.x},${end.y}`) {
        return steps;
    }

    if (total++ % 1000000 === 0) print(steps, node, hist.length);
    nodes[node].forEach(([other, len]) => {
        if (hist.includes(other)) return;
        best = Math.max(best, part2(steps + len, other, [...hist, node]));
    })

    return best;
}

print(part2(0, `${start.x},${start.y}`, []))

// print(visited.print())

// print(dists.get(end.x, end.y).length - 1);
// print(dists.get(end.x, end.y).length - 1);

// let m = new Map(false);
// m.set(start.x, start.y, true);
// print(max(start, m, 0, []))
// print(portals);

// let newMap = asMap.map((v, x, y) => v)
// dists.get(end.x, end.y).forEach(({ x, y }, i) => newMap.set(x, y, 'X'))
// print(newMap.print(''))
