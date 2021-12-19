import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, id } from '../../utils';
import { question } from 'readline-sync';
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

class Point {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) { }

    sub(other: Point) {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
}

// class SuperMap {
//     points: 
// }

class Scanner {
    pos?: Point;
    beacons: Point[] = [];

    // p1: number[];
    // p2: number[];
    // p3: number[];
    // p4: number[];
    // p5: number[];
    // p6: number[];

    reorient: Point[][] = [];
}

const scanners = [] as Scanner[];

const psort = (p1: Point, p2: Point) => {
    if (p1.x !== p2.x) return p1.x - p2.x;
    if (p1.y !== p2.y) return p1.y - p2.y;
    return p1.z - p2.z;
}

asGroups.forEach(beacon => {
    const id = parseInt(beacon.splice(0, 1)[0].substr(12));

    const scanner = new Scanner;
    beacon.forEach(line => {
        const [x, y, z] = line.split(',').map(makeInt);
        scanner.beacons.push(new Point(x, y, z));
    })

    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(x, y, z)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(x, z, -y)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(x, -y, -z)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(x, -z, y)).sort(psort));

    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-x, z, y)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-x, y, -z)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-x, -z, -y)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-x, -y, z)).sort(psort));

    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(y, -x, z)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(y, -z, -x)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(y, x, -z)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(y, z, x)).sort(psort));

    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-y, -z, x)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-y, -x, -z)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-y, z, -x)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-y, x, z)).sort(psort));

    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(z, y, -x)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(z, -x, -y)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(z, -y, x)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(z, x, y)).sort(psort));

    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-z, x, -y)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-z, -y, -x)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-z, -x, y)).sort(psort));
    scanner.reorient.push(scanner.beacons.map(({ x, y, z }) => new Point(-z, y, x)).sort(psort));

    scanners[id] = scanner;
});

// function inCommon(points: Point[], points2: Point[]) {
//     return points2.filter(({ x: dx, y: dy, z: dz }) => {
//         return points.filter(({ x, y, z }) => x === dx && y === dy && z === dz).length > 0;
//     });
// }

// function compare(s1: Scanner, s2: Scanner) {
//     const distances = s1.reorient[0].map(({ x, y, z }) => {
//         const { x: ox, y: oy, z: oz } = s1.reorient[0][0];
//         return {
//             x: x - ox,
//             y: y - oy,
//             z: z - oz,
//         };
//     })
//     return s2.reorient.map(points => {
//         const { x: ox, y: oy, z: oz } = points[0];
//         return inCommon(distances, points.map(({ x, y, z }) => {
//             return {
//                 x: x - ox,
//                 y: y - oy,
//                 z: z - oz,
//             };
//         }));
//     });
// }

const matched = scanners.map(() => false);
matched[0] = true;

const beacons = scanners[0].reorient[0].map(p => new Point(p.x, p.y, p.z));
/*
.map(({ x, y, z }) =>
    new Point(x - scanners[0].reorient[0][0].x,
        y - scanners[0].reorient[0][0].y,
        z - scanners[0].reorient[0][0].z
    )
);
*/
beacons.sort(psort);

const scannerPos = scanners.map(() => new Point(0, 0, 0));
while (matched.filter(m => !m).length) {
    let changed = false;
    scanners.forEach((scanner, i) => {
        if (matched[i]) return;

        for (let o = 0; o < scanner.reorient.length; o++) {
            const points = scanner.reorient[o];

            for (let bOrigin = 0; bOrigin < beacons.length; bOrigin++) {
                for (let origin = 0; origin < points.length; origin++) {
                    const offset = points[origin].sub(beacons[bOrigin]);

                    const reframed = points.map(p => p.sub(offset));
                    const inCommon = reframed.filter(pt => beacons.filter(b => b.equals(pt)).length > 0);
                    if (inCommon.length >= 12) {
                        console.log(i, o, bOrigin, origin, inCommon.length);

                        reframed.forEach(pt => {
                            if (beacons.filter(b => b.equals(pt)).length > 0) {
                                return;
                            }

                            beacons.push(new Point(pt.x, pt.y, pt.z));
                        });
                        matched[i] = true;

                        const { x, y, z } = offset;
                        let offset2: Point;
                        switch (o) {
                            case 0: offset2 = new Point(x, y, z); break;
                            case 1: offset2 = new Point(x, z, -y); break;
                            case 2: offset2 = new Point(x, -y, -z); break;
                            case 3: offset2 = new Point(x, -z, y); break;

                            case 4: offset2 = new Point(-x, z, y); break;
                            case 5: offset2 = new Point(-x, y, -z); break;
                            case 6: offset2 = new Point(-x, -z, -y); break;
                            case 7: offset2 = new Point(-x, -y, z); break;

                            case 8: offset2 = new Point(y, -x, z); break;
                            case 9: offset2 = new Point(y, -z, -x); break;
                            case 10: offset2 = new Point(y, x, -z); break;
                            case 11: offset2 = new Point(y, z, x); break;

                            case 12: offset2 = new Point(-y, -z, x); break;
                            case 13: offset2 = new Point(-y, -x, -z); break;
                            case 14: offset2 = new Point(-y, z, -x); break;
                            case 15: offset2 = new Point(-y, x, z); break;

                            case 16: offset2 = new Point(z, y, -x); break;
                            case 17: offset2 = new Point(z, -x, -y); break;
                            case 18: offset2 = new Point(z, -y, x); break;
                            case 19: offset2 = new Point(z, x, y); break;

                            case 20: offset2 = new Point(-z, x, -y); break;
                            case 21: offset2 = new Point(-z, -y, -x); break;
                            case 22: offset2 = new Point(-z, -x, y); break;
                            case 23: offset2 = new Point(-z, y, x); break;
                        }
                        scannerPos[i] = offset2;

                        changed = true;
                        return;
                    }
                }
            }
        }
    })

    if (!changed) {
        console.log('cri');
        break;
    }
    // break;
}

