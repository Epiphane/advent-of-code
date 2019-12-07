let reg5 = 2; // reg[5]
reg5 *= reg5;
reg5 *= 19;
reg5 *= 11;
let reg2 = 5; // reg[2]
reg2 *= 22;
reg2 += 18;
reg5 += reg2;

reg2 = 27;
reg2 *= 28;
reg2 += 29;
reg2 *= 30;
reg2 *= 14;
reg2 *= 32;
reg5 += reg2;

console.log('reg5 ' + reg5);

let reg0 = 0;

// for (
//    let reg3 = 1;
//    reg3 <= reg5;
// )
// {
//    let reg1 = 1;
   
//    do {
//       if (reg1 * reg3 === reg5) { // here
//          reg0 += reg3;
//          console.log(reg3);
//       }
//       reg1 ++;
//    } while (reg1 <= reg5);

//    reg3 ++;
//    if (reg3 > reg5) {
//       break;
//    }
// }

console.log(reg0);
reg0 = 0;

for (let i = 1; i <= reg5; i ++) {
   if (reg5 % i === 0) {
      reg0 += i;
      console.log('+ ' + i + '=' + reg0);
   }
   // for (let reg1 = 1; reg1 <= reg5; reg1 ++) {
   //    if (reg1 * i === reg5) {
   //       reg0 += i;
   //       console.log('+ ' + i + '=' + reg0);
   //    }
   // }
}
console.log(reg0);
