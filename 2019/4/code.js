let answer = 0;
for (let i = 307237; i <= 769058; ++i) {
   let str = '' + i;
   let inc = 0;
   let good = true;
   let c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
   str.split('').forEach(num => {
      let n = +num;

      if (n < inc) {
         good = false;
      }

      c[n]++;
      // v solution to part 1 LOL v
      //
      // if (n === inc) {
      //    dub = true;
      //    dubnum = n;
      // }
      //
      // ^                        ^

      inc = n;
   })

   if (good && c.filter(i => i === 2).length > 0) {
      answer++;
   }
}

console.log(answer);
