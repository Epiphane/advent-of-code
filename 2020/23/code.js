const print = console.log;

function solve(NCUPS, NTURNS) {
    let input = '716892543'.split('').map(i => +i);
    for (let i = input.length + 1; i <= NCUPS; i++) {
        input.push(i);
    }

    let base = { num: input[0], next: null, prev: null };
    let cur = base;

    let locators = new Array(NCUPS + 1);
    locators[base.num] = base;
    input.forEach((val, i) => {
        if (i === 0) return;
        locators[val] = { num: val, next: base, prev: cur };
        cur.next = locators[val];
        base.prev = locators[val];
        cur = locators[val];
    });

    let current = base;
    while (base.num !== 1) {
        base = base.next;
    }

    function move() {
        let orphan = current.next;

        current.next.next.next.next.prev = current;
        current.next = current.next.next.next.next;

        let val = current.num - 1;
        if (val <= 0) {
            val = NCUPS;
        }

        while (val === orphan.num || val === orphan.next.num || val === orphan.next.next.num) {
            val--;
            if (val <= 0) {
                val = NCUPS;
            }
        }

        let cursor = locators[val];

        orphan.next.next.next = cursor.next;
        orphan.prev = cursor;

        cursor.next.prev = orphan.next.next;
        cursor.next = orphan;

        current = current.next;
    }

    for (let i = 0; i < NTURNS; i++) {
        move();
    }

    return base;
}

let answer = solve(9, 100);
let answerString = '';
for (let cursor = answer.next; cursor !== answer; cursor = cursor.next) {
    answerString += cursor.num;
}
print(`Part 1:`, answerString);

answer = solve(1000000, 10000000);
print(`Part 2:`, answer.next.num * answer.next.next.num);
