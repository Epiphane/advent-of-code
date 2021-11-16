const fs = require('fs');
const util = require('../../util');

/*
Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3
*/

let DEBUG = true;

function main() {
    let spells = [
        { name: 'Magic Missile', mana: 53, damage: 4 },
        { name: 'Poison', mana: 173, effect: () => { return { damage: 3, time: 6 } } },
        { name: 'Drain', mana: 73, damage: 2, heal: 2 },
        { name: 'Recharge', mana: 229, effect: () => { return { mana: 101, time: 5 } } },
        { name: 'Shield', mana: 113, effect: () => { return { armor: 7, time: 6 } } },
    ];

    let boss = {
        hp: 71,
        damage: 10,
    };

    function BossTurn(bossHP, playerHP, playerMana, effects, goingCost, prefix) {
        if (DEBUG) console.log(prefix, 'Going cost: ' + goingCost);
        // if (DEBUG) console.log(prefix, 'Boss HP: ' + bossHP, 'Player HP: ' + playerHP);
        let armor = 0;
        let newEffects = [];
        effects.forEach(original => {
            // if (DEBUG) console.log(prefix, original);
            let effect = Object.assign({}, original);
            if (effect.armor) {
                armor += effect.armor;
            }
            if (effect.damage) {
                bossHP -= effect.damage;
            }
            if (effect.mana) {
                playerMana += effect.mana;
            }
            if (--effect.time > 0) {
                newEffects.push(effect);
            }
        });
        effects = newEffects;
        // if (DEBUG) console.log(prefix, 'Armor: ', armor)

        if (bossHP <= 0) {
            if (DEBUG) console.error(prefix, 'Win! Boss hp: ' + bossHP)
            return goingCost;
        }

        playerHP -= Math.max(boss.damage - armor, 1);
        if (playerHP <= 0) {
            return Infinity;
        }

        return FightBoss(bossHP, playerHP, playerMana, effects, goingCost, prefix + '  ');
    }
    
    let _best = Infinity;
    function FightBoss(bossHP = boss.hp, playerHP = 50, playerMana = 500, effects = [], goingCost = 0, prefix = '') {
        let newEffects = [];
        let armor = 0;
        effects.forEach(original => {
            // if (DEBUG) console.log(prefix, original);
            let effect = Object.assign({}, original);
            if (effect.armor) {
                armor += effect.armor;
            }
            if (effect.damage) {
                bossHP -= effect.damage;
            }
            if (effect.mana) {
                playerMana += effect.mana;
            }
            if (--effect.time > 0) {
                newEffects.push(effect);
            }
        });
        effects = newEffects;

        if (bossHP <= 0) {
            return goingCost;
        }

        // Player turn
        let best = Infinity;
        spells.forEach(spell => {
            let cost = spell.mana;
            if (spell.name === 'Shield' && armor > 14) {
                return;
            }
            if (playerMana >= cost && goingCost + cost < _best) {
                if (DEBUG) console.log(prefix, spell.name);
                let useSpellAndWin = BossTurn(
                    bossHP - (spell.damage || 0),
                    playerHP + (spell.heal || 0),
                    playerMana - cost,
                    effects.concat(spell.effect ? [spell.effect()] : []),
                    goingCost + cost,
                    prefix + '  ');

                if (useSpellAndWin < best && DEBUG) {
                    console.log(prefix, 'New best: ' + useSpellAndWin);
                }
                if (useSpellAndWin < _best && DEBUG) {
                    console.log(prefix, 'New _best: ' + useSpellAndWin);
                }

                best = Math.min(best, useSpellAndWin);
                _best = Math.min(_best, useSpellAndWin);
            }
        });

        // if (DEBUG) console.log(prefix, best);
        return best;
    }

    console.log(FightBoss());
    console.log(_best)
};

main();
