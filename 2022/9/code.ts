// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { Point } from '../../point';
import { permute, gcd, lcm, makeInt, range, mode, addAll } from '../../utils';
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

let visited = new Map(0);
let nodes = range(10).map(() => { return new Point(0, 0) });
const head = nodes[0];

function follow(node, parent) {
    if (node.x === parent.x) {
        let dy = parent.y - node.y;
        if (Math.abs(dy) > 1) {
            node.y += Math.sign(dy);
        }
    }
    else if (node.y === parent.y) {
        let dx = parent.x - node.x;
        if (Math.abs(dx) > 1) {
            node.x += Math.sign(dx);
        }
    }
    else {
        // diag
        let dx = parent.x - node.x;
        let dy = parent.y - node.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            node.x += Math.sign(dx);
            node.y += Math.sign(dy);
        }
    }
}

asLines.forEach(line => {
    let [dir, count] = line.split(' ');
    count = parseInt(count);

    range(count).forEach(() => {
        switch (dir) {
            case 'U':
                head.y--;
                break;
            case 'D':
                head.y++;
                break;
            case 'L':
                head.x--;
                break;
            case 'R':
                head.x++;
                break;
        }

        nodes.forEach((node, i) => {
            if (i === 0) return;

            follow(node, nodes[i - 1]);
            if (i === 9) visited.set(node.x, node.y, 1);
        })
    });
})

print(visited.reduce(addAll, 0));
