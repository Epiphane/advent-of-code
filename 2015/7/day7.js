const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

let wires = {};

function Value(id) {
    let wire = Wire(id);
    if (!wire.value) wire.value = wire.input();
    console.log(id, wire);
    return wire.value;
}

const val = (v) => {
    let maybeInt = parseInt(v);
    if (isNaN(maybeInt)) {
        return Value(v);
    }
    else {
        return maybeInt;
    }
}

const VAL = (value) => {
    return () => val(value);
}

const NOT = (value) => {
    return () => ~val(value);
}

const AND = (in1, in2) => {
    return () => {
        return val(in1) & val(in2);
    }
}

const OR = (in1, in2) => {
    return () => {
        return val(in1) | val(in2);
    }
}

const LSHIFT = (in1, amt) => {
    return () => (val(in1) << amt);
}

const RSHIFT = (in1, amt) => {
    return () => (val(in1) >>> amt);
}

const Wire = (id) => {
    wires[id] = wires[id] || { input: null };
    return wires[id];
}

lines.forEach(line => {
    let parts = line.split(' ');
    if (parts[0] === 'NOT') {
        Wire(parts[3]).input = NOT(parts[1]);
    }
    else if (parts[1] === 'AND') {
        Wire(parts[4]).input = AND(parts[0], parts[2]);
    }
    else if (parts[1] === 'OR') {
        Wire(parts[4]).input = OR(parts[0], parts[2]);
    }
    else if (parts[1] === 'LSHIFT') {
        Wire(parts[4]).input = LSHIFT(parts[0], parseInt(parts[2]));
    }
    else if (parts[1] === 'RSHIFT') {
        Wire(parts[4]).input = RSHIFT(parts[0], parseInt(parts[2]));
    }
    else {
        Wire(parts[2]).input = VAL(parts[0]);
    }
});

console.log(Value('a'));

// console.log(wires);