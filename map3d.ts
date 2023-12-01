import { Point } from "./point";
import { id } from "./utils";

export class Map3D<T> {
    contents: T[][][] = [];
    min?: Point;
    max?: Point;

    constructor(
        public defaultValue?: T,
        min?: number | Point,
        max?: number | Point
    ) {
        if (typeof (min) === 'number') {
            this.min = new Point(min, min, min);
        }

        if (typeof (max) === 'number') {
            this.max = new Point(max, max, max);
        }
    }

    copy() {
        const result = new Map3D<T>(this.defaultValue, this.min, this.max);
        this.map((v, x, y, z) => result.set(x, y, z, v));
        return result;
    }

    contains(x: number, y: number, z: number) {
        return x >= this.min.x &&
            x < this.max.x &&
            y >= this.min.y &&
            y < this.max.y &&
            z >= this.min.z &&
            z < this.max.z;
    }

    has(x: number, y: number, z: number) {
        return this.contents[z] && this.contents[z].hasOwnProperty(y) && this.contents[z][y].hasOwnProperty(x);
    }

    get(x: number, y: number, z: number) {
        if (!this.has(x, y, z)) {
            return this.defaultValue;
        }

        return this.contents[z][y][x];
    }

    set(x: number, y: number, z: number, value: T) {
        if (!this.min || !this.max) {
            this.min = new Point(x, y, z);
            this.max = new Point(x + 1, y + 1, z + 1);
        }

        this.contents[z] = this.contents[z] || [];
        this.contents[z][y] = this.contents[z][y] || [];
        this.contents[z][y][x] = value;

        if (x < this.min.x) {
            this.min.x = x;
        }
        if (y < this.min.y) {
            this.min.y = y;
        }
        if (z < this.min.z) {
            this.min.z = z;
        }
        if (x + 1 > this.max.x) {
            this.max.x = x + 1;
        }
        if (y + 1 > this.max.y) {
            this.max.y = y + 1;
        }
        if (z + 1 > this.max.z) {
            this.max.z = z + 1;
        }
    }

    map<U>(
        callback: (value: T, x: number, y: number, z: number) => U,
        excludeUndefined = false
    ) {
        let result = new Map3D<U>();
        if (!this.min || !this.max) {
            return result;
        }

        for (let z = this.min.z; z < this.max.z; ++z) {
            if (excludeUndefined && !this.contents[z]) {
                continue;
            }

            for (let y = this.min.y; y < this.max.y; ++y) {
                if (excludeUndefined && !this.contents[z].hasOwnProperty(y)) {
                    continue;
                }

                for (let x = this.min.x; x < this.max.x; ++x) {
                    if (excludeUndefined && !this.contents[z][y].hasOwnProperty(x)) {
                        continue;
                    }

                    result.set(x, y, z, callback(this.get(x, y, z), x, y, z));
                }
            }
        }

        return result;
    }

    print(colDelimiter = "", rowDelimiter = "\n", layerDelimiter = "\n\n") {
        if (!this.min || !this.max) {
            return "";
        }

        let maxSize = 0;
        let layers: string[][][] = [];
        for (let z = this.max.z - 1; z >= this.min.z; --z) {
            let rows = [];
            for (let y = this.min.y; y < this.max.y; ++y) {
                let row = [];
                for (let x = this.min.x; x < this.max.x; ++x) {
                    let val = "";
                    if (this.has(x, y, z)) {
                        val = `${this.get(x, y, z)}`;
                        maxSize = Math.max(maxSize, val.length);
                    }
                    else {
                        val = `${this.defaultValue}`;
                        maxSize = Math.max(maxSize, val.length);
                    }
                    row.push(val);
                }
                rows.push(row);
            }
            layers.push(rows);
        }
        return layers
            .map(rows => rows
                .map(row => row
                    .map(val =>
                        val.padEnd(maxSize))
                    .join(colDelimiter))
                .join(rowDelimiter))
            .join(layerDelimiter);
    }

