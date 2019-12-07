const fs = require('fs');

// const input = fs.readFileSync('input.txt').toString();
// let lines = input.split('\n');

// const LinkedList = require('../linkedlist');
const { MakeRow, MakeGrid } = require('../makegrid');

console.time();

// let recipe = [3, 7];
const LISTLEN = 100000;
let lists = [];
let next = 0;
function get(ndx) {
   const listnum = Math.floor(ndx / LISTLEN);
   return lists[listnum][ndx % LISTLEN];
}

function push(num) {
   if (next % LISTLEN === 0) {
      lists.push(new Uint8Array(LISTLEN));
   }
   lists[Math.floor(next / LISTLEN)][next % LISTLEN] = num;
   next ++;
}

push(3); push(7);

let first = 0;
let second = 1;

function iterate() {
   const score = get(first) + get(second);
   if (score < 10) {
      push(score);
   }
   else {
      push(Math.floor(score / 10));
      push(score % 10);
   }

   const _of = first, _os = second;

   first += (1 + get(first));// % next;
   second += (1 + get(second));// % next;
   while (first >= next) first -= next;
   while (second >= next) second -= next;
   // console.log(first, second, next);

   // if (first < _of) { console.log('loop first', first, second); }
   // if (second < _os) { console.log('loop second', second, second); }
}

let INPUT = 990941;
INPUT = 59414;
INPUT = 92510;
INPUT = 51589;
INPUT = 990941;
let revDigits = [];
for (let input = INPUT; input > 0; input = Math.floor(input / 10)) {
   revDigits.push(input % 10);
}

let match = false;
while (!match) {//(added < INPUT + 10) {
   iterate();

   match = true;
   for (let i = revDigits.length - 1; i >= 0; i --) {
      if (next - i - 1 < 0 || revDigits[i] !== get(next - 1 - i)) {
         match = false;
         break;
      }
   }
}

console.log('match!');
console.log(next - revDigits.length);
let str = [];
for (let i = next - 10 - revDigits.length; i < next; i ++) {
   str.push(get(i));
}
console.log(str.join(''));
console.log("there are " + next + ' recipes');

console.log(get())

return;

/*
const insertAfter = (node, data) => {
   let next = new LinkedList(data, node, node.next);
   node.next.prev = next;
   node.next = next;
   return next;
}

const insertBefore = (node, data) => {
   return node.prev.insertAfter(data);
}

function LinkedList(data, prev = null, next = null) {
   this.next = next || this;
   this.prev = prev || this;
   this.data = data;
   this.insertAfter = (data) => insertAfter(this, data);
   this.insertBefore = (data) => insertBefore(this, data);
}

const recipe = new LinkedList(3);

let first = recipe;
let second = recipe.insertAfter(7);
let last = second;

let added = 2;
function iterate() {
   const score = first.data + second.data;
   if (score < 10) {
      last = last.insertAfter(score);
      added ++;
   }
   else {
      last = last.insertAfter(Math.floor(score / 10));
      last = last.insertAfter(score % 10);
      added += 2;
   }

   let firstSteps = 1 + first.data;
   for (let i = 0; i < firstSteps; i ++) {
      first = first.next;
   }
   
   let secondSteps = 1 + second.data;
   for (let i = 0; i < secondSteps; i ++) {
      second = second.next;
   }
}

let INPUT = 51589;
INPUT = 990941;
let rev_digits = [];
for (let input = INPUT; input > 0; input = Math.floor(input / 10)) {
   rev_digits.push(input % 10);
}

let match = false;
while (!match) {//(added < INPUT + 10) {
   // let str = [recipe.data];
   // for (let n = recipe.next; n !== recipe; n = n.next) {
   //    str.push(n.data);
   // }
   if (added % 10000 === 0) 
   console.log(added);
   // console.log(str.join(' '));

   iterate();
   
   match = true;
   let subcursor = last;
   rev_digits.forEach(digit => {
      if (digit !== subcursor.data) {
         match = false;
      }
      subcursor = subcursor.prev;
   });

   // if (last.data === 1)last.prev.data === 4) {
   //    console.log(last.prev.prev.data);
   // }
}

console.log('match!');
let end = [];
let cursor = last;
for (let i = 0; i < 12; i ++) {
   end.unshift(cursor.data);
   cursor = cursor.prev;
}
console.log(end.join(''));
console.log(added - 5);

// let rev_digits = [];
// for (let input = INPUT; input > 0; input = Math.floor(input / 10)) {
//    rev_digits.push(input % 10);
// }

// let cursor = last;
// let match = false;
// let a = added;
// while (!match) {
//    let subcursor = cursor;
//    match = true;
//    rev_digits.forEach(digit => {
//       if (digit !== subcursor.data) {
//          match = false;
//       }
//       subcursor = subcursor.prev;
//    });
//    cursor = cursor.prev;
//    a --;
//    if (a % 10000 === 0) console.log(a);
// }

// console.log('result');
// console.log(cursor.data);
// cursor = cursor.prev;
// console.log(cursor.data);
// cursor = cursor.prev;
// console.log(cursor.data);
// cursor = cursor.prev;
// console.log(cursor.data);
// cursor = cursor.prev;
// console.log(cursor.data);
// cursor = cursor.prev;
// console.log(cursor.data);

// let cursor = recipe;
// for (let i = 0; i < INPUT; i ++) {
//    cursor = cursor.next;
// }

// let res = [];
// for (let x = 0; x < 10; x ++) {
//    res.push(cursor.data);
//    cursor = cursor.next;
// }
// console.log(res.join(''));*/

console.timeEnd();