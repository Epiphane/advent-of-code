const fs = require('fs');

let file = process.argv[2] || 'input';
let lines = fs.readFileSync(file + '.txt').toString().trim().split('\n');
const print = console.log;
const log = console.log;

let mapping = { i: 1 };
let titles = [];
let floors = [{ gs: [], ms: [] }];
let parts = 0;

lines.forEach((line, f) => {
    let generators = [...line.matchAll(/([a-z]+) generator/g)];
    let microchips = [...line.matchAll(/([a-z]+)-compatible microchip/g)];

    let contents = Array.apply(null, new Array(11)).map(e => undefined);

    let gs = [];
    let ms = [];

    generators.forEach(m => {
        let id = m[1][0].toUpperCase() + m[1][1];
        if (!mapping[id]) {
            mapping[id] = mapping.i++;
            titles.push(id);
        }

        contents[mapping[id] * 2] = id + 'G';
        gs.push(id);
        parts++;
    })

    microchips.forEach(m => {
        let id = m[1][0].toUpperCase() + m[1][1];
        if (!mapping[id]) {
            mapping[id] = mapping.i++;
            titles.push(id);
        }

        contents[mapping[id] * 2 + 1] = id + 'M';
        ms.push(id);
        parts++;
    })

    floors.push({
        gs, ms
    });
});

let elevator = 1;

function serialize(floors, e) {
    return floors.map((_, i) => {
        i = floors.length - i - 1;
        let floor = floors[i];
        let prefix = ((i === e) ? ' E' : '  ');
        return `${i}: ${prefix}` + floor.gs.join(' ').padStart(20) + ' | ' + floor.ms.join(' ').padEnd(20);
    }).slice(0, floors.length - 1).join('\n');
}

function superserialize(floors, e) {
    return e + floors.reduce((prev, floor) => {
        return `${prev}` + floor.gs.length * 10 + floor.ms.length;
    }, 0);
}

function printState(floors, e) {
    console.log('               Generators | Microchips  ')
    // console.log(floors.map((_, i) =>
    //     `${floors.length - i}: ` +
    //     ((floors.length - i - 1 === elevator) ? ' E' : '  ') +
    //     floors[floors.length - i - 1].slice(1).map(i => i ? i : '   ').join('  |  ')
    // ).join('\n'));

    console.log(serialize(floors, e));
}

function makeCopy(floor) {
    return {
        gs: floor.gs.map(g => g),
        ms: floor.ms.map(m => m),
    };
}

function isValid(floor) {
    return floor.ms.reduce((prev, id) => {
        if (!floor.gs.includes(id) && floor.gs.length > 0) {
            return false;
        }
        return prev;
    }, true);
}

function available(floor) {
    let options = [];
    floor.gs.forEach((g, i) => {
        let copy = makeCopy(floor);
        copy.gs = copy.gs.filter(g_ => g !== g_);
        if (isValid(copy)) {
            options.push({ gs: [g], ms: [], floor: copy });
        }

        floor.gs.forEach((g2, i2) => {
            if (i2 <= i) return;
            let copy2 = makeCopy(copy);
            copy2.gs = copy.gs.filter(g_ => g2 !== g_);
            if (isValid(copy2)) {
                options.push({ gs: [g, g2], ms: [], floor: copy2 });
            }
        })

        floor.ms.forEach((m2, i2) => {
            let copy2 = makeCopy(copy);
            copy2.ms = copy.ms.filter(m_ => m2 !== m_);
            if (isValid(copy2)) {
                options.push({ gs: [g], ms: [m2], floor: copy2 });
            }
        })
    })

    floor.ms.forEach((m, i) => {
        let copy = makeCopy(floor);
        copy.ms = copy.ms.filter(m_ => m !== m_);
        if (isValid(copy)) {
            options.push({ gs: [], ms: [m], floor: copy });
        }

        floor.ms.forEach((m2, i2) => {
            if (i2 <= i) return;
            let copy2 = makeCopy(copy);
            copy2.ms = copy.ms.filter(m_ => m2 !== m_);
            if (isValid(copy2)) {
                options.push({ gs: [], ms: [m, m2], floor: copy2 });
            }
        })

        floor.gs.forEach((g2, i2) => {
            let copy2 = makeCopy(copy);
            copy2.gs = copy.gs.filter(g_ => g2 !== g_);
            if (isValid(copy2)) {
                options.push({ gs: [g2], ms: [m], floor: copy2 });
            }
        })
    })

    return options;
}

function step() {

}

// printState();

let states = [{
    floors,
    elevator,
    path: [],
    steps: 0
}];

let exp = {};

let __i = 0;
let last = 0;
let done = false;
while (!done) {
    let state = states.shift();
    if (!state) {
        break;
    }

    // if (++__i % 1000 === 0) {
    //     process.stdout.write('.');
    // }

    let { floors, elevator, path, steps } = state;

    // printState(floors, elevator);
    // print(state.path);
    // print(steps);
    let top = floors[floors.length - 1];
    if (top.gs.length + top.ms.length === parts) {
        print(steps);
        break;
    }

    if (steps !== last) {
        // process.stdout.write('\n');
        // print(steps);
        // print(states.length);
        last = steps;
    }

    let options = available(floors[elevator]);
    // print(options);

    options.forEach(option => {
        let newfloors = floors.map(f => makeCopy(f));
        newfloors[elevator] = option.floor;
        if (elevator > 1) {
            newfloors[elevator - 1].gs = newfloors[elevator - 1].gs.concat(option.gs);
            newfloors[elevator - 1].ms = newfloors[elevator - 1].ms.concat(option.ms);

            if (isValid(newfloors[elevator - 1])) {
                let key = superserialize(newfloors, elevator - 1);
                // print(serialize(newfloors, elevator - 1));
                // print(key);
                if (!exp[key]) {
                    exp[key] = true;
                    states.push({
                        floors: newfloors,
                        elevator: elevator - 1,
                        path: path.concat({ dir: 'down', gs: option.gs, ms: option.ms }),
                        steps: steps + 1
                    });
                }
                else {
                    // print(key);
                }
            }
        }

        newfloors = floors.map(f => makeCopy(f));
        newfloors[elevator] = option.floor;
        if (elevator < floors.length - 1) {
            newfloors[elevator + 1].gs = newfloors[elevator + 1].gs.concat(option.gs);
            newfloors[elevator + 1].ms = newfloors[elevator + 1].ms.concat(option.ms);

            if (isValid(newfloors[elevator + 1])) {
                let key = superserialize(newfloors, elevator + 1);
                if (!exp[key]) {
                    exp[key] = true;
                    states.push({
                        floors: newfloors,
                        elevator: elevator + 1,
                        path: path.concat({ dir: 'up', gs: option.gs, ms: option.ms }),
                        steps: steps + 1
                    });
                }
                else {
                    // print(key);
                }
            }
        }
    })

    // states.forEach(state => {
    //     print(state);
    //     printState(state.floors);
    //     print(state.path);
    // })
    // print(states.length);
}
