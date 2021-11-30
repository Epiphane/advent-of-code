var fs = require('fs');

if (process.argv.length < 3) {
   console.log('Usage: newday.js <year> <day>')
   return;
}

const make = (path) => {
   if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
   }
}

const year = process.argv[2];
const day = process.argv[3];
console.log(year, day);

make(`${__dirname}/${year}`);
make(`${__dirname}/${year}/${day}`);
fs.copyFileSync('0000/00/initial.ts', `${year}/${day}/code.ts`);
fs.writeFileSync(`${year}/${day}/nodemon.json`, '{"ext": "ts,js,json,txt","watch":"../../"}');
fs.writeFileSync(`${year}/${day}/input.txt`, '');
fs.writeFileSync(`${year}/${day}/test.txt`, '');
