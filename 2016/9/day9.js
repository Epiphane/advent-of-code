const fs = require('fs');

let file = 'input';
let input = fs.readFileSync(file + '.txt').toString().trim();

const { MakeRow, MakeGrid } = require('../../makegrid');

//const re = /\(([0-9]+)x\)/g;

let i = 0;
let res = '';
let l = 0;

// input = 'A(1x5)BC';
// input = '(3x3)XYZ(3x3)XYZ';

function decomp(str) {
   let paren = str.indexOf('(');
   let end = str.indexOf(')');

   if (paren < 0) {
      return str.length;
   }

   let res = paren;

   let dims = str.substr(paren + 1, end - paren - 1).split('x').map(n => parseInt(n));
   res += decomp(str.substr(end + 1, dims[0])) * dims[1];

   // console.log(str.substr(end + 1, dims[0]));
   // console.log(str);
   // console.log(dims);
   // console.log(paren, end);
   // console.log(res + str.length - end - 2)

   if (str.indexOf('(', end + dims[0]) >= 0) {
      res += decomp(str.substr(end + 1 + dims[0]));
   }

   return res;// + str.length - end - 2;
}

// input = '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'
// input = '(27x12)(20x12)(13x14)(7x10)(1x12)A'

console.log(decomp(input));

// while (i < input.length) {
//    let b = input.substr(i).indexOf('(');
//    if (b < 0) {
//       l += input.length - i;
//       res += input.substr(i);
//       break;
//    }

//    b += i;
//    let e = input.substr(i).indexOf(')') + i
//    console.log('e', e);
//    if (e < 0) {
//       e = input.length;
//    }

//    res += input.substr(i, b - i);

//    let dim = input.substr(b + 1, e - b - 1).split('x').map(n => parseInt(n));
//    for (let x = 0; x < dim[1]; x ++) {
//       res += input.substr(e + 1, dim[0]);
//       // console.log('a');
//       // l += dim[0]
//    }
//    // console.log(input.substr(b + 1, e - b - 1));
//    // console.log(dim);
//    l += dim[0] * dim[1];

//    // console.log(i, b, e);
//    // console.log(l);
//    i = e + dim[0] + 1;
//    console.log(i, input[i]);
// }

// console.log(res.length);
// console.log(l);
