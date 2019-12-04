const input = 'uqwqemis';
// let input = 'abc';

const md5 = require('./md5');

console.log(md5('abc'));

let i = 0;

let password = [false, false, false, false, false, false, false, false];
let n = 0;

while (n < 8) {
   let str = input + i;

   const hsh = md5(str);
   if (hsh.substr(0, 5) === '00000') {
      switch (hsh[5]) {
         case '0':
            if (!password[0]) {
               password[0] = hsh[6];
               n++;
            }
            break;
         case '1':
            if (!password[1]) {
               password[1] = hsh[6];
               n++;
            }
            break;
         case '2':
            if (!password[2]) {
               password[2] = hsh[6];
               n++;
            }
            break;
         case '3':
            if (!password[3]) {
               password[3] = hsh[6];
               n++;
            }
            break;
         case '4':
            if (!password[4]) {
               password[4] = hsh[6];
               n++;
            }
            break;
         case '5':
            if (!password[5]) {
               password[5] = hsh[6];
               n++;
            }
            break;
         case '6':
            if (!password[6]) {
               password[6] = hsh[6];
               n++;
            }
            break;
         case '7':
            if (!password[7]) {
               password[7] = hsh[6];
               n++;
            }
            break;
      }
   }

   i ++;
}

console.log(password.join(''))
