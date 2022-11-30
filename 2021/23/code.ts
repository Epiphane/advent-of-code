import { MapFromInput } from '../../map';
import { range, deepCopy, BinaryInsert } from '../../utils';

const energy = [0, 1, 10, 100, 1000];

function toChar(num: number) {
    return ['.', 'A', 'B', 'C', 'D'][num];
}

function fromChar(char: string) {
    return ['.', 'A', 'B', 'C', 'D'].indexOf(char);
}

class Space {
    occupant = 0;
    canOccupy: boolean;

    constructor(public x: number) {
        this.canOccupy = [0, 1, 3, 5, 7, 9, 10].includes(x);
    }
}

class Room {
    occupants: number[] = [];

    left: Space[] = [];
    right: Space[] = [];

    constructor(
        public index: number
    ) { }

    isComplete() {
        return this.occupants.every(occupant => occupant === this.index + 1);
    }

    isOpen() {
        return this.occupants.every(occupant => occupant === this.index + 1 || occupant === 0)
    }
}

class State {
    rooms = range(4).map(num => new Room(num));
    hall = range(11).map(x => new Space(x));
    hallReverse = this.hall.slice().reverse();
    spent = 0;

    constructor() {
        // Construct the hall connections
        this.rooms.forEach((room, num) => {
            room.left = this.hall.slice(0, 2 * num + 3).reverse();
            room.right = this.hall.slice(2 * num + 2);
        })
    }

    isComplete() {
        return this.rooms.every(room => room.isComplete());
    }

    clone() {
        const state = new State();
        this.hall.forEach(({ occupant }, x) => state.hall[x].occupant = occupant);
        this.rooms.forEach((room, num) => state.rooms[num].occupants = room.occupants.slice())
        state.spent = this.spent;
        return state;
    }

    serialize() {
        let id = 0;
        this.hall.forEach(({ occupant }) => id = id * 5 + occupant);
        this.rooms.forEach(({ occupants }) => occupants.forEach(v => id = id * 5 + v));
        return id;
    }

    toString() {
        return [
            `Spent: (${this.spent})`,
            `#############`,
            `#${this.hall.map(({ occupant }) => toChar(occupant)).join('')}#`,
            ...range(this.rooms[0].occupants.length).map(depth => {
                const pad = ['##'][depth] ?? '  ';
                return [pad, ...this.rooms.map(room => toChar(room.occupants[depth])), pad].join('#')
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

    let i__ = 0;

    while (queue.length > 0) {
        // if (queue.length - 1) break;
        const state = queue.shift();
        if (state.isComplete()) {
            return state.spent;
        }

        if (i__++ % 1000 === 0) {
            console.log(state.toString());
        }

        // A room is either mixed or clear. Mixed rooms need to be emptied
        // so that the intended inhabitants can enter, because of this rule:
        //
        // - Amphipods will never move from the hallway into a room unless
        //   that room is their destination room and that room contains no
        //   amphipods which do not also have that room as their own destination.

        // Empy mixed rooms
        state.rooms.forEach(room => {
            if (room.isOpen()) {
                return;
            }

            // Only the amphipod on top can leave
            const index = room.occupants.findIndex(occ => occ);
            const occupant = room.occupants[index];
            const upDist = index + 1;

            // Take advantage of find's short circuiting to exit early,
            // once we've found the first occupied space.
            const tryEnterHallway = (space: Space, dist: number) => {
                if (space.occupant) {
                    return true;
                }

                const option = state.clone();
                option.rooms[room.index].occupants[index] = 0;
                option.hall[space.x].occupant = occupant;
                option.spent += energy[occupant] * (dist + upDist);
                TryAddQueue(option);
            };
            room.left.find(tryEnterHallway);
            room.right.find(tryEnterHallway);
        })

        // Now try to move amphipods from hallways into their room.
        state.hall.forEach(({ occupant, x }) => {
            if (!occupant) {
                return;
            }

            // How far can we move?
            const leftMax = state.hallReverse
                .findIndex(({ occupant }, pos) => pos < x && !!occupant) + 1;
            const rightMax = state.hall
                .findIndex(({ occupant }, pos) => pos > x && !!occupant) - 1;

            const myRoom = state.rooms[occupant - 1];
            if (myRoom.isOpen()) {
                // Can we even get to the door?
                const myDoor = 2 * occupant;
                if (myDoor >= leftMax && myDoor <= rightMax) {
                    myRoom.occupants.slice().reverse().find((current, y) => {
                        if (current === 0) {
                            // Move in
                            const option = state.clone();
                            option.rooms[myRoom.index][y] = occupant;
                            option.hall[x].occupant = 0;
                            option.spent += energy[occupant] * (Math.abs(x - myDoor) + (y + 1));
                            TryAddQueue(option);
                            return true;
                        }
                    })
                }
            }
        })
    }
}

const inputMap = MapFromInput('.');
const initial = new State();
initial.rooms[0].occupants.splice(0, 0, fromChar(inputMap.get(3, 2)), fromChar(inputMap.get(3, 3)))
initial.rooms[1].occupants.splice(0, 0, fromChar(inputMap.get(5, 2)), fromChar(inputMap.get(5, 3)))
initial.rooms[2].occupants.splice(0, 0, fromChar(inputMap.get(7, 2)), fromChar(inputMap.get(7, 3)))
initial.rooms[3].occupants.splice(0, 0, fromChar(inputMap.get(9, 2)), fromChar(inputMap.get(9, 3)))
console.log(`Part 1:`, solve(initial));

// initial.rooms[0].occupants.splice(1, 0, fromChar('D'), fromChar('D'))
// initial.rooms[1].occupants.splice(1, 0, fromChar('C'), fromChar('B'))
// initial.rooms[2].occupants.splice(1, 0, fromChar('B'), fromChar('A'))
// initial.rooms[3].occupants.splice(1, 0, fromChar('A'), fromChar('C'))
// console.log(`Part 2:`, solve(initial));
