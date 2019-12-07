var fs = require('fs');

if (process.argv.length < 3) {
   console.log('Usage: newday.js <year> <day>')
}

const make = (path) => {
   if (!fs.existsSync(path)){
      fs.mkdirSync(path);
   }
}

const year = process.argv[2];
const day = process.argv[3];
console.log(year, day);

make(`${__dirname}/${year}`);
make(`${__dirname}/${year}/${day}`);
fs.copyFileSync('sample.js', `${year}/${day}/code.js`);
fs.writeFileSync(`${year}/${day}/input.txt`, '');
