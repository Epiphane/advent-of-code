const fs = require('fs');

lines = fs.readFileSync('input3.txt').toString().trim().split('\n');

const Claim = (line) => {
   let parts = line.split(' ');
   let coords = parts[2].split(',');
   let size = parts[3].split('x');
   return {
      num: parseInt(parts[0].substring(1)),
      l: parseInt(coords[0]),
      t: parseInt(coords[1]),
      r: parseInt(coords[0]) + parseInt(size[0]),
      b: parseInt(coords[1]) + parseInt(size[1]),
   };
};

let claims = lines.map(line => Claim(line));
claims.sort((a, b) => {
   if (a.l === b.l) {
      return a.t - b.t;
   }
   return a.l - b.l;
});

let overlaps = [];

const addOverlap = (overlap) => {
   for (let r = overlap.t; r < overlap.b; r++) {
      if (!overlaps[r]) {
         overlaps[r] = [];
      }

      for (let c = overlap.l; c < overlap.r; c++) {
         if (!overlaps[r][c]) {
            overlaps[r][c] = [];
         }
         
         overlaps[r][c].push();
      }
   }
}

claims.forEach((claim, index) => {
   for (let r = claim.t; r < claim.b; r++) {
      if (!overlaps[r]) {
         overlaps[r] = [];
      }

      for (let c = claim.l; c < claim.r; c++) {
         if (!overlaps[r][c]) {
            overlaps[r][c] = [];
         }
         
         overlaps[r][c].push(claim.num);
      }
   }

   // for (let before = index - 1; before >= 0; before --) {
   //    let other = claims[before];
   //    if (claim.l >= other.r) {
   //       break;
   //    }
   //    if (claim.t < other.b && claim.b > other.t) {
   //       return;
   //    }
   // }
   // for (let after = index + 1; after < claims.length; after ++) {
   //    let other = claims[after];
   //    if (other.l >= claim.r) {
   //       console.log(claim.num);
   //       return;
   //    }
   //    if (other.t < claim.b) {
   //       return;
   //    }
   // }

   for (let i = 0; i < claims.length; i ++) {
      let other = claims[i];
      if (index !== i &&
          other.l < claim.r &&
          other.t < claim.b &&
          other.r > claim.l &&
          other.b > claim.t)
      {
         return;
      }
   }
   console.log(claim.num);
});

var total = 0;

overlaps.forEach((row, i) => 
   row.forEach((col, j) => {
      if (col.length > 1) {
         total ++;
      }
   }))

// console.log(total);
