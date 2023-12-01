// @ts-nocheck

import * as fs from 'fs';
import { Interpreter } from '../../interpreter.ts';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, mode, Directions } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString();

let asLines = raw.split('\n').map(line => line);
let asNumbers = raw.split('\n').map(line => parseInt(line));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.split('\n').map(line =>
        line));
let asMap = MapFromInput(' ');
let asNumberMap = MapFromInput(0, makeInt)

let dirs = asLines[asLines.length - 2].split('');

// asMap.max.y -= 2;

let foundSpot = false;
let me = { x: 0, y: 0 };
let map = new Map(' ');
asLines.map(i => i).forEach((line, y) => {
    if (line[0] !== '1') {
        let ents = line.split('');

        for (let x = 0; x < ents.length; x++) {
            let l = ents[x];
            if (l.charCodeAt(0) === 13) continue;
            if (y === 1 && x === 1) print(x + 1, y + 1, l);
            map.set(x + 1, y + 1, l);
            if (!foundSpot && l !== ' ') {
                me = { x: x + 1, y: y + 1 };
                foundSpot = true;
            }
        }
    }
})

const UP = 3;
const RIGHT = 0;
const LEFT = 2;
const DOWN = 1;
function move(dx, dy) {
    let newPos = { ...me };
    newPos.x += dx;
    newPos.y += dy;
    let newDir = direction;
    if (map.get(newPos.x, newPos.y) === ' ') {
        let qx = Math.ceil(me.x / 50) - 1;
        let qy = Math.ceil(me.y / 50) - 1;
        let rx = (me.x - 1) % 50 + 1;
        let ry = (me.y - 1) % 50 + 1;

        //   1122
        //   1122
        //   33
        //   33
        // 4455
        // 4455
        // 66
        // 66
        let shouldBe;
        const Q1 = { x: 1, y: 0 };
        const Q2 = { x: 2, y: 0 };
        const Q3 = { x: 1, y: 1 };
        const Q4 = { x: 0, y: 2 };
        const Q5 = { x: 1, y: 2 };
        const Q6 = { x: 0, y: 3 };
        if (qx === 1 && qy === 0) {
            // Face 1
            if (direction === UP) {
                newPos.x = 1;
                newPos.y = 150 + rx;
                newDir = RIGHT;
                shouldBe = Q6;
            }
            else if (direction === LEFT) {
                newPos.x = 1;
                newPos.y = 100 + (51 - ry);
                newDir = RIGHT;
                shouldBe = Q4;
            }
            else {
                throw `bad dir F1: me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
            }
        }
        else if (qx === 2 && qy === 0) {
            // Face 2
            if (direction === UP) {
                newPos.x = rx;
                newPos.y = 200;
                newDir = UP;
                shouldBe = Q6;
            }
            else if (direction === RIGHT) {
                newPos.x = 100;
                newPos.y = 100 + (51 - ry);
                newDir = LEFT;
                shouldBe = Q5;
            }
            else if (direction === DOWN) {
                newPos.x = 50 + 50;
                newPos.y = 50 + rx;
                newDir = LEFT;
                shouldBe = Q3;
            }
            else {
                throw `bad dir F2: me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
            }
        }
        else if (qx === 1 && qy === 1) {
            // Face 3
            if (direction === LEFT) {
                newPos.x = ry;
                newPos.y = 101;
                newDir = DOWN;
                shouldBe = Q4;
            }
            else if (direction === RIGHT) {
                newPos.x = 100 + ry;
                newPos.y = 50;
                newDir = UP;
                shouldBe = Q2;
            }
            else {
                throw `bad dir F3: me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
            }
        }
        else if (qx === 0 && qy === 2) {
            // Face 4
            if (direction === UP) {
                newPos.x = 51;
                newPos.y = 50 + rx;
                newDir = RIGHT;
                shouldBe = Q3;
            }
            else if (direction === LEFT) {
                newPos.x = 51;
                newPos.y = (51 - ry);
                newDir = RIGHT;
                shouldBe = Q1;
            }
            else {
                throw `bad dir F4: me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
            }
        }
        else if (qx === 1 && qy === 2) {
            // Face 5
            if (direction === RIGHT) {
                newPos.x = 150;
                newPos.y = (51 - ry);
                newDir = LEFT;
                shouldBe = Q2;
            }
            else if (direction === DOWN) {
                newPos.x = 50;
                newPos.y = 150 + rx;
                newDir = LEFT;
                shouldBe = Q6;
            }
            else {
                throw `bad dir F5: me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
            }
        }
        else if (qx === 0 && qy === 3) {
            // Face 6
            if (direction === LEFT) {
                newPos.x = 50 + ry;
                newPos.y = 1;
                newDir = DOWN;
                shouldBe = Q1;
            }
            else if (direction === DOWN) {
                newPos.x = 100 + rx;
                newPos.y = 1;
                newDir = DOWN;
                shouldBe = Q2;
            }
            else if (direction === RIGHT) {
                newPos.x = 50 + ry;
                newPos.y = 150;
                newDir = UP;
                shouldBe = Q5;
            }
            else {
                throw `bad dir F6: me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
            }
        }
        else {
            throw `bad face: ${qx}, ${qy}`;
        }

        let nqx = Math.ceil(newPos.x / 50) - 1;
        let nqy = Math.ceil(newPos.y / 50) - 1;
        if (nqx !== shouldBe.x) {
            throw `bad nqx: ${nqx},${nqy}, should be: ${shouldBe.x},${shouldBe.y} me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
        }

        if (nqy !== shouldBe.y) {
            throw `bad nqy: ${nqy},${nqy}, should be: ${shouldBe.x},${shouldBe.y} me=${me.x},${me.y} dx=${dx},${dy} quad=${qx},${qy} direction=${direction}`;
        }
        /*
        // Face 1
        const { x, y } = newPos;
        if (y < 1 && x >= 51 && x <= 100) {
            // 6
            newPos.x = 1;
            newPos.y = x + 100;
            newDir = RIGHT;
        }
        else if (y <= 50 && x <= 50) {
            // 5
            newPos.x = 1;
            newPos.y = (51 - y) + 100;
            newDir = RIGHT;
        }

        // Face 2
        else if (y < 1 && x > 100) {
            newPos.x = x - 100;
            newPos.y = 200;
            newDir = UP;
        }
        else if (y <= 50 && x > 150) {
            // 4
            newPos.x = 100;
            newPos.y = (51 - y) + 100;
            newDir = LEFT;
        }

        // Face 3
        else if (y <= 100 && x <= 50) {
            // 5
            if (newDir === LEFT) {
                newPos.x = (y - 50);
                newPos.y = 101;
                newDir = DOWN; // Down
            }
            else {
                // 5->3
                newPos.y = 50 + x;
                newPos.x = 51;
                // print(me, newPos, newDir);
                newDir = RIGHT;
                // throw 'stop';
            }
        }
        else if (y <= 100 && x > 100) {
            let ry = y - 50;
            let rx = x - 100;
            if (newDir === RIGHT) {
                // 2
                newPos.y = 50;
                newPos.x = ry + 100;
                newDir = UP; // Up
            }
            else {
                // 3
                newPos.x = 100;
                newPos.y = rx + 50;
                newDir = LEFT;
            }
        }

        // Face 4
        else if (x > 100 && y >= 101 && y <= 150) {
            let ry = y - 100;
            let rx = x - 100;
            // 2
            newDir = LEFT;
            newPos.x = 150;
            newPos.y = 51 - ry;
        }
        else if (x >= 51 && x <= 100 && y >= 151 && y <= 200) {
            let ry = y - 150;
            let rx = x - 50;
            // print(rx, ry);
            if (newDir === RIGHT) {
                // 4
                newPos.y = 150;
                newPos.x = ry + 50;
                newDir = UP; // Up
            }
            else {
                // 6
                newPos.x = 50;
                newPos.y = rx + 150;
                newDir = LEFT;
            }
        }

        // Face 5
        else if (x <= 0 && y <= 150) {
            let ry = y - 100;
            let rx = x - 50;
            newPos.y = 51 - ry;
            newPos.x = 51;
            newDir = RIGHT;
        }

        // Face 6
        else if (x <= 0 && y >= 151) {
            newDir = DOWN;
            newPos.y = 1;
            newPos.x = y - 150 + 50;
        }
        else if (x <= 50 && y > 200) {
            // 2
            newDir = DOWN;
            newPos.y = 1;
            newPos.x = x + 50;
        }
        else {
            print(newPos, newDir);
            throw '??';
        }
        */

        // if (y >= 1 && y < 51) {
        //     if (x < 51) {
        //         newPos.x = 1;
        //         newPos.y = 151 - newPos.y;
        //     }
        //     else {
        //         newPos.y = 151 - newPos.y;
        //         newPos.x = 100;
        //     }
        // }
        // else if (y <= 0) {
        //     if (x <= 100) {
        //         newPos.y = x - 50;
        //         newPos.x = 1;
        //     }
        //     else {

        //     }
        // }
        let { x: mx, y: my } = me;
        let { x: nx, y: ny } = newPos;
        // print({ x: me.x + dx, y: me.y + dy }, newPos, face(me), face(newPos));
    }

    if (map.get(newPos.x, newPos.y) !== '#') {
        me = newPos;
        direction = newDir;
    }
    // if (me.y <= 0) {
    //     print(me, map.get(me.x, me.y) === ' ');
    //     print(map.get(me.x - dx, me.y - dy))
    //     print(bt);
    //     throw 'dsiuag'
    // }

    // if (map.get(me.x, me.y) === '#') {
    //     me.x -= dx;
    //     me.y -= dy;
    //     print('wal', me);
    // }
    // print('end', me, map.get(me.x, me.y));
    if (map.get(me.x, me.y) !== '.') {
        print(dx, dy, me);
        throw 'why';
    }
}

let i = 0;
let accum = '';
let direction = 0;
dirs.push('L');
dirs.push('0');
dirs.push('R');
for (; i < dirs.length; i++) {
    if (dirs[i] === 'L') {
        let num = parseInt(accum);
        accum = '';
        // print('L', num);
        range(num).forEach((n) => {
            let { dx, dy } = Directions[direction];
            move(dx, dy);
            // print(me);
        })
        direction--;
        if (direction < 0) direction += Directions.length;
        // print('move L', dx, dy, num, direction, me)
        let orig = map.get(me.x, me.y);
        map.set(me.x, me.y, 'X');
        // print(map.print());
        map.set(me.x, me.y, orig);
    }
    else if (dirs[i] === 'R') {
        let num = parseInt(accum);
        accum = '';
        // print('R', num);
        // me.x += dx * num;
        // me.y += dy * num;
        // print(me);
        // print(map.get(9, 1));
        // print(map.get(10, 1));
        // print(map.get(11, 1));
        // print(map.get(12, 1));
        // print(map.get(13, 1).charCodeAt(0));
        // print(map.get(14, 1))
        range(num).forEach((n) => {
            let { dx, dy } = Directions[direction];
            move(dx, dy);

            // print(n, me, map.get(me.x, me.y).charCodeAt(0));
        })
        direction = (direction + 1) % Directions.length;
        // print('move', 'R', dx, dy, num, direction, me);
        let orig = map.get(me.x, me.y);
        map.set(me.x, me.y, 'X');
        // print(map.print());
        // print(map.min, map.get(me.x, me.y));
        map.set(me.x, me.y, orig);
        // break;
    }
    else {
        accum += dirs[i];
    }

    // print(dirs[i]);
}

print(me, direction, me.y * 1000 + 4 * me.x + direction);
// print(map.print());
