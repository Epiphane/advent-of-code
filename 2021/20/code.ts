import * as fs from 'fs';
import { Map, MapFromString } from '../../map';
import { Point } from '../../point';
import { addAll, range } from '../../utils';

const file = process.argv[2] || 'input';
const raw = fs.readFileSync(file + '.txt').toString().trim();
const groups = raw.split(/\r?\n\r?\n/).map(line => line.trim());

const ToNumber = (v: string) => ['.', '#'].indexOf(v);
const lookup = groups[0].split('').map(ToNumber);
const inputImage = MapFromString(groups[1]).map(ToNumber);

const isFlipping = (lookup[0] === 1);
if (isFlipping && lookup[511] === 1) {
    throw 'Bad input ya jangus';
}

function enhance(img: Map<number>) {
    const image = new Map(isFlipping ? 1 - img.defaultValue : img.defaultValue);
    image.min = img.min.sub(new Point(1, 1));
    image.max = img.max.add(new Point(1, 1));
    image.forEach((_, x, y) => {
        image.set(x, y, lookup[parseInt([
            img.get(x - 1, y - 1),
            img.get(x + 0, y - 1),
            img.get(x + 1, y - 1),
            img.get(x - 1, y + 0),
            img.get(x + 0, y + 0),
            img.get(x + 1, y + 0),
            img.get(x - 1, y + 1),
            img.get(x + 0, y + 1),
            img.get(x + 1, y + 1),
        ].join(''), 2)]);
    }, true)

    return image;
}

let image = new Map(0);
inputImage.forEach((v, x, y) => image.set(x, y, v));

range(2).forEach(() => image = enhance(image));
console.log(`Part 1`, image.reduce(addAll, 0));

range(48).forEach(() => image = enhance(image));
console.log(`Part 2`, image.reduce(addAll, 0));
