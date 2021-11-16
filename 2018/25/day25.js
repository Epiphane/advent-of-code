const fs = require('fs');
const util = require('../../util');

function main(inputFile) {
    let input = fs.readFileSync(inputFile).toString().trim();
    let lines = input.split('\n');

    let points = lines.map((line, id) => {
        let parts = line.split(',').map(i => parseInt(i));
        return {
            id,
            x: parts[0],
            y: parts[1],
            z: parts[2],
            t: parts[3],
            neighbors: [],
        };
    }).filter(el => el);

    let constellations = [];

    function Dist(point1, point2) {
        return Math.abs(point1.x - point2.x) +
            Math.abs(point1.y - point2.y) +
            Math.abs(point1.z - point2.z) +
            Math.abs(point1.t - point2.t);
    }

    points.forEach((point, i) => {
        for (let j = i + 1; j < points.length; j ++) {
            if (Dist(point, points[j]) <= 3) {
                point.neighbors.push(points[j].id);
                points[j].neighbors.push(point.id);
            }
        }
    });

    let avail = points.map(p => p.id);
    function AddToConst(constellation, id) {
        // if (constellation.indexOf(id) >= 0) { return constellation; }
        let point = points[id];
        let added = [];
        point.neighbors.forEach(nid => {
            if (constellation.indexOf(nid) >= 0) { return; }
            constellation.push(nid);
            added.push(nid);
        });

        added.forEach(id => {
            constellation = AddToConst(constellation, id);
        });
        return constellation;
    }

    while (avail.length > 0) {
        let next = avail[0];
        avail.shift();

        let constellation = [next];
        constellation = AddToConst(constellation, next);
        constellations.push(constellation);
        avail = avail.filter(id => constellation.indexOf(id) < 0);
    }

    console.log(points);
    console.log(constellations);
    console.log(constellations.length);
};

// main('sample.txt');
main('input.txt');
