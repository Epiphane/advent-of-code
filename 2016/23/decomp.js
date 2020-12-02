/*
cpy a b
dec b
cpy a d
cpy 0 a
cpy b c
inc a
dec c
jnz c - 2
dec d
jnz d - 5
dec b
cpy b c
cpy c d
dec d
inc c
jnz d - 2
tgl c
cpy - 16 c
jnz 1 c
cpy 94 c
jnz 80 d
inc a
inc d
jnz d - 2
inc c
jnz c - 5
*/

function decomp() {
    let a = 7;
    let b = 0;
    let c = 0;
    let d = 0;

    b = a; // cpy a b
    b--; // dec b
    d = a; // cpy a d
    a = 0; // cpy 0 a
    c = b; // cpy b c
    a++; // inc a
    c--; // dec c
    if (c != 0) jmp(41) // jnz c -2
    d--; // dec d
    if (d != 0) jmp(40) // jnz d -5
    b-- // dec b
    c = b; // cpy b c
    d = c; // cpy c d
    d--; // dec d
    c++; // inc c
    if (d != 0) jmp(49) // jnz d -2
    // tgl c
    c = -16; // cpy -16 c
    jmp(-37)// jnz 1 c
    c = 94; // cpy 94 c
    jmp(55 + d) // jnz 80 d
    a++ // inc a
    d++ // inc d
    if (d != 0) jmp(57)// jnz d -2
    c++ // inc c
    if (c != 0) jmp(56) // jnz c -5
}

/* PROGRAM */

let a = 7;
let b = 0;
let c = 0;
let d = 0;

b = a; // cpy a b
do {
    b--; // dec b
    d = a; // cpy a d
    a = 0; // cpy 0 a

    a += a * (a - 1);

    b = a - 2;
    c = 2 * (a - 2);

    // tgl c

    c = -16;
} while (true);
