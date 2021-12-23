import { MapFromInput } from '../../map';
import { range, deepCopy, BinaryInsert } from '../../utils';

const energy = [0, 1, 10, 100, 1000];

function toChar(num: number) {
    return ['.', 'A', 'B', 'C', 'D'][num];
}

function fromChar(char: string) {
    return ['.', 'A', 'B', 'C', 'D'].indexOf(char);
}

class State {
    rooms = range(4).map(() => [] as number[]);
    hall = range(11).map(() => 0);
    spent = 0;

    isComplete() {
        return this.rooms.every((room, num) => room.every(occ => occ === num + 1));
    }

    clone() {
        const state = new State();
        state.hall = this.hall.map(deepCopy);
        state.rooms = this.rooms.map(deepCopy);
        state.spent = this.spent;
        return state;
    }

    serialize() {
        let id = 0;
        this.hall.forEach(v => id = id * 5 + v);
        this.rooms.forEach(room => room.forEach(v => id = id * 5 + v));
        return id;
    }

    toString() {
        return [
            `Spent: (${this.spent})`,
            `#############`,
            `#${this.hall.map(toChar).join('')}#`,
            ...this.rooms[0].map((_, depth) => {
                const pad = ['##'][depth] ?? '  ';
                return [pad, ...this.rooms.map(room => toChar(room[depth])), pad].join('#')
            }),
            `  #########`,
        ].join('\n');
    }
}

function solve(initial: State) {
    const best: { [key: string]: number } = {};

    let queue: State[] = [initial];
    function TryAddQueue(state: State) {
        const serial = state.serialize();
        if (best[serial] && best[serial] <= state.spent) {
            return;
        }

        best[serial] = state.spent;
        BinaryInsert(queue, state, 'spent');
    }

    while (queue.length > 0) {
        const state = queue.shift();

        if (state.isComplete()) {
            return state.spent;
        }

        const RoomOpen =
            state.rooms.map((room, num) => room.every(occ => !occ || occ === num + 1));

        RoomOpen.forEach((isOpen, roomNum) => {
            if (isOpen) {
                return;
            }

            const room = state.rooms[roomNum];

            for (let i = 0; i < room.length; i++) {
                if (room[i] === 0) {
                    continue;
                }

                const exitDist = i + 1;
                const door = 2 * (roomNum + 1);
                [0, 1, 3, 5, 7, 9, 10].forEach(hall => {
                    if (hall < door) {
                        for (let i = hall; i <= door; i++) {
                            if (state.hall[i]) {
                                return;
                            }
                        }

                        const option = state.clone();
                        const occupant = option.rooms[roomNum][i];
                        option.rooms[roomNum][i] = 0;
                        option.hall[hall] = occupant;
                        option.spent += energy[occupant] * (door - hall + exitDist);
                        TryAddQueue(option);
                    }
                    else {
                        for (let i = door; i <= hall; i++) {
                            if (state.hall[i]) {
                                return;
                            }
                        }

                        const option = state.clone();
                        const occupant = option.rooms[roomNum][i];
                        option.rooms[roomNum][i] = 0;
                        option.hall[hall] = occupant;
                        option.spent += energy[occupant] * (hall - door + exitDist);
                        TryAddQueue(option);
                    }
                });

                break;
            }
        })

        // Hallways
        state.hall.forEach((occupant, hall) => {
            if (occupant === 0) return;

            let accessible = state.hall.map((_, i) => false);
            for (let i = hall - 1; i >= 0; i--) {
                if (state.hall[i] === 0) {
                    accessible[i] = true;
                }
                else {
                    break;
                }
            }
            for (let i = hall + 1; i < state.hall.length; i++) {
                if (state.hall[i] === 0) {
                    accessible[i] = true;
                }
                else {
                    break;
                }
            }

            // Room 1?
            const myRoom = occupant - 1;
            if (RoomOpen[myRoom]) {
                const myDoor = 2 * (myRoom + 1);

                if (accessible[myDoor]) {
                    for (let d = state.rooms[myRoom].length - 1; d >= 0; d--) {
                        if (state.rooms[myRoom][d] !== 0) {
                            continue;
                        }

                        // Move in
                        const distToEnter = (Math.abs(hall - myDoor) + d + 1);
                        const option = state.clone();
                        option.rooms[myRoom][d] = occupant;
                        option.hall[hall] = 0;
                        option.spent += energy[occupant] * distToEnter;
                        TryAddQueue(option);
                        break;
                    }
                }
            }
        })
    }
}

const inputMap = MapFromInput('.');
const initial = new State();
initial.rooms[0].splice(0, 0, fromChar(inputMap.get(3, 2)), fromChar(inputMap.get(3, 3)))
initial.rooms[1].splice(0, 0, fromChar(inputMap.get(5, 2)), fromChar(inputMap.get(5, 3)))
initial.rooms[2].splice(0, 0, fromChar(inputMap.get(7, 2)), fromChar(inputMap.get(7, 3)))
initial.rooms[3].splice(0, 0, fromChar(inputMap.get(9, 2)), fromChar(inputMap.get(9, 3)))
console.log(`Part 1:`, solve(initial));

initial.rooms[0].splice(1, 0, fromChar('D'), fromChar('D'))
initial.rooms[1].splice(1, 0, fromChar('C'), fromChar('B'))
initial.rooms[2].splice(1, 0, fromChar('B'), fromChar('A'))
initial.rooms[3].splice(1, 0, fromChar('A'), fromChar('C'))
console.log(`Part 2:`, solve(initial));
