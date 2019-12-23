let LEN =     BigInt(119315717514047);
let REPEATS = BigInt(101741582076661);
const log = console.log;

const fs = require('fs');
let file = process.argv[2] || 'input';
let raw = fs.readFileSync(file + '.txt').toString().trim();

let lines = raw.split('\n').map(line => line.trim());

let offset = BigInt(0);
let increment = BigInt(1);

function powerMod(bas, exp, mod) {
   if (exp === 0) return 1;
   if (mod === 1) return 0;
   let base = BigInt(bas);
   let exponent = BigInt(exp);
   let modulus = BigInt(mod);
   let result = BigInt(1);
   base = base % modulus;
   while (exponent > 0) {
      if (exponent % BigInt(2) === BigInt(1)) {
         result = (result * base) % modulus;
      }
      exponent = exponent / BigInt(2);
      base = (base * base) % modulus;
   }
   return result;
}

lines.forEach(line => {
   let deal = line.match(/deal with increment ([0-9]+)/);
   let cut = line.match(/cut (-?[0-9]+)/);
   if (line === 'deal into new stack') {
      increment *= BigInt(-1);

      offset += increment;
   }
   if (cut) {
      let amt = BigInt(+cut[1]);
      offset += increment * amt;
   }
   if (deal) {
      let inc = +deal[1];

      // card i goes to i * inc.
      // when i * inc = 1 (mod LEN), we know what the
      // new second card is.
      //
      // LEN is prime, so we need to find the "modular inverse"
      // of inc. Modular inverse is a value i such that
      // inc * i = 1 (mod LEN)
      //
      // Literally just https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
      // now:
      //
      // If i is a coprime to LEN (always), then
      //   i^(ϕ(LEN)) = 1 (mod LEN)
      //   i^(ϕ(LEN) - 1) = i^(-1) (mod LEN)
      // In the special case where m (LEN) is a prime, ϕ(LEN) = LEN - 1 so
      //   i^(LEN - 2) = i^(-1) (mod LEN)
      //   i^(-1) = i^(LEN - 2) (mod LEN)
      //
      // i^(-1) is the answer, the modular inverse, and not 1/i.
      //
      // Fermat's little theorem:
      // If a is not divisible by p, then
      // a^(p - 1) = 1 (mod p)
      //
      // We want increment *= n^(LEN - 2) % LEN
      increment *= powerMod(inc, (LEN - BigInt(2)), LEN);
   }

   offset = offset % LEN;
   increment = increment % LEN;
   while (offset < 0) { offset += LEN; }
   while (increment < 0) { increment += LEN; }
});

// Shuffler function is now created
log(`Shuffler: fn(x) = ${offset} + x * ${increment}`);

function compile_unshuffle(iterations) {
   let inc = powerMod(increment, iterations, LEN);
   // offset = 0 + offset_diff * (1 + increment_mul + increment_mul^2 + ... + increment_mul^iterations)
   let off = offset * (BigInt(1) - inc) * powerMod((BigInt(1) - increment) % LEN, LEN - BigInt(2), LEN)

   while (off < 0) { off += LEN; }
   while (inc < 0) { inc += LEN; }
   off %= LEN;
   inc %= LEN;

   return {
      offset: off,
      increment: inc,
   };
}

{
   let final = compile_unshuffle(REPEATS);
   log(`Compiled: fn(x) = ${final.offset} + x * ${final.increment}`);

   log(`Final: ${(final.offset + final.increment * BigInt(2020)) % LEN}`);
}
