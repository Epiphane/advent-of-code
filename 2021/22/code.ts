import * as fs from 'fs';
import { Point } from '../../point';

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();
let asLines = raw.split('\n').map(line => line.trim());

class Block {
    constructor(
        public on: boolean,
        public min: Point,
        public max: Point,
    ) { }

    area() {
        return this.max.sub(this.min).area();
    }

    copy() {
        return new Block(this.on, this.min.copy(), this.max.copy());
    }
}

const input = asLines.map(line => {
    const [_, dir, x0, x1, y0, y1, z0, z1] = line
        .match(/(\w+) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/);

    return new Block(
        dir === 'on',
        new Point(x0, y0, z0),
        new Point(x1, y1, z1).add(new Point(1, 1, 1)),
    );
});

function CalculateLitArea(blocks: Block[]) {
    const disjoint: Block[] = [];

    blocks.forEach(block => {
        block = block.copy();

        for (let i = 0; i < disjoint.length; i++) {
            const other = disjoint[i];

            if (other.max.x < block.min.x ||
                other.min.x > block.max.x ||
                other.max.y < block.min.y ||
                other.min.y > block.max.y ||
                other.max.z < block.min.z ||
                other.min.z > block.max.z) {
                continue;
            }

            // Split up overlaps
            ['x', 'y', 'z'].forEach(c => {
                if (other.min[c] < block.min[c] && block.min[c] < other.max[c]) {
                    const split = other.copy();
                    split.min[c] = other.max[c] = block.min[c];
                    disjoint.push(split);
                }

                if (other.min[c] < block.max[c] && block.max[c] < other.max[c]) {
                    const split = other.copy();
                    split.max[c] = other.min[c] = block.max[c];
                    disjoint.push(split);
                }
            });

            // Consume this block if it's redundant
            if (block.max.x >= other.max.x &&
                block.max.y >= other.max.y &&
                block.max.z >= other.max.z &&
                block.min.x <= other.min.x &&
                block.min.y <= other.min.y &&
                block.min.z <= other.min.z) {
                disjoint.splice(i--, 1);
            }
        }

        disjoint.push(block);
    });

    return disjoint.filter(block => block.on).reduce((prev, block) => prev + block.area(), 0);
}

// Stupid funny solution: turn off everything that's outside -50,-50,-50
const min = new Point(
    Math.min(...input.map(b => b.min.x)),
    Math.min(...input.map(b => b.min.y)),
    Math.min(...input.map(b => b.min.z))
);
const max = new Point(
    Math.max(...input.map(b => b.max.x)),
    Math.max(...input.map(b => b.max.y)),
    Math.max(...input.map(b => b.max.z))
);
console.log(`Part 1:`, CalculateLitArea(input.concat([
    new Block(false, new Point(50, min.y, min.z), new Point(max.x, max.y, max.z)),
    new Block(false, new Point(min.x, 50, min.z), new Point(max.x, max.y, max.z)),
    new Block(false, new Point(min.x, min.y, 50), new Point(max.x, max.y, max.z)),
    new Block(false, new Point(min.x, min.y, min.z), new Point(-50, max.y, max.z)),
    new Block(false, new Point(min.x, min.y, min.z), new Point(max.x, -50, max.z)),
    new Block(false, new Point(min.x, min.y, min.z), new Point(max.x, max.y, -50)),
])));
console.log(`Part 2:`, CalculateLitArea(input));