console.log(matched);
console.log(beacons.length);

let max = 0;
for (let i = 0; i < scannerPos.length; i++) {
    for (let j = 0; j < scannerPos.length; j++) {
        const manhat = Math.abs(scannerPos[i].x - scannerPos[j].x) +
            Math.abs(scannerPos[i].y - scannerPos[j].y) +
            Math.abs(scannerPos[i].z - scannerPos[j].z);

        if (manhat > max) {
            max = manhat;
            console.log(i, j, manhat);
        }
    }
}

console.log(max);

// console.log(compare(scanners[0], scanners[13]))

// console.log(scanners[0].reorient[0][0]);
// console.log(
//     inCommon(scanners[13].reorient[1].map(({ x, y, z }) => new Point(x - 41, y + 71, z - 1237)), scanners[0].reorient[0])
// );

/*
scanner 13
facing dir 1 ([x, z, -y])
x = 41
y =
*/

/*
function compare(l1: number[], l2: number[]) {
    let x1 = 0;
    let x2 = 0;

    for (let i = 0; i < l1.length; i++) {
        const element = l1[i];

    }
}

let allprofs = [];
for (let i = 0; i < scanners.length; i++) {
    const element = scanners[i];
    const profiles = [
        element.p1.join(),
        element.p2.join(),
        element.p3.join(),
        element.p4.join(),
        element.p5.join(),
        element.p6.join(),
    ];
    allprofs = allprofs.concat(...profiles.map((p, i2) => `${p}\t\t${i}: ${i2}`));
    // console.log(profiles.join('\n'));
    // console.log('------');
}

allprofs.sort();
// console.log(allprofs.join('\n'))

const bruhs = scanners[0].p2.map((dist, nx) => {
    if (!scanners[13].p2.includes(dist)) {
        return false;
    }
    return nx;
}).filter(i => i !== false);
const bruhs2 = scanners[13].p2.map((dist, nx) => {
    if (!scanners[0].p2.includes(dist)) {
        return false;
    }
    return nx;
}).filter(i => i !== false);

console.log(scanners[0].beacons.filter((_, i) => bruhs.indexOf(i) >= 0))
console.log(scanners[13].beacons.filter((_, i) => bruhs2.indexOf(i) >= 0))

// console.log(scanners)
console.log(bruhs);
// console.log(scanners[13].p2);

// let origin = scanners[0];
// let sb1 = origin.beacons.map(b => [Math.abs(b.x), Math.abs(b.y), Math.abs(b.z)].sort());
// for (let i1 = 1; i1 < scanners.length; i1++) {
//     const other = scanners[i1];

//     let inCommon = 0;
//     let sb2 = other.beacons.map(b => [Math.abs(b.x), Math.abs(b.y), Math.abs(b.z)].sort());

//     sb1.forEach(([x1, y1, z1], n1) => {
//         let found = false;
//         for (let n2 = 0; n2 < sb2.length; n2++) {
//             const [x2, y2, z2] = sb2[n2];
//             if (x1 === x2 && y1 === y2 && z1 === z2) {
//                 console.log(i1, n1, n2, sb1[n1], sb2[n2])
//                 inCommon++;
//                 break;
//             }
//         }
//     })

//     if (inCommon >= 12) {
//         console.log(i1, inCommon);
//     }
// }

*/
