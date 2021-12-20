import * as fs from 'fs';
import { id, makeInt, range } from '../../utils';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));

class Point {
    constructor(
        public x: number,
        public y: number,
        public z: number) {
    }

    sub(other: Point) {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    reorient(orientation: number) {
        switch (orientation) {
            case 0: return new Point(this.x, this.y, this.z);
            case 1: return new Point(this.x, this.z, -this.y);
            case 2: return new Point(this.x, -this.y, -this.z);
            case 3: return new Point(this.x, -this.z, this.y);

            case 4: return new Point(-this.x, this.z, this.y);
            case 5: return new Point(-this.x, this.y, -this.z);
            case 6: return new Point(-this.x, -this.z, -this.y);
            case 7: return new Point(-this.x, -this.y, this.z);

            case 8: return new Point(this.y, -this.x, this.z);
            case 9: return new Point(this.y, -this.z, -this.x);
            case 10: return new Point(this.y, this.x, -this.z);
            case 11: return new Point(this.y, this.z, this.x);

            case 12: return new Point(-this.y, -this.z, this.x);
            case 13: return new Point(-this.y, -this.x, -this.z);
            case 14: return new Point(-this.y, this.z, -this.x);
            case 15: return new Point(-this.y, this.x, this.z);

            case 16: return new Point(this.z, this.y, -this.x);
            case 17: return new Point(this.z, -this.x, -this.y);
            case 18: return new Point(this.z, -this.y, this.x);
            case 19: return new Point(this.z, this.x, this.y);

            case 20: return new Point(-this.z, this.x, -this.y);
            case 21: return new Point(-this.z, -this.y, -this.x);
            case 22: return new Point(-this.z, -this.x, this.y);
            case 23: return new Point(-this.z, this.y, this.x);
        }
    }
}

class Scanner {
    id: number;
    pos?: Point;
    reoriented: Point[][] = [];
}

const scanners = [] as Scanner[];

asGroups.forEach(input => {
    const scanner = new Scanner;
    const beacons = input.slice(1).map(line => {
        return new Point(...line.split(',').map(makeInt) as [number, number, number]);
    })

    scanner.id = scanners.length;

    range(24).forEach(orientation =>
        scanner.reoriented.push(
            beacons.map(
                point => point.reorient(orientation)
            )
        )
    );

    scanners.push(scanner);
});

const exists = {} as { [key: string]: boolean };

function FindTranslation(base: Point[], options: Point[]) {
    for (let i = 0; i < base.length; i++) {
        const baseOrigin = base[i];

        for (let j = 0; j < options.length; j++) {
            const optionOrigin = options[j];
            const offset = baseOrigin.sub(optionOrigin);

            let matches = 0;
            for (let z = 0; z < options.length; z++) {
                const point = options[z].add(offset);
                if (exists[point.x ^ point.y ^ point.z]) {
                    if (++matches >= 12) {
                        return offset;
                    }
                }
            }
        }
    }
}

// Use the 0th scanner as a frame of reference.
scanners[0].pos = new Point(0, 0, 0);
scanners[0].reoriented[0].forEach(({ x, y, z }) => exists[x ^ y ^ z] = true);
const beacons = scanners[0].reoriented[0].map(id);

let remaining = scanners.filter(scanner => !scanner.pos);
while (remaining.length > 0) {
    remaining.forEach(scanner => {
        const matches = scanner.reoriented.find(positions => FindTranslation(beacons, positions))
        if (matches) {
            scanner.pos = FindTranslation(beacons, matches);
            matches
                .map(point => point.add(scanner.pos))
                .filter(point => !beacons.find(b => b.equals(point)))
                .forEach(point => {
                    beacons.push(point)
                    exists[point.x ^ point.y ^ point.z] = true;
                });
        }
    })
    remaining = scanners.filter(scanner => !scanner.pos);
}

console.log(`Part 1`, beacons.length);
console.log(`Part 2`, Math.max(
    ...scanners.map(scannerA =>
        Math.max(
            ...scanners.map(scannerB => {
                const dist = scannerB.pos.sub(scannerA.pos);
                return Math.abs(dist.x) + Math.abs(dist.y) + Math.abs(dist.z);
            })
        )
    )
));