    clip(minX: number, minY: number, minZ: number, width: number, height: number, depth: number) {
        const result = new Map3D<T>(this.defaultValue);

        for (let z = minZ; z < minZ + depth; ++z) {
            for (let y = minY; y < minY + height; ++y) {
                for (let x = minX; x < minX + width; ++x) {
                    result.set(x, y, z, this.get(x, y, z));
                }
            }
        }

        return result;
    }

    forEach(
        callback: (value: T, x: number, y: number, z: number) => void,
        includeUndefined = false
    ) {
        if (!this.min || !this.max) {
            return;
        }

        for (let z = this.min.z; z < this.max.z; ++z) {
            if (!this.contents[z] && !includeUndefined) {
                continue;
            }

            for (let y = this.min.y; y < this.max.y; ++y) {
                if ((!this.contents[z] || !this.contents[z].hasOwnProperty(y)) && !includeUndefined) {
                    continue;
                }

                for (let x = this.min.x; x < this.max.x; ++x) {
                    if ((!this.contents[z][y] || !this.contents[z][y].hasOwnProperty(x)) && !includeUndefined) {
                        continue;
                    }

                    callback(this.get(x, y, z), x, y, z);
                }
            }
        }
    }

    forAdjacent(
        cx: number,
        cy: number,
        cz: number,
        callback: (value: T, x: number, y: number, z: number) => void,
        dist = 1,
        diagonal = false
    ) {
        if (diagonal) {
            this.forNeighbors(cx, cy, cz, callback, dist);
        }
        else {
            for (let d = 1; d <= dist; d++) {
                if (this.contains(cx - d, cy, cz)) {
                    callback(this.get(cx - d, cy, cz), cx - d, cy, cz);
                }

                if (this.contains(cx + d, cy, cz)) {
                    callback(this.get(cx + d, cy, cz), cx + d, cy, cz);
                }

                if (this.contains(cx, cy - d, cz)) {
                    callback(this.get(cx, cy - d, cz), cx, cy - d, cz);
                }

                if (this.contains(cx, cy + d, cz)) {
                    callback(this.get(cx, cy + d, cz), cx, cy + d, cz);
                }

                if (this.contains(cx, cy, cz - d)) {
                    callback(this.get(cx, cy, cz - d), cx, cy, cz - d);
                }

                if (this.contains(cx, cy, cz + d)) {
                    callback(this.get(cx, cy, cz + d), cx, cy, cz + d);
                }
            }
        }
    }

    forNeighbors(
        cx: number,
        cy: number,
        cz: number,
        callback: (value: T, x: number, y: number, z: number) => void,
        dist = 1,
    ) {
        for (let dx = -dist; dx <= dist; dx++) {
            for (let dy = -dist; dy <= dist; dy++) {
                for (let dz = -dist; dz <= dist; dz++) {
                    if (dx === 0 && dy === 0 && dz === 0) continue;

                    const x = cx + dx;
                    const y = cy + dy;
                    const z = cz + dz;
                    if (this.contains(x, y, z)) {
                        callback(this.get(x, y, z), x, y, z);
                    }
                }
            }
        }
    }

    reduce<U>(
        callback: (current: U, value: T, x: number, y: number, z: number) => U,
        initial: U,
        excludeUndefined?: boolean
    ) {
        let result = initial;
        this.forEach((val, x, y, z) => {
            result = callback(result, val, x, y, z);
        }, excludeUndefined);

        return result;
    }
}

export function MakeMap3D<T>(
    width = 1,
    height = 1,
    depth = 1,
    generator: (x: number, y: number, z: number) => T | undefined = () => undefined,
    defaultElement?: T
) {
    let map = new Map3D(defaultElement);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            for (let z = 0; z < height; z++) {
                map.set(x, y, z, generator(x, y, z));
            }
        }
    }

    return map;
}
