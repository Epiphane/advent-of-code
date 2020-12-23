const print = console.log;

let N = 1000000;
let input = '716892543'.split('').map(i => +i);
for (let i = input.length + 1; i <= N; i++) {
    input.push(i);
}

let base = { num: input[0], next: null, prev: null };
let cur = base;

let locators = new Array(N + 1);
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
        val = N;
    }

    while (val === orphan.num || val === orphan.next.num || val === orphan.next.next.num) {
        val--;
        if (val <= 0) {
            val = N;
        }
    }

    let cursor = locators[val];

    orphan.next.next.next = cursor.next;
    orphan.prev = cursor;

    cursor.next.prev = orphan.next.next;
    cursor.next = orphan;

    current = current.next;
}

for (let i = 0; i < 10000000; i++) {
    if (i % 1000 === 0) {
        print(i, base.num, base.next.num, base.next.next.num, base.next.num * base.next.next.num);
    }
    move();
}

print(base.num);
print(base.next.num);
print(base.next.next.num);
print(base.next.num * base.next.next.num);
