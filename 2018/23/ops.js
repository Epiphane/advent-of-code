module.exports = {
    addr: (registers, a, b, c) => {
        registers[c] = registers[a] + registers[b];
    },
    addi: (registers, a, b, c) => {
        registers[c] = registers[a] + b;
    },
    mulr: (registers, a, b, c) => {
        registers[c] = registers[a] * registers[b];
    },
    muli: (registers, a, b, c) => {
        registers[c] = registers[a] * b;
    },
    banr: (registers, a, b, c) => {
        registers[c] = registers[a] & registers[b];
    },
    bani: (registers, a, b, c) => {
        registers[c] = registers[a] & b;
    },
    borr: (registers, a, b, c) => {
        registers[c] = registers[a] | registers[b];
    },
    bori: (registers, a, b, c) => {
        registers[c] = registers[a] | b;
    },
    setr: (registers, a, _, c) => {
        registers[c] = registers[a];
    },
    seti: (registers, a, _, c) => {
        registers[c] = a;
    },
    gtir: (registers, a, b, c) => {
        registers[c] = a > registers[b] ? 1 : 0;
    },
    gtri: (registers, a, b, c) => {
        registers[c] = registers[a] > b ? 1 : 0;
    },
    gtrr: (registers, a, b, c) => {
        registers[c] = registers[a] > registers[b] ? 1 : 0;
    },
    eqir: (registers, a, b, c) => {
        registers[c] = a === registers[b] ? 1 : 0;
    },
    eqri: (registers, a, b, c) => {
        registers[c] = registers[a] === b ? 1 : 0;
    },
    eqrr: (registers, a, b, c) => {
        registers[c] = registers[a] === registers[b] ? 1 : 0;
    },
};