let permArr = [];
let usedChars = [];

function permute(input) {
   var i, ch;
   for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
         permArr.push(usedChars.slice());
      }
      permute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
   }
   return permArr;
};

function gcd(x, y) {
   if ((typeof x !== 'number') || (typeof y !== 'number'))
      return false;
   x = Math.abs(x);
   y = Math.abs(y);
   while(y) {
      var t = y;
      y = x % y;
      x = t;
   }
   return x;
}

module.exports = {
   permute,
   gcd,
}
