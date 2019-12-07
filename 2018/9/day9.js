const NPLAYERS = 431;
const LARGESTPOINT = 7095000;

// const NPLAYERS = 9;
// const LARGESTPOINT = 25;

console.time();

let scores = [];
for (let i = 0; i < NPLAYERS; i ++) { scores.push(0); }

let marbles = [];
let nmarb = 1;
let claimed = 0;

let allMarbles = [];
const makeMarble = (value) => {
   return { next: null, prev: null, value: value };
};
      console.time();
for (let i = 0; i <= LARGESTPOINT; i ++) {
   allMarbles.push(makeMarble(i));
}
console.timeEnd();

let circle = allMarbles[0];//makeMarble(0);
    circle.next = circle.prev = circle;
let zero = circle;
let cursor = circle;

let ndx = 0;
let turn = 0;
while (marbles.length > 0 || nmarb <= LARGESTPOINT) {
   let marble = nmarb;
   if (marbles.length > 0) {
      marble = marbles[0];
      marbles.shift();
   }
   else {
      nmarb ++;
   }

   if (marble % 23 === 0) {
let gains = marble;
// console.timeEnd();
// console.time();
cursor = cursor.prev.prev.prev.prev.prev.prev.prev;
cursor.prev.next = cursor.next;
// console.timeEnd();
// console.time();
      cursor.next.prev = cursor.prev;
gains += cursor.value;
// console.timeEnd();
// console.time();
scores[turn % NPLAYERS] += gains;
// console.log('[' + (claimed++) + '] Player ' + (turn % NPLAYERS) + ' got ' + gains + ' = ' + marble + ' + ' + (gains - marble));
cursor = cursor.next;
// console.timeEnd();
}
   else {
      // console.time();
      let newMarb = allMarbles[marble];//makeMarble(marble);
      cursor = cursor.next;
      newMarb.prev = cursor;
      newMarb.next = cursor.next;
      cursor.next.prev = newMarb;
      cursor.next = newMarb;
      cursor = newMarb;
// console.timeEnd();
}

   turn ++;

   // let output = '0';
   // for (let c = zero.next; c.value !== 0; c = c.next) {
   //    output += ' ' + c.value;
   // }

   // console.log('[' + (turn % NPLAYERS) + '] ' + output);
}

/*
let circle = [0];
let ndx = 0;
let turn = 0;
while (marbles.length > 0 || nmarb <= LARGESTPOINT) {
   let marble = nmarb;
   if (marbles.length > 0) {
      marble = marbles[0];
      marbles.shift();
   }
   else {
      nmarb ++;
   }

   if (marble % 23 === 0) {
      ndx -= 7;
      if (ndx < 0) { ndx += circle.length; }

      let gains = marble + circle[ndx];

      scores[turn % NPLAYERS] += gains;
      // scores[turn % NPLAYERS] += marble;
      // scores[turn % NPLAYERS] += circle[ndx];
      // marbles.push(circle[ndx]);
      // marbles.sort((a, b) => a - b);
      // console.log(marbles);
      circle.splice(ndx, 1);

      console.log('[' + (claimed++) + '] Player ' + (turn % NPLAYERS) + ' got ' + gains + ' = ' + marble + ' + ' + (gains - marble));
   }
   else {
      ndx = (ndx + 2) % circle.length;
      if (ndx === 0) { circle.push(marble); ndx = circle.length - 1; }
      else { circle.splice(ndx, 0, marble); }
   }

   turn ++;
   // console.log('[' + (++turn % NPLAYERS) + '] ' + circle.join(' '));
}
*/

// console.log(scores);
scores.sort();
console.log(scores[scores.length - 1]);

console.timeEnd();
