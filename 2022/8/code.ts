// @ts-nocheck

import { Map, MapFromInput } from '../../map';
import { Point } from '../../point';
import { makeInt, addAll, range, multiplyAll, Directions } from '../../utils';
const print = console.log;
let trees = MapFromInput(-1, makeInt);

const maxSize = Math.max(trees.max.x, trees.max.y);
const visible = trees.map((tree, x, y) => {
    return range(maxSize).every(d => trees.get(x + d + 1, y) < tree)
        || range(maxSize).every(d => trees.get(x - d - 1, y) < tree)
        || range(maxSize).every(d => trees.get(x, y + d + 1) < tree)
        || range(maxSize).every(d => trees.get(x, y - d - 1) < tree);
});

print('Part 1:', visible.reduce(addAll, 0));

trees.min = trees.min.add(new Point(1, 1));
trees.max = trees.max.sub(new Point(1, 1));
const score = trees.map((tree, x, y) => {
    let parts = range(4).map(() => 1);

    range(maxSize).every(d => trees.contains(x - d - 1, y) && trees.get(x - d - 1, y) < tree && ++parts[0]);
    range(maxSize).every(d => trees.contains(x + d + 1, y) && trees.get(x + d + 1, y) < tree && ++parts[1]);
    range(maxSize).every(d => trees.contains(x, y - d - 1) && trees.get(x, y - d - 1) < tree && ++parts[2]);
    range(maxSize).every(d => trees.contains(x, y + d + 1) && trees.get(x, y + d + 1) < tree && ++parts[3]);
    return parts.reduce(multiplyAll, 1);
});

print('Part 2:', score.reduce((prev, v) => Math.max(prev, v), 0))
