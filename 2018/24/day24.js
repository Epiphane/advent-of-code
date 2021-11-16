const fs = require('fs');
const util = require('../../util');

let DEBUG = 'sample.txt';
function main(inputFile, boost = 0) {
    console.log('------------------ Running ' + inputFile + ' with ' + boost + ' boost -------------------')
    let input = fs.readFileSync(inputFile).toString().trim()
    let lines = input.split('\n');

    let armies = [];
    let state = 0;
    lines.forEach(line => {
        if (line === 'Immune System:') {
            state = 0;
        }
        else if (line === 'Infection:') {
            state = 1;
        }
        else if (line.length > 0) {
            parts = line.split('|');
            // 84|9798|immune to bludgeoning|1151|fire|9
            let special = { immune: [], weak: [] };
            let specialParts = parts[2].split('; ');
            specialParts.forEach(s => {
                if (s.indexOf('immune') >= 0) {
                    special.immune = s.substr('immune to '.length).split(', ');
                }
                if (s.indexOf('weak') >= 0) {
                    special.weak = s.substr('weak to '.length).split(', ');
                }
            })
            let army = {
                id: armies.length,
                team: state === 0 ? 'R' : 'I',
                units: parseInt(parts[0]),
                hp: parseInt(parts[1]),
                special,
                attack: parseInt(parts[3]),
                type: parts[4],
                initiative: parseInt(parts[5]),
            };
            
            if (army.team === 'R') {
                army.attack += boost;
            }

            armies.push(army);
        }
    });

    function Effective(army) {
        return army.attack * army.units;
    }

    function Damage(attacker, defender) {
        let damage = Effective(attacker);
        if (defender.special.immune.indexOf(attacker.type) >= 0) {
            return 0;
        }
        if (defender.special.weak.indexOf(attacker.type) >= 0) {
            return 2 * damage;
        }
        return damage;
    }

    function iterate(armies) {
        let targets = armies.map(a => null);
        let targeted = armies.map(a => false);
        let turns = armies.map(a => a.id);
        turns.sort((a1, a2) => {
            if (Effective(armies[a1]) !== Effective(armies[a2])) { return Effective(armies[a2]) - Effective(armies[a1]); }
            return armies[a2].initiative - armies[a1].initiative;
        });

        // console.log(armies);
        // console.log(turns);
        if (inputFile === DEBUG) {
            console.log('   Targeting:');
        }
        turns.forEach(a => {
            let army = armies[a];
            if (army.units <= 0) {
                return;
            }

            // During the target selection phase, each group attempts to choose one target.
            // In decreasing order of effective power, groups choose their targets;
            // in a tie, the group with the higher initiative chooses first.
            // The attacking group chooses to target the group in the enemy army to which it
            // would deal the most damage (after accounting for weaknesses and immunities,
            // but not accounting for whether the defending group has enough units to
            // actually receive all of that damage).
            let enemies = armies.filter(a => !targeted[a.id] && a.team !== army.team && a.units > 0).map(a => a.id);
            let predictions = armies.map(enemy => {
                if (enemy.team === army.team) return 0;
                return Damage(army, enemy);
            });

            enemies.sort((id1, id2) => {
                if (predictions[id2] !== predictions[id1]) return predictions[id2] - predictions[id1];
                if (Effective(armies[id2]) !== Effective(armies[id1])) return Effective(armies[id2]) - Effective(armies[id1]);
                return armies[id2].initiative - armies[id1].initiative;
            });

            // console.log(a, enemies);

            if (enemies.length > 0 && predictions[enemies[0]] > 0) {
                targets[a] = enemies[0];
                targeted[enemies[0]] = true;

                if (inputFile === DEBUG) {
                    console.log(`      Group ${a} would deal ${predictions[enemies[0]]} damage to ${armies[enemies[0]].id}`);
                }
            }
            else if (inputFile === DEBUG) {
                console.log(`      Group ${a} will do nothing`);
            }
        });

        if (inputFile === DEBUG) {
            console.log(`   Targets: ${targets.join(',')}`);
        }

        turns.sort((a1, a2) => {
            return armies[a2].initiative - armies[a1].initiative;
        });

        if (inputFile === DEBUG) {
            console.log('   Attacking:');
        }
        turns.forEach(a => {
            let army = armies[a];

            if (army.units <= 0) {
                return;
            }

            let enemy = armies[targets[a]];
            if (!enemy || enemy.units <= 0) {
                return;
            }

            let damage = Damage(army, enemy);
            enemy.units -= Math.floor(damage / enemy.hp);
            if (enemy.units < 0) enemy.units = 0;

            if (inputFile === DEBUG) {
                console.log(`      Group ${a} deals ${damage} damage to ${enemy.id}, killing ${Math.floor(damage / enemy.hp)} units (${enemy.hp} hp)`);
            }
        });

        return armies;
    }

    let round = 0;
    armies.done = false;
    while (!armies.done) {
        round ++;
        if (inputFile === DEBUG || round % 100 === 0) {
            console.log('Round ' + round + ': ');
            console.log('   Immune:\n      ' + armies.filter(a => a.team === 'R' && a.units > 0).map(a => `Group ${a.id} contains ${a.units} units`).join('\n      '));
            console.log('   Infect:\n      ' + armies.filter(a => a.team === 'I' && a.units > 0).map(a => `Group ${a.id} contains ${a.units} units`).join('\n      '));
        }

        if (armies.filter(a => a.team === 'R' && a.units > 0).length === 0) break;
        if (armies.filter(a => a.team === 'I' && a.units > 0).length === 0) break;

        armies = iterate(armies);
        if (inputFile === DEBUG) {
            console.log();
        }
        // break;
    }

    // console.log(armies);

    console.log('Immune: ' + util.count(armies, a => a.team === 'R' ? a.units : 0));
    console.log('Infect: ' + util.count(armies, a => a.team === 'I' ? a.units : 0));
    return armies.filter(a => a.team === 'R' && a.units > 0).length;
}

DEBUG = 'sample.txt';
main('sample.txt');

let boost = 77;
let res = main('input.txt', boost++);
while (!res) {
    res = main('input.txt', boost++);
}