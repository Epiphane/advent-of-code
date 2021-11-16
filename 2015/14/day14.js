const fs = require('fs');
const util = require('../../util');

let input = fs.readFileSync('input.txt').toString().trim()
let lines = input.split('\n');

// lines = ['Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.',
// 'Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.'];

let reindeer = lines.map(line => {
    let match = line.match(/(.*) can fly ([0-9]+) km\/s for ([0-9]+) seconds, but then must rest for ([0-9]+) seconds./);
    return {
        name: match[1],
        speed: parseInt(match[2]),
        pos: 0,
        score: 0,

        time: [parseInt(match[3]), parseInt(match[4])],
        state: 0,
        curtime: 0,
    };
});

for (let s = 0; s < 2503; s ++) {
    reindeer.forEach(r => {
        r.curtime ++;
        if (r.state === 0) { r.pos += r.speed; }
        
        if (r.curtime === r.time[r.state]) {
            r.curtime = 0;
            r.state = 1 - r.state;
        }
    });

    reindeer.sort((r1, r2) => r2.pos - r1.pos);
    let winningpos = reindeer[0].pos;
    for (let i = 0; i < reindeer.length && reindeer[i].pos === winningpos; i ++) {
        reindeer[i].score ++;
    }
}

    reindeer.sort((r1, r2) => r2.score - r1.score);
    console.log(reindeer);
