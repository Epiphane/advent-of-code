let iterations = 1;

const ROW = 3010;
const COL = 3019;

// const ROW = 4;
// const COL = 6;

// const ROW = 2;
// const COL = 2;

for (let i = 0; i < ROW - 1; i ++) {
   iterations += i + 1;
}

for (let i = 0; i < COL - 1; i ++) {
   iterations += ROW + i + 1;
}

let code = 20151125;
for (let i = 1; i < iterations; i ++) {
   code = code * 252533;
   code = code % 33554393;
}

// console.log(iterations);
console.log(code);
