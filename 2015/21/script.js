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

function main() {
    let weapons = [
        { name: 'Dagger', cost: 8, damage: 4, armor: 0 },
        { name: 'Shortsword', cost: 10, damage: 5, armor: 0 },
        { name: 'Warhammer', cost: 25, damage: 6, armor: 0 },
        { name: 'Longsword', cost: 40, damage: 7, armor: 0 },
        { name: 'Greataxe', cost: 74, damage: 8, armor: 0 },
    ];

    let armors = [
        { name: 'Leather', cost: 13, damage: 0, armor: 1 },
        { name: 'Chainmail', cost: 31, damage: 0, armor: 2 },
        { name: 'Splintmail', cost: 53, damage: 0, armor: 3 },
        { name: 'Bandedmail', cost: 75, damage: 0, armor: 4 },
        { name: 'Platemail', cost: 102, damage: 0, armor: 5 },
    ];

    let rings = [
        { name: 'Damage +1', cost: 25, damage: 1, armor: 0 },
        { name: 'Damage +2', cost: 50, damage: 2, armor: 0 },
        { name: 'Damage +3', cost: 100, damage: 3, armor: 0 },
        { name: 'Defense +1', cost: 20, damage: 0, armor: 1 },
        { name: 'Defense +2', cost: 40, damage: 0, armor: 2 },
        { name: 'Defense +3', cost: 80, damage: 0, armor: 3 },
    ];

    let boss = {
        hp: 109,
        damage: 8,
        armor: 2,
    };
    
    function FightBoss(items) {
        let bossHP = boss.hp;
        let playerHP = 100;

        let playerDamage = items.reduce((acc, i) => acc + i.damage, 0);
        let playerArmor = items.reduce((acc, i) => acc + i.armor, 0);

        while (bossHP > 0 && playerHP > 0) {
            let damage = Math.max(playerDamage - boss.armor, 1);
            bossHP -= damage;

            damage = Math.max(boss.damage - playerArmor, 1);
            playerHP -= damage;
        }

        return bossHP <= 0;
    }

    let answer = 0;
    for (let w = 0; w < weapons.length; w ++) {
        let weapon = weapons[w];
        for (let a = -1; a < armors.length; a ++) {
            let armor = a >= 0 ? armors[a] : null;
            for (let r1 = -2; r1 < rings.length; r1 ++) {
                let ring1 = r1 >= 0 ? rings[r1] : null;
                for (let r2 = r1 + 1; r2 < rings.length; r2 ++) {
                    let ring2 = r2 >= 0 ? rings[r2] : null;

                    let items = [weapon, armor, ring1, ring2].filter(i => !!i);
                    if (!FightBoss(items)) {
                        let cost = items.reduce((acc, i) => acc + i.cost, 0)
                        if (cost > answer) {
                            answer = Math.max(answer, cost);
                            console.log(cost, items);
                        }
                    }
                }
            }
        }
    }

    console.log(answer);
    console.log(FightBoss([]));
};

main();
