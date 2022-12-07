// @ts-nocheck

function local(p, send, recv) {
    let i = 31;
    let a = 1;
    p *= 17;

    if (p === 0) {
        console.log(i);
        a = Math.pow(2, i) - 1;

        i = 127;
        p = 826;
        for (let i = 127; i > 0; i--) {
            p *= 8505;
            p %= a;
            p *= 129749;
            p += 12345;
            p %= a;
            b = p % 10000;
            send(b);
        }
    }

    while (true) {
        // if (a <= 0) {
        // }

        do {
            f = 0;
            i = 126;
            a = recv();
            while (i > 0) {
                b = recv();

                p = b - a;
                if (b > a) {
                    send(b);
                    f = 1;
                    i--;
                }
                else {
                    send(a);
                    a = b;
                    i--;
                }
            }
            send(a);
        } while (f > 0);

        if (a <= 0) throw '??';
        do {
            b = recv();
        } while (b > 0);
    }
}

local(0, (i) => console.log(i), () => { throw '?' });
