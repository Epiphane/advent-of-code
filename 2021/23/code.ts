import * as fs from 'fs';
import { Map, MapFromInput } from '../../map';
import { permute, gcd, lcm, makeInt, range, id } from '../../utils';
import { question } from 'readline-sync';
const md5 = require('../../md5');
const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let asLines = raw.split('\n');
let asNumbers = raw.split('\n').map(line => parseInt(line.trim()));
let asGroups = raw.split(/\r?\n\r?\n/).map(line =>
    line.trim().split('\n').map(line =>
        line.trim()));
let asMap = MapFromInput('.');
let asNumberMap = MapFromInput(0, makeInt)

const energy = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
};

class State {
    rooms: [string, string, string, string][] = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
    ];

    // Room 0 goes to hall[2]
    // Room 1 goes to hall[4]
    // Room 2 goes to hall[6]
    // Room 3 goes to hall[8]
    hall: string[] = range(11).map(() => '.');

    serialize() {
        return this.rooms.map(r => r.join()).join() + `|` + this.hall.join();
    }

    sorted() {
        return this.rooms[0].filter(i => i === 'A').length === 4 &&
            this.rooms[1].filter(i => i === 'B').length === 4 &&
            this.rooms[2].filter(i => i === 'C').length === 4 &&
            this.rooms[3].filter(i => i === 'D').length === 4;
    }

    clone() {
        const state = new State();
        state.rooms = this.rooms.map(r => r.map(id)) as [string, string, string, string][];
        state.hall = this.hall.map(id);
        state.spent = this.spent;
        return state;
    }

    possibilities() {
        if (this.rooms[0][0] !== 'A' && this.rooms[0][0] !== '.') {

        }
    }

    spent = 0;

    points() {
        return this.rooms[0].filter(i => i === 'A').length +
            this.rooms[1].filter(i => i === 'B').length +
            this.rooms[2].filter(i => i === 'C').length +
            this.rooms[3].filter(i => i === 'D').length;
    }

    dist() {
        let dist = 0;
        this.hall.forEach((occ, i) => {
            if (occ === '.') return;


        })
    }

    toString() {
        return `(${this.spent})
#############
#${this.hall.join('')}#
###${this.rooms[0][0]}#${this.rooms[1][0]}#${this.rooms[2][0]}#${this.rooms[3][0]}###
  #${this.rooms[0][1]}#${this.rooms[1][1]}#${this.rooms[2][1]}#${this.rooms[3][1]}#
  #${this.rooms[0][2]}#${this.rooms[1][2]}#${this.rooms[2][2]}#${this.rooms[3][2]}#
  #${this.rooms[0][3]}#${this.rooms[1][3]}#${this.rooms[2][3]}#${this.rooms[3][3]}#
  #########
`;
    }
}

let best = Infinity;

const calculating: { [key: string]: boolean } = {};

const initial = new State();
initial.rooms[0][0] = asLines[2][3];
initial.rooms[0][1] = asLines[3][3];
initial.rooms[0][2] = asLines[4][3];
initial.rooms[0][3] = asLines[5][3];

initial.rooms[1][0] = asLines[2][5];
initial.rooms[1][1] = asLines[3][5];
initial.rooms[1][2] = asLines[4][5];
initial.rooms[1][3] = asLines[5][5];

initial.rooms[2][0] = asLines[2][7];
initial.rooms[2][1] = asLines[3][7];
initial.rooms[2][2] = asLines[4][7];
initial.rooms[2][3] = asLines[5][7];

initial.rooms[3][0] = asLines[2][9];
initial.rooms[3][1] = asLines[3][9];
initial.rooms[3][2] = asLines[4][9];
initial.rooms[3][3] = asLines[5][9];

console.log(initial.toString());

const cache: { [key: string]: number } = {};

let queue: State[] = [initial];
function TryAddQueue(state: State) {
    const serial = state.serialize();
    if (cache[serial] && cache[serial] <= state.spent) {
        return;
    }

    cache[serial] = state.spent;
    if (isNaN(state.spent) || state.spent < 0) {
        console.trace();
        throw 'a';
    }
    const st = state.toString();
    if (st.indexOf('A') < 0 || st.indexOf('B') < 0 || st.indexOf('C') < 0 || st.indexOf('D') < 0) {
        console.log(st);
        console.trace();
        throw 'b';
    }
    // console.log(state.toString());
    queue.push(state);
}

