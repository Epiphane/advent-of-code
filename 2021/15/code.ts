import { Map, MapFromInput } from '../../map';
import { makeInt, range } from '../../utils';

const part1 = MapFromInput(0, makeInt);
const part2 = new Map(0);
part1.forEach((val, x, y) => {
    range(5).forEach(dx =>
        range(5).forEach(dy =>
            part2.set(
                x + part1.max.x * dx,
                y + part1.max.y * dy,
                (val + dx + dy - 1) % 9 + 1
            )
        )
    )
});

function calculateRisk(map: Map<number>) {
    const best = new Map(Infinity);
    const queue = [
        { x: 0, y: 0, risk: 0 }
    ];

    for (; ;) {
        const { x, y, risk } = queue.shift();

        if (x === map.max.x - 1 && y === map.max.y - 1) {
            return risk;
        }

        map.forAdjacent(x, y, (newRisk, x, y) => {
            const currentBest = best.get(x, y);
            if (risk + newRisk < currentBest) {
                best.set(x, y, risk + newRisk)
                queue.push({ x, y, risk: risk + newRisk })
            }
        })

        queue.sort((a, b) => {
            return (a.risk - b.risk)
        })
    }
}

console.log(`Part 1:`, calculateRisk(part1));
console.log(`Part 2:`, calculateRisk(part2));
