const { id } = require('../utils');
const { DefaultIntcodeMachine } = require('../intcode/machine');
const prompt = require('readline-sync').question;
const log = console.log;

let SAVED = false;
let AI = false;
if (process.argv[2] === 'ai') {
    AI = true;
}
else if (process.argv[2] === 'saved') {
    SAVED = true;
}

const CHECKPOINT = 'Security Checkpoint';
const OUTPUT = false;

process.argv[2] = 'input';
let machine = DefaultIntcodeMachine();
let { stdin, stdout } = machine;

// Get initial output
function tick(onOutput) {
    machine.run(100000);

    while (!stdout.empty()) {
        onOutput(stdout.readline());
    }
}

// Final solution
if (SAVED) {
    [
        'east',
        'east',
        'east',
        'take shell',
        'east',
        'west',
        'south',
        'take monolith',
        'north',
        'west',
        'north',
        'west',
        'take bowl of rice',
        'east',
        'north',
        'take planetoid',
        'west',
        'take ornament',
        'south',
        'south',
        'take fuel cell',
        'north',
        'north',
        'east',
        'east',
        'take cake',
        'south',
        'west',
        'north',
        'take astrolabe',
        'west',
        'drop shell',
        'drop bowl of rice',
        'drop ornament',
        'drop cake',
        'north',
    ].forEach(cmd => {
        stdin.writeline(cmd);
        tick(log);
    });
}
else if (AI) {
    const inverse = {
        north: 'south',
        south: 'north',
        west: 'east',
        east: 'west',
    };

    let done = false;
    let explored = false;
    let itemsVerified = false;
    let mode;
    let room;
    let commands;
    let lastCmd;
    let testingItem;
    let commandQueue;
    let inv = [];
    let path = [];
    let pathToCheckpoint;

    let items = {};
    let map = {};
    let rooms = {};

    let newGame = () => {
        machine = DefaultIntcodeMachine();
        stdout = machine.stdout;
        stdin = machine.stdin;

        mode = 'desc';
        room = '';
        commands = [];
        inv = [];
        lastCmd = '';
        testingItem = '';

        commandQueue = [];
        path = [];
    };

    newGame();

    function computePath(current, dest) {
        let path = [];

        let common = 0;
        while (
            common < current.length &&
            common < dest.length &&
            current[common] === dest[common]
        ) {
            common ++;
        }

        for (let i = current.length - 1; i >= common; i --) {
            path.push(inverse[current[i]]);
        }

        return path.concat(dest.slice(common));
    }

    function decide() {
        if (commands.length === 0) {
            return;
        }

        if (commandQueue.length > 0) {
            return;
        }

        if (!explored) {
            // We are exploring! Don't pick up anything,
            // but try to enter every room.
            if (room !== CHECKPOINT) {
                for (let i = 0; i < commands.length; i++) {
                    const cmd = commands[i];
                    if (inverse[cmd] === path[path.length - 1]) {
                        continue;
                    }

                    if (!map[path.concat([cmd]).join()]) {
                        return cmd;
                    }
                }
            }

            // Everything has been explored!
            if (path.length === 0) {
                explored = true;

                // lazy lol
                newGame();
                return false;
            }

            return inverse[path[path.length - 1]];
        }

        if (commands.length === 1) {
            return commands[0];
        }

        if (!itemsVerified) {
            // Test each item, one by one, to make sure it's safe.
            for (let item in items) {
                if (items[item].safe < 0) {
                    commandQueue = commandQueue.concat(computePath(path, items[item].path));
                    commandQueue.push(`take ${item}`);
                    testingItem = item;
                    return;
                }
            }

            itemsVerified = true;
        }

        if (itemsVerified) {
            // Navigate to the checkpoint and then start trying combinations.
            if (room !== CHECKPOINT) {
                for (let item in items) {
                    if (items[item].safe === 1 && inv.indexOf(item) < 0) {
                        commandQueue = commandQueue.concat(computePath(path, items[item].path));
                        commandQueue.push(`take ${item}`);
                        return;
                    }
                }

                commandQueue = commandQueue.concat(computePath(path, pathToCheckpoint));
                return;
            }

            // Testing sequence:
            // b,c,d
            // a,c,d
            // a,b,d
            // a,b,c
            // c,d
            // b,d
            // b,c
            // a,d
            // a,c
            // a,b
            // d
            // c
            // b
            // a
            // You can infer the next test from the current state by "decrementing" the last value,
            // and then "carrying" any underflow.
            const avail = Object.keys(items).filter(i => items[i].safe === 1).sort();
            const indexes = inv.map(i => avail.indexOf(i));

            let replace = indexes.length;
            for (; replace > 0; --replace) {
                const held = indexes[replace];
                if (held > indexes[replace - 1] + 1) {
                    commandQueue.push(`drop ${avail[held]}`);
                    commandQueue.push(`take ${avail[held - 1]}`);
                    break;
                }
            }

            if (replace !== 0 || indexes[0] > 0) {
                for (let i = replace; i < indexes.length; i ++) {
                    commandQueue.push(`drop ${inv[i]}`);
                }

                commandQueue.push(`take ${avail[indexes[replace] - 1]}`);
                let nReplace = indexes.length - (replace + 1);
                for (let i = 1; i <= nReplace; i ++) {
                    commandQueue.push(`take ${avail[avail.length - i]}`);
                }
            }
            else {
                inv.forEach(i => commandQueue.push(`drop ${i}`));
                avail.forEach((item, ndx) => {
                    if (ndx >= avail.length - inv.length + 1) {
                        commandQueue.push(`take ${item}`);
                    }
                });
            }

            // Try it out!
            for (let i = 0; i < commands.length; i++) {
                const cmd = commands[i];
                if (inverse[cmd] === pathToCheckpoint[pathToCheckpoint.length - 1]) {
                    continue;
                }

                return cmd;
            }
        }
    }

    let stalled = false;
    function go() {
        let cmd = decide();
        if (cmd) {
            commandQueue.push(cmd);
        }

        if (cmd === false) {
            return;
        }

        lastCmd = commandQueue.shift();
        if (lastCmd === inverse[path[path.length - 1]]) {
            path.pop();
        }
        else if (inverse[lastCmd]) {
            path.push(lastCmd);
        }

        if (OUTPUT) {
            log(lastCmd);
        }
        stdin.writeline(lastCmd);
    }

    function respond(line) {
        if (OUTPUT) {
            log(line);
        }
        let finale = line.match(/You should be able to get in by typing ([0-9]+) on the keypad/);
        if (finale) {
            log(`Passcode: ${+finale[1]}`);
            done = true;
            return;
        }

        let cmd = line.match(/- ([0-9A-Za-z ]+)/);
        let title = line.match(/== (.+) ==/);
        let take = line.match(/You take the ([0-9A-Za-z ]+)\./);
        let drop = line.match(/You drop the ([0-9A-Za-z ]+)\./);
        if (cmd) {
            const option = cmd[1];
            if (mode === 'doors') {
                commands.push(option);
            }
            else if (mode === 'items') {
                if (!items[option]) {
                    items[option] = {
                        safe: -1,
                        path: path.map(id),
                    };
                }
            }
            else {
                log(`Unexpected command option: ${line}`);
            }
        }
        if (line.match(/You can't/) || line.match(/You don't/)) {
            if (!itemsVerified && testingItem) {
                items[testingItem].safe = 0;
                newGame();
                return;
            }
        }
        if (line.match(/Doors here lead:/)) {
            mode = 'doors';
        }
        else if (line.match(/Items here:/)) {
            mode = 'items';
        }
        else if (line.match(/Command\?/)) {
            stalled = false;
            mode = 'desc';
            go();
        }
        else if (take) {
            inv.push(take[1]);
            inv.sort();

            items[take[1]].safe = 1;
        }
        else if (drop) {
            inv = inv.filter(i => i !== drop[1]);
        }
        else if (title) {
            commands = [];
            room = title[1];
            if (!map[path.join()]) {
                map[path.join()] = room;
            }
            if (!rooms[room]) {
                rooms[room] = path.map(id);
            }
            if (room === CHECKPOINT) {
                if (!pathToCheckpoint) {
                    pathToCheckpoint = path.map(id);
                }
                verifying = true;
            }
        }
    }

    while (!done) {
        stalled = true;
        tick(respond);

        if (stalled && testingItem) {
            items[testingItem].safe = 0;
            newGame();
        }
    }
}
else {
    // Interactive mode.
    tick(log);
    while (true) {
        stdin.writeline(prompt());

        tick(log);
    };
}