// console.log(initial.toString());
// console.log(initial.rooms[1].filter(i => i !== '.' && i !== 'B'));

let i__ = 0;

let int = setInterval(() => {
    console.log(i__, 'queue', queue.length, curState.toString());
}, 500)

let curState = queue[0];
while (queue.length > 0) {
    const state = queue.shift();
    curState = state;

    i__++
    // if (i__ % 100 === 0) {
    if (i__ === 47001) console.log(i__, 'queue', queue.length, state.toString());
    // console.log(state.toString());
    // }

    // console.log(state.toString());

    if (state.sorted()) {
        console.log(state.spent);
        // console.log(state.toString());
        best = Math.min(best, state.spent);
        console.log(best);
        continue;
    }

    if (state.spent > best) {
        continue;
    }

    // const serialized = state.serialize();
    // if (cache[serialized]) {
    //     return cache[serialized];
    // }

    // if (state.sorted()) {
    //     return cache[serialized] = 0;
    // }

    // Don't redo
    // if (calculating[serialized]) {
    //     return Infinity;
    // }

    // Get out of the depths
    const Occupant = ['A', 'B', 'C', 'D']
    const RoomOpen =
        state.rooms.map((room, r) => room.filter(i => !['.', Occupant[r]].includes(i)).length === 0);

    RoomOpen.forEach((isOpen, roomNum) => {
        if (isOpen) {
            return;
        }

        const room = state.rooms[roomNum];

        for (let i = 0; i < room.length; i++) {
            if (room[i] === '.') {
                continue;
            }

            const exitDist = i + 1;
            const door = 2 * (roomNum + 1);
            [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                if (hall < door) {
                    for (let i = hall; i <= door; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[roomNum][i];
                    option.rooms[roomNum][i] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (door - hall + exitDist);
                    TryAddQueue(option);
                }
                else {
                    for (let i = door; i <= hall; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[roomNum][i];
                    option.rooms[roomNum][i] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (hall - door + exitDist);
                    TryAddQueue(option);
                }
            });

            break;
        }
    })

    if (i__ === 47001) console.log('a');

    /*
    if (!RoomOpen[0])
        if (state.rooms[0][0] !== '.' && (state.rooms[0][0] !== 'A' || state.rooms[0][1] !== 'A')) {
            const door = 2;
            [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                if (hall < door) {
                    for (let i = hall; i <= door; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    // console.log('---');
                    // console.log(state.toString(), option.toString());
                    const occupant = option.rooms[0][0];
                    option.rooms[0][0] = '.';
                    option.hall[hall] = occupant;
                    // for (let i = hall; i <= door; i++) {
                    // console.log(i, state.hall[i]);
                    // }
                    // console.log(occupant, hall, option.toString());
                    // console.log('---');
                    option.spent += energy[occupant] * (door - hall + 1 )
                    TryAddQueue(option);
                }
                else {
                    for (let i = door; i <= hall; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[0][0];
                    option.rooms[0][0] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (hall - door + 1 )
                    TryAddQueue(option);
                }
            });
        }
    if (state.rooms[0][1] !== '.' && state.rooms[0][1] !== 'A') {
        if (state.rooms[0][0] === '.') {
            const door = 2;
            [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                if (hall < door) {
                    for (let i = hall; i <= door; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[0][1];
                    option.rooms[0][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (door - hall + 2 )
                    TryAddQueue(option);
                }
                else {
                    for (let i = door; i <= hall; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[0][1];
                    option.rooms[0][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (hall - door + 2 )
                    TryAddQueue(option);
                }
            });
        }
    }

    // Room 2
    if (state.rooms[1][0] !== '.' && (state.rooms[1][0] !== 'B' || state.rooms[1][1] !== 'B')) {
        const door = 4;
        [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
            if (hall < door) {
                for (let i = hall; i <= door; i++) {
                    if (state.hall[i] !== '.') {
                        return;
                    }
                }

                // option!
                const option = state.clone();
                const occupant = option.rooms[1][0];
                option.rooms[1][0] = '.';
                option.hall[hall] = occupant;
                option.spent += energy[occupant] * (door - hall + 1 )
                TryAddQueue(option);
            }
            else {
                for (let i = door; i <= hall; i++) {
                    if (state.hall[i] !== '.') {
                        return;
                    }
                }

                // option!
                const option = state.clone();
                const occupant = option.rooms[1][0];
                option.rooms[1][0] = '.';
                option.hall[hall] = occupant;
                option.spent += energy[occupant] * (hall - door + 1 )
                TryAddQueue(option);
            }
        });
    }
    if (state.rooms[1][1] !== '.' && state.rooms[1][1] !== 'B') {
        if (state.rooms[1][0] === '.') {
            const door = 4;
            [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                if (hall < door) {
                    for (let i = hall; i <= door; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[1][1];
                    option.rooms[1][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (door - hall + 2 )
                    TryAddQueue(option);
                }
                else {
                    for (let i = door; i <= hall; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[1][1];
                    option.rooms[1][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (hall - door + 2 )
                    TryAddQueue(option);
                }
            });
        }
    }

    // Room 3
    if (state.rooms[2][0] !== '.' && (state.rooms[2][0] !== 'C' || state.rooms[2][1] !== 'C')) {
        const door = 6;
        [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
            if (hall < door) {
                for (let i = hall; i <= door; i++) {
                    if (state.hall[i] !== '.') {
                        return;
                    }
                }

                // option!
                const option = state.clone();
                const occupant = option.rooms[2][0];
                option.rooms[2][0] = '.';
                option.hall[hall] = occupant;
                option.spent += energy[occupant] * (door - hall + 1 )
                TryAddQueue(option);
            }
            else {
                for (let i = door; i <= hall; i++) {
                    if (state.hall[i] !== '.') {
                        return;
                    }
                }

                // option!
                const option = state.clone();
                const occupant = option.rooms[2][0];
                option.rooms[2][0] = '.';
                option.hall[hall] = occupant;
                option.spent += energy[occupant] * (hall - door + 1 )
                TryAddQueue(option);
            }
        });
    }
    if (state.rooms[2][1] !== '.' && state.rooms[2][1] !== 'C') {
        if (state.rooms[2][0] === '.') {
            const door = 6;
            [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                if (hall < door) {
                    for (let i = hall; i <= door; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[2][1];
                    option.rooms[2][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (door - hall + 2 )
                    TryAddQueue(option);
                }
                else {
                    for (let i = door; i <= hall; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[2][1];
                    option.rooms[2][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (hall - door + 2 )
                    TryAddQueue(option);
                }
            });
        }
    }

    // Room 4
    if (state.rooms[3][0] !== '.' && (state.rooms[3][0] !== 'D' || state.rooms[3][1] !== 'D')) {
        const door = 8;
        [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
            if (hall < door) {
                for (let i = hall; i <= door; i++) {
                    if (state.hall[i] !== '.') {
                        return;
                    }
                }

                // option!
                const option = state.clone();
                const occupant = option.rooms[3][0];
                option.rooms[3][0] = '.';
                option.hall[hall] = occupant;
                option.spent += energy[occupant] * (door - hall + 1 )
                TryAddQueue(option);
            }
            else {
                for (let i = door; i <= hall; i++) {
                    if (state.hall[i] !== '.') {
                        return;
                    }
                }

                // option!
                const option = state.clone();
                const occupant = option.rooms[3][0];
                option.rooms[3][0] = '.';
                option.hall[hall] = occupant;
                option.spent += energy[occupant] * (hall - door + 1 )
                TryAddQueue(option);
            }
        });
    }
    if (state.rooms[3][1] !== '.' && state.rooms[3][1] !== 'D') {
        if (state.rooms[3][0] === '.') {
            const door = 8;
            [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                if (hall < door) {
                    for (let i = hall; i <= door; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[3][1];
                    option.rooms[3][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (door - hall + 2 )
                    TryAddQueue(option);
                }
                else {
                    for (let i = door; i <= hall; i++) {
                        if (state.hall[i] !== '.') {
                            return;
                        }
                    }

                    // option!
                    const option = state.clone();
                    const occupant = option.rooms[3][1];
                    option.rooms[3][1] = '.';
                    option.hall[hall] = occupant;
                    option.spent += energy[occupant] * (hall - door + 2 )
                    TryAddQueue(option);
                }
            });
        }
    }
    */
    if (i__ === 47001) console.log('b');

    // Hallways
    state.hall.forEach((occupant, hall) => {
        if (i__ === 47001) console.log('b2', occupant, hall);
        if (occupant === '.') return;

        let accessible = state.hall.map((_, i) => false);
        for (let i = hall - 1; i >= 0; i--) {
            if (state.hall[i] === '.') {
                accessible[i] = true;
            }
            else {
                break;
            }
        }
        for (let i = hall + 1; i < state.hall.length; i++) {
            if (state.hall[i] === '.') {
                accessible[i] = true;
            }
            else {
                break;
            }
        }

        // Room 1?
        const myRoom = Occupant.indexOf(occupant);
        if (i__ === 47001) console.log('b3', occupant, hall, myRoom, RoomOpen);
        if (RoomOpen[myRoom]) {
            const myDoor = 2 * (myRoom + 1);

            if (accessible[myDoor]) {
                for (let d = state.rooms[myRoom].length - 1; d >= 0; d--) {
                    if (state.rooms[myRoom][d] !== '.') {
                        continue;
                    }

                    // console.log
                    // Move in
                    const distToEnter = (Math.abs(hall - myDoor) + d + 1);
                    // option!
                    const option = state.clone();
                    option.rooms[myRoom][d] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * distToEnter;
                    TryAddQueue(option);
                    break;
                }

                /*

                if (state.rooms[0][1] === '.') {
                    // option!
                    const option = state.clone();
                    option.rooms[0][1] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 2) + 2)
                    TryAddQueue(option);
                }
                else {

                    // option!
                    const option = state.clone();
                    option.rooms[0][0] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 2) + 1)
                    TryAddQueue(option);
                }
                */
            }
        }

        /*
        if (occupant === 'A' && state.rooms[0].filter(i => i !== '.' && i !== 'A').length === 0) {
            if (accessible[2] && state.rooms[0][0] === '.') {

                if (state.rooms[0][1] === '.') {
                    // option!
                    const option = state.clone();
                    option.rooms[0][1] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 2) + 2)
                    TryAddQueue(option);
                }
                else {

                    // option!
                    const option = state.clone();
                    option.rooms[0][0] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 2) + 1)
                    TryAddQueue(option);
                }
            }
        }

        // Room 2?
        if (occupant === 'B' && state.rooms[1].filter(i => i !== '.' && i !== 'B').length === 0) {
            if (accessible[4] && state.rooms[1][0] === '.') {

                if (state.rooms[1][1] === '.') {
                    // option!
                    const option = state.clone();
                    option.rooms[1][1] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 4) + 2)
                    TryAddQueue(option);
                }
                else {

                    // option!
                    const option = state.clone();
                    option.rooms[1][0] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 4) + 1)
                    TryAddQueue(option);
                }
            }
        }

        // Room 3?
        if (occupant === 'C' && state.rooms[2].filter(i => i !== '.' && i !== 'C').length === 0) {
            if (accessible[6] && state.rooms[2][0] === '.') {

                if (state.rooms[2][1] === '.') {
                    // option!
                    const option = state.clone();
                    option.rooms[2][1] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 6) + 2)
                    TryAddQueue(option);
                }
                else {

                    // option!
                    const option = state.clone();
                    option.rooms[2][0] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 6) + 1)
                    TryAddQueue(option);
                }
            }
        }

        // Room 4?
        if (occupant === 'D' && state.rooms[3].filter(i => i !== '.' && i !== 'D').length === 0) {
            if (accessible[8] && state.rooms[3][0] === '.') {

                if (state.rooms[3][1] === '.') {
                    // option!
                    const option = state.clone();
                    option.rooms[3][1] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 8) + 2)
                    TryAddQueue(option);
                }
                else {
                    // option!
                    const option = state.clone();
                    option.rooms[3][0] = occupant;
                    option.hall[hall] = '.';
                    option.spent += energy[occupant] * (Math.abs(hall - 8) + 1)
                    TryAddQueue(option);
                }
            }
        }
        */
    })

    if (i__ === 47001) console.log('c');
    if (i__ % 1000 === 0) {
        queue.sort((a, b) => {
            const ap = a.points();
            const bp = b.points();
            if (ap !== bp) {
                return bp - ap;
            }

            return a.spent - b.spent
        });
    }
    // console.log('---');
    // console.log(queue[0].toString(), queue[1].toString());
    // console.log('---');
    // }
    // console.log('q');
    // console.log(queue.map(i => i.toString()).join('\n'));
    // break;
}

// calculating[serialized] = false;

// return cache[serialized] = best;
// }
clearInterval(int);

console.log(best);
