import * as fs from 'fs';
import { makeInt, range } from '../../utils';

const file = process.argv[2] || 'input';
const raw = fs.readFileSync(file + '.txt').toString().trim();
const initialSpots = raw.split('\n')
    .map(line => line.match(/position: (\d+)/)[1])
    .map(makeInt)
    .map(pos => pos - 1);

let Part1Rolls = 0;
function RollPart1() {
    return (Part1Rolls++ % 100) + 1;
}

function TakeTurnPart1(turn: number, positions: number[], scores: number[]) {
    positions[turn] = (positions[turn] + RollPart1() + RollPart1() + RollPart1()) % 10;
    scores[turn] += positions[turn] + 1;
    return scores[turn] < 1000;
}

function PlayGamePart1(initial: number[]) {
    const positions = [...initial];
    const scores = [0, 0];
    let turn = 0;
    Part1Rolls = 0;
    while (TakeTurnPart1(turn, positions, scores)) {
        turn = 1 - turn;
    }

    return Part1Rolls * scores[1 - turn];
}

console.log(`Part 1`, PlayGamePart1(initialSpots));

// Map from (# rolled) to (# ways to roll it). For example,
// universes[4] = 3 because 1,1,2, 1,2,1, 2,1,1 can all make 4.
const universes = [0, 0, 0, 1, 3, 6, 7, 6, 3, 1,]

function encode(spots: number[], score: number[], turn: number) {
    return [...spots, ...score, turn].join(',');
}

const results = {} as { [key: string]: number[] };
function TakeTurnPart2(turn: number, positions: number[], scores: number[]) {
    const encoded = encode(positions, scores, turn);

    if (results[encoded]) {
        return results[encoded];
    }

    return results[encoded] = universes.reduce((result: number[], times, value) => {
        if (times === 0) return result;

        let newPositions = [...positions];
        let newScore = [...scores];
        newPositions[turn] = (newPositions[turn] + value) % 10;
        newScore[turn] += (newPositions[turn] + 1);

        if (newScore[turn] >= 21) {
            result[turn] += times;
        }
        else {
            TakeTurnPart2(1 - turn, newPositions, newScore).forEach((val, i) =>
                result[i] += times * val
            );
        }

        return result;
    }, [0, 0]);
}

console.log(`Part 2`, Math.max(...TakeTurnPart2(0, initialSpots, [0, 0])));
