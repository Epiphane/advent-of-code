import * as fs from 'fs';
import { id } from '../../utils';
const print = console.log;

const file = process.argv[2] || 'input';
const raw = fs.readFileSync(file + '.txt').toString().trim();
const asLines = raw.split('\n').map(line => line);

type Valve = {
    id: number;
    flow: number;
    tunnels: number[];
}

const locations = ['AA'];
function getId(name: string) {
    if (locations.indexOf(name) < 0) {
        locations.push(name);
    }
    return locations.indexOf(name);
}

const valves: Valve[] = [];
asLines.forEach(line => {
    if (line.trim() === '') return;

    const pattern = /Valve ([A-Z]+) has flow rate=([0-9]+); tunnels? leads? to valves? ([A-Z, ]+)\r?$/;
    const [_, name, flowStr, ends] = line.match(pattern);

    const id = getId(name);
    const flow = parseInt(flowStr);
    const tunnels = ends.split(', ').map(name => getId(name));
    valves[id] = { id, flow, tunnels };
})

class Person {
    position = 0;
    visited: number[] = [];
    history: string[] = [];

    constructor(position?: number, visited?: number[]) {
        if (position) {
            this.position = position;
        }
        if (visited) {
            this.visited = visited;
        }
        else {
            this.visited = locations.map(() => 0);
            this.visited[this.position] = 1;
        }
    }

    resetVisited() {
        this.visited = locations.map(() => 0);
        this.visited[this.position] = 1;
    }

    moveTo(location: number) {
        this.position = location;
        this.visited[this.position] = 1;
        this.history.push(locations[location]);
    }

    toString() {
        return `{${this.position}|${this.visited.join('|')}}`;
    }

    clone() {
        const copy = new Person(this.position, this.visited.map(id));
        copy.history = this.history.map(id);
        return copy;
    }
}

let mm = 0;
let created = {};
class State {
    time: number;
    people: Person[] = [];
    open = locations.map(() => 0);
    score = 0;

    constructor(time: number, people: Person[]) {
        this.time = time;
        this.people = people;
    }

    clone() {
        const copy = new State(this.time, this.people.map(p => p.clone()));
        copy.open = this.open.map(id);
        copy.score = this.score;
        return copy;
    }

    toString() {
        return `${this.time} ${this.people.map(p => p.toString()).sort().join(' ')} [${this.open.join('|')}]`;
    }

    key() {
        const openScore = parseInt(this.open.join(''), 2);
        const positions = this.people.map(({ position }) => position)
            .sort()
            .reduce((prev, position, i) => prev * locations.length + position, this.time);

        return (openScore << 13) + positions;
    }

    maxScore() {
        return valves
            .filter(({ id, flow }) => !this.open[id] && flow > 0)
            .sort(({ flow: flow1 }, { flow: flow2 }) => flow2 - flow1)
            .reduce((prev, { flow }, i) => prev + (flow * (this.time - 2 * Math.floor(i / 2))), this.score);
    }

    possible(person?: number) {
        const result: State[] = [];
        if (typeof (person) === 'number') {
            // Mutate just this person's state
            const { position, visited } = this.people[person];
            const { flow, tunnels } = valves[position];
            if (!this.open[position] && flow > 0) {
                const copy = this.clone();
                copy.open[position] = 1;
                copy.score += flow * copy.time;
                copy.people[person].resetVisited();
                copy.people[person].history.push('open');

                const key = copy.key();
                if (!created[key] || created[key] < copy.score) {
                    created[key] = copy.score;
                    result.push(copy);
                }
            }

            tunnels.forEach(id => {
                if (visited[id]) return;

                const copy = this.clone();
                copy.people[person].moveTo(id);

                const key = copy.key();
                if (!created[key] || created[key] < copy.score) {
                    created[key] = copy.score;
                    result.push(copy);
                }
            });

        }
        else {
            let copies = [this.clone()];
            copies[0].time--;
            this.people.forEach((_, i) => {
                let modified = [];
                copies.forEach(copy => {
                    const possibilities = copy.possible(i);
                    modified.splice(0, 0, ...possibilities);
                })

                if (modified.length) {
                    copies = modified;
                }
            });

            return copies;
        }
        return result;
    }
}

function solve(initialState: State) {
    const stack = [initialState];
    let best = 0;
    while (stack.length) {
        const top = stack.shift();

        if (top.time === 0) {
            // print(top.people.map(({ history }) => history).join('\n'))
            return top.score;
        }

        const possibilities = top.possible();
        stack.splice(0, 0, ...possibilities);
        stack.sort((a, b) => b.maxScore() - a.maxScore());
    }
}

print(`Part 1:`, solve(new State(30, [new Person])));
print(`Part 2:`, solve(new State(26, [new Person, new Person])));
