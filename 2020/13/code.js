import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

const log = console.log;
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim())
let input = lines;

let map = new Map('.');

let early = +lines[0];
input = input[1].split(',');
let buses = []
input.forEach((l, i) => {
    if (l === 'x') return;
    buses.push([parseInt(l), i])
})
print(buses);

let times = [];
let first = Math.ceil(early / buses[2][0]);
print(early);

let DELAY = (bus, t) => {
    return bus * Math.ceil(t / bus);
}

// 1361317053288127
let LCM = 1;
buses.forEach(b => {
    LCM = lcm(b[0], LCM);
})
// let LCM = lcm(19, lcm(41, lcm(859, lcm(23, lcm(13, lcm(17, lcm(29, lcm(373, 37))))))));
print('lcm', LCM);

for (let i = 1; ; i++) {
    let time = LCM * i;

    let good = true;
    for (let b = 0; b < buses.length; b++) {
        let t = time + buses[b][1];
        if (t % buses[b][0] !== 0) {
            good = false;
            break;
        }
    }

    if (good) {
        print(i);
        print(time);
        for (let b = 0; b < buses.length; b++) {
            print(buses[b]);
            let t = time + buses[b][1];
            print('->', t)
            print('  ', t / buses[b][0])
            if (t % buses[b][0] !== 0) {
                good = false;
                break;
            }
        }
        break;
    }
}


// let i__ = 0;
// print('hi');
// for (let n = first; ; n++) {
//     let time = n * buses[2][0];
//     let good = true;
//     let t2 = time;
//     let times = buses.map(b => DELAY(b[0], time));
//     // let times2 = times.map(i => i).sort();

//     for (let i = 0; i < buses.length; i++) {
//         if (DELAY(buses[i][0], time) !== time + buses[i][1]) {
//             good = false;
//             break;
//         }
//     }

//     // print('new loop!', n, time);
//     // for (let b = 0; b < buses.length && good; b++) {
//     //     let delay = DELAY(buses[b], t2);
//     //     // print(b, t2, delay);
//     //     for (let d = b + 1; d < buses.length; d++) {
//     //         // print('     ', d, 'delay', DELAY(buses[d], t2));
//     //         if (DELAY(buses[d], t2) < delay) {
//     //             // print('     ', d, 'bad');
//     //             good = false;
//     //             break;
//     //         }
//     //     }
//     //     t2 = delay;
//     //     print(b, delay);
//     // }

//     // print(time);
//     if (i__++ % 1000000 === 0) print(time);
//     if (good) {
//         print(n);
//         print(time);
//         print(times);
//         break;
//     }
// }

// print(early);
// buses.forEach(bus => {
//     print(bus * Math.ceil(early / bus) - early, bus);
// })

// for (let i = early; i !== 0; i++) {
//     buses.forEach(bus => {
//         if (bus % i === 0) {
//             print(bus);
//             i = 0;
//         }
//     })
// }
