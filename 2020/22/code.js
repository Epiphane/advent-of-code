import fs from 'fs';
import md5 from '../../md5.js';
import { Map } from '../../map.js';
import { MakeGrid, MakeRow } from '../../makegrid.js';
import { permute, gcd, lcm } from '../../utils.js';
import { question } from 'readline-sync';

const print = console.log;

let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let groups = raw.split(/\r?\n\r?\n/).map(line => line.split('\n').map(l => l.trim()));

let decks = []
groups.forEach(lines => {
    let deck = [];
    lines.slice(1).forEach(line => {
        deck.push(+line);
    });

    decks.push(deck);
});

function Game(deck1, deck2) {
    let states = [];

    function play() {
        while (deck1.length > 0 && deck2.length > 0) {
            let state = `${deck1.join()}|${deck2.join()}`;
            if (states.indexOf(state) >= 0) {
                break;
            }
            states.push(state);

            let card1 = deck1.shift();
            let card2 = deck2.shift();

            let winner1 = false;
            if (deck1.length >= card1 && deck2.length >= card2) {
                let newGame = new Game(deck1.slice(0, card1), deck2.slice(0, card2));
                let ending = newGame.play();
                winner1 = ending[0].length > 0;
            }
            else {
                winner1 = card1 > card2;
            }

            if (winner1) {
                deck1.push(card1);
                deck1.push(card2);
            }
            else {
                deck2.push(card2);
                deck2.push(card1);
            }
        }

        return [deck1, deck2];
    }

    return { play };
}

let game = new Game(decks[0], decks[1]);
decks = game.play();

let score = 0;
decks[0].forEach((card, i) => {
    score += card * (decks[0].length - i);
})
print(`Player 1: ${score}`);

score = 0;
decks[1].forEach((card, i) => {
    score += card * (decks[1].length - i);
})
print(`Player 2: ${score}`);
